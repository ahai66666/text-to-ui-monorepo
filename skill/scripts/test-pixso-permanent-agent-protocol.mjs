#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PIXSO_PAGE_IMPORT_CAPABILITIES } from "./pixso-native-scene-lib.mjs";

const scripts = path.dirname(fileURLToPath(import.meta.url));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "text-to-ui-agent-v5-"));
const stateDirectory = path.join(temporary, "bridge");
const planPath = path.join(temporary, "plan.json");
const port = 47500 + Math.floor(Math.random() * 400);
const env = { ...process.env, TEXT_TO_UI_PIXSO_BRIDGE_PORT: String(port), TEXT_TO_UI_PIXSO_BRIDGE_STATE_DIR: stateDirectory };
const plan = {
  kind: "pixso-component-library-plan",
  page: { name: "AgentV5Fixture" },
  execution: {
    mode: "component-library",
    minimumRuntimeVersion: "5.0.0",
    agentContract: {
      protocolVersion: 4,
      planSchemaVersion: 5,
      minimumKernelVersion: "5.0.0",
      requiredCapabilities: PIXSO_PAGE_IMPORT_CAPABILITIES,
      idempotencyKey: "agent-v5-fixture",
    },
  },
  operations: [],
};
fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
const bridge = spawn(process.execPath, [path.join(scripts, "pixso-plugin-bridge.mjs"), "serve"], { env, stdio: "ignore" });
const waitForBridge = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/health`)).ok) return true; } catch (_) {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return false;
};
const hello = (capabilities) => fetch(`http://127.0.0.1:${port}/session`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ sessionId: "agent-v5", runtimeVersion: "5.0.0", kernelVersion: "5.0.0", protocolVersion: 4, operationPlanVersions: [1, 5], capabilities }),
});

try {
  assert.equal(await waitForBridge(), true);
  const publish = spawnSync(process.execPath, [path.join(scripts, "pixso-plugin-bridge.mjs"), "publish", planPath], { env, encoding: "utf8" });
  assert.equal(publish.status, 0, publish.stderr);
  assert.equal(JSON.parse(publish.stdout).queued, true);

  await hello(["node.create"]);
  const blocked = await (await fetch(`http://127.0.0.1:${port}/claim?after=&session=agent-v5&runtime=5.0.0&protocol=4`)).json();
  assert.equal(blocked.reason, "plugin-capability-mismatch");
  assert.ok(blocked.missingCapabilities.includes("transaction.commit"));

  await hello(PIXSO_PAGE_IMPORT_CAPABILITIES);
  const recovered = await (await fetch(`http://127.0.0.1:${port}/claim?after=&session=agent-v5&runtime=5.0.0&protocol=4`)).json();
  assert.equal(recovered.changed, true);
  assert.equal(recovered.plan.execution.agentContract.planSchemaVersion, 5);

  const duplicate = spawnSync(process.execPath, [path.join(scripts, "pixso-plugin-bridge.mjs"), "publish", planPath], { env, encoding: "utf8" });
  assert.equal(duplicate.status, 0, duplicate.stderr);
  assert.equal(JSON.parse(duplicate.stdout).reused, true);

  const cancel = await (await fetch(`http://127.0.0.1:${port}/cancel`, { method: "POST" })).json();
  assert.equal(cancel.cancelRequested, true);
  const heartbeat = await (await hello(PIXSO_PAGE_IMPORT_CAPABILITIES)).json();
  assert.equal(heartbeat.cancelRequested, true);
} finally {
  bridge.kill("SIGTERM");
  fs.rmSync(temporary, { recursive: true, force: true });
}

console.log("Pixso Permanent Agent protocol tests passed: queue, capability negotiation, reconnect, idempotency, and cancellation are deterministic.");
