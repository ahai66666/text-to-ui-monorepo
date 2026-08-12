#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const contractPath = path.join(root, "packages/component-contracts/src/components.json");
const source = JSON.parse(await fs.readFile(contractPath, "utf8"));
const existing = new Map(source.components.map((component) => [component.logicalName, component]));

const names = [
  "Accordion", "Alert", "Alert Dialog", "Aspect Ratio", "Attachment", "Avatar", "Badge", "Breadcrumb", "Bubble", "Button", "Calendar", "Card", "Carousel", "Chart", "Checkbox", "Collapsible", "Combobox", "Context Menu", "Data Table", "Date Picker", "Time Picker", "Dialog", "Dropdown Menu", "Empty", "Field", "Hover Card", "Input", "Input OTP", "Item", "Kbd", "Label", "Menubar", "Native Select", "Navigation Menu", "Pagination", "Popover", "Progress", "Radio Group", "Search", "Select", "Separator", "Sidebar", "Slider", "Switch", "Table", "Tabs", "Textarea", "Toast", "Tooltip", "Typography", "List Card", "Semi-modal", "Titlebar"
];

const idFor = (name) => name
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .replace(/[^a-zA-Z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .toLowerCase();

const stateFor = (name) => {
  const states = ["default", "hover", "focus", "disabled"];
  if (["Accordion", "Collapsible", "Dialog", "Alert Dialog", "Dropdown Menu", "Popover", "Hover Card", "Context Menu", "Menubar", "Navigation Menu", "Select", "Combobox", "Date Picker", "Time Picker", "Titlebar"].includes(name)) states.push("open");
  if (["Checkbox", "Radio Group", "Switch", "Tabs", "Sidebar", "Table", "Data Table", "List Card"].includes(name)) states.push("selected");
  if (["Input", "Textarea", "Field", "Search", "Combobox", "Select", "Date Picker", "Time Picker"].includes(name)) states.push("error");
  if (["Progress", "Chart", "Toast"].includes(name)) states.push("loading");
  return [...new Set(states)];
};

const slotsFor = (name) => {
  if (["Button", "Titlebar"].includes(name)) return ["leading", "label", "trailing", "actions"];
  if (["Input", "Search", "Textarea", "Select", "Native Select", "Combobox", "Date Picker", "Time Picker", "Field"].includes(name)) return ["label", "leading", "value", "trailing", "help"];
  if (["Dialog", "Alert Dialog", "Semi-modal", "Popover", "Hover Card"].includes(name)) return ["title", "description", "content", "actions"];
  if (["Card", "Item", "List Card", "Table", "Data Table"].includes(name)) return ["leading", "title", "description", "content", "trailing"];
  return ["label", "content", "description"];
};

const tokenRolesFor = (name) => {
  const roles = ["color.text", "color.surface", "color.border", "typography.body-l", "spacing.component-gap"];
  if (["Button", "Alert", "Badge", "Progress", "Toast", "Tabs", "Switch"].includes(name)) roles.push("color.primary");
  if (["Dialog", "Alert Dialog", "Semi-modal", "Popover", "Hover Card", "Context Menu", "Dropdown Menu", "Tooltip"].includes(name)) roles.push("shadow.overlay", "radius.card");
  if (["Table", "Data Table", "Calendar", "Date Picker", "Time Picker", "Pagination"].includes(name)) roles.push("spacing.content-inset");
  return [...new Set(roles)];
};

const variantFor = (name) => {
  if (["Button"].includes(name)) return ["primary", "secondary", "ghost", "danger"];
  if (["Alert"].includes(name)) return ["info", "success", "warning", "danger", "neutral"];
  if (["Badge", "Toast", "Progress"].includes(name)) return ["default", "success", "warning", "danger", "info"];
  if (["Dialog", "Alert Dialog", "Semi-modal"].includes(name)) return ["white", "gray", "modal", "non-modal"];
  if (["Titlebar"].includes(name)) return ["small", "medium", "large", "xlarge"];
  return ["default"];
};

const baseContracts = {
  Button: {
    id: "button", logicalName: "Button/Primary/Default", variants: ["primary", "secondary", "ghost", "danger"], sizes: ["standard", "small"], modes: ["text", "icon-text", "icon", "selection-dropdown", "split-dropdown"], states: ["default", "hover", "pressed", "focus", "disabled"], props: ["label", "variant", "size", "mode", "disabled", "menuItems"], slots: ["icon", "label", "trigger", "menu"], tokenRoles: ["color.primary", "color.primary-text", "size.button-height", "radius.button", "spacing.padding-button-x", "typography.body-l"], iconAliases: ["action/add", "action/download", "action/settings", "action/close", "navigation/chevron-down", "action/refresh", "action/more"], source: "skill-canonical", status: "ready", implementations: { html: "@text-to-ui/components-html/button", react: "@text-to-ui/components-react/Button", vue: "@text-to-ui/components-vue/Button" }
  },
  Input: {
    id: "input", logicalName: "Input/White Surface/Default", variants: ["default", "error", "disabled"], states: ["default", "hover", "focus", "disabled", "error"], props: ["value", "placeholder", "disabled", "error"], slots: ["leading", "value", "trailing", "help"], tokenRoles: ["color.input-bg", "color.text", "color.border", "size.input-height", "radius.input", "typography.body-l"], source: "skill-canonical", status: "ready", implementations: { html: "@text-to-ui/components-html/input", react: "@text-to-ui/components-react/Input", vue: "@text-to-ui/components-vue/Input" }
  },
  Search: {
    id: "search", logicalName: "Search/White Surface/Default", variants: ["default", "focused", "with-value"], states: ["default", "hover", "focus", "disabled"], props: ["value", "placeholder", "disabled"], slots: ["leading", "value", "clear"], tokenRoles: ["color.input-bg", "color.text", "color.icon", "size.search-height", "radius.search", "spacing.padding-search-x", "typography.body-l"], iconAliases: ["field/search", "action/close"], source: "skill-canonical", status: "ready", implementations: { html: "@text-to-ui/components-html/search", react: "@text-to-ui/components-react/Search", vue: "@text-to-ui/components-vue/Search" }
  },
  Sidebar: {
    id: "sidebar", logicalName: "Sidebar Item/Default", variants: ["default", "selected", "collapsed"], states: ["default", "hover", "pressed", "focus", "selected", "disabled"], props: ["label", "icon", "selected", "collapsed", "count"], slots: ["leading", "label", "trailing"], tokenRoles: ["color.sidebar-bg", "color.sidebar-selected", "color.text", "color.primary", "size.list-item-height", "radius.list-item", "typography.body-l"], iconAliases: ["navigation/grid", "navigation/recent", "action/settings"], source: "skill-canonical", status: "ready", implementations: { html: "@text-to-ui/components-html/sidebar", react: "@text-to-ui/components-react/Sidebar", vue: "@text-to-ui/components-vue/Sidebar" }
  },
  "List Card": {
    id: "list-card", logicalName: "List Item/White Surface/Default", variants: ["default", "selected", "unread"], states: ["default", "hover", "pressed", "focus", "selected", "disabled"], props: ["title", "description", "meta", "selected", "unread"], slots: ["leading", "title", "description", "trailing"], tokenRoles: ["color.surface", "color.sidebar-selected", "color.text", "color.text-muted", "size.list-item-height", "radius.list-item", "typography.body-l", "typography.body-m"], iconAliases: ["navigation/list", "navigation/grid"], source: "skill-canonical", status: "ready", implementations: { html: "@text-to-ui/components-html/list-card", react: "@text-to-ui/components-react/ListCard", vue: "@text-to-ui/components-vue/ListCard" }
  }
};

const makeContract = (name) => ({
  id: idFor(name),
  logicalName: `${name}/Default`,
  variants: variantFor(name),
  states: stateFor(name),
  props: ["label", "value", "disabled", "state", "className"],
  slots: slotsFor(name),
  tokenRoles: tokenRolesFor(name),
  source: "skill-canonical",
  status: "ready",
  implementations: {
    html: "@text-to-ui/components-html/legacy",
    react: "@text-to-ui/components-react/LegacyCatalog",
    vue: "@text-to-ui/components-vue/LegacyCatalog"
  }
});

const contracts = names.map((name) => {
  const existingComponent = baseContracts[name] ?? existing.get(`${name}/Default`);
  return existingComponent ?? makeContract(name);
});

source.schemaVersion = 2;
source.contractVersion = 2;
source.components = contracts;
await fs.writeFile(contractPath, `${JSON.stringify(source, null, 2)}\n`);
console.log(`Expanded ${path.relative(root, contractPath)} to ${contracts.length} logical components.`);
