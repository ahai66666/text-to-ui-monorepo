#!/usr/bin/env node

/**
 * Add the stable comparison metadata used by the contract and runtime galleries.
 * This is deliberately separate from adapter generation: normalization may be
 * rerun without losing the canonical order, fixtures, or honest readiness.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "packages/component-contracts/src/components.json");
const registry = JSON.parse(await fs.readFile(file, "utf8"));

const sections = [
  ["titlebars", "标题栏"],
  ["buttons", "按钮"],
  ["fields", "输入与字段"],
  ["choices", "选择控件"],
  ["navigation", "导航"],
  ["data-display", "卡片与数据"],
  ["disclosure", "披露与导航"],
  ["overlays", "浮层与命令"],
  ["form-plus", "复合表单"],
  ["loading-data", "加载与日期"],
  ["specialized", "专用内容"],
  ["feedback", "提示与反馈"]
];
const sectionLabels = Object.fromEntries(sections);
const order = {
  titlebar: 10,
  button: 20,
  input: 30, search: 31, textarea: 32, select: 33, field: 34,
  checkbox: 40, radio: 41, "radio-group": 42, switch: 43,
  "primary-navigation-item": 49, sidebar: 50, "list-card": 51, tabs: 52, breadcrumb: 53, pagination: 54,
  avatar: 60, badge: 61, card: 62, item: 63, table: 64, "data-table": 65, progress: 66, empty: 67,
  accordion: 70, collapsible: 71, "navigation-menu": 72, menubar: 73, separator: 74,
  dialog: 80, "alert-dialog": 81, "semi-modal": 82, popover: 83, "hover-card": 84, "context-menu": 85, "dropdown-menu": 86,
  label: 90, combobox: 91, "native-select": 92, slider: 93, "input-otp": 94, kbd: 95,
  chart: 102, calendar: 103, "date-picker": 104, "time-picker": 105,
  attachment: 110, carousel: 111, "aspect-ratio": 112, bubble: 113, typography: 114,
  alert: 120, tooltip: 121, toast: 122
};
const sectionFor = {
  titlebar: "titlebars", button: "buttons",
  input: "fields", search: "fields", textarea: "fields", select: "fields", field: "fields",
  checkbox: "choices", radio: "choices", "radio-group": "choices", switch: "choices",
  "primary-navigation-item": "navigation", sidebar: "navigation", "list-card": "navigation", tabs: "navigation", breadcrumb: "navigation", pagination: "navigation",
  avatar: "data-display", badge: "data-display", card: "data-display", item: "data-display", table: "data-display", "data-table": "data-display", progress: "data-display", empty: "data-display",
  accordion: "disclosure", collapsible: "disclosure", "navigation-menu": "disclosure", menubar: "disclosure", separator: "disclosure",
  dialog: "overlays", "alert-dialog": "overlays", "semi-modal": "overlays", popover: "overlays", "hover-card": "overlays", "context-menu": "overlays", "dropdown-menu": "overlays",
  label: "form-plus", combobox: "form-plus", "native-select": "form-plus", slider: "form-plus", "input-otp": "form-plus", kbd: "form-plus",
  chart: "loading-data", calendar: "loading-data", "date-picker": "loading-data", "time-picker": "loading-data",
  attachment: "specialized", carousel: "specialized", "aspect-ratio": "specialized", bubble: "specialized", typography: "specialized",
  alert: "feedback", tooltip: "feedback", toast: "feedback"
};
const coreIds = new Set(["button", "input", "search", "primary-navigation-item", "sidebar", "list-card", "titlebar", "textarea", "field", "select", "combobox", "native-select", "checkbox", "radio", "radio-group", "switch", "tabs", "accordion", "collapsible", "avatar", "badge", "card", "item", "table", "data-table", "pagination", "breadcrumb", "progress", "empty", "separator", "label", "alert", "tooltip", "toast", "attachment", "carousel"]);
const fillIds = new Set(["input", "search", "textarea", "sidebar", "list-card", "table", "data-table", "accordion", "collapsible"]);
const overlayIds = new Set(["dialog", "alert-dialog", "semi-modal", "popover", "hover-card", "context-menu", "dropdown-menu"]);
const behaviorMap = {
  button: ["click", "keyboard-activation", "disabled"],
  input: ["input", "focus", "disabled", "error"],
  search: ["input", "clear", "focus", "disabled"],
  radio: ["select", "keyboard-activation", "disabled"],
  textarea: ["input", "focus", "disabled", "error"],
  "primary-navigation-item": ["select", "keyboard-activation", "disabled"],
  sidebar: ["select", "keyboard-activation", "disabled"],
  "list-card": ["select", "keyboard-activation", "disabled"],
  tabs: ["select", "arrow-keys", "focus"],
  accordion: ["toggle", "keyboard-activation", "focus"],
  collapsible: ["toggle", "keyboard-activation", "focus"],
  combobox: ["open", "select", "escape", "arrow-keys"],
  "dropdown-menu": ["open", "select", "escape", "arrow-keys"],
  dialog: ["open", "confirm", "cancel", "escape", "focus-return", "no-outside-dismiss"],
  "alert-dialog": ["open", "confirm", "cancel", "escape", "focus-return", "no-outside-dismiss"],
  "semi-modal": ["open", "confirm", "cancel", "close", "escape", "focus-return", "no-outside-dismiss", "modal-focus-trap"],
  calendar: ["select", "arrow-keys"],
  "date-picker": ["open", "select", "escape"],
  "time-picker": ["open", "select", "escape"],
  attachment: ["open", "select", "preview", "download", "escape", "outside-click", "disabled"]
};

// The legacy gallery is the visual authority, but its section names do not
// always match the newer logical registry. Keep this mapping explicit so a
// future renderer never guesses a baseline from a component's English name.
const legacyVisualGroup = {
  titlebar: "titlebars", button: "buttons",
  input: "fields", search: "fields", textarea: "fields", select: "fields", field: "fields",
  checkbox: "choices", radio: "choices", "radio-group": "choices", switch: "choices",
  "primary-navigation-item": "navigation", sidebar: "navigation", "list-card": "navigation", tabs: "navigation", breadcrumb: "navigation", pagination: "navigation",
  avatar: "data-display", badge: "data-display", card: "data-display", item: "data-display", table: "data-display", "data-table": "data-display", progress: "data-display", empty: "data-display",
  accordion: "disclosure", collapsible: "disclosure", "navigation-menu": "disclosure", menubar: "disclosure", separator: "disclosure",
  dialog: "overlays", "alert-dialog": "overlays", "semi-modal": "overlays", popover: "overlays", "hover-card": "overlays", "context-menu": "overlays", "dropdown-menu": "overlays",
  label: "form-plus", combobox: "form-plus", "native-select": "form-plus", slider: "form-plus", "input-otp": "form-plus", kbd: "form-plus",
  chart: "loading-data", calendar: "loading-data", "date-picker": "loading-data", "time-picker": "loading-data",
  attachment: "specialized", carousel: "specialized",
  alert: "feedback", tooltip: "feedback", toast: "feedback"
};

const typographyRoles = {
  button: ["label:body-l", "small-label:body-m"],
  input: ["value:body-l", "placeholder:body-l", "label:body-m", "help:body-s"],
  search: ["value:body-l", "placeholder:body-l"],
  radio: ["label:body-m"],
  textarea: ["value:body-l", "placeholder:body-l", "label:body-m", "help:body-s"],
  "primary-navigation-item": [],
  sidebar: ["label:body-l", "count:body-m"],
  "list-card": ["title:title-s", "description:body-m", "meta:body-m"],
  table: ["header:body-m", "cell:body-l"],
  "data-table": ["header:body-m", "cell:body-l"],
  tabs: ["label:body-m"],
  attachment: ["title:subtitle-s", "content:body-m", "description:body-s", "help:body-s"],
  alert: ["content:subtitle-s"],
  tooltip: ["content:body-l"],
  badge: ["label:body-s"]
};

const explicitStates = {
  input: ["default", "hover", "focus", "filled", "error", "disabled"],
  search: ["default", "hover", "focus", "filled", "error", "disabled"],
  textarea: ["default", "hover", "focus", "filled", "error", "disabled"]
};

// Every runtime adapter must declare the semantic icon it renders.  This is
// deliberately explicit rather than inferred from a generic fallback so an
// unknown alias fails during generation instead of silently turning into an
// unrelated glyph.
const iconAliases = {
  titlebar: ["action/minimize", "action/maximize", "action/close"],
  button: ["action/add", "action/download", "action/settings", "action/close", "navigation/chevron-down", "action/refresh", "action/more"],
  input: [],
  search: ["field/search", "action/close"],
  textarea: [],
  select: ["navigation/chevron-down"],
  field: [],
  checkbox: ["choice/check"],
  radio: [],
  "radio-group": ["action/check"],
  switch: ["action/check"],
  "primary-navigation-item": ["navigation/grid", "field/calendar", "navigation/mail-unread", "action/settings"],
  sidebar: ["navigation/grid", "navigation/recent", "action/more"],
  "list-card": ["navigation/list"],
  tabs: ["navigation/list"],
  breadcrumb: ["navigation/chevron-down"],
  pagination: ["navigation/back", "navigation/forward"],
  avatar: [],
  badge: [],
  card: [],
  item: [],
  table: [],
  "data-table": [],
  progress: ["status/success"],
  empty: ["action/add"],
  accordion: ["navigation/chevron-right"],
  collapsible: ["navigation/chevron-down"],
  "navigation-menu": ["navigation/grid"],
  menubar: ["navigation/grid"],
  separator: [],
  dialog: [],
  "alert-dialog": ["status/warning"],
  "semi-modal": ["action/close"],
  popover: ["action/more"],
  "hover-card": ["action/more"],
  "context-menu": ["action/more"],
  "dropdown-menu": ["action/more"],
  label: ["field/search"],
  combobox: ["navigation/chevron-down"],
  "native-select": ["navigation/chevron-down"],
  slider: ["action/more"],
  "input-otp": ["action/check"],
  kbd: ["action/more"],
  chart: ["navigation/grid"],
  calendar: ["field/calendar"],
  "date-picker": ["field/calendar"],
  "time-picker": ["field/clock"],
  attachment: ["navigation/chevron-down"],
  carousel: ["navigation/chevron-down"],
  alert: ["status/info", "status/success", "status/warning", "status/danger", "status/neutral", "action/close"],
  tooltip: ["status/info"],
  toast: ["status/success", "action/close"]
};

const coreSpecimens = {
  titlebar: [
    { id: "small-normal", variant: "small", state: "default" },
    { id: "small-unfocus", variant: "small", state: "unfocus" },
    { id: "medium-normal", variant: "medium", state: "default" },
    { id: "medium-unfocus", variant: "medium", state: "unfocus" },
    { id: "large-normal", variant: "large", state: "default" },
    { id: "large-unfocus", variant: "large", state: "unfocus" },
    { id: "xlarge-normal", variant: "xlarge", state: "default" },
    { id: "xlarge-unfocus", variant: "xlarge", state: "unfocus" }
  ],
  button: [
    { id: "primary", variant: "primary", state: "default", mode: "text" },
    { id: "secondary", variant: "secondary", state: "default", mode: "text" },
    { id: "ghost", variant: "ghost", state: "default", mode: "text" },
    { id: "danger", variant: "danger", state: "default", mode: "text" },
    { id: "small-primary", variant: "primary", state: "default", mode: "text", size: "small" },
    { id: "small-secondary", variant: "secondary", state: "default", mode: "text", size: "small" },
    { id: "small-ghost", variant: "ghost", state: "default", mode: "text", size: "small" },
    { id: "small-danger", variant: "danger", state: "default", mode: "text", size: "small" },
    { id: "icon", variant: "ghost", state: "default", mode: "icon" },
    { id: "icon-text-primary", variant: "primary", state: "default", mode: "icon-text" },
    { id: "icon-text-secondary", variant: "secondary", state: "default", mode: "icon-text" },
    { id: "icon-text-ghost", variant: "ghost", state: "default", mode: "icon-text" },
    { id: "selection-dropdown", variant: "secondary", state: "default", mode: "selection-dropdown" },
    { id: "split-dropdown", variant: "ghost", state: "default", mode: "split-dropdown" }
  ],
  input: [
    { id: "white-surface", variant: "default", state: "default", surface: "white" },
    { id: "gray-surface", variant: "default", state: "default", surface: "gray" }
  ],
  search: [
    { id: "white-surface", variant: "default", state: "default", surface: "white" },
    { id: "gray-surface", variant: "default", state: "default", surface: "gray" }
  ],
  textarea: [
    { id: "white-surface", variant: "default", state: "default", surface: "white" },
    { id: "gray-surface", variant: "default", state: "default", surface: "gray" }
  ],
  select: [
    { id: "white-surface", variant: "default", state: "default", surface: "white" },
    { id: "gray-surface", variant: "default", state: "default", surface: "gray" }
  ],
  radio: [
    { id: "unselected", variant: "unselected", state: "default", checked: false },
    { id: "selected", variant: "selected", state: "selected", checked: true }
  ],
  item: [
    { id: "single-text-arrow", variant: "single-line", state: "default", lines: 1, trailing: "text-arrow" },
    { id: "double-icon", variant: "double-line", state: "default", lines: 2, trailing: "icon" },
    { id: "triple-radio", variant: "triple-line", state: "default", lines: 3, trailing: "radio" },
    { id: "single-checkbox", variant: "single-line", state: "default", lines: 1, trailing: "checkbox" },
    { id: "single-switch", variant: "single-line", state: "default", lines: 1, trailing: "switch" },
    { id: "single-notification-arrow", variant: "single-line", state: "default", lines: 1, trailing: "notification-arrow" }
  ],
  "primary-navigation-item": [{ id: "default", variant: "default", state: "default", surface: "white" }],
  sidebar: [{ id: "default", variant: "default", state: "default", surface: "white" }],
  "list-card": [
    { id: "single-text-arrow", variant: "single-line", state: "default", lines: 1, trailing: "text-arrow" },
    { id: "double-icon", variant: "double-line", state: "default", lines: 2, trailing: "icon" },
    { id: "triple-radio", variant: "triple-line", state: "default", lines: 3, trailing: "radio" },
    { id: "single-checkbox", variant: "single-line", state: "default", lines: 1, trailing: "checkbox" },
    { id: "single-switch", variant: "single-line", state: "default", lines: 1, trailing: "switch" },
    { id: "single-notification-arrow", variant: "single-line", state: "default", lines: 1, trailing: "notification-arrow" }
  ],
  avatar: [
    { id: "fallback-32", variant: "size-32", state: "default", size: 32, content: "initials" },
    { id: "fallback-40", variant: "size-40", state: "default", size: 40, content: "initials" }
  ],
  dialog: [
    { id: "single-default", variant: "single", state: "closed", actionLayout: "single", intent: "default" },
    { id: "double-default", variant: "double", state: "closed", actionLayout: "double", intent: "default" }
  ],
  "alert-dialog": [
    { id: "danger-confirm", variant: "danger", state: "closed", actionLayout: "double", intent: "danger" }
  ],
  "semi-modal": [
    { id: "s-white-non-modal", variant: "s-white-non-modal", state: "closed", size: "s", surface: "white", mode: "non-modal" },
    { id: "m-white-non-modal", variant: "m-white-non-modal", state: "closed", size: "m", surface: "white", mode: "non-modal" },
    { id: "l-white-non-modal", variant: "l-white-non-modal", state: "closed", size: "l", surface: "white", mode: "non-modal" },
    { id: "s-gray-non-modal", variant: "s-gray-non-modal", state: "closed", size: "s", surface: "gray", mode: "non-modal" },
    { id: "m-gray-non-modal", variant: "m-gray-non-modal", state: "closed", size: "m", surface: "gray", mode: "non-modal" },
    { id: "l-gray-non-modal", variant: "l-gray-non-modal", state: "closed", size: "l", surface: "gray", mode: "non-modal" },
    { id: "m-white-modal", variant: "m-white-modal", state: "closed", size: "m", surface: "white", mode: "modal" }
  ],
  alert: [
    { id: "info", variant: "info", state: "default", label: "Info / 信息", message: "系统将在今晚自动完成更新。", action: "查看详情" },
    { id: "success", variant: "success", state: "default", label: "Success / 成功", message: "所有修改已经同步到云端。", action: "查看详情" },
    { id: "warning", variant: "warning", state: "default", label: "Warning / 警告", message: "连接不稳定，部分内容可能暂时无法加载。", action: "重新连接" },
    { id: "danger", variant: "danger", state: "default", label: "Danger / 危险", message: "存储空间不足，请清理空间后重试。", action: "清理空间" },
    { id: "neutral", variant: "neutral", state: "default", label: "Neutral / 中性", message: "当前为只读模式，部分编辑操作暂不可用。", action: "知道了" }
  ]
};

for (const component of registry.components) {
  const section = sectionFor[component.id] ?? "specialized";
  const specimens = coreSpecimens[component.id] ?? [{ id: "default", variant: component.variants?.[0] ?? "default", state: "default" }];
  // A source adapter is not evidence of visual/behavior parity. Start every
  // component as Partial and promote only from browser-level evidence.
  const ready = false;
  component.category = section;
  component.categoryLabel = sectionLabels[section] ?? section;
  component.order = order[component.id] ?? 999;
  component.canonicalSection = `section#${section}`;
  component.canonicalSelector = `section#${section} [data-component="${component.logicalName}"]`;
  component.legacyVisualGroup = legacyVisualGroup[component.id] ?? section;
  component.canonicalSpecimen = `legacy:${component.legacyVisualGroup}:${component.id}`;
  component.specimens = specimens;
  component.fixtureId = `fixture-${component.id}`;
  component.surface = component.id === "input" || component.id === "search" || component.id === "textarea" || component.id === "semi-modal"
    ? ["white", "gray"]
    : component.id === "dialog" || component.id === "alert-dialog"
      ? "white"
      : overlayIds.has(component.id) ? ["white", "gray"] : "white";
  component.sizing = overlayIds.has(component.id) ? "overlay" : fillIds.has(component.id) ? "fill" : "intrinsic";
  component.allowedStates = explicitStates[component.id] ?? component.states ?? ["default", "hover", "focus", "disabled"];
  component.behaviors = behaviorMap[component.id] ?? ["focus", "disabled"];
  component.textRoles = typographyRoles[component.id] ?? ["title:title-s", "content:body-l", "description:body-m", "help:body-s"];
  if (component.id === "primary-navigation-item") {
    component.tokenRoles = (component.tokenRoles ?? []).map((role) => role === "icon-size-md" ? "icon-size-lg" : role);
  }
 component.iconAliases = iconAliases[component.id] ?? [];
  const iconKind = "regular";
 component.iconSlots = component.id === "pagination"
   ? [
       { slot: "previous", alias: "navigation/back", displaySizes: [16, 20, 24], kind: "regular" },
       { slot: "next", alias: "navigation/forward", displaySizes: [16, 20, 24], kind: "regular" }
     ]
      : component.iconAliases.map((alias) => ({ alias, displaySizes: component.id === "primary-navigation-item" ? [24] : ["accordion", "collapsible"].includes(component.id) ? [20] : [16, 20, 24], kind: iconKind }));
 component.iconSemantic = component.iconAliases[0] ?? null;
  if (component.id === "primary-navigation-item") {
    component.slots = ["icon", "tooltip"];
    component.structuralAxes = {
      placement: ["primary-navigation-shell"],
      alignment: ["bottom"],
      presentation: ["icon-only"],
    };
    component.slotContracts = {
      ...component.slotContracts,
      icon: { ...component.slotContracts?.icon, cardinality: "1", scope: "primary-navigation-item", displaySize: "24px", kind: "regular", source: "lucide" }
    };
  }
  if (component.id === "semi-modal") {
    component.slots = ["title", "description", "content", "actions", "close"];
    component.iconAliases = ["action/close"];
    component.iconSlots = [{ slot: "close", alias: "action/close", displaySizes: [20], kind: "regular" }];
    component.slotContracts = {
      ...component.slotContracts,
      close: { cardinality: "1", scope: "semi-modal-header", control: "icon-button", iconAlias: "action/close", iconSize: "20px", trailingInsetToken: "space/5", trailingInset: "16px" }
    };
  }
 if (component.id === "search") {
    component.variants = ["default", "focused", "with-value", "advanced-search"];
    component.props = ["value", "defaultValue", "placeholder", "disabled", "state", "surface", "advancedSearch", "advancedSearchLabel", "onAdvancedSearch", "onChange", "onClear"];
    component.slots = ["leading", "value", "clear", "advanced-search"];
    component.slotContracts = {
      ...component.slotContracts,
      "advanced-search": {
        cardinality: "0..1",
        scope: "search-query-builder",
        defaultPlacement: "trailing-after-clear",
        control: "small-text-button",
        variant: "ghost",
        size: "small",
        mode: "text",
        textColorToken: "color.text-muted",
        trailingInsetToken: "space/2",
        requiresAccessibleName: true,
        interaction: "open-advanced-search-layer",
        coexistenceOrder: ["clear", "advanced-search"]
      }
    };
    component.behaviors = ["input", "clear", "advanced-search", "focus", "disabled"];
  }
  if (component.id === "attachment") {
    component.iconSlots = [{ slot: "menu-trigger", alias: "navigation/chevron-down", displaySizes: [20], kind: "regular" }];
    component.props = ["type", "name", "meta", "leading", "content", "actions", "disabled", "onAction", "onPreview", "onDownload"];
    component.slots = ["leading", "title", "content", "description", "actions", "menu-trigger", "menu"];
    component.slotContracts = {
      actions: {
        cardinality: "0..1",
        scope: "attachment-surface",
        defaultPlacement: "trailing-end",
        control: "attachment-action-menu",
        interaction: "open-attachment-action-menu",
        menuItems: ["preview", "download"]
      },
      "menu-trigger": {
        cardinality: "0..1",
        scope: "attachment-action-menu",
        defaultVisibility: "visible",
        iconAlias: "navigation/chevron-down",
        iconSize: "20px",
        ariaHasPopup: "menu"
      },
      menu: {
        cardinality: "0..1",
        scope: "attachment-action-menu",
        role: "menu",
        items: ["preview", "download"],
        closeOn: ["escape", "outside-click", "select"]
      }
    };
  }
  if (component.id === "titlebar") {
    component.variants = ["small", "medium", "large", "xlarge"];
    component.structuralAxes = {
      size: ["small", "medium", "large", "xlarge"],
      layout: ["standalone", "two-column", "three-column"],
      paneRole: ["global", "primary-navigation", "secondary-pane", "final-pane"]
    };
    component.props = ["label", "paneTitle", "size", "layout", "paneRole", "disabled", "state", "mainDetailActions", "onMainDetailAction", "onAction", "className"];
    component.slots = ["leading", "label", "main-content-title", "main-detail-actions", "actions"];
    component.slotContracts = {
      ...component.slotContracts,
      "main-content-title": {
        cardinality: "0..1",
        scope: "main-content-pane-global",
        activeWhen: { layout: "two-column", paneRole: "final-pane" },
        defaultPlacement: "final-pane-leading-slot",
        leadingInsetToken: "layout/main-title-leading-padding"
      },
      "main-detail-actions": {
        ...component.slotContracts?.["main-detail-actions"],
        cardinality: "0..n",
        scope: "main-detail-pane-global",
        activeWhen: { layout: "three-column", paneRole: "final-pane" },
        defaultPlacement: "final-pane-leading-slot",
        layout: "compact-horizontal-group",
        leadingInsetToken: "layout/main-detail-action-leading-padding",
        allowedButtonVariants: ["ghost"],
        allowedButtonTypes: ["icon", "icon-text-ghost"],
        forbidden: ["page-global-primary", "card-action", "field-action", "section-action", "selection-action", "inline-action"]
      }
    };
    component.dividerRules = {
      default: "no-horizontal-divider",
      standalone: "no-horizontal-divider",
      "two-column": {
        "primary-navigation": "no-horizontal-divider",
        "final-pane": "no-horizontal-divider"
      },
      "three-column": {
        "primary-navigation": "no-horizontal-divider",
        "secondary-pane": "no-horizontal-divider",
        "final-pane": "bottom-divider"
      },
      verticalPaneDividers: "owned-by-layout-and-continuous"
    };
  }
  if (component.id === "dialog") {
    component.variants = ["single", "double"];
    component.states = ["closed", "open"];
    component.allowedStates = ["closed", "open"];
    component.structuralAxes = { actionLayout: ["single", "double"], intent: ["default", "danger"] };
    component.interactionStates = ["closed", "open"];
    component.props = ["open", "title", "description", "intent", "actionLayout", "confirmLabel", "cancelLabel", "onConfirm", "onCancel", "onOpenChange"];
  }
  if (component.id === "alert-dialog") {
    component.variants = ["danger"];
    component.states = ["closed", "open"];
    component.allowedStates = ["closed", "open"];
    component.structuralAxes = { actionLayout: ["double"], intent: ["danger"], mode: ["modal"] };
    component.interactionStates = ["closed", "open"];
    component.props = ["open", "title", "description", "confirmLabel", "cancelLabel", "statusIcon", "onConfirm", "onCancel", "onOpenChange"];
  }
  if (component.id === "semi-modal") {
    component.variants = ["s", "m", "l", "white", "gray", "non-modal", "modal"];
    component.states = ["closed", "open"];
    component.allowedStates = ["closed", "open"];
    component.structuralAxes = { size: ["s", "m", "l"], surface: ["white", "gray"], mode: ["non-modal", "modal"] };
    component.interactionStates = ["closed", "open"];
    component.props = ["open", "size", "surface", "mode", "title", "onConfirm", "onCancel", "onClose", "onOpenChange"];
  }
  component.readiness = {
    sourceReady: true,
    contractReady: true,
    visualParity: ready,
    behaviorParity: ready,
    accessibilityParity: ready,
    tokenParity: true
  };
  component.status = ready ? "ready" : "partial";
  component.frameworks = Object.fromEntries(["html", "react", "vue"].map((framework) => [framework, {
    ...component.frameworks?.[framework],
    status: ready ? "ready" : "partial"
  }]));
  component.contractNotes = ready
    ? "三框架核心适配器已按旧 Skill 视觉基线和同一 fixture 对齐；运行时只展示结构性 Variant，交互状态由组件触发。"
    : "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。";
}

const comparisonGroups = (registry.registryPolicy?.comparisonGroups ?? []).map((group) => ({
  ...group,
  componentIds: [...(group.componentIds ?? [])]
}));
const comparisonGroupById = new Map(comparisonGroups.map((group) => [group.id, group]));
for (const [id, label] of sections) {
  if (!comparisonGroupById.has(id)) {
    const group = { id, label, componentIds: [] };
    comparisonGroups.push(group);
    comparisonGroupById.set(id, group);
  }
}
const registeredIds = new Set(registry.components.map((component) => component.id));
for (const group of comparisonGroups) group.componentIds = group.componentIds.filter((componentId) => registeredIds.has(componentId));
for (const component of registry.components) {
  if (!comparisonGroups.some((group) => group.componentIds.includes(component.id))) {
    comparisonGroupById.get(component.category)?.componentIds.push(component.id);
  }
}
const preferredComparisonOrder = {
  navigation: ["primary-navigation-item", "tabs", "list-card"],
  disclosure: ["breadcrumb", "accordion", "collapsible", "navigation-menu", "menubar", "separator", "sidebar", "item"],
  fields: ["input", "search", "textarea", "select"],
  "form-plus": ["field", "label", "combobox", "native-select", "slider", "input-otp", "kbd"]
};
for (const [groupId, preferredIds] of Object.entries(preferredComparisonOrder)) {
  const group = comparisonGroupById.get(groupId);
  if (!group) continue;
  const current = new Set(group.componentIds);
  group.componentIds = [
    ...preferredIds.filter((componentId) => current.has(componentId)),
    ...group.componentIds.filter((componentId) => !preferredIds.includes(componentId))
  ];
}

registry.registryPolicy = {
  ...(registry.registryPolicy ?? {}),
  visualAuthority: "skill-canonical",
  readinessDimensions: ["sourceReady", "contractReady", "visualParity", "behaviorParity", "accessibilityParity", "tokenParity"],
  readyWhen: "all readinessDimensions are true",
  runtimeRule: "只显示结构性 specimens；hover/pressed/focus/open/close 由真实组件交互触发",
  categoryOrder: sections.map(([id]) => id),
  comparisonGroups,
  partialMustNotBeUsedFor: ["strict-pixso-component-parity", "cross-framework-component-claim"]
};

await fs.writeFile(file, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Enriched ${registry.components.length} contracts: ${registry.components.filter((item) => item.status === "ready").length} ready, ${registry.components.filter((item) => item.status === "partial").length} partial.`);
