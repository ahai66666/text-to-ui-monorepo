#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createPixsoOfficialAdapterPlan, pixsoOfficialAdapterVersion } from "./pixso-official-adapter.mjs";

const host = "127.0.0.1";
const port = Number(process.env.TEXT_TO_UI_PIXSO_BRIDGE_PORT ?? 43982);
const stateDirectory = process.env.TEXT_TO_UI_PIXSO_BRIDGE_STATE_DIR
  ? path.resolve(process.env.TEXT_TO_UI_PIXSO_BRIDGE_STATE_DIR)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), `../.text-to-ui/pixso-bridge-${port}`);
const archiveDirectory = path.join(stateDirectory, "archive");
const stateFile = path.join(stateDirectory, "current-plan.json");
const resultFile = path.join(stateDirectory, "latest-result.json");
const pluginSessionFile = path.join(stateDirectory, "plugin-session.json");
const jobFile = path.join(stateDirectory, "current-job.json");
const pluginSessionTtlMs = 15000;
const legacyPluginSessionTtlMs = 30000;
const bridgeVersion = 4;
const protocolVersion = 4;
const supportedProtocolVersions = [3, 4];
const preferredKernelVersion = "5.0.0";
// Keep this in sync with TextToUiPixsoRuntime.version. A plan that does not
// declare a minimum is treated as requiring the current renderer, so an old
// installed plugin cannot silently replay an old interpretation of the plan.
const minimumPluginRuntimeVersion = "4.16";
const scriptPath = fileURLToPath(import.meta.url);

function headers(extra = {}) {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-private-network": "true",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    ...extra
  };
}

function versionTuple(value) {
  const match = String(value ?? "").match(/\d+(?:\.\d+){0,3}/);
  return match ? match[0].split(".").map((part) => Number(part)) : null;
}

function versionAtLeast(actual, required) {
  const left = versionTuple(actual);
  const right = versionTuple(required);
  if (!left || !right) return false;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const a = left[index] ?? 0;
    const b = right[index] ?? 0;
    if (a !== b) return a > b;
  }
  return true;
}

function requiredRuntimeVersionFor(plan) {
  if (!plan) return preferredKernelVersion;
  const contract = plan?.execution?.agentContract;
  if (contract?.minimumKernelVersion) return String(contract.minimumKernelVersion);
  const declared = String(plan?.execution?.minimumRuntimeVersion ?? minimumPluginRuntimeVersion);
  return versionAtLeast(declared, minimumPluginRuntimeVersion) ? declared : minimumPluginRuntimeVersion;
}

function planProtocolVersion(plan) {
  return Number(plan?.execution?.agentContract?.protocolVersion ?? 3);
}

function planSchemaVersion(plan) {
  return Number(plan?.execution?.agentContract?.planSchemaVersion ?? 1);
}

function planCapabilities(plan) {
  return [...new Set((plan?.execution?.agentContract?.requiredCapabilities ?? []).map(String))];
}

function planIdempotencyKey(plan, absolutePath = "") {
  return String(plan?.execution?.agentContract?.idempotencyKey
    ?? plan?.execution?.importRun?.runId
    ?? plan?.execution?.runId
    ?? crypto.createHash("sha256").update(`${absolutePath}\n${JSON.stringify(plan)}`).digest("hex"));
}

function readJob() {
  if (!fs.existsSync(jobFile)) return null;
  try { return JSON.parse(fs.readFileSync(jobFile, "utf8")); } catch (_) { return null; }
}

function writeJob(job) {
  fs.mkdirSync(stateDirectory, { recursive: true });
  fs.writeFileSync(jobFile, `${JSON.stringify(job, null, 2)}\n`);
}

function archiveActivePublication(reason, detail = null) {
  if (!fs.existsSync(stateFile) && !fs.existsSync(jobFile) && !fs.existsSync(resultFile)) return null;
  const suffix = `${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto.randomBytes(3).toString("hex")}`;
  const target = path.join(archiveDirectory, suffix);
  fs.mkdirSync(target, { recursive: true });
  for (const file of [stateFile, jobFile, resultFile]) {
    if (fs.existsSync(file)) fs.renameSync(file, path.join(target, path.basename(file)));
  }
  fs.writeFileSync(path.join(target, "archive-reason.json"), `${JSON.stringify({ reason, detail, archivedAt: new Date().toISOString() }, null, 2)}\n`);
  return target;
}

function currentJob(state = readState()) {
  const job = readJob();
  return job && state.plan && job.revision === state.revision ? job : null;
}

function currentResult(state = readState()) {
  if (!state.plan || !fs.existsSync(resultFile)) return null;
  try {
    const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    return result.revision === state.revision ? result : null;
  } catch (_) {
    return null;
  }
}

function readState() {
  if (!fs.existsSync(stateFile)) return { revision: "", plan: null, requiredRuntimeVersion: minimumPluginRuntimeVersion };
  let stored;
  try { stored = JSON.parse(fs.readFileSync(stateFile, "utf8")); }
  catch (error) {
    archiveActivePublication("invalid-publication-json", error.message);
    return { revision: "", plan: null, requiredRuntimeVersion: minimumPluginRuntimeVersion };
  }
  const envelope = stored?.kind === "text-to-ui-pixso-publication"
    ? stored
    : { kind: "text-to-ui-pixso-publication", publicationId: "legacy", planPath: null, plan: stored };
  const staleRevision = crypto.createHash("sha256").update(JSON.stringify(envelope)).digest("hex").slice(0, 16);
  // A state file written by an older bridge is historical input, not a
  // publication. Quarantine it in memory so a freshly started service cannot
  // replay an old plan merely because it still exists in /tmp.
  if (!supportedProtocolVersions.includes(Number(envelope.protocolVersion)) || !envelope.requiredRuntimeVersion) {
    return {
      revision: "",
      staleRevision,
      stale: true,
      stalePublicationId: envelope.publicationId ?? null,
      stalePlanPath: envelope.planPath ?? null,
      plan: null,
      requiredRuntimeVersion: minimumPluginRuntimeVersion,
    };
  }
  const plan = envelope.plan;
  const revision = staleRevision;
  return {
    revision,
    stale: false,
    planPath: envelope.planPath ?? null,
    publicationId: envelope.publicationId ?? null,
    publishedAt: envelope.publishedAt ?? null,
    plan,
    requiredRuntimeVersion: envelope.requiredRuntimeVersion ?? requiredRuntimeVersionFor(plan),
  };
}

async function health() {
  try {
    const response = await fetch(`http://${host}:${port}/health`);
    return response.ok;
  } catch (_) {
    return false;
  }
}

function readPluginSession() {
  if (!fs.existsSync(pluginSessionFile)) return {
    connected: false,
    sessionId: null,
    lastSeenAt: null,
    ageMs: null,
    runtimeVersion: null,
    protocolVersion: null,
  };
  try {
    const session = JSON.parse(fs.readFileSync(pluginSessionFile, "utf8"));
    const timestamp = Date.parse(session.lastSeenAt);
    const ageMs = Number.isFinite(timestamp) ? Math.max(0, Date.now() - timestamp) : null;
    const ttlMs = session.sessionId === "legacy-plugin" ? legacyPluginSessionTtlMs : pluginSessionTtlMs;
    return { ...session, connected: ageMs !== null && ageMs <= ttlMs, ageMs, ttlMs };
  } catch (_) {
    return {
      connected: false,
      sessionId: null,
      lastSeenAt: null,
      ageMs: null,
      runtimeVersion: null,
      protocolVersion: null,
    };
  }
}

function recordPluginSession(sessionId, revision = "", runtimeVersion = null, pluginProtocolVersion = null, details = {}) {
  if (!sessionId) return readPluginSession();
  fs.mkdirSync(stateDirectory, { recursive: true });
  const normalizedSessionId = String(sessionId);
  const previous = readPluginSession();
  const sameSession = previous.sessionId === normalizedSessionId;
  const normalizedRuntime = runtimeVersion && runtimeVersion !== "unknown"
    ? String(runtimeVersion)
    : sameSession ? previous.runtimeVersion ?? null : null;
  const normalizedProtocol = pluginProtocolVersion !== null && pluginProtocolVersion !== ""
    ? Number(pluginProtocolVersion)
    : sameSession ? previous.protocolVersion ?? null : null;
  const session = {
    sessionId: normalizedSessionId,
    revision: String(revision ?? ""),
    runtimeVersion: normalizedRuntime,
    protocolVersion: Number.isFinite(normalizedProtocol) ? normalizedProtocol : null,
    kernelVersion: String(details.kernelVersion ?? normalizedRuntime ?? previous.kernelVersion ?? "") || null,
    operationPlanVersions: Array.isArray(details.operationPlanVersions)
      ? details.operationPlanVersions.map(Number).filter(Number.isFinite)
      : sameSession ? previous.operationPlanVersions ?? [1] : [1],
    capabilities: Array.isArray(details.capabilities)
      ? [...new Set(details.capabilities.map(String))]
      : sameSession ? previous.capabilities ?? [] : [],
    lastSeenAt: new Date().toISOString(),
  };
  fs.writeFileSync(pluginSessionFile, `${JSON.stringify(session, null, 2)}\n`);
  return { ...session, connected: true, ageMs: 0 };
}

function pluginCompatibility(plan, session = readPluginSession()) {
  const requiredRuntimeVersion = requiredRuntimeVersionFor(plan);
  const requiredProtocolVersion = planProtocolVersion(plan);
  const requiredPlanSchemaVersion = planSchemaVersion(plan);
  const requiredCapabilities = planCapabilities(plan);
  const actualKernelVersion = session.kernelVersion ?? session.runtimeVersion;
  const runtimeCompatible = versionAtLeast(actualKernelVersion, requiredRuntimeVersion);
  const pluginProtocolCompatible = Number(session.protocolVersion) >= requiredProtocolVersion;
  const planSchemaCompatible = (session.operationPlanVersions ?? [1]).includes(requiredPlanSchemaVersion);
  const missingCapabilities = requiredCapabilities.filter((capability) => !(session.capabilities ?? []).includes(capability));
  const capabilitiesCompatible = missingCapabilities.length === 0;
  const ready = Boolean(session.connected && runtimeCompatible && pluginProtocolCompatible && planSchemaCompatible && capabilitiesCompatible);
  const reason = !session.connected
    ? "plugin-disconnected"
    : !runtimeCompatible
      ? "plugin-runtime-mismatch"
      : !pluginProtocolCompatible
        ? "plugin-protocol-mismatch"
        : !planSchemaCompatible
          ? "plugin-plan-schema-mismatch"
          : !capabilitiesCompatible
            ? "plugin-capability-mismatch"
        : null;
  return {
    requiredRuntimeVersion,
    requiredProtocolVersion,
    requiredPlanSchemaVersion,
    requiredCapabilities,
    missingCapabilities,
    runtimeCompatible,
    pluginProtocolCompatible,
    planSchemaCompatible,
    capabilitiesCompatible,
    ready,
    reason,
  };
}

function pluginStatus(state = readState()) {
  const session = readPluginSession();
  const compatibility = pluginCompatibility(state.plan, session);
  const { protocolVersion: pluginProtocolVersion, ...sessionStatus } = session;
  return {
    ...sessionStatus,
    pluginProtocolVersion,
    ...compatibility,
    recommendedExecutor: "plugin",
  };
}

function adapterStatus(state = readState()) {
  return createPixsoOfficialAdapterPlan(state.plan ?? {}, pluginStatus(state));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); } catch (error) { reject(error); }
    });
    request.on("error", reject);
  });
}

async function status() {
  await ensureServer();
  const response = await fetch(`http://${host}:${port}/plugin-status`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.ok !== true) {
    return { ok: true, bridge: `http://${host}:${port}`, bridgeVersion: 1, legacyBridge: true, connected: false, ready: false, reason: "plugin-disconnected", recommendedExecutor: "plugin" };
  }
  return { ok: true, bridge: `http://${host}:${port}`, bridgeVersion, protocolVersion, ...payload };
}

async function ensureServer() {
  if (await health()) return;
  spawn(process.execPath, [scriptPath, "serve"], { detached: true, stdio: "ignore" }).unref();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (await health()) return;
  }
  throw new Error(`Pixso bridge did not start on ${host}:${port}`);
}

function isStrictHtmlImportPlan(plan) {
  return plan?.kind === "pixso-operation-plan" && (
    plan.execution?.sourcePolicy === "fresh-build-current-html-no-history" ||
    Boolean(plan.page?.htmlSourceFingerprint) ||
    plan.page?.visualSnapshot?.source === "html-live-computed-style"
  );
}

function validateCurrentImportPublication(plan, planPath) {
  const provenance = plan.execution?.importRun;
  if (isStrictHtmlImportPlan(plan) && !provenance?.runId) {
    throw new Error("Cannot publish: strict HTML import plan has no importRun/runId; legacy root plans are blocked");
  }
  if (!provenance) return;
  for (const [label, file] of [["run manifest", provenance.manifestPath], ["visual manifest", provenance.visualManifestPath]]) {
    if (!file || !fs.existsSync(path.resolve(file))) throw new Error(`Cannot publish: ${label} is missing (${file ?? "not declared"})`);
  }
  const manifestPath = path.resolve(provenance.manifestPath);
  const visualManifestPath = path.resolve(provenance.visualManifestPath);
  const runManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const visualManifest = JSON.parse(fs.readFileSync(visualManifestPath, "utf8"));
  if (runManifest.runId !== provenance.runId || visualManifest.runId !== provenance.runId) throw new Error("Cannot publish: import runId is stale or mixed");
  if (runManifest.source?.htmlSourceFingerprint !== provenance.htmlSourceFingerprint || visualManifest.htmlSourceFingerprint !== provenance.htmlSourceFingerprint) throw new Error("Cannot publish: HTML source fingerprint is stale or mixed");
  if (plan.page?.htmlSourceFingerprint !== provenance.htmlSourceFingerprint || plan.page?.visualSnapshot?.htmlSourceFingerprint !== provenance.htmlSourceFingerprint) {
    throw new Error("Cannot publish: plan HTML fingerprint does not match the current import run");
  }
  if (path.resolve(runManifest.artifacts?.operationPlan ?? "") !== path.resolve(planPath)) {
    throw new Error("Cannot publish: plan is not the Operation Plan declared by the current import run");
  }
  if (path.resolve(runManifest.artifacts?.visualManifest ?? "") !== visualManifestPath) {
    throw new Error("Cannot publish: visual manifest is not the artifact declared by the current import run");
  }
  const runsRoot = path.dirname(path.dirname(manifestPath));
  const currentRunPath = path.join(runsRoot, "current-run.json");
  if (!fs.existsSync(currentRunPath)) throw new Error("Cannot publish: current-run.json is missing");
  const currentRun = JSON.parse(fs.readFileSync(currentRunPath, "utf8"));
  if (currentRun.runId !== provenance.runId || path.resolve(currentRun.manifest ?? "") !== manifestPath) {
    throw new Error("Cannot publish: plan belongs to an old import run, not current-run.json");
  }
}

async function publish(planPath) {
  if (!planPath) throw new Error("Usage: pixso-plugin-bridge.mjs publish <pixso-operation-plan.json|pixso-component-library-plan.json>");
  const absolute = path.resolve(planPath);
  const plan = JSON.parse(fs.readFileSync(absolute, "utf8"));
  if (!["pixso-operation-plan", "pixso-component-library-plan"].includes(plan.kind)) {
    throw new Error("Input must be a pixso-operation-plan or pixso-component-library-plan");
  }
  if (plan.kind === "pixso-operation-plan") validateCurrentImportPublication(plan, absolute);
  await ensureServer();
  const plugin = pluginCompatibility(plan, readPluginSession());
  const idempotencyKey = planIdempotencyKey(plan, absolute);
  const existingState = readState();
  const existingJob = currentJob(existingState);
  if (existingState.plan && existingJob?.idempotencyKey === idempotencyKey && !["failed", "cancelled"].includes(existingJob.status)) {
    process.stdout.write(`${JSON.stringify({ ok: true, reused: true, queued: existingJob.status !== "completed", jobId: existingJob.jobId, revision: existingState.revision, plan: absolute, bridge: `http://${host}:${port}` }, null, 2)}\n`);
    return;
  }
  const officialAdapter = createPixsoOfficialAdapterPlan(plan, { ...plugin, ready: true });
  fs.mkdirSync(stateDirectory, { recursive: true });
  if (existingState.plan) archiveActivePublication("superseded-by-new-publication", { publicationId: existingState.publicationId, idempotencyKey });
  const publication = {
    kind: "text-to-ui-pixso-publication",
    publicationId: `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}`,
    publishedAt: new Date().toISOString(),
    protocolVersion: planProtocolVersion(plan),
    planSchemaVersion: planSchemaVersion(plan),
    idempotencyKey,
    requiredRuntimeVersion: requiredRuntimeVersionFor(plan),
    planPath: absolute,
    plan
  };
  fs.writeFileSync(stateFile, `${JSON.stringify(publication, null, 2)}\n`);
  const { revision } = readState();
  writeJob({
    jobId: publication.publicationId,
    revision,
    publicationId: publication.publicationId,
    planPath: absolute,
    status: plugin.ready ? "queued" : "queued-awaiting-plugin",
    idempotencyKey,
    requiredRuntimeVersion: publication.requiredRuntimeVersion,
    createdAt: publication.publishedAt,
    startedAt: null,
    finishedAt: null,
    error: null,
  });
  const job = readJob();
  if (job?.revision === revision) {
    writeJob({
      ...job,
      executorRoute: { ...officialAdapter.route, executor: "text-to-ui-native-plugin", transport: "text-to-ui-plugin-bridge", allowed: true, reason: plugin.ready ? "full-page-bulk-structured-execution" : "queued-awaiting-plugin" },
      officialAdapterVersion: pixsoOfficialAdapterVersion,
    });
  }
  process.stdout.write(`${JSON.stringify({
    ok: true,
    jobId: publication.publicationId,
    revision,
    plan: absolute,
    bridge: `http://${host}:${port}`,
    pluginConnected: readPluginSession().connected,
    pluginRuntimeVersion: readPluginSession().runtimeVersion ?? null,
    pluginRuntimeCompatible: plugin.runtimeCompatible,
    queued: !plugin.ready,
    requiredRuntimeVersion: publication.requiredRuntimeVersion,
    recommendedExecutor: "plugin",
    executorRoute: officialAdapter.route,
  }, null, 2)}\n`);
}

function serve() {
  const server = http.createServer((request, response) => {
    if (request.method === "OPTIONS") {
      response.writeHead(204, headers());
      return response.end();
    }
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);
    if (url.pathname === "/health") {
      response.writeHead(200, headers());
      return response.end(JSON.stringify({
        ok: true,
        service: "text-to-ui-pixso-bridge",
        version: bridgeVersion,
        bridgeVersion,
        protocolVersion,
        supportedProtocolVersions,
        preferredKernelVersion,
        operationPlanVersions: [1, 5],
        minimumPluginRuntimeVersion,
        legacyRuntimeFloor: minimumPluginRuntimeVersion,
        officialAdapterVersion: pixsoOfficialAdapterVersion,
      }));
    }
    if (url.pathname === "/plugin-status") {
      response.writeHead(200, headers());
      return response.end(JSON.stringify({
        ok: true,
        service: "text-to-ui-pixso-bridge",
        bridgeVersion,
        protocolVersion,
        ...pluginStatus(),
      }));
    }
    if (url.pathname === "/service-status") {
      const state = readState();
      response.writeHead(200, headers());
      return response.end(JSON.stringify({
        ok: true,
        service: "text-to-ui-pixso-service",
        bridge: `http://${host}:${port}`,
        bridgeVersion,
        protocolVersion,
        minimumPluginRuntimeVersion,
        publication: state.plan ? {
          publicationId: state.publicationId,
          revision: state.revision,
          planPath: state.planPath,
          requiredRuntimeVersion: state.requiredRuntimeVersion,
          publishedAt: state.publishedAt,
        } : null,
        plugin: pluginStatus(state),
        officialAdapter: adapterStatus(state),
        job: currentJob(state),
        stalePublication: state.stale ? {
          publicationId: state.stalePublicationId,
          revision: state.staleRevision,
          planPath: state.stalePlanPath,
          ignored: true,
        } : null,
      }));
    }
    if (url.pathname === "/official-adapter") {
      const state = readState();
      response.writeHead(200, headers());
      return response.end(JSON.stringify({ ok: true, ...adapterStatus(state) }));
    }
    if (url.pathname === "/job") {
      const state = readState();
      response.writeHead(200, headers());
      return response.end(JSON.stringify({ ok: true, job: currentJob(state), result: currentResult(state), revision: state.revision }));
    }
    if (url.pathname === "/cancel" && request.method === "POST") {
      const state = readState();
      const job = currentJob(state);
      if (!job) {
        response.writeHead(404, headers());
        return response.end(JSON.stringify({ ok: false, error: "no-active-job" }));
      }
      writeJob({ ...job, cancelRequested: true, cancelRequestedAt: new Date().toISOString(), status: job.status === "running" ? "cancelling" : "cancelled" });
      response.writeHead(200, headers());
      return response.end(JSON.stringify({ ok: true, jobId: job.jobId, cancelRequested: true }));
    }
    if (url.pathname === "/progress" && request.method === "POST") {
      readJsonBody(request).then((payload) => {
        const state = readState();
        const job = currentJob(state);
        if (!job || payload.revision !== state.revision) throw new Error("progress revision does not match the current job");
        writeJob({ ...job, status: "running", lastProgressAt: new Date().toISOString(), progress: payload.progress ?? payload });
        response.writeHead(200, headers());
        response.end(JSON.stringify({ ok: true }));
      }).catch((error) => {
        response.writeHead(409, headers());
        response.end(JSON.stringify({ ok: false, error: error.message }));
      });
      return;
    }
    if (url.pathname === "/session" && request.method === "POST") {
      readJsonBody(request).then((payload) => {
        const session = recordPluginSession(
          payload.sessionId,
          payload.revision ?? "",
          payload.runtimeVersion ?? payload.kernelVersion,
          payload.protocolVersion,
          payload,
        );
        const job = currentJob();
        response.writeHead(200, headers());
        response.end(JSON.stringify({ ok: true, ...session, ...pluginCompatibility(readState().plan, session), cancelRequested: Boolean(job?.cancelRequested) }));
      }).catch((error) => {
        response.writeHead(400, headers());
        response.end(JSON.stringify({ ok: false, error: error.message }));
      });
      return;
    }
    if (url.pathname === "/session") {
      const session = recordPluginSession(
        url.searchParams.get("session"),
        url.searchParams.get("revision") ?? "",
        url.searchParams.get("runtime") ?? url.searchParams.get("runtimeVersion"),
        url.searchParams.get("protocol"),
      );
      const job = currentJob();
      response.writeHead(200, headers());
      return response.end(JSON.stringify({ ok: true, ...session, ...pluginCompatibility(readState().plan, session), cancelRequested: Boolean(job?.cancelRequested) }));
    }
    if (url.pathname === "/result" && request.method === "GET") {
      const result = currentResult();
      response.writeHead(200, headers());
      return response.end(JSON.stringify({ ok: true, result }));
    }
    if (url.pathname === "/result" && request.method === "POST") {
      let body = "";
      request.on("data", (chunk) => { body += chunk; });
      request.on("end", () => {
        try {
          const payload = JSON.parse(body || "{}");
          const state = readState();
          if (!state.plan || payload.revision !== state.revision) throw new Error("result revision does not match the current publication");
          const expectedRunId = state.plan.execution?.importRun?.runId ?? state.plan.execution?.runId ?? null;
          if (expectedRunId && payload.runId !== expectedRunId) throw new Error("result runId does not match the current publication");
          const record = { ...payload, receivedAt: new Date().toISOString() };
          fs.mkdirSync(stateDirectory, { recursive: true });
          fs.writeFileSync(resultFile, `${JSON.stringify(record, null, 2)}\n`);
          const manifestPath = state.plan.execution?.importRun?.manifestPath;
          if (manifestPath && fs.existsSync(path.resolve(manifestPath))) {
            const runManifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), "utf8"));
            const target = runManifest.artifacts?.pluginResult;
            if (target) {
              fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
              fs.writeFileSync(path.resolve(target), `${JSON.stringify(record, null, 2)}\n`);
            }
          }
          const previousJob = readJob();
          if (previousJob && previousJob.revision === state.revision) {
            const cancelled = payload.result?.phase === "paused" || payload.cancelled === true;
            writeJob({
              ...previousJob,
              status: cancelled ? "cancelled" : payload.ok ? "completed" : "failed",
              finishedAt: record.receivedAt,
              error: payload.ok || cancelled ? null : payload.error ?? "Pixso execution failed",
            });
          }
          response.writeHead(200, headers());
          response.end(JSON.stringify({ ok: true }));
        } catch (error) {
          response.writeHead(409, headers());
          response.end(JSON.stringify({ ok: false, error: error.message }));
        }
      });
      return;
    }
    if (url.pathname === "/next") {
      const state = readState();
      response.writeHead(200, headers());
      return response.end(JSON.stringify({ ok: true, changed: false, revision: state.revision, deprecated: true }));
    }
    if (url.pathname === "/claim") {
      const state = readState();
      const after = url.searchParams.get("after") ?? "";
      // Older installed plugin UIs do not send a session id yet, but their
      // active /claim poll is still reliable proof that the Pixso panel is
      // open. Keep that path compatible while the new delivery is reloaded.
      const session = recordPluginSession(
        url.searchParams.get("session") ?? "legacy-plugin",
        after,
        url.searchParams.get("runtime") ?? url.searchParams.get("runtimeVersion"),
        url.searchParams.get("protocol"),
      );
      if (state.stale) {
        const archivedTo = archiveActivePublication("stale-publication-envelope", { publicationId: state.stalePublicationId, planPath: state.stalePlanPath });
        response.writeHead(200, headers());
        return response.end(JSON.stringify({
          ok: true,
          changed: false,
          blocked: true,
          reason: "stale-publication",
          revision: state.staleRevision,
          cleared: true,
          archivedTo,
          error: "已隔离旧 publication；请由当前 Text-to-UI import run 重新发布计划。",
        }));
      }
      if (state.plan?.kind === "pixso-operation-plan") {
        try {
          validateCurrentImportPublication(state.plan, state.planPath ?? "");
        } catch (error) {
          const archivedTo = archiveActivePublication("stale-publication", { publicationId: state.publicationId, error: error.message });
          response.writeHead(200, headers());
          return response.end(JSON.stringify({ ok: true, changed: false, blocked: true, cleared: true, archivedTo, reason: "stale-publication", revision: state.revision, error: error.message }));
        }
      }
      // Delivery is scoped to the requesting plugin session. The plugin sends
      // its last consumed revision through `after`, so the same session cannot
      // loop. A newly opened plugin starts with an empty revision and must be
      // able to recover the latest plan even if an older session claimed it.
      const changed = Boolean(state.plan && state.revision !== after);
      let job = currentJob(state);
      const compatibility = pluginCompatibility(state.plan, session);
      let lockedRoute = job?.executorRoute?.executor ?? null;
      // A transient plugin heartbeat gap must not permanently force a queued
      // publication onto the MCP fallback. Upgrade only before execution has
      // started and only when there is no result, so a reconnecting plugin can
      // safely claim the plan without racing an active MCP transaction.
      if (
        changed &&
        ["queued", "queued-awaiting-plugin", "blocked"].includes(job?.status) &&
        !job.startedAt &&
        !currentResult(state) &&
        lockedRoute &&
        lockedRoute !== "text-to-ui-native-plugin" &&
        compatibility.ready
      ) {
        const recoveredRoute = createPixsoOfficialAdapterPlan(state.plan, { ready: true }).route;
        if (recoveredRoute.executor === "text-to-ui-native-plugin") {
          job = {
            ...job,
            executorRoute: recoveredRoute,
            recoveredAt: new Date().toISOString(),
            recoveryReason: "plugin-reconnected-before-execution",
          };
          writeJob(job);
          lockedRoute = recoveredRoute.executor;
        }
      }
      // The executor is selected once, at publication time. Do not let a
      // plugin that reconnects after an MCP fallback publication steal the
      // same plan and execute it a second time. Without this lock, a delayed
      // plugin poll could race the MCP batches and leave a failed plugin
      // result beside a successful canvas import.
      if (changed && lockedRoute && lockedRoute !== "text-to-ui-native-plugin") {
        response.writeHead(200, headers());
        return response.end(JSON.stringify({
          ok: true,
          changed: false,
          blocked: true,
          reason: "executor-route-locked",
          revision: state.revision,
          executorRoute: job.executorRoute,
          error: "当前 publication 已锁定 MCP 执行，插件不会重复领取同一份导入计划。",
        }));
      }
      if (changed && !compatibility.ready) {
        const previousJob = readJob();
        if (previousJob?.revision === state.revision) {
          writeJob({
            ...previousJob,
            status: "blocked",
            blockedReason: compatibility.reason,
            pluginRuntimeVersion: session.runtimeVersion ?? null,
            pluginProtocolVersion: session.protocolVersion ?? null,
            error: compatibility.reason === "plugin-runtime-mismatch"
              ? `插件 Runtime v${session.runtimeVersion ?? "unknown"} 不满足要求 v${compatibility.requiredRuntimeVersion}，请重新加载最新插件`
              : compatibility.reason === "plugin-protocol-mismatch"
                ? `插件协议 v${session.protocolVersion ?? "unknown"} 不满足服务协议 v${protocolVersion}，请重新加载最新插件`
                : compatibility.reason === "plugin-plan-schema-mismatch"
                  ? `插件不支持 Operation Plan v${compatibility.requiredPlanSchemaVersion}`
                  : compatibility.reason === "plugin-capability-mismatch"
                    ? `插件缺少能力：${compatibility.missingCapabilities.join("、")}`
                : "Pixso 插件未连接",
          });
        }
        const error = compatibility.reason === "plugin-runtime-mismatch"
          ? `需要 Pixso 插件 Runtime v${compatibility.requiredRuntimeVersion}，当前为 v${session.runtimeVersion ?? "unknown"}。请重新加载最新插件。`
          : compatibility.reason === "plugin-protocol-mismatch"
            ? `需要 Pixso 插件协议 v${protocolVersion}，当前为 v${session.protocolVersion ?? "unknown"}。请重新加载最新插件。`
            : compatibility.reason === "plugin-plan-schema-mismatch"
              ? `需要 Operation Plan v${compatibility.requiredPlanSchemaVersion} 执行能力。`
              : compatibility.reason === "plugin-capability-mismatch"
                ? `插件缺少执行能力：${compatibility.missingCapabilities.join("、")}。`
            : "Pixso 插件未连接";
        response.writeHead(200, headers());
        return response.end(JSON.stringify({
          ok: true,
          changed: false,
          blocked: true,
          reason: compatibility.reason,
          revision: state.revision,
          requiredRuntimeVersion: compatibility.requiredRuntimeVersion,
          pluginRuntimeVersion: session.runtimeVersion ?? null,
          protocolVersion,
          pluginProtocolVersion: session.protocolVersion ?? null,
          missingCapabilities: compatibility.missingCapabilities,
          error,
        }));
      }
      if (changed) {
        const previousJob = readJob();
        if (previousJob?.revision === state.revision) writeJob({ ...previousJob, status: "running", blockedReason: null, cancelRequested: false, startedAt: previousJob.startedAt ?? new Date().toISOString() });
      }
      response.writeHead(200, headers());
      return response.end(JSON.stringify({ ok: true, changed, revision: state.revision, plan: changed ? state.plan : undefined }));
    }
    response.writeHead(404, headers());
    response.end(JSON.stringify({ ok: false, error: "not-found" }));
  });
  server.listen(port, host);
}

const command = process.argv[2] ?? "serve";
if (command === "serve") serve();
else if (command === "publish") await publish(process.argv[3]);
else if (command === "status") process.stdout.write(`${JSON.stringify(await status(), null, 2)}\n`);
else throw new Error(`Unknown command: ${command}`);
