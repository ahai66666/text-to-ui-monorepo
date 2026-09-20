#!/usr/bin/env node

/** Structural checks shared by the three runtime galleries. */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createTitlebarPreviewScenes } from "../packages/component-contracts/src/titlebar-segments.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFile(path.join(root, file), "utf8");
const registry = JSON.parse(await read("packages/component-contracts/src/components.json"));
const failures = [];
const expectedFrameworks = ["html", "react", "vue"];
const requiredDimensions = ["sourceReady", "contractReady", "visualParity", "behaviorParity", "accessibilityParity", "tokenParity"];

const components = [...registry.components].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
const ids = new Set();
for (const component of components) {
  if (ids.has(component.id)) failures.push(`duplicate component order entry: ${component.id}`);
  ids.add(component.id);
  if (!component.fixtureId || !component.category || !Number.isFinite(component.order)) failures.push(`${component.id}: missing fixture/category/order`);
  if (!component.specimens?.length) failures.push(`${component.id}: missing structural specimen`);
  for (const key of requiredDimensions) if (typeof component.readiness?.[key] !== "boolean") failures.push(`${component.id}: missing readiness.${key}`);
  const calculated = requiredDimensions.every((key) => component.readiness[key]) ? "ready" : "partial";
  if (component.status !== calculated) failures.push(`${component.id}: status is not derived from readiness`);
  for (const framework of expectedFrameworks) {
    if (!component.frameworks?.[framework]?.source) failures.push(`${component.id}: missing ${framework} source`);
    if (component.frameworks?.[framework]?.status !== component.status) failures.push(`${component.id}: ${framework} status differs from component status`);
  }
}

const comparisonGroups = registry.registryPolicy?.comparisonGroups ?? [];
const comparisonIds = comparisonGroups.flatMap((group) => group.componentIds ?? []);
if (comparisonGroups.length !== 7) failures.push(`comparison order must contain 7 functional sections, received ${comparisonGroups.length}`);
if (comparisonIds.length !== components.length) failures.push(`comparison order must contain ${components.length} components, received ${comparisonIds.length}`);
if (new Set(comparisonIds).size !== comparisonIds.length) failures.push("comparison order contains duplicate component ids");
for (const component of components) if (!comparisonIds.includes(component.id)) failures.push(`${component.id}: missing from contract comparison order`);
for (const componentId of comparisonIds) if (!ids.has(componentId)) failures.push(`${componentId}: comparison order references an unknown component`);
const comparisonGroupById = new Map(comparisonGroups.map((group) => [group.id, group.componentIds ?? []]));
const requiredContractPlacements = {
  navigation: ["titlebar", "primary-navigation-item", "sidebar", "tabs", "sub-tabs", "tree-view", "breadcrumb", "menubar", "pagination", "accordion", "collapsible"],
  actions: ["button", "chips", "context-menu", "dropdown-menu"],
  display: ["alert", "snackbar", "tooltip", "popover", "hover-card", "avatar", "badge", "color-picker", "table", "progress"],
  input: ["input", "search", "textarea", "field", "label", "combobox", "number-selector"],
  choices: ["checkbox", "radio", "radio-group", "switch", "segmented-button", "select", "native-select", "slider", "calendar", "date-picker", "time-picker"],
  containers: ["form-field", "list-card", "dialog", "alert-dialog", "semi-modal"],
  specialized: ["attachment"]
};
for (const [groupId, expectedIds] of Object.entries(requiredContractPlacements)) {
  if (JSON.stringify(comparisonGroupById.get(groupId)) !== JSON.stringify(expectedIds)) failures.push(`${groupId}: comparison order no longer matches the contract visual baseline`);
}

const catalog = await read("apps/component-gallery/runtime-catalog.js");
const html = await read("apps/component-gallery/runtime-html.js");
const htmlComponents = await read("packages/components-html/src/index.js");
const react = await read("apps/component-gallery/runtime-react.jsx");
const vue = await read("apps/component-gallery/runtime-vue.js");
const titlebarContract = await read("packages/component-contracts/src/titlebar-segments.js");
for (const source of [catalog, html, react, vue]) {
  if (source.includes("core-five") || source.includes("full-catalog")) failures.push("runtime source contains the removed two-catalog split");
}
for (const source of [react, vue]) {
  if (source.includes("innerHTML") || source.includes("legacy-skill") || source.includes("cloneNode")) failures.push("React/Vue runtime must not clone or inject legacy HTML");
}
for (const required of ["runtimeCategories", "comparisonGroups", "comparisonMetaFor", "specimensFor"]) if (!catalog.includes(required)) failures.push(`runtime catalog missing ${required}`);
for (const required of ["tui-runtime-category", "data-fixture-id", "RuntimeStructuralButton"]) if (!html.includes(required) && !react.includes(required) && !vue.includes(required)) failures.push(`runtime renderer missing ${required}`);
const titlebarSizes = createTitlebarPreviewScenes().map((scene) => scene.size);
const titlebarLayouts = createTitlebarPreviewScenes().flatMap((scene) => scene.scenes.map((item) => item.layout));
for (const required of ["small", "medium", "large", "xlarge", "unfocus"]) {
  if (!titlebarContract.includes(required)) failures.push(`shared Titlebar contract is missing canonical structural coverage: ${required}`);
}
for (const required of ["standalone", "two-column", "three-column"]) {
  if (!titlebarLayouts.includes(required)) failures.push(`shared Titlebar contract is missing canonical layout coverage: ${required}`);
}
if (new Set(titlebarSizes).size !== 4) failures.push(`shared Titlebar contract must expose 4 canonical sizes, received ${new Set(titlebarSizes).size}`);
for (const [framework, source] of [["html", `${html}\n${htmlComponents}`], ["react", react], ["vue", vue]]) {
  if (!source.includes("createTitlebarPreviewScenes")) failures.push(`${framework} runtime must consume the shared Titlebar preview contract`);
  if (!source.includes("data-surface-context")) failures.push(`${framework} runtime is missing canonical Input surface coverage`);
}
for (const [framework, source] of [["html", html], ["react", react], ["vue", vue]]) {
  for (const required of ["data-contract-id", "data-category", "data-order", "data-registry-category", "data-registry-order", "data-fixture-id"]) {
    if (!source.includes(required)) failures.push(`${framework} runtime cards missing ${required}`);
  }
}

const result = {
  ok: failures.length === 0,
  componentCount: components.length,
  categoryCount: new Set(components.map((component) => component.category)).size,
  readyCount: components.filter((component) => component.status === "ready").length,
  partialCount: components.filter((component) => component.status === "partial").length,
  frameworks: expectedFrameworks,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
