#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildIconSymbol, loadIconRegistry } from "../text-to-ui/scripts/icon-tools.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "text-to-ui/preview/component-gallery.html");
const aliases = [
  "primary-level/overview",
  "primary-level/calendar",
  "primary-level/contacts",
  "primary-level/mail",
  "object/device"
];
const legacyIds = ["hmos-grid-fill", "hmos-document-fill", "hmos-users-fill", "hmos-message-fill", "hmos-device"];
const registry = await loadIconRegistry();
let html = await fs.readFile(file, "utf8");

for (const id of legacyIds) {
  html = html.replace(new RegExp(`\\s*<symbol id="${id}"[\\s\\S]*?<\\/symbol>`, "g"), "");
}
for (const alias of aliases) {
  const id = `icon-${alias.replaceAll("/", "-")}`;
  html = html.replace(new RegExp(`\\s*<symbol id="${id}"[\\s\\S]*?<\\/symbol>`, "g"), "");
}

const symbols = (await Promise.all(aliases.map((alias) => buildIconSymbol(alias, registry)))).join("\n");
html = html.replace(/(<svg class="hmos-sprite"[^>]*>)/, `$1\n${symbols}`);
const replacements = new Map([
  ["hmos-grid-fill", "icon-primary-level-overview"],
  ["hmos-document-fill", "icon-primary-level-calendar"],
  ["hmos-users-fill", "icon-primary-level-contacts"],
  ["hmos-message-fill", "icon-primary-level-mail"],
  ["hmos-device", "icon-object-device"]
]);
for (const [legacyId, id] of replacements) {
  html = html.replaceAll(`#${legacyId}`, `#${id}`);
  html = html.replaceAll(`<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${legacyId}"/></svg>`, `<svg class="pattern-lucide-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`);
}
html = html.replace("一级导航图标（专用面型）", "一级导航图标（Lucide Regular）");
await fs.writeFile(file, html);
console.log(`Synchronized ${aliases.length} legacy primary-level icons to Lucide Regular.`);
