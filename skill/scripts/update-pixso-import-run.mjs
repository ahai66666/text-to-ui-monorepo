#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { parseArgs, readJson, writeJson } from "./pixso-native-scene-lib.mjs";
import { releaseActiveRunLock, TERMINAL_RUN_STATUSES } from "./pixso-import-run-state.mjs";

const args = parseArgs(process.argv.slice(2));
const usage = "Usage: update-pixso-import-run.mjs --manifest <run-manifest.json> --stage preflight|capture|compile|execute|readback|diff|cleanup|baseline(diagnostic only) --status start|passed|failed [--executor plugin|mcp] [--detail <text>] [--metrics <json>] [--baseline-node-id <id>] [--structured-node-id <id>]";
if (args.help || !args.manifest || !args.stage || !args.status) {
  if (!args.help) console.error(usage);
  process.exit(args.help ? 0 : 2);
}

const allowedStages = ["preflight", "capture", "baseline", "compile", "execute", "readback", "diff", "cleanup"];
const allowedStatuses = ["start", "passed", "failed"];
const stage = String(args.stage);
const status = String(args.status);
if (!allowedStages.includes(stage)) throw new Error(`Unknown import stage: ${stage}`);
if (!allowedStatuses.includes(status)) throw new Error(`Unknown import status: ${status}`);

const manifestPath = path.resolve(args.manifest);
if (!fs.existsSync(manifestPath)) throw new Error(`Run manifest not found: ${manifestPath}`);
const manifest = readJson(manifestPath);
if (manifest.kind !== "text-to-ui-pixso-import-run") throw new Error("Input is not a Text-to-UI Pixso import run manifest");

const now = new Date();
const mode = manifest.executionPolicy?.mode ?? "normal";
if (stage === "baseline" && mode !== "diagnostic") throw new Error("Baseline is disabled in normal mode; use the current browser screenshot or start a separate diagnostic run");
const timing = manifest.timing ?? { startedAt: null, wallStartedAt: manifest.createdAt ?? now.toISOString(), stages: {}, events: [] };
timing.stages = timing.stages ?? {};
timing.events = timing.events ?? [];
const current = timing.stages[stage] ?? { attempts: 0 };
const attemptLimit = Number(manifest.executionPolicy?.attemptLimits?.[stage] ?? (mode === "diagnostic" ? 3 : 1));
let metrics = null;
if (args.metrics) {
  try { metrics = JSON.parse(String(args.metrics)); }
  catch (_) { throw new Error("--metrics must be valid JSON"); }
  if (!metrics || Array.isArray(metrics) || typeof metrics !== "object") throw new Error("--metrics must be a JSON object");
}

if (status === "start") {
  if (current.status === "in_progress") throw new Error(`${stage} is already in progress`);
  if (current.status === "passed" && mode === "normal") throw new Error(`Normal import already passed ${stage}; repeated work requires a new run or diagnostic mode`);
  if (Number(current.attempts ?? 0) >= attemptLimit) throw new Error(`${stage} attempt limit reached (${attemptLimit})`);
  timing.stages[stage] = {
    ...current,
    status: "in_progress",
    attempts: Number(current.attempts ?? 0) + 1,
    startedAt: now.toISOString(),
    endedAt: null,
    elapsedMs: null,
    executor: args.executor ?? current.executor ?? null,
    detail: args.detail ?? null
  };
  if (!timing.startedAt) timing.startedAt = now.toISOString();
  manifest.status = "running";
} else {
  if (current.status !== "in_progress") throw new Error(`${stage} must be started before it can be marked ${status}`);
  const started = Date.parse(current.startedAt);
  const elapsedMs = Number.isFinite(started) ? Math.max(0, now.getTime() - started) : null;
  const budgetMs = Number(manifest.executionPolicy?.budgetsMs?.[stage] ?? 0) || null;
  const measuredWorkMs = Number(metrics?.actualWorkMs);
  const workElapsedMs = Number.isFinite(measuredWorkMs) && measuredWorkMs >= 0 ? measuredWorkMs : elapsedMs;
  timing.stages[stage] = {
    ...current,
    status,
    endedAt: now.toISOString(),
    elapsedMs,
    workElapsedMs,
    orchestrationElapsedMs: elapsedMs,
    budgetMs,
    withinBudget: budgetMs === null || workElapsedMs === null ? null : workElapsedMs <= budgetMs,
    detail: args.detail ?? current.detail ?? null,
    metrics: { ...(current.metrics ?? {}), ...(metrics ?? {}) }
  };
  if (status === "failed") manifest.status = "failed";
}

if (args["baseline-node-id"]) manifest.pixsoArtifacts = { ...(manifest.pixsoArtifacts ?? {}), diagnosticVisualBaselineNodeId: String(args["baseline-node-id"]) };
if (args["structured-node-id"]) manifest.pixsoArtifacts = { ...(manifest.pixsoArtifacts ?? {}), structuredNodeId: String(args["structured-node-id"]) };
if (metrics) manifest.telemetry = { ...(manifest.telemetry ?? {}), ...metrics };

const event = {
  at: now.toISOString(),
  stage,
  status,
  attempt: timing.stages[stage].attempts,
  elapsedMs: timing.stages[stage].elapsedMs ?? null,
  executor: timing.stages[stage].executor ?? null,
  detail: args.detail ?? null
};
timing.events.push(event);
const totalStart = Date.parse(timing.wallStartedAt ?? timing.startedAt);
timing.wallElapsedMs = Number.isFinite(totalStart) ? Math.max(0, now.getTime() - totalStart) : null;
timing.elapsedMs = Object.values(timing.stages).reduce((sum, entry) => sum + (Number(entry.workElapsedMs) || 0), 0);
timing.totalBudgetMs = Number(manifest.executionPolicy?.budgetsMs?.total ?? 0) || null;
timing.withinTotalBudget = timing.totalBudgetMs === null || timing.elapsedMs === null ? null : timing.elapsedMs <= timing.totalBudgetMs;
manifest.timing = timing;

const required = ["preflight", "capture", "compile", "execute", "readback", "diff"];
const diagnosticBaselineUsed = mode === "diagnostic" && Boolean(timing.stages.baseline);
const diagnosticCleanupReady = !diagnosticBaselineUsed || timing.stages.cleanup?.status === "passed";
if (required.every((name) => timing.stages[name]?.status === "passed")) {
  manifest.status = diagnosticCleanupReady ? "completed" : "accepted-awaiting-cleanup";
}

writeJson(manifestPath, manifest);
if (TERMINAL_RUN_STATUSES.has(manifest.status)) {
  releaseActiveRunLock({ runsRoot: path.dirname(path.dirname(manifestPath)), runId: manifest.runId });
}
console.log(JSON.stringify({ ok: true, runId: manifest.runId, mode, stage, status, runStatus: manifest.status, timing: timing.stages[stage], totalWorkElapsedMs: timing.elapsedMs, wallElapsedMs: timing.wallElapsedMs, withinTotalBudget: timing.withinTotalBudget }, null, 2));
