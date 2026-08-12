#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const contractPath = path.join(root, "packages/component-contracts/src/components.json");
const mappingPath = path.join(root, "packages/pixso-mapping/index.json");
const contracts = JSON.parse(await fs.readFile(contractPath, "utf8"));
const mapping = JSON.parse(await fs.readFile(mappingPath, "utf8"));

const colorVariables = (component) => {
  if (component.logicalName.startsWith("Button/")) return ["brand/100", "neutral-light/100", "neutral-dark/05", "function/danger/100"];
  if (component.logicalName.startsWith("Alert/")) return ["brand/10", "function/success/10", "function/warning/10", "function/danger/10", "neutral-dark/05"];
  if (["Input", "Search"].some((name) => component.logicalName.startsWith(`${name}/`))) return ["neutral-light/100", "neutral-dark/90", "neutral-dark/10"];
  if (component.logicalName.startsWith("Sidebar")) return ["neutral-dark/05", "brand/10", "brand/100", "neutral-dark/90"];
  if (component.logicalName.startsWith("List Item")) return ["neutral-light/100", "brand/10", "neutral-dark/90", "neutral-dark/60"];
  return ["neutral-light/100", "neutral-dark/05", "neutral-dark/90", "brand/100"];
};

const axesFor = (component) => {
  const axes = ["state"];
  if ((component.variants ?? []).length > 1) axes.unshift("variant");
  if ((component.sizes ?? []).length > 1) axes.push("size");
  if ((component.modes ?? []).length > 1) axes.push("mode");
  return [...new Set(axes)];
};

for (const component of contracts.components) {
  mapping.components[component.logicalName] ??= {
    libraryPage: "NewComponents",
    variantAxes: axesFor(component),
    slots: component.slots,
    colorVariables: colorVariables(component)
  };
}

mapping.schemaVersion = 2;
await fs.writeFile(mappingPath, `${JSON.stringify(mapping, null, 2)}\n`);
console.log(`Expanded ${path.relative(root, mappingPath)} to ${Object.keys(mapping.components).length} logical mappings.`);
