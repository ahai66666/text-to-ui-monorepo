const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

import { generatedHtmlComponents } from "./generated/index.js";
import { iconMarkup } from "./icon-map.js";
import { advancedHtmlComponents } from "./advanced.js";

const attrs = (id, logicalName, variant, state, extra = "") => `data-component="${id}" data-logical-component="${logicalName}" data-variant="${variant}" data-state="${state}" data-framework="html"${extra}`;
// Inline SVG keeps the HTML runtime deterministic for file:// previews and
// makes the imported Pixso frame carry real vector geometry instead of a
// fragile external <use> reference. Unknown semantics fail loudly.
const icon = (name, className = "", options = {}) => iconMarkup(name, options).replace("class=\"", `class=\"${className ? `${className} ` : ""}`);

const buttonLogicalName = {
  text: "Button/Primary/Default",
  "icon-text": "Button/Icon Text/Default",
  icon: "Button/Icon/Default",
  "selection-dropdown": "Button/Selection Dropdown/Default",
  "split-dropdown": "Button/Split Dropdown/Default"
};

const buttonContent = ({ label, iconName, mode = "text", includeChevron = false }) => {
  const iconMarkup = iconName ? `<span data-slot="icon">${icon(iconName)}</span>` : "";
  const labelMarkup = mode === "icon" ? "" : `<span data-slot="label" data-typography-role="body-l">${escapeHtml(label)}</span>`;
  // The chevron is a 16px control icon. Keep the SVG's data-icon-size in
  // sync with its CSS box so the 1px outline rule is applied consistently.
  const chevronMarkup = includeChevron ? `<span data-slot="trigger">${icon("navigation/chevron-down", "", { size: 16 })}</span>` : "";
  return `${iconMarkup}${labelMarkup}${chevronMarkup}`;
};

const renderButton = ({
  label = "新建项目",
  variant = "primary",
  size = "standard",
  mode = "text",
  iconName,
  disabled = false,
  state
} = {}) => {
  const resolvedState = state ?? (disabled ? "disabled" : "default");
  const logicalName = buttonLogicalName[mode] ?? buttonLogicalName.text;
  const disabledAttr = disabled ? " disabled" : "";
  const modeClass = mode === "icon" ? " tui-button--icon" : mode === "selection-dropdown" ? " tui-button--selection" : "";
  const typeAttrs = mode === "icon" ? ` aria-label="${escapeHtml(label)}"` : "";
  const menuAttrs = mode === "selection-dropdown" ? ` aria-haspopup="menu" aria-expanded="false"` : "";
  return `<button class="tui-component tui-button${modeClass}" type="button" ${attrs("button", logicalName, variant, resolvedState, ` data-mode="${mode}" data-size="${size}"`)}${typeAttrs}${menuAttrs}${disabledAttr}>${buttonContent({ label, iconName, mode, includeChevron: mode === "selection-dropdown" })}</button>`;
};

const renderSelectionDropdown = ({ label = "列表视图", variant = "secondary", disabled = false, menuItems = ["列表视图", "网格视图", "紧凑视图"] } = {}) => {
  const state = disabled ? "disabled" : "default";
  const trigger = renderButton({ label, variant, mode: "selection-dropdown", disabled, state });
  const menu = menuItems.map((item) => `<button class="tui-button-dropdown__item" type="button" role="menuitem">${escapeHtml(item)}</button>`).join("");
  return `<div class="tui-component tui-button-dropdown" data-component="button" data-logical-component="Button/Selection Dropdown/Default" data-variant="${variant}" data-state="${state}" data-mode="selection-dropdown" data-framework="html">${trigger}<div class="tui-button-dropdown__menu" role="menu" hidden>${menu}</div></div>`;
};

const renderSplitDropdown = ({ label = "导出文件", iconName = "action/download", disabled = false, iconOnly = false, menuItems = ["导出为 PDF", "复制分享链接", "发送到设备"] } = {}) => {
  const state = disabled ? "disabled" : "default";
  const logicalName = buttonLogicalName["split-dropdown"];
  const mainLabel = iconOnly ? "" : `<span data-slot="label" data-typography-role="body-l">${escapeHtml(label)}</span>`;
  // Split-button leading icons are 20px (1.25px outline), while the
  // adjacent chevron is the smaller 16px control icon.
  const mainIcon = `<span data-slot="icon">${icon(iconName, "", { size: 20 })}</span>`;
  const main = `<button class="tui-component tui-button tui-split-button__main${iconOnly ? " tui-split-button__main--icon" : ""}" type="button" ${attrs("button", logicalName, "ghost", state, ` data-mode="split-dropdown" data-size="standard"`)}${iconOnly ? ` aria-label="${escapeHtml(label)}"` : ""}${disabled ? " disabled" : ""}>${mainIcon}${mainLabel}</button>`;
  const trigger = `<button class="tui-component tui-button tui-split-button__trigger" type="button" ${attrs("button", logicalName, "ghost", state, ` data-mode="split-dropdown" data-size="standard"`)} aria-label="展开更多操作" aria-haspopup="menu" aria-expanded="false"${disabled ? " disabled" : ""}>${icon("navigation/chevron-down", "", { size: 16 })}</button>`;
  const menu = menuItems.map((item) => `<button class="tui-button-dropdown__item" type="button" role="menuitem">${escapeHtml(item)}</button>`).join("");
  return `<div class="tui-component tui-split-button${iconOnly ? " tui-split-button--icon" : ""}" data-component="button" data-logical-component="${logicalName}" data-variant="ghost" data-state="${state}" data-mode="split-dropdown" data-framework="html"><div class="tui-split-button__control">${main}${trigger}</div><div class="tui-button-dropdown__menu" role="menu" hidden>${menu}</div></div>`;
};

const inputState = ({ surface = "white", state = "default", placeholder = "项目名称", disabled = false, value = "" } = {}) => {
  const resolvedState = disabled ? "disabled" : state;
  // Surface describes the host context; the logical component remains the
  // single contract entry used by React and Vue.
  const logicalName = "Input/White Surface/Default";
  const valueAttr = value ? ` value="${escapeHtml(value)}"` : "";
  return `<label class="tui-component tui-input" ${attrs("input", logicalName, "default", resolvedState, ` data-surface="${surface}"`)}><input data-slot="value" data-typography-role="body-l" type="text" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}"${valueAttr}${disabled ? " disabled" : ""}${state === "error" ? " aria-invalid=\"true\"" : ""} /></label>`;
};

const searchState = ({ surface = "white", state = "default", placeholder = "搜索项目", disabled = false, value = "" } = {}) => {
  const resolvedState = disabled ? "disabled" : state;
  const valueAttr = value ? ` value="${escapeHtml(value)}"` : "";
  return `<label class="tui-component tui-search" ${attrs("search", "Search/White Surface/Default", value ? "with-value" : "default", resolvedState, ` data-surface="${surface}"`)}><span data-slot="leading">${icon("field/search", "", { size: 16 })}</span><input data-slot="value" data-typography-role="body-l" type="search" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}"${valueAttr}${disabled ? " disabled" : ""} /><button class="tui-icon-button" data-slot="clear" type="button" aria-label="清除"${value ? "" : " hidden"}>${icon("action/close", "", { size: 16 })}</button></label>`;
};

const titlebarState = ({ label = "项目空间", size = "large", state = "default", disabled = false, mainDetailActions = [] } = {}) => {
  const controlIconSize = size === "small" ? 16 : 24;
  const paneActions = mainDetailActions.length ? `<div class="tui-titlebar__pane-actions" data-slot="main-detail-actions" data-action-scope="main-detail-pane-global" aria-label="Main Detail 栏级操作">${mainDetailActions.map((action) => `<button class="tui-icon-button tui-titlebar__pane-action" type="button" data-slot="main-detail-action" data-action="${escapeHtml(action.id)}" aria-label="${escapeHtml(action.label)}"${disabled || action.disabled ? " disabled" : ""}>${icon(action.icon ?? "action/more", "", { size: 20 })}</button>`).join("")}</div>` : "";
  return `<header class="tui-component tui-titlebar" ${attrs("titlebar", "Titlebar/Default", size, disabled ? "disabled" : state)} data-size="${escapeHtml(size)}"><span class="tui-titlebar__brand" data-slot="leading">${icon("navigation/grid", "", { size: 24 })}<span data-slot="label" data-typography-role="subtitle-m">${escapeHtml(label)}</span></span>${paneActions}<div class="tui-titlebar__actions" data-slot="actions"><button class="tui-icon-button tui-titlebar__action" type="button" data-slot="titlebar-action" data-action="minimize" aria-label="最小化"${disabled ? " disabled" : ""}>${icon("window/minimize", "", { size: controlIconSize })}</button><button class="tui-icon-button tui-titlebar__action" type="button" data-slot="titlebar-action" data-action="maximize" aria-label="最大化"${disabled ? " disabled" : ""}>${icon("window/maximize", "", { size: controlIconSize })}</button><button class="tui-icon-button tui-titlebar__action" type="button" data-slot="titlebar-action" data-action="close" aria-label="关闭"${disabled ? " disabled" : ""}>${icon("window/close", "", { size: controlIconSize })}</button></div></header>`;
};

const textareaState = ({ surface = "white", state = "default", label = "项目说明", value = "统一 HarmonyOS PC 客户端中的布局、组件与交互规则。", disabled = false } = {}) => `<label class="tui-component tui-textarea" ${attrs("textarea", "Textarea/Default", "default", disabled ? "disabled" : state, ` data-surface="${surface}"`)}><span data-slot="label" data-typography-role="body-m">${escapeHtml(label)}</span><textarea data-slot="value" data-typography-role="body-l" rows="3" placeholder="请输入内容"${disabled ? " disabled" : ""}${state === "error" ? " aria-invalid=\"true\"" : ""}>${escapeHtml(value)}</textarea><span data-slot="help" data-typography-role="caption-l">支持多行输入，最多 500 字</span></label>`;

const fieldState = ({ surface = "white", state = "default", label = "项目名称", value = "客户端设计系统", disabled = false } = {}) => `<label class="tui-component tui-field" ${attrs("field", "Field/Default", "default", disabled ? "disabled" : state, ` data-surface="${surface}"`)}><span data-slot="label" data-typography-role="body-m">${escapeHtml(label)}</span><span class="tui-field__control"><input data-slot="value" data-typography-role="body-l" type="text" value="${escapeHtml(value)}"${disabled ? " disabled" : ""}${state === "error" ? " aria-invalid=\"true\"" : ""}/></span><span data-slot="help" data-typography-role="caption-l">这是一个必填字段</span></label>`;

const menuItems = ["进行中", "已完成", "已归档"];
const selectState = ({ id = "select", label = "状态", value = "进行中", open = false, disabled = false, surface = "white" } = {}) => `<div class="tui-component tui-select" ${attrs(id, `${id === "combobox" ? "Combobox" : "Select"}/Default`, "default", disabled ? "disabled" : "default", ` data-surface="${surface}"`)}><span data-slot="label" data-typography-role="body-m">${escapeHtml(label)}</span><button class="tui-select__trigger" type="button" role="${id === "combobox" ? "combobox" : "button"}" aria-haspopup="listbox" aria-expanded="${open}"${disabled ? " disabled" : ""}><span data-slot="value" data-typography-role="body-m">${escapeHtml(value)}</span>${icon("navigation/chevron-down", "", { size: 16 })}</button><div class="tui-select__menu" role="listbox" hidden><button type="button" role="option" aria-selected="true" data-value="${escapeHtml(value)}" data-typography-role="body-l">${escapeHtml(value)}</button>${menuItems.filter((item) => item !== value).map((item) => `<button type="button" role="option" aria-selected="false" data-value="${escapeHtml(item)}" data-typography-role="body-l">${escapeHtml(item)}</button>`).join("")}</div></div>`;

const nativeSelectState = ({ label = "视图", value = "列表视图", disabled = false, surface = "white" } = {}) => `<label class="tui-component tui-native-select" ${attrs("native-select", "Native Select/Default", "default", disabled ? "disabled" : "default", ` data-surface="${surface}"`)}><span data-slot="label" data-typography-role="body-m">${escapeHtml(label)}</span><span class="tui-native-select__control"><select data-slot="value" data-typography-role="body-m"${disabled ? " disabled" : ""}><option${value === "列表视图" ? " selected" : ""}>列表视图</option><option${value === "网格视图" ? " selected" : ""}>网格视图</option><option${value === "紧凑视图" ? " selected" : ""}>紧凑视图</option></select>${icon("navigation/chevron-down", "", { size: 16 })}</span></label>`;

const checkboxIndicator = () => `<span class="tui-checkbox__indicator" aria-hidden="true">${icon("choice/check", "tui-checkbox__icon", { size: 16 })}</span>`;
const checkboxState = ({ checked = true, disabled = false } = {}) => `<label class="tui-component tui-choice tui-checkbox" ${attrs("checkbox", "Checkbox/Default", "default", disabled ? "disabled" : checked ? "selected" : "default")}><input type="checkbox"${checked ? " checked" : ""}${disabled ? " disabled" : ""}/>${checkboxIndicator()}<span data-slot="label" data-typography-role="body-m">同步到云端</span><span data-slot="description" data-typography-role="body-m">保存后自动同步</span></label>`;
const radioGroupState = ({ value = "邮件" } = {}) => `<fieldset class="tui-component tui-choice tui-radio-group" ${attrs("radio-group", "Radio Group/Default", "default", "default")}><legend data-slot="label" data-typography-role="body-m">通知方式</legend><label><input type="radio" name="runtime-radio" value="邮件"${value === "邮件" ? " checked" : ""}/><span class="tui-radio__indicator" aria-hidden="true"></span><span data-typography-role="body-m">邮件</span></label><label><input type="radio" name="runtime-radio" value="站内消息"${value === "站内消息" ? " checked" : ""}/><span class="tui-radio__indicator" aria-hidden="true"></span><span data-typography-role="body-m">站内消息</span></label></fieldset>`;
const switchState = ({ checked = true, disabled = false } = {}) => `<label class="tui-component tui-choice tui-switch" ${attrs("switch", "Switch/Default", "default", disabled ? "disabled" : checked ? "selected" : "default")}><input type="checkbox" role="switch"${checked ? " checked" : ""}${disabled ? " disabled" : ""}/><span class="tui-switch__track" aria-hidden="true"></span><span data-slot="label" data-typography-role="body-m">自动同步</span><span data-slot="description" data-typography-role="body-m">已开启</span></label>`;
const tabsState = () => `<div class="tui-component tui-tabs" ${attrs("tabs", "Tabs/Default", "default", "default")}><div class="tui-tabs__list" role="tablist" aria-label="项目视图"><button type="button" role="tab" aria-selected="true" class="is-selected" data-tab="overview" data-typography-role="body-m">概览</button><button type="button" role="tab" aria-selected="false" data-tab="projects" data-typography-role="body-m">项目</button><button type="button" role="tab" aria-selected="false" data-tab="members" data-typography-role="body-m">成员</button></div><div class="tui-tabs__panel" role="tabpanel" data-tab-panel="overview" data-typography-role="body-l">工作空间概览</div></div>`;
const disclosureState = (id, title, detail) => {
  const contentId = `${id}-content`;
  const isAccordion = id === "accordion";
  const triggerContent = isAccordion
    ? `${icon("navigation/chevron-right", "", { size: 20 })}<span data-slot="label" data-typography-role="body-l">${escapeHtml(title)}</span>`
    : `<span data-slot="label" data-typography-role="body-l">${escapeHtml(title)}</span>${icon("navigation/chevron-down", "", { size: 20 })}`;
  return `<div class="tui-component tui-disclosure" ${attrs(id, `${isAccordion ? "Accordion" : "Collapsible"}/Default`, "default", "default")}><button class="tui-disclosure__trigger" type="button" aria-expanded="false" aria-controls="${contentId}" data-typography-role="body-l">${triggerContent}</button><div class="tui-disclosure__content" id="${contentId}" data-slot="content" hidden data-typography-role="body-l">${escapeHtml(detail)}</div></div>`;
};
const avatarState = ({ initials = "H", name = "HarmonyOS", size = 40 } = {}) => {
  const resolvedSize = Number(size) === 32 ? 32 : 40;
  return `<div class="tui-component tui-avatar" ${attrs("avatar", `Avatar/${resolvedSize}/Fallback`, `size-${resolvedSize}`, "default", ` data-size="${resolvedSize}"`)} aria-label="${escapeHtml(name)}" data-typography-role="caption-l">${escapeHtml(initials)}</div>`;
};
const badgeState = ({ label = "进行中", tone = "info" } = {}) => `<span class="tui-component tui-badge tui-badge--${escapeHtml(tone)}" ${attrs("badge", "Badge/Default", tone, "default")} data-typography-role="caption-l">${escapeHtml(label)}</span>`;
const badgeSpecimens = () => `<div class="tui-badge-group" aria-label="Badge 颜色示例">${badgeState({ label: "进行中", tone: "info" })}${badgeState({ label: "已完成", tone: "success" })}${badgeState({ label: "待处理", tone: "warning" })}${badgeState({ label: "错误", tone: "danger" })}${badgeState({ label: "未开始", tone: "neutral" })}</div>`;
const cardState = ({ title = "工作空间", description = "最近更新的项目与协作动态" } = {}) => `<article class="tui-component tui-card" ${attrs("card", "Card/Default", "default", "default")}><div class="tui-card__body"><h4 data-slot="title" data-typography-role="title-s">${escapeHtml(title)}</h4><p data-slot="content" data-typography-role="body-l">${escapeHtml(description)}</p><span data-slot="description" data-typography-role="body-m">本周新增 3 个项目</span></div></article>`;
const itemTrailing = (type = "text-arrow", value = "详情") => {
  if (type === "icon") return `<span class="tui-item__trailing tui-item__trailing--icon" data-slot="trailing">${icon("action/more", "", { size: 20 })}</span>`;
  if (type === "radio") return `<label class="tui-item__trailing tui-choice" data-slot="trailing" aria-label="已选中"><input type="radio" checked/><span class="tui-radio__indicator" aria-hidden="true"></span></label>`;
  if (type === "checkbox") return `<label class="tui-item__trailing tui-choice tui-checkbox" data-slot="trailing" aria-label="已选中"><input type="checkbox" checked/>${checkboxIndicator()}</label>`;
  if (type === "switch") return `<label class="tui-item__trailing tui-choice tui-switch" data-slot="trailing" aria-label="已开启"><input type="checkbox" role="switch" checked/><span class="tui-switch__track" aria-hidden="true"></span></label>`;
  if (type === "notification-arrow") return `<span class="tui-item__trailing tui-item__trailing--notification-arrow" data-slot="trailing"><span class="tui-item__notification-dot" aria-label="有新事件"></span>${icon("navigation/chevron-right", "", { size: 20 })}</span>`;
  return `<span class="tui-item__trailing tui-item__trailing--text-arrow" data-slot="trailing" data-typography-role="body-m"><span>${escapeHtml(value)}</span>${icon("navigation/chevron-right", "", { size: 20 })}</span>`;
};
const itemState = ({ title = "HarmonyOS 组件规范", description = "", supporting = "", lines = description ? supporting ? 3 : 2 : 1, leadingIcon = "navigation/grid", trailing = "text-arrow", trailingText = "详情", id = "item", logicalName = "Item/Default" } = {}) => `<div class="tui-component ${id === "list-card" ? "tui-list-card" : "tui-item"}" role="button" tabindex="0" ${attrs(id, logicalName, `line-${lines}`, "default", ` data-lines="${lines}"`)}><span class="tui-item__leading" data-slot="leading">${icon(leadingIcon, "", { size: 24 })}</span><span class="tui-item__content"><span data-slot="title" data-typography-role="body-l">${escapeHtml(title)}</span>${description ? `<span data-slot="description" data-typography-role="body-m">${escapeHtml(description)}</span>` : ""}${supporting ? `<span data-slot="supporting" data-typography-role="caption-l">${escapeHtml(supporting)}</span>` : ""}</span>${itemTrailing(trailing, trailingText)}</div>`;
const tableState = (id = "table") => `<div class="tui-component tui-table" ${attrs(id, `${id === "data-table" ? "Data Table" : "Table"}/Default`, "default", "default")}><div class="tui-table__heading"><h4 data-slot="title" data-typography-role="title-s">项目列表</h4><span data-slot="description" data-typography-role="body-m">3 个项目</span></div><table><thead><tr><th data-typography-role="body-m">名称</th><th data-typography-role="body-m">负责人</th><th data-typography-role="body-m">状态</th></tr></thead><tbody><tr><td data-typography-role="body-l">客户端设计系统</td><td data-typography-role="body-l">赵博海</td><td data-typography-role="body-l"><span class="tui-badge tui-badge--info" data-typography-role="caption-l">进行中</span></td></tr><tr><td data-typography-role="body-l">组件规范</td><td data-typography-role="body-l">林晓</td><td data-typography-role="body-l"><span class="tui-badge tui-badge--success" data-typography-role="caption-l">已完成</span></td></tr></tbody></table></div>`;
const paginationState = () => `<nav class="tui-component tui-pagination" ${attrs("pagination", "Pagination/Default", "default", "default")} aria-label="分页"><button class="tui-icon-button" type="button" data-page="prev" aria-label="上一页">${icon("navigation/back", "", { size: 20 })}</button><button type="button" data-page="1" aria-current="page" data-typography-role="body-l">1</button><button type="button" data-page="2" data-typography-role="body-l">2</button><button type="button" data-page="3" data-typography-role="body-l">3</button><button class="tui-icon-button" type="button" data-page="next" aria-label="下一页">${icon("navigation/forward", "", { size: 20 })}</button></nav>`;
const breadcrumbState = () => `<nav class="tui-component tui-breadcrumb" ${attrs("breadcrumb", "Breadcrumb/Default", "default", "default")} aria-label="面包屑"><a href="#" data-typography-role="body-l">工作空间</a><span aria-hidden="true">/</span><a href="#" data-typography-role="body-l">项目</a><span aria-hidden="true">/</span><span aria-current="page" data-typography-role="subtitle-m">设置</span></nav>`;
const progressState = ({ value = 68, label = "完成度" } = {}) => `<div class="tui-component tui-progress" ${attrs("progress", "Progress/Default", "default", "default")} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" style="--progress-value:${Math.min(100, Math.max(0, Number(value)))}%"><span class="tui-progress__label" data-typography-role="caption-l">${escapeHtml(label)} · ${value}%</span><div class="tui-progress__track"><span class="tui-progress__value"></span></div></div>`;
const emptyState = ({ title = "暂无项目", description = "创建项目后会显示在这里。" } = {}) => `<section class="tui-component tui-empty" ${attrs("empty", "Empty/Default", "default", "default")} aria-live="polite"><h4 data-slot="title" data-typography-role="title-s">${escapeHtml(title)}</h4><p data-slot="description" data-typography-role="body-m">${escapeHtml(description)}</p><button class="tui-button tui-empty__action" type="button" data-variant="primary" data-typography-role="body-l">新建项目</button></section>`;
const separatorState = () => `<hr class="tui-component tui-separator" ${attrs("separator", "Separator/Default", "default", "default")} role="separator" />`;
const labelState = ({ text = "项目名称", forId = "project-name" } = {}) => `<label class="tui-component tui-label" ${attrs("label", "Label/Default", "default", "default")} for="${escapeHtml(forId)}" data-typography-role="body-m">${escapeHtml(text)}</label>`;
const feedbackIcon = (id, tone) => id === "toast" && tone === "success" ? "action/check" : ({ info: "status/info", success: "status/success", warning: "status/warning", danger: "status/danger", neutral: "status/neutral" }[tone] ?? "status/info");
const feedbackRole = (id, tone) => id === "alert" && (tone === "warning" || tone === "danger") ? "alert" : "status";
const feedbackState = (id, tone, title, message) => `<div class="tui-component tui-${id} tui-${id}--${tone}" ${attrs(id, `${id[0].toUpperCase()}${id.slice(1)}/Default`, tone, "default")} role="${feedbackRole(id, tone)}"><span class="tui-${id}__icon">${icon(feedbackIcon(id, tone), "", { size: 20 })}</span><span class="tui-${id}__message" data-slot="content" data-typography-role="${id === "toast" ? "body-m" : "subtitle-s"}">${escapeHtml(message ?? title)}</span>${id === "alert" ? `<span class="tui-alert__actions" data-slot="actions"><button class="tui-button tui-button--ghost tui-alert__action" type="button" data-slot="action" data-variant="ghost" data-size="small" data-typography-role="body-m">${escapeHtml(title)}</button><button class="tui-icon-button" data-slot="close" type="button" aria-label="关闭">${icon("action/close", "", { size: 20 })}</button></span>` : `<button class="tui-icon-button" data-slot="close" type="button" aria-label="关闭">${icon("action/close", "", { size: 20 })}</button>`}</div>`;
const alertState = ({ tone = "info", title = "查看详情", message = "系统将在今晚自动完成更新。" } = {}) => feedbackState("alert", tone, title, message);
const alertRuntimeState = ({ specimens = [] } = {}) => `<div class="tui-feedback-specimens" data-runtime-component="alert">${specimens.map((specimen) => `<div class="tui-feedback-specimen" data-specimen="${escapeHtml(specimen.id ?? specimen.variant)}"><span class="tui-runtime-surface-label">${escapeHtml(specimen.label ?? specimen.variant)}</span>${alertState({ tone: specimen.variant, title: specimen.action, message: specimen.message })}</div>`).join("")}</div>`;
const tooltipState = () => `<div class="tui-component tui-tooltip" ${attrs("tooltip", "Tooltip/Default", "default", "default")}><button class="tui-button tui-button--ghost" type="button" data-variant="ghost" data-typography-role="body-l">刷新列表</button><span class="tui-tooltip__panel" role="tooltip" data-slot="content" data-typography-role="body-l">刷新列表</span></div>`;
const toastState = () => feedbackState("toast", "success", "", "所有修改已经同步到云端。");

const stateLabel = (state) => ({ default: "Default", hover: "Hover", pressed: "Pressed", focus: "Focus", filled: "Filled", disabled: "Disabled", error: "Error" }[state] ?? state);

export function renderInputGallery() {
  const states = ["default", "hover", "focus", "filled", "disabled", "error"];
  const context = (surface, label) => `<section class="tui-runtime-state-group" data-surface-context="${surface}"><span data-typography-role="body-m">${label}</span><div class="tui-runtime-state-grid">${states.map((state) => `<div class="tui-runtime-state-cell"><span data-typography-role="caption-l">${stateLabel(state)}</span>${inputState({ surface, state, value: state === "filled" ? "客户端设计系统" : "", disabled: state === "disabled" })}</div>`).join("")}</div></section>`;
  return `<div class="tui-runtime-core-gallery tui-runtime-input-gallery" data-component="input-gallery" data-framework="html"><p class="tui-runtime-note">白色内容面使用灰色输入面；灰色内容面使用白色输入面。下面每个控件都是真实 HTML Input 适配器，状态由 data-state 驱动。</p>${context("white", "White content surface")}${context("gray", "Gray content surface")}</div>`;
}

export function renderSearchGallery() {
  return `<div class="tui-runtime-core-gallery tui-runtime-search-gallery" data-component="search-gallery" data-framework="html"><p class="tui-runtime-note">Search 与 Input 共享 Surface 规则，输入、清除和 disabled 都由真实 DOM 控件提供。</p><div class="tui-runtime-surface-grid"><div class="tui-runtime-state-cell"><span data-typography-role="caption-l">White content surface</span>${searchState({ surface: "white" })}</div><div class="tui-runtime-state-cell"><span data-typography-role="caption-l">Gray content surface</span>${searchState({ surface: "gray" })}</div><div class="tui-runtime-state-cell"><span data-typography-role="caption-l">Filled</span>${searchState({ surface: "white", state: "filled", value: "搜索项目" })}</div><div class="tui-runtime-state-cell"><span data-typography-role="caption-l">Disabled</span>${searchState({ surface: "white", disabled: true })}</div></div></div>`;
}

export function renderSidebarGallery() {
  const item = (label, state, iconName = "navigation/grid", count = "") => `<button class="tui-sidebar-item" type="button" data-state="${state}"><span data-slot="leading">${icon(iconName)}</span><span data-slot="label" data-typography-role="body-l">${label}</span>${count ? `<span class="tui-sidebar-item__count" data-slot="trailing" data-typography-role="body-m">${count}</span>` : ""}</button>`;
  return `<div class="tui-runtime-core-gallery tui-runtime-sidebar-gallery" data-component="sidebar-gallery" data-framework="html"><p class="tui-runtime-note">未选中状态保留二级文本和图标颜色；选中态使用 Sidebar Selected。每一行是同一个 HTML Sidebar Item 的状态。</p><nav class="tui-component tui-sidebar" ${attrs("sidebar", "Sidebar Item/Default", "default", "default")} aria-label="主导航">${item("项目", "default", "navigation/grid", "24")}${item("Hover", "hover", "navigation/recent")}${item("Pressed", "pressed", "navigation/recent")}${item("Focus", "focus", "navigation/recent")}${item("已选中", "selected", "navigation/list")}${item("Disabled", "disabled", "action/settings")}</nav></div>`;
}

export function renderListCardGallery() {
  const card = (title, state) => `<button class="tui-component tui-list-card" type="button" ${attrs("list-card", "List Item/White Surface/Default", state === "selected" ? "selected" : "default", state)} aria-pressed="${state === "selected" ? "true" : "false"}"><span data-slot="leading">${icon("navigation/list")}</span><span class="tui-list-card__content"><span class="tui-list-card__title" data-slot="title" data-typography-role="title-s">${title}</span><span class="tui-list-card__description" data-slot="description" data-typography-role="body-m">刚刚更新 · 12 位成员</span></span><span class="tui-list-card__meta" data-slot="trailing" data-typography-role="body-m">${stateLabel(state)}</span></button>`;
  return `<div class="tui-runtime-core-gallery tui-runtime-list-card-gallery" data-component="list-card-gallery" data-framework="html"><p class="tui-runtime-note">List Card 使用相同的真实 DOM 组件展示 Default、Hover、Pressed、Focus、Selected 和 Disabled。</p><div class="tui-runtime-state-grid tui-runtime-state-grid--single">${["default", "hover", "pressed", "focus", "selected", "disabled"].map((state) => `<div class="tui-runtime-state-cell"><span>${stateLabel(state)}</span>${card(state === "selected" ? "已选中的项目" : "HarmonyOS 组件规范", state)}</div>`).join("")}</div></div>`;
}

/**
 * Single default-state preview used by the unified runtime gallery.  The
 * contract gallery is intentionally allowed to show a full state matrix, but
 * the runtime gallery must stay focused on the real component and let the
 * browser expose hover/focus/pressed behavior naturally.
 */
export function renderRuntimeHtmlComponent(id, options = {}) {
  const specimens = options.specimens ?? [{ id: "default", variant: "default", state: "default" }];
  if (id === "button") {
    const sample = (specimen) => {
      const mode = specimen.mode ?? "text";
      if (mode === "selection-dropdown") return renderSelectionDropdown({ variant: specimen.variant ?? "secondary" });
      if (mode === "split-dropdown") return renderSplitDropdown({ iconOnly: false });
      const variant = specimen.variant ?? "primary";
      const label = mode === "icon" ? "更多操作" : variant === "danger" ? "删除项目" : variant === "secondary" ? "次要操作" : variant === "ghost" ? "文本操作" : "确认操作";
      return renderButton({ label, variant, size: specimen.size ?? "standard", mode, iconName: mode === "icon-text" ? "action/add" : mode === "icon" ? "action/more" : undefined });
    };
    return `<div class="tui-runtime-structural-grid" data-runtime-component="button">${specimens.map((specimen) => `<div class="tui-runtime-structural-cell" data-specimen="${escapeHtml(specimen.id)}"><span class="tui-runtime-surface-label">${escapeHtml(specimen.id)}</span>${sample(specimen)}</div>`).join("")}</div>`;
  }
  if (id === "input") return `<div class="tui-runtime-surface-pair"><div data-surface-context="white"><span class="tui-runtime-surface-label">白色内容面 · 灰色输入面</span>${inputState({ surface: "white", state: "default", placeholder: "项目名称" })}</div><div data-surface-context="gray"><span class="tui-runtime-surface-label">灰色内容面 · 白色输入面</span>${inputState({ surface: "gray", state: "default", placeholder: "项目名称" })}</div></div>`;
  if (id === "search") return `<div class="tui-runtime-surface-pair"><div data-surface-context="white"><span class="tui-runtime-surface-label">白色内容面 · 灰色搜索面</span>${searchState({ surface: "white", state: "default", placeholder: "搜索项目" })}</div><div data-surface-context="gray"><span class="tui-runtime-surface-label">灰色内容面 · 白色搜索面</span>${searchState({ surface: "gray", state: "default", placeholder: "搜索项目" })}</div></div>`;
  if (id === "sidebar") {
    const item = (label, state, iconName, count = "") => `<button class="tui-sidebar-item" type="button" data-state="${state}"><span data-slot="leading">${icon(iconName)}</span><span data-slot="label" data-typography-role="body-l">${label}</span>${count ? `<span class="tui-sidebar-item__count" data-slot="trailing" data-typography-role="body-m">${count}</span>` : ""}</button>`;
    return `<nav class="tui-component tui-sidebar" ${attrs("sidebar", "Sidebar Item/Default", "default", "default")} aria-label="主导航">${item("项目", "selected", "navigation/grid", "24")}${item("最近访问", "default", "navigation/recent")}${item("与我共享", "default", "action/more")}</nav>`;
  }
  if (id === "list-card") {
    const listItem = (options) => itemState({ id: "list-card", logicalName: "List Item/White Surface/Default", ...options });
    return `<div class="tui-list-card-group" role="list">${listItem({ title: "项目设置", lines: 1, trailing: "text-arrow", trailingText: "详情" })}${listItem({ title: "成员权限", description: "管理角色和访问范围", lines: 2, trailing: "icon" })}${listItem({ title: "通知方式", description: "邮件通知", supporting: "已同步到云端", lines: 3, trailing: "radio" })}${listItem({ title: "自动同步", lines: 1, trailing: "switch" })}${listItem({ title: "项目归档", lines: 1, trailing: "checkbox" })}${listItem({ title: "更新动态", lines: 1, trailing: "notification-arrow" })}</div>`;
  }
  if (id === "titlebar") return `<div class="tui-runtime-titlebar-gallery">${[
    ["small", "S · 40px"],
    ["medium", "M · 56px"],
    ["large", "L · 64px"],
    ["xlarge", "XL · 72px"]
  ].map(([size, label]) => `<div class="tui-runtime-titlebar-row"><span class="tui-runtime-surface-label">${label}</span>${titlebarState({ label: "项目空间", size, mainDetailActions: size === "large" ? [{ id: "save", label: "保存", icon: "action/save" }, { id: "expand", label: "展开", icon: "window/maximize" }, { id: "more", label: "更多", icon: "action/more" }] : [] })}${titlebarState({ label: "项目空间", size, state: "unfocus" })}</div>`).join("")}</div>`;
  if (id === "textarea") return `<div class="tui-runtime-surface-pair tui-runtime-textarea-pair"><div data-surface-context="white"><span class="tui-runtime-surface-label">白色内容面 · 灰色输入面</span>${textareaState({ surface: "white" })}</div><div data-surface-context="gray"><span class="tui-runtime-surface-label">灰色内容面 · 白色输入面</span>${textareaState({ surface: "gray" })}</div></div>`;
  if (id === "field") return fieldState({ surface: "white" });
  if (id === "select") return `<div class="tui-runtime-surface-pair"><div data-surface-context="white"><span class="tui-runtime-surface-label">白色内容面 · 灰色选择面</span>${selectState({ id: "select", surface: "white" })}</div><div data-surface-context="gray"><span class="tui-runtime-surface-label">灰色内容面 · 白色选择面</span>${selectState({ id: "select", surface: "gray" })}</div></div>`;
  if (id === "combobox") return selectState({ id: "combobox", label: "负责人", value: "选择成员" });
  if (id === "native-select") return nativeSelectState();
  if (id === "checkbox") return checkboxState();
  if (id === "radio-group") return radioGroupState();
  if (id === "switch") return switchState();
  if (id === "tabs") return tabsState();
  if (id === "accordion") return disclosureState("accordion", "项目设置", "基础信息、成员与通知方式");
  if (id === "collapsible") return disclosureState("collapsible", "更多信息", "点击展开查看详情");
  if (id === "avatar") return `<div class="tui-runtime-avatar-pair"><div><span class="tui-runtime-surface-label">32 × 32</span>${avatarState({ initials: "H", name: "HarmonyOS 32", size: 32 })}</div><div><span class="tui-runtime-surface-label">40 × 40</span>${avatarState({ initials: "H", name: "HarmonyOS 40", size: 40 })}</div></div>`;
  if (id === "badge") return badgeSpecimens();
  if (id === "card") return cardState();
  if (id === "item") return `<div class="tui-item-group" role="list">${itemState({ title: "项目设置", lines: 1, trailing: "text-arrow", trailingText: "详情" })}${itemState({ title: "成员权限", description: "管理角色和访问范围", lines: 2, trailing: "icon" })}${itemState({ title: "通知方式", description: "邮件通知", supporting: "已同步到云端", lines: 3, trailing: "radio" })}${itemState({ title: "自动同步", lines: 1, trailing: "switch" })}${itemState({ title: "项目归档", lines: 1, trailing: "checkbox" })}${itemState({ title: "更新动态", lines: 1, trailing: "notification-arrow" })}</div>`;
  if (id === "table") return tableState("table");
  if (id === "data-table") return tableState("data-table");
  if (id === "pagination") return paginationState();
  if (id === "breadcrumb") return breadcrumbState();
  if (id === "progress") return progressState();
  if (id === "empty") return emptyState();
  if (id === "separator") return separatorState();
  if (id === "label") return labelState();
  if (id === "alert") return alertRuntimeState({ specimens });
  if (id === "tooltip") return tooltipState();
  if (id === "toast") return toastState();
  if (advancedHtmlComponents[id]) return advancedHtmlComponents[id](options);
  const renderer = generatedHtmlComponents[id];
  return renderer ? renderer() : `<p class="tui-runtime-framework-missing">HTML 适配器缺失：${escapeHtml(id)}</p>`;
}

const galleryCell = (name, content, className = "") => `<div class="tui-button-gallery__cell${className ? ` ${className}` : ""}"><span class="tui-button-gallery__label">${escapeHtml(name)}</span>${content}</div>`;
const sectionRule = (title) => `<div class="tui-button-gallery__rule"><span>${escapeHtml(title)}</span></div>`;

export function renderButtonGallery() {
  const variants = [
    ["Primary", "primary", "确认操作"],
    ["Secondary", "secondary", "次要操作"],
    ["Ghost", "ghost", "文本操作"],
    ["Danger", "danger", "删除项目"]
  ];
  const sized = ["standard", "small"].map((size) => {
    const title = size === "standard" ? "Standard · 40px" : "Small · 28px";
    const cells = [false, true].flatMap((disabled) => variants.map(([name, variant, label]) => galleryCell(`${name}${disabled ? " · Disabled" : ""}`, renderButton({ label, variant, size, disabled }))));
    return `<section class="tui-button-gallery__section" data-logical-group="Button/Size/${size === "standard" ? "Standard" : "Small"}">${sectionRule(title)}<div class="tui-button-gallery__grid tui-button-gallery__grid--four">${cells.join("")}</div></section>`;
  }).join("");

  const iconTextDefault = [
    ["Primary", "primary", "action/add", "新建项目"],
    ["Secondary", "secondary", "action/download", "导出文件"],
    ["Ghost", "ghost", "action/settings", "更多设置"]
  ].map(([name, variant, iconName, label]) => galleryCell(name, renderButton({ label, variant, mode: "icon-text", iconName }))).join("");
  const iconTextDisabled = [
    ["Primary · Disabled", "primary", "action/add", "新建项目"],
    ["Secondary · Disabled", "secondary", "action/download", "导出文件"],
    ["Ghost · Disabled", "ghost", "action/settings", "更多设置"]
  ].map(([name, variant, iconName, label]) => galleryCell(name, renderButton({ label, variant, mode: "icon-text", iconName, disabled: true }))).join("");

  const iconButtons = [
    ["Ghost · Default", "ghost", "action/more", false],
    ["Secondary · Explicit", "secondary", "action/close", false],
    ["Ghost · Disabled", "ghost", "action/more", true],
    ["Secondary · Disabled", "secondary", "action/close", true]
  ].map(([name, variant, iconName, disabled]) => galleryCell(name, renderButton({ label: name, variant, mode: "icon", iconName, disabled }), "tui-button-gallery__cell--icon")).join("");

  const selection = [
    galleryCell("List selection", renderSelectionDropdown()),
    galleryCell("Disabled", renderSelectionDropdown({ disabled: true }))
  ].join("");
  const splitDefault = [
    galleryCell("Icon + Text · Independent actions", renderSplitDropdown()),
    galleryCell("Icon · Independent actions", renderSplitDropdown({ label: "刷新", iconName: "action/refresh", iconOnly: true, menuItems: ["重新加载", "同步数据", "清理缓存并刷新"] }))
  ].join("");
  const splitDisabled = [
    galleryCell("Icon + Text · Disabled", renderSplitDropdown({ disabled: true })),
    galleryCell("Icon · Disabled", renderSplitDropdown({ label: "刷新", iconName: "action/refresh", iconOnly: true, disabled: true, menuItems: ["重新加载", "同步数据", "清理缓存并刷新"] }))
  ].join("");

  return `<div class="tui-button-gallery" data-component="button" data-logical-component="Button/Module/Complete" data-framework="html">${sized}<section class="tui-button-gallery__section" data-logical-group="Button/Icon Text/Default">${sectionRule("Icon + Text · 40px · Icon 20px")}<div class="tui-button-gallery__grid tui-button-gallery__grid--three">${iconTextDefault}</div><div class="tui-button-gallery__grid tui-button-gallery__grid--three">${iconTextDisabled}</div></section><section class="tui-button-gallery__section" data-logical-group="Button/Icon/Default">${sectionRule("Icon Button · 图标按钮 · Default = Ghost · 40×40px · Icon 20px")}<div class="tui-button-gallery__grid tui-button-gallery__grid--four">${iconButtons}</div></section><section class="tui-button-gallery__section" data-logical-group="Button/Selection Dropdown/Default">${sectionRule("Selection Dropdown · 选择型下拉按钮 · Text + Chevron · Secondary · 40px")}<div class="tui-button-gallery__grid tui-button-gallery__grid--two">${selection}</div></section><section class="tui-button-gallery__section" data-logical-group="Button/Split Dropdown/Default">${sectionRule("Split Dropdown Button · 分裂式下拉按钮 · Ghost · 40px")}<div class="tui-button-gallery__grid tui-button-gallery__grid--two">${splitDefault}</div><div class="tui-button-gallery__grid tui-button-gallery__grid--two">${splitDisabled}</div></section></div>`;
}

export const htmlComponents = {
  "legacy-catalog": () => renderLegacyCatalog(),
  button: (options = {}) => renderButton(options),
  buttonGallery: () => renderButtonGallery(),
  input: (options = {}) => inputState(options),
  inputGallery: () => renderInputGallery(),
  search: (options = {}) => searchState(options),
  searchGallery: () => renderSearchGallery(),
  sidebar: () => `<nav class="tui-component tui-sidebar" ${attrs("sidebar", "Sidebar Item/Default", "default", "default")} aria-label="主导航"><button class="tui-sidebar-item" type="button" data-state="selected"><span data-slot="leading">${icon("navigation/grid")}</span><span data-slot="label" data-typography-role="body-l">项目</span><span class="tui-sidebar-item__count" data-slot="trailing" data-typography-role="body-m">24</span></button><button class="tui-sidebar-item" type="button" data-state="default"><span data-slot="leading">${icon("navigation/recent")}</span><span data-slot="label" data-typography-role="body-l">最近访问</span></button></nav>`,
  sidebarGallery: () => renderSidebarGallery(),
  listCard: () => `<button class="tui-component tui-list-card" type="button" ${attrs("list-card", "List Item/White Surface/Default", "selected", "selected")} aria-pressed="true"><span data-slot="leading">${icon("navigation/list")}</span><span class="tui-list-card__content"><span class="tui-list-card__title" data-slot="title" data-typography-role="title-s">HarmonyOS 组件规范</span><span class="tui-list-card__description" data-slot="description" data-typography-role="body-m">刚刚更新 · 12 位成员</span></span><span class="tui-list-card__meta" data-slot="trailing" data-typography-role="body-m">进行中</span></button>`,
  listCardGallery: () => renderListCardGallery(),
  titlebar: (options = {}) => titlebarState(options),
  textarea: (options = {}) => textareaState(options),
  field: (options = {}) => fieldState(options),
  select: (options = {}) => selectState(options),
  combobox: (options = {}) => selectState({ id: "combobox", ...options }),
  nativeSelect: (options = {}) => nativeSelectState(options),
  checkbox: (options = {}) => checkboxState(options),
  radioGroup: (options = {}) => radioGroupState(options),
  switch: (options = {}) => switchState(options),
  tabs: () => tabsState(),
  accordion: () => disclosureState("accordion", "项目设置", "基础信息、成员与通知方式"),
  collapsible: () => disclosureState("collapsible", "更多信息", "点击展开查看详情"),
  avatar: (options = {}) => avatarState(options),
  badge: (options = {}) => badgeState(options),
  card: (options = {}) => cardState(options),
  item: (options = {}) => itemState(options),
  table: () => tableState("table"),
  dataTable: () => tableState("data-table"),
  pagination: () => paginationState(),
  breadcrumb: () => breadcrumbState(),
  progress: (options = {}) => progressState(options),
  empty: (options = {}) => emptyState(options),
  separator: () => separatorState(),
  label: (options = {}) => labelState(options),
  alert: () => alertState(),
  tooltip: () => tooltipState(),
  toast: () => toastState(),
  ...advancedHtmlComponents,
  ...generatedHtmlComponents
};

export function renderHtmlComponent(name, options) {
  const renderer = htmlComponents[name];
  if (!renderer) throw new Error(`Unknown HTML component: ${name}`);
  return renderer(options);
}
