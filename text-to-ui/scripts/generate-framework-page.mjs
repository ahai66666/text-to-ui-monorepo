#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readPatternRegistry, resolvePatternContract } from "./pattern-contract-lib.mjs";
import { buildPatternStructure, validatePatternBindings } from "./ui-scene-core.mjs";

const args = process.argv.slice(2);
const valueFor = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : null; };
const contextPath = valueFor("--context");
const layoutPath = valueFor("--layout-contract");
const bindingsPath = valueFor("--bindings") ?? valueFor("--page-spec");
const outputPath = valueFor("--out");
const manifestPath = valueFor("--manifest");
if (!contextPath || !layoutPath || !bindingsPath || !outputPath || !manifestPath) {
  throw new Error("Usage: generate-framework-page.mjs --context <context.json> --layout-contract <layout-contract.json> --bindings <bindings.json> --out <page module> --manifest <framework-page-manifest.json> [--require-slots]");
}

const read = (file) => JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
const context = read(contextPath);
const layoutContract = read(layoutPath);
const input = read(bindingsPath);
if (context.request?.confirmed !== true || context.request?.confirmation?.status !== "confirmed") throw new Error("Context Packet must be explicitly confirmed");
const framework = context.request?.framework;
if (!context.renderer || context.renderer.framework !== framework) throw new Error(`Context Packet is missing the ${framework} renderer contract`);
const resolvedPattern = resolvePatternContract(layoutContract.pattern, { registry: readPatternRegistry(), layoutContract });
if (context.layout?.id !== resolvedPattern.pattern.id) throw new Error("Context Packet Pattern does not match layout-contract Pattern");
const rawBindings = input.componentBindings ?? input.components ?? input.bindings ?? [];
if (!Array.isArray(rawBindings)) throw new Error("Bindings must be an array");
const available = new Map((context.renderer.components ?? []).map((component) => [component.logicalName, component]));
const bindings = rawBindings.map((binding, index) => {
  const renderer = available.get(binding.logicalName);
  if (!renderer) throw new Error(`No ${framework} renderer resolved for binding ${index}: ${binding.logicalName}`);
  const unsupportedProps = Object.keys(binding.options ?? {}).filter((key) => !(renderer.supportedProps ?? []).includes(key));
  if (unsupportedProps.length) throw new Error(`${binding.logicalName}: unsupported props ${unsupportedProps.join(", ")}`);
  return {
    id: binding.id ?? `binding-${index + 1}`,
    logicalName: binding.logicalName,
    rendererKey: renderer.rendererKey,
    exportName: renderer.exportName,
    region: binding.region ?? binding.pane,
    slot: binding.slot ?? null,
    options: binding.options ?? {},
    expectedRuntimeCount: binding.expectedRuntimeCount ?? binding.count ?? 1,
    source: renderer.source,
  };
});
const errors = validatePatternBindings({ resolvedPattern, layoutContract, bindings, requireSlots: args.includes("--require-slots") });
if (errors.length) throw new Error(`Framework page Pattern binding failed:\n${errors.join("\n")}`);
const { patternDigest, structureDigest, structure } = buildPatternStructure({ resolvedPattern, layoutContract, bindings });
if (context.patternContract?.patternDigest && context.patternContract.patternDigest !== patternDigest) throw new Error("Context Packet Pattern digest is stale");

const imports = context.renderer.styleImports.map((source) => `import ${JSON.stringify(source)};`);
const grouped = Object.fromEntries(resolvedPattern.pattern.paneOrder.map((region) => [region, bindings.filter((binding) => binding.region === region)]));
let source;
if (framework === "html") {
  imports.push(`import { renderHtmlComponent } from ${JSON.stringify(context.renderer.package)};`);
  const paneExpressions = resolvedPattern.pattern.paneOrder.map((region) => {
    const children = grouped[region].map((binding) => `renderHtmlComponent(${JSON.stringify(binding.rendererKey)}, ${JSON.stringify(binding.options)})`).join(" + ") || '""';
    return `\`<section data-pattern-region=${JSON.stringify(region)}>\` + ${children} + \`</section>\``;
  });
  source = `${imports.join("\n")}\n\nexport const patternContract = ${JSON.stringify({ id: resolvedPattern.pattern.id, source: resolvedPattern.authority, schemaVersion: 1, patternDigest, structureDigest }, null, 2)};\nexport function renderGeneratedPage() {\n  return \`<main data-pattern=\"${resolvedPattern.pattern.id}\" data-structure-digest=\"${structureDigest}\">\` +\n    ${paneExpressions.join(" +\n    ")} +\n    \`</main>\`;\n}\n`;
} else {
  const exportNames = [...new Set(bindings.map((binding) => binding.exportName).filter(Boolean))];
  if (framework === "react") imports.unshift('import React from "react";');
  else imports.unshift('import { h } from "vue";');
  if (exportNames.length) imports.push(`import { ${exportNames.join(", ")} } from ${JSON.stringify(context.renderer.package)};`);
  const create = framework === "react" ? "React.createElement" : "h";
  const paneExpressions = resolvedPattern.pattern.paneOrder.map((region) => {
    const children = grouped[region].map((binding) => `${create}(${binding.exportName}, ${JSON.stringify({ ...binding.options, key: binding.id })})`).join(", ");
    return `${create}("section", { key: ${JSON.stringify(region)}, "data-pattern-region": ${JSON.stringify(region)} }${children ? `, ${children}` : ""})`;
  });
  source = `${imports.join("\n")}\n\nexport const patternContract = ${JSON.stringify({ id: resolvedPattern.pattern.id, source: resolvedPattern.authority, schemaVersion: 1, patternDigest, structureDigest }, null, 2)};\nexport function GeneratedPage() {\n  return ${create}("main", { "data-pattern": ${JSON.stringify(resolvedPattern.pattern.id)}, "data-structure-digest": ${JSON.stringify(structureDigest)} },\n    ${paneExpressions.join(",\n    ")}\n  );\n}\n`;
}

const manifest = {
  schemaVersion: 1,
  kind: "text-to-ui-framework-page-manifest",
  targetFramework: framework,
  renderer: context.renderer,
  patternContract: { id: resolvedPattern.pattern.id, source: resolvedPattern.authority, schemaVersion: 1, patternDigest, structureDigest },
  structure,
  registered: bindings,
};
for (const [file, contents] of [[outputPath, source], [manifestPath, `${JSON.stringify(manifest, null, 2)}\n`]]) {
  const absolute = path.resolve(file); fs.mkdirSync(path.dirname(absolute), { recursive: true }); fs.writeFileSync(absolute, contents);
}
console.log(JSON.stringify({ ok: true, framework, patternId: resolvedPattern.pattern.id, patternDigest, structureDigest, output: path.resolve(outputPath), manifest: path.resolve(manifestPath) }, null, 2));
