#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "tui-framework-page-"));
const node = process.execPath;
const run = (script, args) => spawnSync(node, [path.join(root, "text-to-ui/scripts", script), ...args], { cwd: root, encoding: "utf8" });
const contexts = {};
for (const framework of ["html", "react", "vue"]) {
  const output = path.join(temp, `${framework}-context.json`);
  const result = run("resolve-context.mjs", ["--task", "tasks", "--framework", framework, "--mode", "fast-preview", "--confirmed", "--out", output]);
  assert.equal(result.status, 0, result.stderr);
  contexts[framework] = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.equal(contexts[framework].renderer.framework, framework);
}
assert.equal(new Set(Object.values(contexts).map((context) => context.patternContract.patternDigest)).size, 1, "all framework Context Packets must share one Pattern digest");

const layout = path.join(temp, "layout-contract.json");
let result = run("generate-layout-contract.mjs", ["--context", path.join(temp, "html-context.json"), "--out", layout]);
assert.equal(result.status, 0, result.stderr);
const bindings = path.join(temp, "bindings.json");
fs.writeFileSync(bindings, `${JSON.stringify({ componentBindings: [
  { id: "navigation", logicalName: "Sidebar Item/Default", region: "primary-navigation", slot: "primary-navigation-shell" },
  { id: "search", logicalName: "Search/White Surface/Default", region: "secondary-list" },
  { id: "action", logicalName: "Button/Primary/Default", region: "main-detail", slot: "main-detail-actions" }
] }, null, 2)}\n`);

const manifests = [];
for (const framework of ["html", "react", "vue"]) {
  const output = path.join(temp, `page.${framework === "react" ? "jsx" : "js"}`);
  const manifest = path.join(temp, `${framework}-manifest.json`);
  result = run("generate-framework-page.mjs", ["--context", path.join(temp, `${framework}-context.json`), "--layout-contract", layout, "--bindings", bindings, "--out", output, "--manifest", manifest]);
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(fs.readFileSync(manifest, "utf8"));
  assert.equal(parsed.targetFramework, framework);
  manifests.push(parsed);
  const source = fs.readFileSync(output, "utf8");
  assert.match(source, /data-structure-digest/);
  assert.match(source, new RegExp(`@text-to-ui/components-${framework}`));
}
assert.equal(new Set(manifests.map((manifest) => manifest.patternContract.structureDigest)).size, 1, "HTML, React, and Vue must share one structure digest");

const invalidBindings = path.join(temp, "invalid-bindings.json");
fs.writeFileSync(invalidBindings, JSON.stringify({ componentBindings: [{ logicalName: "Button/Primary/Default", region: "invented-pane" }] }));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", invalidBindings, "--out", path.join(temp, "invalid.js"), "--manifest", path.join(temp, "invalid.json")]);
assert.notEqual(result.status, 0, "an adapter must not invent a Pattern region");
fs.rmSync(temp, { recursive: true, force: true });
console.log("Cross-framework Pattern page generation tests passed.");
