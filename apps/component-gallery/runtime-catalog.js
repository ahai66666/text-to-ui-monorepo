import contracts from "../../packages/component-contracts/src/components-runtime.js";

export const coreIds = new Set(["button", "input", "search", "sidebar", "list-card", "titlebar", "textarea", "field", "select", "combobox", "native-select", "checkbox", "radio-group", "switch", "tabs", "accordion", "collapsible", "avatar", "badge", "card", "item", "table", "data-table", "pagination", "breadcrumb", "progress", "empty", "separator", "label", "alert", "tooltip", "toast", "dialog", "alert-dialog", "semi-modal", "navigation-menu", "menubar", "context-menu", "dropdown-menu", "popover", "hover-card", "slider", "input-otp", "kbd", "chart", "calendar", "date-picker", "time-picker", "attachment", "carousel"]);
const fullWidthPreviewIds = new Set(["titlebar"]);

export const frameworkLabels = { html: "HTML", react: "React", vue: "Vue" };
export const frameworkSources = {
  html: "packages/components-html",
  react: "packages/components-react",
  vue: "packages/components-vue"
};

export const categoryOrder = contracts.registryPolicy?.categoryOrder ?? [
  "titlebars", "buttons", "fields", "choices", "navigation", "data-display", "disclosure", "overlays", "form-plus", "loading-data", "specialized", "feedback"
];
export const categoryLabels = {
  titlebars: "标题栏",
  buttons: "按钮",
  fields: "输入与字段",
  choices: "选择控件",
  navigation: "导航",
  "data-display": "卡片与数据",
  disclosure: "披露与导航",
  overlays: "浮层与命令",
  "form-plus": "复合表单",
  "loading-data": "加载与日期",
  specialized: "专用内容",
  feedback: "提示与反馈"
};

const componentById = new Map(contracts.components.map((component) => [component.id, component]));
export const comparisonGroups = contracts.registryPolicy?.comparisonGroups ?? categoryOrder.map((category) => ({
  id: category,
  label: categoryLabels[category] ?? category,
  componentIds: [...contracts.components]
    .filter((component) => component.category === category)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((component) => component.id)
}));
const comparisonEntries = comparisonGroups.flatMap((group, groupIndex) => group.componentIds.map((componentId, itemIndex) => ({
  componentId,
  groupId: group.id,
  groupIndex,
  itemIndex,
  comparisonOrder: groupIndex * 100 + itemIndex
})));
const comparisonEntryById = new Map(comparisonEntries.map((entry) => [entry.componentId, entry]));
export const comparisonMetaFor = (component) => comparisonEntryById.get(component.id) ?? {
  componentId: component.id,
  groupId: component.category,
  groupIndex: 999,
  itemIndex: component.order ?? 999,
  comparisonOrder: component.order ?? 999
};
export const runtimeComponents = comparisonEntries
  .map((entry) => componentById.get(entry.componentId))
  .filter(Boolean);
export const runtimeCategories = comparisonGroups
  .map((group) => ({
    id: group.id,
    label: group.label ?? categoryLabels[group.id] ?? group.id,
    components: group.componentIds.map((componentId) => componentById.get(componentId)).filter(Boolean)
  }))
  .filter((group) => group.components.length);

export const componentTitle = (component) => component.logicalName.split("/")[0];
export const sourceFor = (component, framework) => component.frameworks?.[framework]?.source
  ?? component.implementations?.[framework]
  ?? frameworkSources[framework];
export const readinessFor = (component) => component.readiness ?? {};
export const isReady = (component) => ["sourceReady", "contractReady", "visualParity", "behaviorParity", "accessibilityParity", "tokenParity"].every((key) => readinessFor(component)[key] === true);
export const readyCount = runtimeComponents.filter(isReady).length;
export const partialCount = runtimeComponents.length - readyCount;
export const cardClass = (component) => {
  const sizing = component.sizing === "fill" ? " tui-runtime-card--fill" : component.sizing === "overlay" ? " tui-runtime-card--overlay" : " tui-runtime-card--intrinsic";
  return `tui-runtime-card${coreIds.has(component.id) ? " tui-runtime-card--core" : ""}${fullWidthPreviewIds.has(component.id) ? " tui-runtime-card--wide" : ""}${sizing}`;
};
export const cardDescription = (component) => component.status === "ready"
  ? "已通过三框架契约验收；默认态展示，交互状态由真实组件触发。"
  : "Partial · 已接入契约和适配器，视觉、行为与可访问性仍按批次验收。";
export const specimensFor = (component) => component.specimens?.length ? component.specimens : [{ id: "default", variant: component.variants?.[0] ?? "default", state: "default" }];
const feedbackCopy = {
  info: { label: "Info / 信息", message: "系统将在今晚自动完成更新。", action: "查看详情" },
  success: { label: "Success / 成功", message: "所有修改已经同步到云端。", action: "查看详情" },
  warning: { label: "Warning / 警告", message: "连接不稳定，部分内容可能暂时无法加载。", action: "重新连接" },
  danger: { label: "Danger / 危险", message: "存储空间不足，请清理空间后重试。", action: "清理空间" },
  neutral: { label: "Neutral / 中性", message: "当前为只读模式，部分编辑操作暂不可用。", action: "知道了" }
};
export const feedbackSpecimensFor = (component) => specimensFor(component).map((specimen) => ({
  ...(feedbackCopy[specimen.variant] ?? feedbackCopy.info),
  ...specimen
}));
