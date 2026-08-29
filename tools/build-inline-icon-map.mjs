#!/usr/bin/env node

/** Build one deterministic inline-SVG icon module for all three adapters. */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "packages/components-html/src/component-icons.svg");
const xml = await fs.readFile(source, "utf8");
const aliasRegistry = JSON.parse(await fs.readFile(
  path.join(root, "text-to-ui/assets/icons/icon-aliases.json"),
  "utf8"
));
// Symbol ids flatten the semantic path (for example
// `primary-level/mail` becomes `tui-primary-level-mail`). Do not recover the
// alias by splitting on the first hyphen: that turns the group into
// `primary/level-mail` and makes valid component calls fail at runtime.
const canonicalAliasBySymbolId = new Map(
  Object.keys(aliasRegistry.aliases ?? {})
    .map((alias) => [`tui-${alias.replaceAll("/", "-")}`, alias])
);
const definitions = {};
for (const match of xml.matchAll(/<symbol\s+id="tui-([^"]+)"(?:\s+data-icon-alias="([^"]+)")?\s+[^>]*viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g)) {
  const [, id, semanticAlias, viewBox, content] = match;
  const [group, ...parts] = id.split("-");
  const symbolId = `tui-${id}`;
  const alias = semanticAlias ?? canonicalAliasBySymbolId.get(symbolId) ?? `${group}/${parts.join("-")}`;
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

const runtimeModuleSource = moduleSource
  .replace('export function iconMarkup(name, { size = 20, decorative = true, ariaLabel = "" } = {}) {', 'export function iconMarkup(name, { size = 20, decorative = true, ariaLabel = "", iconStyle = "regular" } = {}) {')
  .replace('  if (![16, 20, 24].includes(Number(size)))', '  if (!["regular", "solid"].includes(iconStyle)) throw new Error(`Unsupported icon style: ${iconStyle}`);\n  if (![16, 20, 24].includes(Number(size)))')
  .replace('tui-icon tui-icon--regular', 'tui-icon tui-icon--${iconStyle}')
  .replace('data-icon-kind=\\"regular\\"', 'data-icon-kind=\\"${iconStyle}\\"');

for (const target of [
  "packages/components-html/src/icon-map.js",
  "packages/components-react/src/icon-map.js",
  "packages/components-vue/src/icon-map.js"
]) {
  await fs.writeFile(path.join(root, target), runtimeModuleSource);
}
console.log(`Built inline icon map with ${Object.keys(definitions).length} semantic aliases.`);
