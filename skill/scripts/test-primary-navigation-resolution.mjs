#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const index = readJson("text-to-ui/references/index/generated/component-index.json");
const aliases = readJson("text-to-ui/references/index/capability-aliases.source.json").aliases;
const contract = readJson("packages/component-contracts/src/components.json").components.find((item) => item.id === "primary-navigation-item");
const sidebar = readJson("packages/component-contracts/src/components.json").components.find((item) => item.id === "sidebar");
const failures = [];

const resolve = (capability) => index.components.find((item) => item.capabilities.includes(capability));
const primary = resolve("primary-navigation");
const primaryExplicit = resolve("primary-navigation-item");
if (primary?.id !== "primary-navigation-item" || primaryExplicit?.id !== "primary-navigation-item") failures.push("primary-navigation aliases must resolve to primary-navigation-item");
if (resolve("sidebar")?.id !== "sidebar") failures.push("sidebar must remain a separate component");
if (aliases["primary-navigation"]?.includes("sidebar") || aliases["primary-navigation-item"]?.includes("sidebar")) failures.push("primary-navigation aliases must not include sidebar");
if (!contract?.structuralAxes?.placement?.includes("primary-navigation-shell")) failures.push("primary-navigation-item must declare the Pattern shell placement");
if (!contract?.structuralAxes?.alignment?.includes("bottom")) failures.push("primary-navigation-item must declare bottom alignment");
if (!contract?.slots?.includes("icon") || !contract?.slots?.includes("tooltip")) failures.push("primary-navigation-item must expose icon and tooltip slots");
if (contract?.slotContracts?.icon?.kind !== "regular" || contract?.slotContracts?.icon?.displaySize !== "24px" || contract?.slotContracts?.icon?.source !== "lucide") failures.push("primary-navigation-item must use the 24px Lucide Regular icon contract");
if (JSON.stringify(contract?.iconAliases) !== JSON.stringify(["navigation/grid", "field/calendar", "navigation/mail-unread", "action/settings"])) failures.push("primary-navigation-item aliases must use the approved Lucide Regular semantic aliases");
if (sidebar?.id === primary?.id) failures.push("primary-navigation-item and sidebar must not share a registry identity");
for (const framework of ["html", "react", "vue"]) {
  if (!primary?.frameworks?.[framework]?.exists) failures.push(`primary-navigation-item ${framework} adapter source is missing`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Primary navigation resolution valid: Pattern shell → native primary-navigation-item; sidebar remains second-level.");
