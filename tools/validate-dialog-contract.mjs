#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFile(path.join(root, relative), "utf8");
const registry = JSON.parse(await read("packages/component-contracts/src/components.json"));
const css = await read("packages/component-styles/src/index.css");
const html = await read("packages/components-html/src/advanced.js");
const react = await read("packages/components-react/src/advanced.jsx");
const vue = await read("packages/components-vue/src/advanced.js");
const failures = [];
const component = (id) => registry.components.find((item) => item.id === id);
const mustInclude = (source, marker, label) => { if (!source.includes(marker)) failures.push(`${label}: missing ${marker}`); };
const sameMembers = (actual = [], expected = []) => actual.length === expected.length && expected.every((value) => actual.includes(value));

const dialog = component("dialog");
const alertDialog = component("alert-dialog");
const semiModal = component("semi-modal");
if (!dialog || !alertDialog || !semiModal) failures.push("dialog family is incomplete in the registry");
if (dialog && !sameMembers(dialog.variants, ["single", "double"])) failures.push("dialog variants must be single/double only");
if (dialog?.surface !== "white") failures.push("dialog must use the white surface only");
if (alertDialog && !sameMembers(alertDialog.variants, ["danger"])) failures.push("alert-dialog must expose danger only");
if (alertDialog?.surface !== "white") failures.push("alert-dialog must use the white surface only");
if (semiModal && !sameMembers(semiModal.structuralAxes?.size, ["s", "m", "l"])) failures.push("semi-modal sizes must be s/m/l");
if (semiModal && !sameMembers(semiModal.structuralAxes?.surface, ["white", "gray"])) failures.push("semi-modal surfaces must be white/gray");
if (semiModal && !sameMembers(semiModal.structuralAxes?.mode, ["non-modal", "modal"])) failures.push("semi-modal modes must be non-modal/modal");
if ((semiModal?.specimens ?? []).length < 7) failures.push("semi-modal must record all structural specimens");

for (const marker of [
  "var(--width-dialog)", "var(--width-modal-sm)", "var(--width-modal-md)", "var(--width-modal-lg)",
  "var(--shadow-4)", "var(--height-dialog-header)", "var(--height-modal-footer)",
  '[data-action-layout="single"]', '[data-surface="gray"] [data-field-control]'
]) mustInclude(css, marker, "dialog CSS");
for (const marker of ["data-overlay-trigger", "data-action-layout", "tui-dialog--semi", "data-semi-axis=\"size\"", "data-semi-axis=\"surface\"", "data-semi-axis=\"mode\""]) mustInclude(html, marker, "HTML dialog family");
for (const marker of ["createPortal", "actionLayout", "tui-dialog--semi", "onOpenChange", "triggerRef"]) mustInclude(react, marker, "React dialog family");
for (const marker of ["Teleport", "actionLayout", "tui-dialog--semi", 'emit("update:open"', "const trigger = ref()"] ) mustInclude(vue, marker, "Vue dialog family");

const dialogSource = html.slice(html.indexOf("export const dialog"), html.indexOf("export const semiModal"));
if (dialogSource.includes("tui-dialog__close")) failures.push("Dialog and Alert Dialog must not render a close icon");
if (!html.slice(html.indexOf("export const semiModal"), html.indexOf("const menuComponent")).includes("tui-dialog__close")) failures.push("Semi-modal must render a close icon");

const result = { ok: failures.length === 0, family: ["dialog", "alert-dialog", "semi-modal"], failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
