// Independent HTML adapters for the remaining contract components.
// These are intentionally not generated Card/Menu/Picker snapshots: every
// adapter owns its semantic DOM and the small amount of behavior it needs.
import { iconMarkup } from "./icon-map.js";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const icon = (name, size = 20, kind = "auto") => iconMarkup(name, { size, kind });
const attrs = (id, logicalName, variant = "default", state = "default", extra = "") =>
  `data-component="${id}" data-logical-component="${logicalName}" data-variant="${variant}" data-state="${state}" data-framework="html"${extra}`;

const menu = (items) => items.map((item) => {
  const entry = typeof item === "string" ? { label: item } : item;
  return `<button type="button" role="menuitem" class="tui-advanced-menu__item" data-typography-role="body-l">${entry.icon ? icon(entry.icon, 24) : ""}<span>${escapeHtml(entry.label)}</span></button>`;
}).join("");
const openOverlayHandler = `const l=this.nextElementSibling;l.hidden=false;const d=l.querySelector('.tui-dialog');d.dataset.state='open';d.focus()`;
const closeOverlayHandler = `const e=this.closest('[data-overlay-example]');this.closest('.tui-overlay-layer').hidden=true;e.querySelector('[data-overlay-trigger]').focus()`;
const escapeOverlayHandler = `if(event.key==='Escape'){event.preventDefault();const e=this.closest('[data-overlay-example]');this.closest('.tui-overlay-layer').hidden=true;e.querySelector('[data-overlay-trigger]').focus()}`;

const overlayLayer = ({ id, componentId = id, triggerLabel, role = "dialog", title, description, modifier = "", actions, content = "", extra = "" }) => {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  return `<div class="tui-overlay-example" data-overlay-example="${id}">
    <button class="tui-button" type="button" data-variant="secondary" data-overlay-trigger="${id}" data-typography-role="body-l" onclick="${openOverlayHandler}">${escapeHtml(triggerLabel)}</button>
    <div class="tui-overlay-layer" id="${id}" data-overlay-id="${id}" hidden${extra}>
      <div class="tui-overlay-backdrop" aria-hidden="true"></div>
      <section class="tui-component tui-dialog ${modifier}" ${attrs(componentId, `${componentId === "alert-dialog" ? "Alert Dialog" : componentId === "semi-modal" ? "Semi-modal" : "Dialog"}/Default`, "white", "open")} role="${role}" aria-modal="true" aria-labelledby="${titleId}" aria-describedby="${descriptionId}" tabindex="-1" onkeydown="${escapeOverlayHandler}">
        <header class="tui-dialog__header"><h4 id="${titleId}" data-typography-role="title-s">${escapeHtml(title)}</h4>${componentId === "semi-modal" ? `<button class="tui-icon-button tui-dialog__close" type="button" data-overlay-close aria-label="关闭">${icon("action/close", 20)}</button>` : ""}</header>
        <div class="tui-dialog__content"><p id="${descriptionId}" data-slot="description" data-typography-role="body-m">${escapeHtml(description)}</p>${content}</div>
        <footer class="tui-dialog__actions" data-action-layout="${actions.length === 1 ? "single" : "double"}">${actions.map((action) => `<button class="tui-button" type="button" data-variant="${action.variant}" data-overlay-action="${action.action}" data-typography-role="body-l" onclick="${closeOverlayHandler}">${escapeHtml(action.label)}</button>`).join("")}</footer>
      </section>
    </div>
  </div>`;
};

export const dialog = () => `<div class="tui-overlay-specimens" data-component="dialog">${overlayLayer({ id: "dialog-single", componentId: "dialog", triggerLabel: "打开单按钮对话弹窗", title: "更新完成", description: "应用已经更新到最新版本。", actions: [{ action: "confirm", variant: "primary", label: "知道了" }] })}${overlayLayer({ id: "dialog-double", componentId: "dialog", triggerLabel: "打开双按钮对话弹窗", title: "确认更新？", description: "更新期间应用需要重新启动。", actions: [{ action: "cancel", variant: "secondary", label: "取消" }, { action: "confirm", variant: "primary", label: "确认" }] })}</div>`;

export const alertDialog = () => overlayLayer({ id: "alert-dialog", triggerLabel: "打开删除确认弹窗", role: "alertdialog", title: "删除项目？", description: "删除后无法恢复，请确认操作。", modifier: "tui-dialog--alert", actions: [{ action: "cancel", variant: "secondary", label: "取消" }, { action: "confirm", variant: "danger", label: "删除" }] });

export const semiModal = () => {
  const fields = `<div class="tui-dialog__form"><label class="tui-field"><span data-typography-role="body-m">项目名称</span><span class="tui-input" data-field-control data-surface="white"><input type="text" value="客户端设计系统" data-typography-role="body-l" /></span></label><label class="tui-field"><span data-typography-role="body-m">负责人</span><span class="tui-search" data-field-control data-surface="white">${icon("field/search", 20)}<input type="search" value="赵博海" data-typography-role="body-l" /></span></label></div>`;
  const axisHandler = (axis) => `const l=this.closest('[data-overlay-example]').querySelector('[data-overlay-id=semi-modal]');l.dataset.${axis}=this.value;const d=l.querySelector('.tui-dialog');d.dataset.variant=l.dataset.size+'-'+l.dataset.surface+'-'+l.dataset.mode;d.setAttribute('aria-modal',String(l.dataset.mode==='modal'))`;
  const controls = `<div class="tui-specimen-controls" aria-label="半模态结构维度"><label data-typography-role="body-m">尺寸<select data-semi-axis="size" onchange="${axisHandler("size")}"><option value="s">S · 480</option><option value="m" selected>M · 640</option><option value="l">L · 800</option></select></label><label data-typography-role="body-m">背景<select data-semi-axis="surface" onchange="${axisHandler("surface")}"><option value="white" selected>White</option><option value="gray">Gray</option></select></label><label data-typography-role="body-m">模式<select data-semi-axis="mode" onchange="${axisHandler("mode")}"><option value="non-modal" selected>Non-modal</option><option value="modal">Modal</option></select></label></div>`;
  return `<div class="tui-overlay-example" data-overlay-example="semi-modal">${controls}<button class="tui-button" type="button" data-variant="secondary" data-overlay-trigger="semi-modal" data-typography-role="body-l" onclick="const l=this.nextElementSibling;l.hidden=false;const d=l.querySelector('.tui-dialog');d.dataset.state='open';d.focus()">打开半模态弹窗</button><div class="tui-overlay-layer" id="semi-modal" data-overlay-id="semi-modal" data-size="m" data-surface="white" data-mode="non-modal" hidden><div class="tui-overlay-backdrop" aria-hidden="true"></div><section class="tui-component tui-dialog tui-dialog--semi" ${attrs("semi-modal", "Semi-modal/Default", "m-white-non-modal", "open")} role="dialog" aria-modal="false" aria-labelledby="semi-modal-title" aria-describedby="semi-modal-description" tabindex="-1" onkeydown="${escapeOverlayHandler}"><header class="tui-dialog__header"><h4 id="semi-modal-title" data-typography-role="title-s">编辑项目设置</h4><button class="tui-icon-button tui-dialog__close" type="button" data-overlay-close aria-label="关闭" onclick="${closeOverlayHandler}">${icon("action/close", 20)}</button></header><div class="tui-dialog__content"><p id="semi-modal-description" data-typography-role="body-m">非模态为默认状态，可以继续操作背景内容。</p>${fields}</div><footer class="tui-dialog__actions" data-action-layout="double"><button class="tui-button" type="button" data-variant="secondary" data-overlay-action="cancel" data-typography-role="body-l" onclick="${closeOverlayHandler}">取消</button><button class="tui-button" type="button" data-variant="primary" data-overlay-action="confirm" data-typography-role="body-l" onclick="${closeOverlayHandler}">保存</button></footer></section></div></div>`;
};

const menuComponent = (id, logicalName, label, value, items) => `<div class="tui-component tui-advanced-menu" ${attrs(id, logicalName, "default", "default")}><span class="tui-advanced-menu__label" data-typography-role="body-m">${escapeHtml(label)}</span><button class="tui-advanced-menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false"><span data-slot="value" data-typography-role="body-l">${escapeHtml(value)}</span>${icon("navigation/chevron-down", 16)}</button><div class="tui-advanced-menu__panel" role="menu" hidden>${menu(items)}</div></div>`;
export const navigationMenu = () => menuComponent("navigation-menu", "Navigation Menu/Default", "导航菜单", "项目 / 团队 / 设置", ["项目", "团队", "设置"]);
export const menubar = () => `<nav class="tui-component tui-advanced-menubar" ${attrs("menubar", "Menubar/Default")} aria-label="主菜单"><button class="tui-advanced-menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" data-typography-role="body-l">文件 ${icon("navigation/chevron-down", 16)}</button><div class="tui-advanced-menu__panel" role="menu" hidden>${menu(["新建", "打开", "导出"])}</div></nav>`;
export const contextMenu = () => menuComponent("context-menu", "Context Menu/Default", "更多操作", "右键或点击打开", [{ label: "复制", icon: "action/copy" }, { label: "重命名", icon: "action/rename" }, { label: "删除", icon: "action/delete" }]);
export const dropdownMenu = () => menuComponent("dropdown-menu", "Dropdown Menu/Default", "操作菜单", "新建、导入、导出", ["新建", "导入", "导出"]);

export const popover = () => `<div class="tui-component tui-advanced-popover" ${attrs("popover", "Popover/Default")}><button class="tui-button" type="button" data-variant="ghost" data-typography-role="body-l" aria-expanded="false">筛选条件</button><div class="tui-advanced-popover__panel" role="dialog" hidden><strong data-typography-role="title-s">筛选条件</strong><span data-typography-role="body-m">状态、负责人、更新时间</span></div></div>`;
export const hoverCard = () => `<div class="tui-component tui-advanced-hover-card" ${attrs("hover-card", "Hover Card/Default")}><button class="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">组件说明</button><div class="tui-advanced-hover-card__panel" role="tooltip"><strong data-typography-role="title-s">组件说明</strong><span data-typography-role="body-m">查看组件的详细使用规则</span></div></div>`;

export const slider = () => `<label class="tui-component tui-slider" ${attrs("slider", "Slider/Default")}><span data-slot="label" data-typography-role="body-m">透明度</span><input type="range" min="0" max="100" value="84" data-typography-role="body-l" aria-label="透明度" /><output data-typography-role="body-m">84</output></label>`;
export const inputOtp = () => `<fieldset class="tui-component tui-input-otp" ${attrs("input-otp", "Input OTP/Default")}><legend data-typography-role="body-m">验证码</legend><div class="tui-input-otp__cells">${[1, 2, 3, 4, 5, 6].map((n) => `<input class="tui-input-otp__cell" type="text" inputmode="numeric" maxlength="1" aria-label="第 ${n} 位验证码" data-typography-role="body-l" />`).join("")}</div><small data-typography-role="caption-l">请输入 6 位验证码</small></fieldset>`;
export const kbd = () => `<kbd class="tui-component tui-kbd" ${attrs("kbd", "Kbd/Default")} data-typography-role="body-m">⌘ K</kbd>`;

export const chart = () => `<figure class="tui-component tui-chart" ${attrs("chart", "Chart/Default")}><figcaption data-typography-role="title-s">项目趋势</figcaption><svg class="tui-chart__svg" viewBox="0 0 240 96" role="img" aria-label="项目趋势图"><path d="M8 78L52 58L96 64L140 32L184 42L232 14" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M8 80H232" fill="none" stroke="currentColor" stroke-width="1" opacity=".24" /></svg><span data-typography-role="caption-l">本周完成度 84%</span></figure>`;
const calendarWeekdays = ["日", "一", "二", "三", "四", "五", "六"];
const calendarDays = ["26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5"];
const calendarWeekMarkup = (className = "tui-calendar__week") => `<div class="${className}" data-typography-role="caption-l">${calendarWeekdays.map((day) => `<span data-typography-role="caption-l">${day}</span>`).join("")}</div>`;
const calendarDayMarkup = (className = "tui-calendar__days", selectedDay = "7") => `<div class="${className}" role="grid">${calendarDays.map((day, i) => `<button type="button" role="gridcell" class="${day === selectedDay && i === 12 ? "is-selected" : ""}" data-day="${day}" data-typography-role="body-l">${day}</button>`).join("")}</div>`;
export const calendar = () => `<section class="tui-component tui-calendar" ${attrs("calendar", "Calendar/Default")}><header><strong data-typography-role="title-s">2026 年 08 月</strong><button class="tui-icon-button tui-calendar__prev" type="button" aria-label="上个月">‹</button><button class="tui-icon-button tui-calendar__next" type="button" aria-label="下个月">›</button></header>${calendarWeekMarkup()}${calendarDayMarkup()}</section>`;

const picker = (id, logicalName, label, value, iconName, panel) => `<div class="tui-component tui-picker" ${attrs(id, logicalName)}><label data-typography-role="body-m">${escapeHtml(label)}</label><button class="tui-picker__trigger" type="button" aria-haspopup="dialog" aria-expanded="false"><span data-slot="value" data-typography-role="body-l">${escapeHtml(value)}</span>${icon(iconName, 20)}</button><div class="tui-picker__panel" role="dialog" hidden>${panel}</div></div>`;
export const datePicker = () => picker("date-picker", "Date Picker/Default", "日期", "2026-08-07", "field/calendar", `${calendarWeekMarkup("tui-picker__calendar")}${calendarDayMarkup("tui-picker__calendar", "7")}<footer><button type="button" data-action="clear" data-typography-role="body-l">清除</button><button type="button" data-action="today" data-typography-role="body-l">今天</button></footer>`);
export const timePicker = () => picker("time-picker", "Time Picker/Default", "时间", "09:30", "field/clock", `<div class="tui-picker__columns"><div><span data-typography-role="caption-l">时</span>${["08", "09", "10"].map((d) => `<button type="button" data-time-hour="${d}" data-typography-role="body-l" class="${d === "09" ? "is-selected" : ""}">${d}</button>`).join("")}</div><b data-typography-role="body-l">:</b><div><span data-typography-role="caption-l">分</span>${["25", "30", "35"].map((d) => `<button type="button" data-time-minute="${d}" data-typography-role="body-l" class="${d === "30" ? "is-selected" : ""}">${d}</button>`).join("")}</div></div><footer><button type="button" data-action="clear" data-typography-role="body-l">清除</button><button type="button" data-action="confirm" data-typography-role="body-l">确定</button></footer>`);

export const attachment = () => `<article class="tui-component tui-attachment" ${attrs("attachment", "Attachment/Default")}><span class="tui-attachment__type" data-typography-role="caption-l">PDF</span><div><strong data-typography-role="subtitle-s">项目说明.pdf</strong><small data-typography-role="body-s">2.4 MB · 已上传</small></div><button class="tui-icon-button tui-attachment__download" type="button" aria-label="下载">${icon("action/download", 20)}</button></article>`;
export const carousel = () => `<section class="tui-component tui-carousel" ${attrs("carousel", "Carousel/Default")} aria-roledescription="carousel"><header><strong data-typography-role="title-s">项目概览</strong><span class="tui-carousel__count" data-typography-role="caption-l">1 / 3</span></header><div class="tui-carousel__slide" data-slide="0" data-typography-role="body-l">HarmonyOS PC 组件规范</div><footer><button type="button" class="tui-icon-button tui-carousel__prev" aria-label="上一项">‹</button><button type="button" class="tui-icon-button tui-carousel__next" aria-label="下一项">›</button></footer></section>`;

export const advancedHtmlComponents = {
  dialog, "alert-dialog": alertDialog, "semi-modal": semiModal,
  "navigation-menu": navigationMenu, menubar, "context-menu": contextMenu, "dropdown-menu": dropdownMenu,
  popover, "hover-card": hoverCard, slider, "input-otp": inputOtp, kbd,
  chart, calendar, "date-picker": datePicker, "time-picker": timePicker,
  attachment, carousel
};
