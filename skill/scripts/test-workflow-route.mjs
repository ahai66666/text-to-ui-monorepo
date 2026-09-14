#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scripts = path.dirname(fileURLToPath(import.meta.url));
const resolve = (route) => spawnSync(process.execPath, [path.join(scripts, "resolve-workflow-route.mjs"), "--route", route], { encoding: "utf8" });
for (const route of ["existing-html-to-pixso", "new-page", "micro-revision", "pixso-component-library", "converter-diagnosis", "skill-maintenance"]) {
  const result = resolve(route);
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.routeId, route);
  assert.ok(payload.exactReferencesToRead.length >= 1);
}
const normal = JSON.parse(resolve("existing-html-to-pixso").stdout);
assert.deepEqual(normal.exactReferencesToRead.map((entry) => entry.relative), ["references/routes/existing-html-to-pixso.md"]);
assert.equal(normal.exactReferencesToRead.some((entry) => /pixso-(?:mcp|native-scene|fidelity-import-pipeline)/.test(entry.relative)), false, "normal import must not load broad diagnostic manuals");
const invalid = resolve("unknown");
assert.notEqual(invalid.status, 0);
console.log("Workflow route tests passed: each request resolves to one small route and normal HTML import loads no broad Pixso manual.");
