#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const valueFor = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const manifestPath = valueFor("--manifest");
const evidencePath = valueFor("--evidence");
if (!manifestPath || !evidencePath) { console.error("Usage: validate-runtime-component-reuse.mjs --manifest <component-usage.json> --evidence <runtime-evidence.json>"); process.exit(2); }
const manifest = JSON.parse(fs.readFileSync(path.resolve(manifestPath), "utf8"));
const evidence = JSON.parse(fs.readFileSync(path.resolve(evidencePath), "utf8"));
const failures = [];
if (manifest.schemaVersion !== 2 || manifest.enforcement !== "strict-source") failures.push("runtime reuse validation requires a strict-source schemaVersion 2 manifest");
if (evidence.schemaVersion !== 1 || !Array.isArray(evidence.components)) failures.push("runtime evidence must use schemaVersion 1 and contain components");
for (const usage of manifest.registered ?? []) {
  const matches = (evidence.components ?? []).filter((item) => item.rendererKey === usage.rendererKey && item.logicalName === usage.logicalName);
  if (matches.length < (usage.expectedRuntimeCount ?? 1)) failures.push(`${usage.logicalName} expected at least ${usage.expectedRuntimeCount ?? 1} runtime instance(s), found ${matches.length}`);
  if (matches.some((item) => !item.visible)) failures.push(`${usage.logicalName} has hidden or detached runtime evidence`);
  if (usage.regions?.length && matches.some((item) => !usage.regions.includes(item.region))) failures.push(`${usage.logicalName} rendered outside declared region(s): ${usage.regions.join(", ")}`);
  for (const requiredSlot of usage.requiredRuntimeSlots ?? []) if (!matches.some((item) => item.slots?.includes(requiredSlot))) failures.push(`${usage.logicalName} is missing required runtime slot: ${requiredSlot}`);
}
if (failures.length) { console.error("Runtime component reuse validation failed"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(JSON.stringify({ ok: true, url: evidence.url ?? null, componentCount: evidence.components.length, registeredCount: manifest.registered?.length ?? 0 }, null, 2));
