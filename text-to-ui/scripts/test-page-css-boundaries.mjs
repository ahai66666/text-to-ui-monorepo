#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "tui-css-boundary-"));
const valid = path.join(temp, "valid.css");
const invalid = path.join(temp, "invalid.css");
const fixedCanvas = path.join(temp, "fixed-canvas.css");
fs.writeFileSync(valid, ".mail-list { display: grid; }\n");
fs.writeFileSync(invalid, "[data-pattern-shell-slot=primary-navigation-bottom] { display: grid; }\n");
fs.writeFileSync(fixedCanvas, "main { width: 1728px; height: 1152px; transform: scale(.8); }\n");
const script = path.resolve("text-to-ui/scripts/validate-page-css-boundaries.mjs");
assert.equal(spawnSync(process.execPath, [script, "--source", valid]).status, 0);
assert.notEqual(spawnSync(process.execPath, [script, "--source", invalid]).status, 0);
assert.notEqual(spawnSync(process.execPath, [script, "--source", fixedCanvas]).status, 0);
fs.rmSync(temp, { recursive: true, force: true });
console.log("Page CSS boundary tests passed.");
