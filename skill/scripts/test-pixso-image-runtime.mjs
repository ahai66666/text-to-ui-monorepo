#!/usr/bin/env node

import assert from "node:assert/strict";

await import("./pixso-native-execution-runtime.js");

function descendants(node) {
  return (node.children ?? []).flatMap((child) => [child, ...descendants(child)]);
}

function makeNode(type) {
  return {
    id: `${type.toLowerCase()}-${Math.random()}`,
    type,
    name: "",
    children: [],
    fills: [],
    strokes: [],
    visible: true,
    width: 1,
    height: 1,
    appendChild(child) {
      this.children.push(child);
      child.parent = this;
      // Simulate Pixso normalizing an inserted vector to its source SVG
      // stroke. The runtime must reapply the display-size contract afterward.
      if (child.type === "VECTOR") child.strokeWeight = 1.5;
    },
    remove() { if (this.parent) this.parent.children = this.parent.children.filter((child) => child !== this); },
    resize(width, height) { this.width = width; this.height = height; },
    setPluginData(key, value) { this.pluginData ??= {}; this.pluginData[key] = value; },
    getPluginData(key) { return this.pluginData?.[key] ?? ""; },
    setBoundVariable(key, variable) {
      this.boundVariables ??= {};
      this.boundVariables[key] = { type: "VARIABLE_ALIAS", id: variable.id };
    },
    findAll(predicate) { return descendants(this).filter(predicate); },
  };
}

const page = { ...makeNode("PAGE"), id: "page-1", name: "coremail" };
let decoded = false;
let createdImage = false;
const pixso = {
  currentPage: page,
  root: { children: [page] },
  variables: { getLocalVariablesAsync: async () => [
    { id: "icon-stroke-16", name: "icon/stroke/16", resolvedType: "FLOAT", value: 1 },
    { id: "icon-stroke-20", name: "icon/stroke/20", resolvedType: "FLOAT", value: 1.25 },
    { id: "icon-stroke-24", name: "icon/stroke/24", resolvedType: "FLOAT", value: 1.5 },
  ] },
  getLocalTextStylesAsync: async () => [],
  getLocalEffectStylesAsync: async () => [],
  createFrame: () => makeNode("FRAME"),
  createRectangle: () => makeNode("RECTANGLE"),
  createVector: () => makeNode("VECTOR"),
  base64Decode(value) { decoded = value === "iVBORw0KGgo="; return new Uint8Array([137, 80, 78, 71]); },
  createImage(bytes) { createdImage = bytes[0] === 137; return { hash: "pixso-image-hash" }; },
};
const plan = {
  execution: { rootNodeId: "root", canonicalKey: "image-runtime-test" },
  page: { name: "Image runtime test" },
  resources: { variableAliases: {}, images: [{ ref: "brand/logo", mimeType: "image/png", dataBase64: "iVBORw0KGgo=" }] },
  operations: [
    { op: "create-frame", phase: "layout", nodeId: "root", parentId: null, name: "Image runtime test", region: "test", layout: { direction: "VERTICAL", width: "hug", height: "hug" }, style: {} },
    { op: "create-image", phase: "layout", nodeId: "logo", parentId: "root", name: "Brand logo", region: "test", layout: { width: 36, height: 36 }, style: { fill: { kind: "transparent" } }, imageRef: { ref: "brand/logo", fit: "FILL" } },
  ],
};

const result = await globalThis.TextToUiPixsoRuntime.create(pixso).execute(plan);
assert.equal(result.ok, true, JSON.stringify(result));
assert.equal(decoded, true, "image resource must be base64-decoded in the Pixso sandbox");
assert.equal(createdImage, true, "decoded bytes must be registered through pixso.createImage");
const logo = page.children[0].children[0];
assert.deepEqual(logo.fills, [{ type: "IMAGE", imageHash: "pixso-image-hash", scaleMode: "FILL" }]);
assert.equal(logo.getPluginData("text-to-ui-image-ref"), "brand/logo");

// The same plan must also work when the page is delivered in ordered modules:
// the new root stays visible during assembly, then the old canonical root is
// removed only after final readback and MCP prefixes are stripped from names.
page.children = [];
const oldRoot = makeNode("FRAME");
oldRoot.name = "Old image artboard";
oldRoot.setPluginData("text-to-ui-canonical-key", "image-runtime-test");
page.appendChild(oldRoot);
const modularPlan = {
  ...plan,
  execution: { ...plan.execution, canonicalKey: "image-runtime-test", runId: undefined },
  modules: [
    { id: "shell", label: "shell", operationIndexes: [0] },
    { id: "main-detail", label: "detail", operationIndexes: [1] },
  ],
};
const modularResult = await globalThis.TextToUiPixsoRuntime.create(pixso).execute(modularPlan, { replaceExisting: true });
assert.equal(modularResult.ok, true, modularResult.audit?.issues?.join(", "));
assert.equal(modularResult.phase, "modular-readback");
assert.equal(page.children.length, 1, "transactional modular import must remove the old root only after the final readback");
assert.equal(page.children[0].name, "Image runtime test", "final modular commit must strip MCP-only name prefixes");
assert.equal(page.children[0].visible, true, "final modular commit must reveal the accepted root");
assert.equal(page.children[0].children[0].getPluginData("text-to-ui-image-ref"), "brand/logo");

// A cooperative pause must never hide or delete either side of the comparison.
// The draft remains visible for inspection and the accepted root remains intact.
page.children = [];
const acceptedRoot = makeNode("FRAME");
acceptedRoot.name = "Accepted image artboard";
acceptedRoot.setPluginData("text-to-ui-canonical-key", "image-runtime-test");
page.appendChild(acceptedRoot);
let pauseChecks = 0;
const pausedResult = await globalThis.TextToUiPixsoRuntime.create(pixso).execute(modularPlan, {
  replaceExisting: true,
  checkpointInterval: 1,
  shouldCancel: () => (pauseChecks += 1) >= 3,
});
assert.equal(pausedResult.ok, false);
assert.equal(pausedResult.phase, "paused");
assert.equal(page.children.length, 2, "pause must preserve the accepted root and the current draft");
const visibleDraft = page.children.find((node) => node !== acceptedRoot);
assert.equal(acceptedRoot.visible, true, "accepted root must remain visible during a paused replacement");
assert.equal(visibleDraft.visible, true, "paused draft must remain visible for visual inspection");
assert.equal(visibleDraft.getPluginData("text-to-ui-draft-status"), "paused");

page.children = [];
const iconPlan = {
  execution: { rootNodeId: "icon-root", canonicalKey: "icon-runtime-test", runId: undefined },
  page: { name: "Icon runtime test" },
  resources: {
    variableAliases: {},
    variables: [
      { ref: "$variable/icon/stroke/16", name: "icon/stroke/16", value: 1 },
      { ref: "$variable/icon/stroke/20", name: "icon/stroke/20", value: 1.25 },
      { ref: "$variable/icon/stroke/24", name: "icon/stroke/24", value: 1.5 },
    ],
    // Deliberately use a non-contract source value: the renderer must
    // normalize it to the display-size table rather than copying 2px to all
    // three slots.
    icons: [{ alias: "action/add", svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>' }],
  },
  modules: [
    { id: "shell", label: "shell", operationIndexes: [0, 1, 2, 3] },
    { id: "icon-hydration", label: "icons", operationIndexes: [4, 5, 6] },
  ],
  operations: [
    { op: "create-frame", phase: "layout", nodeId: "icon-root", parentId: null, name: "Icon runtime test", region: "test", layout: { direction: "HORIZONTAL", width: 80, height: 24, align: "CENTER" }, style: {} },
    { op: "create-icon-slot", phase: "layout", nodeId: "icon-slot-16", parentId: "icon-root", name: "Add icon 16", region: "test", layout: { direction: "VERTICAL", width: 16, height: 16, align: "MIN" }, style: {}, iconSlot: { alias: "action/add", size: 16, hotZone: { alignment: "CENTER", axes: "BOTH" } } },
    { op: "create-icon-slot", phase: "layout", nodeId: "icon-slot-20", parentId: "icon-root", name: "Add icon 20", region: "test", layout: { direction: "VERTICAL", width: 20, height: 20, align: "MAX" }, style: {}, iconSlot: { alias: "action/add", size: 20, hotZone: { alignment: "CENTER", axes: "BOTH" } } },
    { op: "create-icon-slot", phase: "layout", nodeId: "icon-slot-24", parentId: "icon-root", name: "Add icon 24", region: "test", layout: { direction: "VERTICAL", width: 24, height: 24, align: "MIN" }, style: {}, iconSlot: { alias: "action/add", size: 24, hotZone: { alignment: "CENTER", axes: "BOTH" } } },
    { op: "hydrate-icon", phase: "icon-hydration", targetNodeId: "icon-slot-16", name: "Add icon 16", region: "test", iconRef: { alias: "action/add", size: 16, strokeWeight: { ref: "$variable/icon/stroke/16", value: 1 }, hotZone: { alignment: "CENTER", axes: "BOTH" } }, style: {} },
    { op: "hydrate-icon", phase: "icon-hydration", targetNodeId: "icon-slot-20", name: "Add icon 20", region: "test", iconRef: { alias: "action/add", size: 20, strokeWeight: { ref: "$variable/icon/stroke/20", value: 1.25 }, hotZone: { alignment: "CENTER", axes: "BOTH" } }, style: {} },
    { op: "hydrate-icon", phase: "icon-hydration", targetNodeId: "icon-slot-24", name: "Add icon 24", region: "test", iconRef: { alias: "action/add", size: 24, strokeWeight: { ref: "$variable/icon/stroke/24", value: 1.5 }, hotZone: { alignment: "CENTER", axes: "BOTH" } }, style: {} },
  ],
};
const iconResult = await globalThis.TextToUiPixsoRuntime.create(pixso).execute(iconPlan, { replaceExisting: true });
assert.equal(iconResult.ok, true, iconResult.audit?.issues?.join(", "));
const iconRoot = page.children[0];
const expectedStrokeWeights = new Map([["icon-slot-16", 1], ["icon-slot-20", 1.25], ["icon-slot-24", 1.5]]);
for (const [slotId, expectedStroke] of expectedStrokeWeights) {
  const slot = iconRoot.children.find((child) => child.getPluginData("text-to-ui-scene-id") === slotId);
  const icon = slot?.children[0];
  assert.ok(slot, `${slotId} hot zone must be created`);
  assert.ok(icon, `${slotId} must contain a hydrated vector`);
  assert.equal(icon.type, "VECTOR", "semantic icon hydration must use a native vector node");
  assert.equal(icon.getPluginData("text-to-ui-icon-renderer"), "native-vector");
  assert.equal(Number(icon.strokeWeight), expectedStroke, `${slotId} must use the display-size stroke rule`);
  assert.equal(slot.primaryAxisAlignItems, "CENTER", `${slotId} hot zone must be vertically centred`);
  assert.equal(slot.counterAxisAlignItems, "CENTER", `${slotId} hot zone must be horizontally centred`);
  assert.equal(Number(icon.x), (slot.width - icon.width) / 2, `${slotId} vector must be horizontally centred by bounds`);
  assert.equal(Number(icon.y), (slot.height - icon.height) / 2, `${slotId} vector must be vertically centred by bounds`);
  assert.equal(Number(icon.getPluginData("text-to-ui-icon-display-size")), Number(slotId.slice("icon-slot-".length)));
  assert.equal(Number(icon.getPluginData("text-to-ui-icon-stroke-weight")), expectedStroke);
  assert.equal(icon.boundVariables?.strokeWeight?.id, `icon-stroke-${slotId.slice("icon-slot-".length)}`);
  assert.deepEqual(icon.vectorPaths.map((path) => path.data), ["M12 5v14M5 12h14"]);
}
console.log("Pixso image runtime test passed: raster bytes become a native IMAGE fill with stable symbolic metadata.");
