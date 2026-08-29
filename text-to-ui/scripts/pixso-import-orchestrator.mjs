#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cancelActiveRun, describeActiveRun } from "./pixso-import-run-state.mjs";
import { parseArgs } from "./pixso-native-scene-lib.mjs";

const command = process.argv[2];
const forwarded = process.argv.slice(3);
const args = parseArgs(forwarded);
const scripts = path.dirname(fileURLToPath(import.meta.url));
// The managed Bridge is the single source of truth for publications.  Keep
// child-process publishing on the same durable state directory as the
// long-running Bridge process; otherwise a direct `publish` child can write a
// plan into the legacy port-suffixed directory while the plugin polls the
// managed directory and remains stuck at "waiting for a new plan".
const bridgeStateDirectory = path.resolve(
  process.env.TEXT_TO_UI_PIXSO_BRIDGE_STATE_DIR
    ?? path.join(scripts, "../.text-to-ui/pixso-bridge"),
);
const usage = `Usage:
  pixso-import-orchestrator.mjs status --runs-root <directory>
  pixso-import-orchestrator.mjs cancel --runs-root <directory> --reason <text>
  pixso-import-orchestrator.mjs start --html-root <directory> --url <rendered-url> [--allow-virtual-route] [--runs-root <directory>] [--mode normal|diagnostic]
  pixso-import-orchestrator.mjs compile <compile-pixso-import arguments>
  pixso-import-orchestrator.mjs publish --run-manifest <json>
  pixso-import-orchestrator.mjs diff <compare-pixso-screenshots arguments>`;

function run(script, scriptArgs) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...scriptArgs], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

function runCapture(script, scriptArgs) {
  const env = script === "pixso-plugin-bridge.mjs"
    ? { ...process.env, TEXT_TO_UI_PIXSO_BRIDGE_STATE_DIR: bridgeStateDirectory }
    : process.env;
  return spawnSync(process.execPath, [path.join(scripts, script), ...scriptArgs], { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function parseOutput(result, label) {
  if (result.status !== 0) throw new Error(`${label} failed:\n${result.stderr || result.stdout}`);
  return result.stdout?.trim() ? JSON.parse(result.stdout) : {};
}

if (!command || command === "--help" || command === "help") {
  console.log(usage);
  process.exit(command ? 0 : 2);
}
if (command === "status") {
  if (!args["runs-root"]) throw new Error("status requires --runs-root");
  const state = describeActiveRun(path.resolve(args["runs-root"]));
  console.log(JSON.stringify({
    ok: true,
    active: state.active,
    runId: state.runId,
    status: state.status,
    manifest: state.manifestPath,
    nextAction: state.active ? "resume-or-finish-current-run" : "start-new-run",
  }, null, 2));
  process.exit(0);
}
if (command === "cancel") {
  if (!args["runs-root"]) throw new Error("cancel requires --runs-root");
  console.log(JSON.stringify({ ok: true, ...cancelActiveRun({ runsRoot: path.resolve(args["runs-root"]), reason: args.reason || undefined }) }, null, 2));
  process.exit(0);
}
if (command === "start") run("create-pixso-import-run.mjs", forwarded);
if (command === "compile") run("compile-pixso-import.mjs", forwarded);
if (command === "publish") {
  if (!args["run-manifest"]) throw new Error("publish requires --run-manifest");
  const manifestPath = path.resolve(args["run-manifest"]);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const visualManifestPath = path.resolve(manifest.artifacts?.visualManifest ?? "");
  const operationPlanPath = path.resolve(manifest.artifacts?.operationPlan ?? "");
  if (!fs.existsSync(visualManifestPath) || !fs.existsSync(operationPlanPath)) throw new Error("publish requires the current run's visual manifest and operation plan");
  parseOutput(runCapture("validate-pixso-import-run.mjs", [
    "--run-manifest", manifestPath,
    "--visual-manifest", visualManifestPath,
    "--operation-plan", operationPlanPath,
  ]), "import validation");
  parseOutput(runCapture("update-pixso-import-run.mjs", [
    "--manifest", manifestPath,
    "--stage", "execute",
    "--status", "start",
    "--detail", "queue validated current-run operation plan for the Pixso Permanent Agent; reconnect resumes automatically",
  ]), "execution-stage start");
  const published = runCapture("pixso-plugin-bridge.mjs", ["publish", operationPlanPath]);
  if (published.status !== 0) {
    runCapture("update-pixso-import-run.mjs", [
      "--manifest", manifestPath,
      "--stage", "execute",
      "--status", "failed",
      "--detail", String(published.stderr || published.stdout || "plugin publication failed").slice(0, 1000),
    ]);
    throw new Error(`plugin publication failed:\n${published.stderr || published.stdout}`);
  }
  process.stdout.write(`${JSON.stringify({ ok: true, runId: manifest.runId, stage: "publish", executor: "plugin", mcpFallbackAllowed: false, publication: JSON.parse(published.stdout) }, null, 2)}\n`);
  process.exit();
}
if (command === "diff") run("compare-pixso-screenshots.mjs", forwarded);
throw new Error(`Unknown orchestrator command: ${command}\n${usage}`);
