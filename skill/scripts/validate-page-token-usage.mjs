#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const valueFor = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
const projectRoot = path.resolve(valueFor("--project-root") ?? process.cwd());
const layoutPath = valueFor("--layout-contract");
const sourceArgs = args.flatMap((arg, index) => arg === "--source" ? [args[index + 1]] : []).filter(Boolean);
if (sourceArgs.length === 0) { console.error("Usage: validate-page-token-usage.mjs --source <file-or-dir> [--source <file-or-dir>] --project-root <dir> [--layout-contract <file>]"); process.exit(2); }
const failures = [];
const cssFiles = [];
const collect = (candidate) => {
  const absolute = path.isAbsolute(candidate) ? candidate : path.resolve(projectRoot, candidate);
  if (!fs.existsSync(absolute)) { failures.push(`source not found: ${absolute}`); return; }
  const stat = fs.statSync(absolute);
  if (stat.isFile()) { if (absolute.endsWith(".css")) cssFiles.push(absolute); return; }
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) if (!["node_modules", "dist", ".git"].includes(entry.name)) collect(path.relative(projectRoot, path.join(absolute, entry.name)));
};
sourceArgs.forEach(collect);
if (cssFiles.length === 0) failures.push("no editable CSS source was found");
const layout = layoutPath ? JSON.parse(fs.readFileSync(path.resolve(layoutPath), "utf8")) : {};
const exceptions = new Set((layout.cssStructuralParameters ?? []).map((item) => `${item.property}:${item.value}`));
for (const item of layout.cssStructuralParameters ?? []) if (!item.property || !item.value || !item.reason) failures.push("layout-contract cssStructuralParameters entries require property, value, and reason");

const tokenRoot = path.join(projectRoot, "packages/tokens/src");
const tokenNames = new Set();
if (fs.existsSync(tokenRoot)) for (const file of fs.readdirSync(tokenRoot).filter((name) => name.endsWith(".css"))) {
  const text = fs.readFileSync(path.join(tokenRoot, file), "utf8");
  for (const match of text.matchAll(/(--[a-z0-9-]+)\s*:/gi)) tokenNames.add(match[1]);
}
const localNames = new Set();
const contents = cssFiles.map((file) => ({ file, text: fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "") }));
for (const { text } of contents) for (const match of text.matchAll(/(--[a-z0-9-]+)\s*:/gi)) localNames.add(match[1]);
const knownNames = new Set([...tokenNames, ...localNames]);
const visibleMetric = /^(?:color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?-color|fill|stroke|box-shadow|text-shadow|font(?:-family|-size|-weight)?|line-height|letter-spacing|border-radius|gap|row-gap|column-gap|padding(?:-(?:top|right|bottom|left|inline|block))?|margin(?:-(?:top|right|bottom|left|inline|block))?|width|min-width|max-width|height|min-height|max-height)$/i;
const literalColor = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|lab|lch)\s*\(/i;
const literalMetric = /-?(?:\d*\.)?\d+(?:px|rem|em|pt)\b/i;
const allowedKeyword = /^(?:0|auto|none|normal|inherit|initial|unset|transparent|currentColor|100%|min-content|max-content|fit-content)$/i;
for (const { file, text } of contents) {
  for (const reference of text.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) if (!knownNames.has(reference[1])) failures.push(`${path.relative(projectRoot, file)} references unknown Token ${reference[1]}`);
  for (const match of text.matchAll(/(^|[;{])\s*([a-z-]+|--[a-z0-9-]+)\s*:\s*([^;{}]+)\s*(?=;|})/gim)) {
    const property = match[2];
    const value = match[3].trim();
    const key = `${property}:${value}`;
    if (property.startsWith("--")) {
      if ((literalColor.test(value) || literalMetric.test(value)) && !exceptions.has(key)) failures.push(`${path.relative(projectRoot, file)} custom property ${property} stores a literal (${value}); alias a canonical Token or declare a structural layout parameter`);
      continue;
    }
    if (!visibleMetric.test(property) || allowedKeyword.test(value) || value.includes("var(")) continue;
    if ((literalColor.test(value) || literalMetric.test(value)) && !exceptions.has(key)) failures.push(`${path.relative(projectRoot, file)} uses a literal visible value: ${property}: ${value}`);
  }
}
if (failures.length) { console.error("Page Token usage validation failed"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(JSON.stringify({ ok: true, cssFiles: cssFiles.map((file) => path.relative(projectRoot, file)), tokenCount: tokenNames.size, structuralExceptions: exceptions.size }, null, 2));
