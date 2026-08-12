import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const index = args.indexOf("--contract");
if (index < 0 || !args[index + 1]) {
  console.error("Usage: validate-pc-framework-layout.mjs --contract <layout-contract.json>");
  process.exit(2);
}

const contractPath = path.resolve(args[index + 1]);
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const failures = [];
const patterns = {
  "pattern-a-two-pane": ["primary-navigation", "main-content"],
  "pattern-b-three-pane": ["primary-navigation", "secondary-list", "main-detail"],
  "pattern-c-tool-workspace": ["primary-navigation", "tool-workspace"],
  "pattern-d-inspector": null,
};
const finalSlots = {
  "pattern-a-two-pane": "main-content-title",
  "pattern-b-three-pane": "main-detail-operations",
  "pattern-c-tool-workspace": "main-content-title",
};

if (contract.schemaVersion !== 1) failures.push("schemaVersion must equal 1");
if (contract.platform !== "harmonyos-pc") failures.push("platform must equal harmonyos-pc");
if (!Object.hasOwn(patterns, contract.pattern)) failures.push("pattern must be an approved HarmonyOS PC framework pattern");
if (!Array.isArray(contract.references) || !contract.references.some((item) => item.includes("harmonyos-layout-patterns.md")) || !contract.references.some((item) => item.includes("layout-system.md"))) failures.push("references must include harmonyos-layout-patterns.md and layout-system.md");

const viewport = contract.viewport ?? {};
for (const key of ["width", "height", "minWidth", "minHeight"]) {
  if (!(viewport[key] > 0)) failures.push(`viewport.${key} must be positive`);
}
if (viewport.width < viewport.minWidth || viewport.height < viewport.minHeight) failures.push("reference viewport must not be smaller than the minimum window");
if (contract.globalTitleLayer !== true) failures.push("globalTitleLayer must be true");
if (contract.primaryActionSlot !== "primary-navigation-shell") failures.push("primaryActionSlot must be primary-navigation-shell");

const panes = Array.isArray(contract.paneOrder) ? contract.paneOrder : [];
const expected = patterns[contract.pattern];
if (expected && JSON.stringify(panes) !== JSON.stringify(expected)) failures.push(`${contract.pattern} paneOrder must equal ${expected.join(" -> ")}`);
if (contract.pattern === "pattern-d-inspector") {
  if (!panes.includes("inspector")) failures.push("pattern-d-inspector must include inspector");
  if (panes.at(-1) !== "inspector") failures.push("pattern-d-inspector must place inspector after the final main pane");
  const base = panes.filter((pane) => pane !== "inspector");
  const validBase = JSON.stringify(base) === JSON.stringify(patterns["pattern-b-three-pane"]) || JSON.stringify(base) === JSON.stringify(patterns["pattern-c-tool-workspace"]);
  if (!validBase) failures.push("pattern-d-inspector must extend pattern B or C");
}

const expectedSlot = finalSlots[contract.pattern];
if (expectedSlot && contract.finalPaneLeadingSlot !== expectedSlot) failures.push(`finalPaneLeadingSlot must equal ${expectedSlot}`);
if (contract.pattern === "pattern-d-inspector" && !["main-detail-operations", "main-content-title"].includes(contract.finalPaneLeadingSlot)) failures.push("pattern-d-inspector finalPaneLeadingSlot must follow its B or C base");

if (!Array.isArray(contract.titleSegments) || JSON.stringify(contract.titleSegments) !== JSON.stringify(panes)) failures.push("titleSegments must match paneOrder exactly");
const insetOwners = contract.insetOwners && typeof contract.insetOwners === "object" && !Array.isArray(contract.insetOwners) ? contract.insetOwners : {};
for (const pane of panes) if (typeof insetOwners[pane] !== "string" || insetOwners[pane].length === 0) failures.push(`insetOwners must declare one owner for pane: ${pane}`);
for (const pane of Object.keys(insetOwners)) if (!panes.includes(pane)) failures.push(`inset owner is declared for an unknown pane: ${pane}`);

if (!Array.isArray(contract.scrollOwners) || contract.scrollOwners.length === 0) failures.push("scrollOwners must declare pane-level scrolling ownership");
if (new Set(contract.scrollOwners ?? []).size !== (contract.scrollOwners ?? []).length) failures.push("scrollOwners must not duplicate pane ownership");
for (const owner of contract.scrollOwners ?? []) if (!panes.includes(owner)) failures.push(`scroll owner is not a declared pane: ${owner}`);
if (contract.resizeBehavior !== "fixed-panes-flexible-final-pane") failures.push("resizeBehavior must preserve fixed panes and a flexible final pane");
if (!["default-content", "edge-aligned"].includes(contract.contentMode)) failures.push("contentMode must be default-content or edge-aligned");
if (!Array.isArray(contract.layoutTokens) || contract.layoutTokens.length === 0) failures.push("layoutTokens must contain shared layout Token paths");
for (const token of contract.layoutTokens ?? []) if (!/^(layout|space|size|radius|font|opacity)\//.test(token)) failures.push(`layout token is not a shared foundation path: ${token}`);

if (failures.length > 0) {
  console.error("PC framework layout validation failed");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, pattern: contract.pattern, panes, titleSegments: contract.titleSegments, insetOwners, scrollOwners: contract.scrollOwners, layoutTokenCount: contract.layoutTokens.length }, null, 2));
