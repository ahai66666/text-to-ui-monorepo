#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const contractPath = path.join(root, "packages/component-contracts/src/components.json");
const pixsoPath = path.join(root, "packages/pixso-mapping/index.json");
const contracts = JSON.parse(await fs.readFile(contractPath, "utf8"));
const pixso = JSON.parse(await fs.readFile(pixsoPath, "utf8"));
const failures = [];
const warnings = [];
const comparisonGroups = contracts.registryPolicy?.comparisonGroups ?? [];
const comparisonIds = comparisonGroups.flatMap((group) => group.componentIds ?? []);
if (comparisonGroups.length !== 12) failures.push("Component gallery comparison order must define 12 contract sections");
if (comparisonIds.length !== contracts.components.length || new Set(comparisonIds).size !== contracts.components.length) failures.push("Component gallery comparison order must include every registered component exactly once");

const exists = async (relativePath) => {
  try { await fs.access(path.join(root, relativePath)); return true; } catch { return false; }
};
const read = async (relativePath) => fs.readFile(path.join(root, relativePath), "utf8");
const implementationPath = (component, framework) => String(component.frameworks?.[framework]?.source ?? component.implementations?.[framework] ?? "").split("#")[0];

for (const component of contracts.components) {
  if (!component.sourceStrategy || !component.visualAuthority) failures.push(`${component.logicalName}: sourceStrategy and visualAuthority are required`);
  if (!component.frameworks || !component.implementations) failures.push(`${component.logicalName}: framework implementation matrix is missing`);
  const readinessKeys = ["sourceReady", "contractReady", "visualParity", "behaviorParity", "accessibilityParity", "tokenParity"];
  if (!component.readiness || readinessKeys.some((key) => typeof component.readiness[key] !== "boolean")) {
    failures.push(`${component.logicalName}: readiness must contain six boolean dimensions`);
  }
  const calculatedStatus = component.readiness && readinessKeys.every((key) => component.readiness[key]) ? "ready" : "partial";
  if (component.status !== calculatedStatus) failures.push(`${component.logicalName}: status must be derived from readiness dimensions`);
  if (!component.category || !Number.isFinite(component.order) || !component.canonicalSection || !component.fixtureId || !component.sizing) {
    failures.push(`${component.logicalName}: runtime comparison metadata is incomplete`);
  }
  for (const framework of ["html", "react", "vue"]) {
    const file = implementationPath(component, framework);
    if (!(await exists(file))) failures.push(`${component.logicalName}: missing ${framework} implementation ${file}`);
    else {
      const source = await read(file);
      // React adapters use a shared contract helper to emit the four runtime
      // attributes; Vue adapters may be render-function components rather
      // than SFCs, so the validator accepts either an SFC template or a
      // defineComponent/h() implementation.
      const evidenceSource = framework === "react"
        ? `${source}\n${await read("packages/components-react/src/shared.jsx")}`
        : source;
      for (const attribute of ["data-component", "data-logical-component", "data-variant", "data-state"]) {
        if (!evidenceSource.includes(attribute)) failures.push(`${component.logicalName}: ${framework} implementation is missing ${attribute}`);
      }
      if (framework === "react") {
        const exportName = component.frameworks?.react?.source?.split("#")[1];
        if (exportName && !source.includes(`export function ${exportName}`) && !source.includes(`export default ${exportName}`)) failures.push(`${component.logicalName}: React adapter does not export ${exportName}`);
      }
      if (framework === "vue" && !source.includes("<template>") && !(source.includes("defineComponent") && source.includes(" h("))) failures.push(`${component.logicalName}: Vue adapter has no template or render function`);
      if (/(?:color|background|border|fill|stroke)\s*[:=]\s*(?:#[0-9a-f]{3,8}\b|rgba?\(|hsla?\()/i.test(source)) {
        failures.push(`${component.logicalName}: ${framework} implementation contains a hardcoded color`);
      }
    }
    const expectedFrameworkStatus = component.status === "ready" ? "ready" : "partial";
    if (component.frameworks?.[framework]?.status !== expectedFrameworkStatus) failures.push(`${component.logicalName}: ${framework} framework status does not match component status`);
  }
  if (!pixso.components[component.logicalName]) failures.push(`${component.logicalName}: missing Pixso logical mapping`);
  if (!component.tokenRoles?.length) warnings.push(`${component.logicalName}: no token roles declared`);
  if (!component.slots?.length) failures.push(`${component.logicalName}: slots must not be empty`);
}

const titlebar = contracts.components.find((component) => component.id === "titlebar");
const mainDetailActions = titlebar?.slotContracts?.["main-detail-actions"];
if (!titlebar?.slots?.includes("main-detail-actions")) failures.push("Titlebar/Default: main-detail-actions slot is required");
if (!titlebar?.props?.includes("mainDetailActions") || !titlebar?.props?.includes("onMainDetailAction")) failures.push("Titlebar/Default: multi-action framework props are required");
if (mainDetailActions?.cardinality !== "0..n" || mainDetailActions?.scope !== "main-detail-pane-global" || mainDetailActions?.defaultPlacement !== "final-pane-leading-slot") failures.push("Titlebar/Default: Main Detail action slot cardinality, scope, and placement are invalid");
if (mainDetailActions?.leadingInsetToken !== "layout/main-detail-action-leading-padding") failures.push("Titlebar/Default: Main Detail action slot must use the canonical 16px leading inset Token");
if (titlebar?.layoutRules?.secondaryListPane?.surfaceInset !== "16px" || titlebar?.layoutRules?.secondaryListPane?.contentAxis !== "24px") failures.push("Titlebar/Default: Secondary List Pane 16px surface inset and 24px content axis are required");
if (titlebar?.layoutRules?.mainDetailPane?.paddingInline !== "24px" || titlebar?.layoutRules?.mainDetailPane?.paddingTop !== "16px" || titlebar?.layoutRules?.mainDetailPane?.paddingBottom !== "0px") failures.push("Titlebar/Default: Main Detail Pane must use 24px inline, 16px top, and 0px bottom insets");
if (titlebar?.layoutRules?.mainDetailActions?.leadingInset !== "16px") failures.push("Titlebar/Default: Main Detail action slot must begin 16px after the pane divider");

if (!(await exists("packages/tokens/src/index.css"))) failures.push("Token package entry is missing");
if (!(await exists("apps/component-gallery/index.html"))) failures.push("Component gallery is missing");
else {
  const gallery = await read("apps/component-gallery/index.html");
  const galleryRuntime = await read("apps/component-gallery/preview.js");
  if (!gallery.includes('data-component-mount="component-catalog"') || !galleryRuntime.includes("loadRuntimeFramework")) failures.push("Gallery is missing the unified runtime component mount");
  if (!galleryRuntime.includes('data-runtime-framework') || !galleryRuntime.includes("runtime-html.js") || !galleryRuntime.includes("runtime-react.jsx") || !galleryRuntime.includes("runtime-vue.js")) failures.push("Gallery is missing the same-page HTML / React / Vue runtime switch");
  if (!(await exists("apps/component-gallery/runtime-catalog.js"))) failures.push("Runtime catalog order source is missing");
  for (const runtimeEntry of ["runtime-html.js", "runtime-react.jsx", "runtime-vue.js"]) {
    if (!(await exists(`apps/component-gallery/${runtimeEntry}`))) failures.push(`Missing unified runtime renderer ${runtimeEntry}`);
  }
  const htmlRuntime = await read("apps/component-gallery/runtime-html.js");
  const reactRuntime = await read("apps/component-gallery/runtime-react.jsx");
  const vueRuntime = await read("apps/component-gallery/runtime-vue.js");
  for (const componentId of ["button", "input", "search", "sidebar", "list-card"]) {
    if (!htmlRuntime.includes("renderRuntimeHtmlComponent") || !reactRuntime.includes(`id === \"${componentId}\"`) || !vueRuntime.includes(`id === \"${componentId}\"`)) failures.push(`${componentId}: unified runtime catalog is missing its canonical adapter`);
  }
  for (const frameworkEntry of ["framework-html.html", "framework-react.html", "framework-vue.html"]) {
    if (!(await exists(`apps/component-gallery/${frameworkEntry}`))) failures.push(`Missing framework runtime entry ${frameworkEntry}`);
  }
  if (!gallery.includes('class="contract-visual-frame"') || !gallery.includes('/legacy-skill/preview/component-gallery.html')) failures.push("Gallery must embed the old Skill full visual baseline as the single contract source");
  if (gallery.includes("核心五类视觉规则") || gallery.includes("全量契约样例")) failures.push("Gallery must not split the contract visual source into core-five and full-catalog sections");
}
const result = {
  ok: failures.length === 0,
  componentCount: contracts.components.length,
  readyCount: contracts.components.filter((component) => component.status === "ready").length,
  partialCount: contracts.components.filter((component) => component.status === "partial").length,
  frameworks: ["html", "react", "vue"],
  warnings,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
