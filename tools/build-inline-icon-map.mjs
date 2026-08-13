#!/usr/bin/env node

/** Build one deterministic inline-SVG icon module for all three adapters. */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "packages/components-html/src/component-icons.svg");
const xml = await fs.readFile(source, "utf8");
const definitions = {};
for (const match of xml.matchAll(/<symbol\s+id="tui-([^"]+)"\s+viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g)) {
  const [, id, viewBox, content] = match;
  const [group, ...parts] = id.split("-");
  const alias = `${group}/${parts.join("-")}`;
  // HarmonyOS icons expose one canonical Regular style only. Some supplied
  // assets intentionally carry their own paint (for example the white
  // checkbox mark with a subtle translucent edge), so preserve those values.
  const preservePaint = /(?:fill|stroke)="(?!none|currentColor)[^"]+"/.test(content);
  definitions[alias] = { viewBox, content: content.trim(), ...(preservePaint ? { preservePaint: true } : {}) };
}
if (!Object.keys(definitions).length) throw new Error("No icons found in the canonical sprite");

const moduleSource = `// Generated from packages/components-html/src/component-icons.svg. Do not edit by hand.\n` +
  `export const iconDefinitions = ${JSON.stringify(definitions, null, 2)};\n` +
  `export const iconSizes = Object.freeze({16: 16, 20: 20, 24: 24});\n` +
  `export const iconStrokeWidths = Object.freeze({16: 1, 20: 1.25, 24: 1.5});\n` +
  `export function resolveIcon(name) {\n` +
  `  const definition = iconDefinitions[name];\n` +
  `  if (!definition) throw new Error(\`Unknown icon semantic alias: \${name}\`);\n` +
  `  return definition;\n` +
  `}\n` +
  `export function iconMarkup(name, { size = 20, decorative = true, ariaLabel = \"\" } = {}) {\n` +
  `  if (![16, 20, 24].includes(Number(size))) throw new Error(\`Unsupported icon display size: \${size}\`);\n` +
  `  const definition = resolveIcon(name);\n` +
  `  const label = decorative ? \" aria-hidden=\\\"true\\\"\" : \` role=\\\"img\\\" aria-label=\\\"\${String(ariaLabel).replaceAll(\"\\\"\", \"&quot;\")}\\\"\`;\n` +
  `  return \`<svg class=\\\"tui-icon tui-icon--regular\\\" viewBox=\\\"\${definition.viewBox}\\\" width=\\\"\${size}\\\" height=\\\"\${size}\\\" data-icon-alias=\\\"\${name}\\\" data-icon-size=\\\"\${size}\\\" data-icon-kind=\\\"regular\\\"\${label}>\${definition.content}</svg>\`;\n` +
  `}\n`;

for (const target of [
  "packages/components-html/src/icon-map.js",
  "packages/components-react/src/icon-map.js",
  "packages/components-vue/src/icon-map.js"
]) {
  await fs.writeFile(path.join(root, target), moduleSource);
}
console.log(`Built inline icon map with ${Object.keys(definitions).length} semantic aliases.`);
