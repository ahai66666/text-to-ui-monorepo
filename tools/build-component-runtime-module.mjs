#!/usr/bin/env node

/**
 * Create a browser-loadable registry module from the canonical JSON registry.
 *
 * The Vite build can import JSON directly, but a gallery opened as file://
 * cannot reliably import JSON modules (and some browsers stop executing the
 * entry module before any navigation handlers are registered). Keeping this
 * generated module next to the canonical JSON makes the standalone preview
 * use the same registry without changing the source of truth.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "packages/component-contracts/src/components.json");
const target = path.join(root, "packages/component-contracts/src/components-runtime.js");
const registry = JSON.parse(await fs.readFile(source, "utf8"));

const output = [
  "// Generated from components.json. Do not edit by hand.",
  `export default ${JSON.stringify(registry, null, 2)};`,
  ""
].join("\n");

await fs.writeFile(target, output, "utf8");
console.log(`Generated ${path.relative(root, target)} from ${path.relative(root, source)}`);
