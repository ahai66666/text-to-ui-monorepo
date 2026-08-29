#!/usr/bin/env node

/**
 * Titlebar's third-pane action slot is one uniform business-action group. The
 * fixed More trigger is the only icon-only exception; all other actions keep
 * one shared icon or icon+text mode and overflow in stable order.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderRuntimeHtmlComponent } from "../../packages/components-html/src/index.js";

const html = renderRuntimeHtmlComponent("titlebar");
const action = (id) => html.match(new RegExp(`<button[^>]+data-action="${id}"[\\s\\S]*?<\\/button>`))?.[0] ?? "";
const reply = action("reply");
const replyAll = action("reply-all");
const forward = action("forward");
const more = action("more");

for (const [name, markup] of [["reply", reply], ["reply-all", replyAll], ["forward", forward]]) {
  assert.match(markup, /data-button-type="icon-text-ghost"/, `${name} must use the shared icon-text mode`);
  assert.match(markup, /data-logical-component="Icon Text Button\/Ghost\/Default"/);
  assert.match(markup, /data-mode="icon-text"/);
  assert.match(markup, /data-slot="icon"/);
  assert.match(markup, /data-slot="label"/);
}
assert.match(more, /data-button-type="icon"/);
assert.match(more, /data-logical-component="Icon Button\/Ghost\/Default"/);
assert.match(more, /data-overflow-trigger="true"/);
assert.match(more, /aria-haspopup="menu"/);
assert.match(html, /data-action-overflow="collapse-to-more"/);
assert.match(html, /class="tui-titlebar__overflow-menu"/);
assert.ok(html.indexOf('data-action="more"') > html.indexOf('data-action="forward"'), "More must remain after business actions");

const contract = JSON.parse(fs.readFileSync(new URL("../../packages/component-contracts/src/components.json", import.meta.url), "utf8"));
const pixsoMap = JSON.parse(fs.readFileSync(new URL("../assets/design-system/pixso-native-component-map.json", import.meta.url), "utf8"));
const titlebar = contract.components.find((component) => component.id === "titlebar");
const slot = titlebar?.slotContracts?.["main-detail-actions"];
const pixsoTitlebar = pixsoMap.mappings.find((mapping) => mapping.logicalName === "Titlebar/L/Normal");
assert.deepEqual(slot?.allowedButtonLogicalNames, [
  "Icon Button/Ghost/Default",
  "Icon Text Button/Ghost/Default"
]);
assert.equal(slot?.buttonTypeContracts?.icon?.mode, "icon");
assert.equal(slot?.buttonTypeContracts?.["icon-text-ghost"]?.mode, "icon-text");
assert.deepEqual(slot?.overflow, {
  strategy: "collapse-to-more",
  triggerLogicalName: "Icon Button/Ghost/Default",
  triggerActionId: "more",
  triggerIconAlias: "action/more",
  triggerPosition: "last",
  eligibleButtonTypes: ["icon", "icon-text-ghost"],
  preserveMode: true,
  preserveOrder: true,
  fit: "available-width",
  staticBoard: { renderTrigger: true, renderMenu: false }
});
assert.deepEqual(slot?.modePolicy, {
  type: "uniform-business-actions",
  allowedModes: ["icon", "icon-text"],
  mixedModes: "forbidden",
  overflowTriggerExcluded: true
});
assert.ok(pixsoTitlebar?.supportedProps?.includes("actionOverflow"), "Pixso Titlebar mapping must accept actionOverflow");

console.log("Titlebar main-detail-actions contract passed: uniform icon/icon-text mode and collapse-to-more overflow are explicit and Pixso-addressable.");
