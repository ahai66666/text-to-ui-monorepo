import React from "react";
import { createPortal } from "react-dom";
import "./styles.css";
import { Icon, contract } from "./shared.jsx";

const cx = (...values) => values.filter(Boolean).join(" ");
const menuItems = (items, onChoose) => items.map((item) => {
  const entry = typeof item === "string" ? { label: item } : item;
  return <button key={entry.label} type="button" role="menuitem" className="tui-advanced-menu__item" data-typography-role="body-l" onClick={() => onChoose?.(entry.label)}>{entry.icon ? <Icon name={entry.icon} size={24} /> : null}<span>{entry.label}</span></button>;
});
const calendarWeekdays = ["日", "一", "二", "三", "四", "五", "六"];
const calendarDays = ["26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5"];

function useControllableOpen(controlled, onOpenChange) {
  const [internal, setInternal] = React.useState(false);
  const open = controlled === undefined ? internal : controlled;
  const setOpen = React.useCallback((next) => {
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  }, [controlled, onOpenChange]);
  return [open, setOpen];
}

function DialogBase({ id, open: controlledOpen, title, description, intent = "default", actionLayout = "double", confirmLabel = "确认", cancelLabel = "取消", size = "m", surface = "white", mode = "modal", triggerLabel = "打开弹窗", showClose = false, children, onConfirm, onCancel, onClose, onOpenChange }) {
  const [open, setOpen] = useControllableOpen(controlledOpen, onOpenChange);
  const triggerRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const close = React.useCallback((reason) => {
    setOpen(false);
    if (reason === "confirm") onConfirm?.();
    if (reason === "cancel") onCancel?.();
    if (reason === "close") onClose?.();
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [onCancel, onClose, onConfirm, setOpen]);
  React.useEffect(() => {
    if (!open) return undefined;
    const node = dialogRef.current;
    requestAnimationFrame(() => node?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); close("cancel"); return; }
      if (mode !== "modal" || event.key !== "Tab" || !node) return;
      const focusable = [...node.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) { event.preventDefault(); node.focus(); return; }
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, mode, open]);

  const actions = actionLayout === "single"
    ? <button className="tui-button" type="button" data-variant={intent === "danger" ? "danger" : "primary"} data-typography-role="body-l" onClick={() => close("confirm")}>{confirmLabel}</button>
    : <><button className="tui-button" type="button" data-variant="secondary" data-typography-role="body-l" onClick={() => close("cancel")}>{cancelLabel}</button><button className="tui-button" type="button" data-variant={intent === "danger" ? "danger" : "primary"} data-typography-role="body-l" onClick={() => close("confirm")}>{confirmLabel}</button></>;
  const layer = open && typeof document !== "undefined" ? createPortal(<div className="tui-overlay-layer" data-size={size} data-surface={surface} data-mode={mode}>
    <div className="tui-overlay-backdrop" aria-hidden="true" />
    <section ref={dialogRef} className={cx("tui-component tui-dialog", id === "alert-dialog" && "tui-dialog--alert", id === "semi-modal" && "tui-dialog--semi")} {...contract(id, `${id === "alert-dialog" ? "Alert Dialog" : id === "semi-modal" ? "Semi-modal" : "Dialog"}/Default`, `${size}-${surface}-${mode}`, "open")} role={id === "alert-dialog" ? "alertdialog" : "dialog"} aria-modal={mode === "modal"} aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}>
      <header className="tui-dialog__header"><h4 id={titleId} data-typography-role="title-s">{title}</h4>{showClose && <button className="tui-icon-button tui-dialog__close" type="button" aria-label="关闭" onClick={() => close("close")}><Icon name="action/close" size={20} /></button>}</header>
      <div className="tui-dialog__content"><p id={descriptionId} data-slot="description" data-typography-role="body-m">{description}</p>{children}</div>
      <footer className="tui-dialog__actions" data-action-layout={actionLayout}>{actions}</footer>
    </section>
  </div>, document.body) : null;
  return <div className="tui-overlay-example"><button ref={triggerRef} className="tui-button" type="button" data-variant="secondary" data-typography-role="body-l" onClick={() => setOpen(true)}>{triggerLabel}</button>{layer}</div>;
}

export function Dialog({ actionLayout = "double", ...props }) { return <DialogBase id="dialog" title={actionLayout === "single" ? "更新完成" : "确认更新？"} description={actionLayout === "single" ? "应用已经更新到最新版本。" : "更新期间应用需要重新启动。"} actionLayout={actionLayout} confirmLabel={actionLayout === "single" ? "知道了" : "确认"} triggerLabel={actionLayout === "single" ? "打开单按钮对话弹窗" : "打开双按钮对话弹窗"} {...props} />; }
export function AlertDialog(props) { return <DialogBase id="alert-dialog" title="删除项目？" description="删除后无法恢复，请确认操作。" intent="danger" actionLayout="double" confirmLabel="删除" triggerLabel="打开删除确认弹窗" {...props} />; }
export function SemiModal({ size = "m", surface = "white", mode = "non-modal", ...props }) { return <DialogBase id="semi-modal" title="编辑项目设置" description="非模态为默认状态，可以继续操作背景内容。" size={size} surface={surface} mode={mode} showClose confirmLabel="保存" triggerLabel="打开半模态弹窗" {...props}><div className="tui-dialog__form"><label className="tui-field"><span data-typography-role="body-m">项目名称</span><span className="tui-input" data-surface={surface}><input defaultValue="客户端设计系统" data-typography-role="body-l" /></span></label><label className="tui-field"><span data-typography-role="body-m">负责人</span><span className="tui-search" data-surface={surface}><Icon name="field/search" size={20} /><input type="search" defaultValue="赵博海" data-typography-role="body-l" /></span></label></div></DialogBase>; }

function Menu({ id, logicalName, label, value, items }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(value);
  const choose = (item) => { setSelected(item); setOpen(false); };
  return <div className="tui-component tui-advanced-menu" {...contract(id, logicalName, "default", open ? "open" : "default")}>
    <span className="tui-advanced-menu__label" data-typography-role="body-m">{label}</span>
    <button className="tui-advanced-menu__trigger" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}><span data-slot="value" data-typography-role="body-l">{selected}</span><Icon name="navigation/chevron-down" size={16} /></button>
    <div className="tui-advanced-menu__panel" role="menu" hidden={!open}>{menuItems(items, choose)}</div>
  </div>;
}
export function NavigationMenu() { return <Menu id="navigation-menu" logicalName="Navigation Menu/Default" label="导航菜单" value="项目 / 团队 / 设置" items={["项目", "团队", "设置"]} />; }
export function ContextMenu() { return <Menu id="context-menu" logicalName="Context Menu/Default" label="更多操作" value="右键或点击打开" items={[{ label: "复制", icon: "action/copy" }, { label: "重命名", icon: "action/rename" }, { label: "删除", icon: "action/delete" }]} />; }
export function DropdownMenu() { return <Menu id="dropdown-menu" logicalName="Dropdown Menu/Default" label="操作菜单" value="新建、导入、导出" items={["新建", "导入", "导出"]} />; }
export function Menubar() { return <Menu id="menubar" logicalName="Menubar/Default" label="主菜单" value="文件" items={["新建", "打开", "导出"]} />; }

export function Popover() {
  const [open, setOpen] = React.useState(false);
  return <div className="tui-component tui-advanced-popover" {...contract("popover", "Popover/Default")}><button className="tui-button" type="button" data-variant="ghost" data-typography-role="body-l" aria-expanded={open} onClick={() => setOpen((v) => !v)}>筛选条件</button><div className="tui-advanced-popover__panel" role="dialog" hidden={!open}><strong data-typography-role="title-s">筛选条件</strong><span data-typography-role="body-m">状态、负责人、更新时间</span></div></div>;
}
export function HoverCard() { return <div className="tui-component tui-advanced-hover-card" {...contract("hover-card", "Hover Card/Default")}><button className="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">组件说明</button><div className="tui-advanced-hover-card__panel" role="tooltip"><strong data-typography-role="title-s">组件说明</strong><span data-typography-role="body-m">查看组件的详细使用规则</span></div></div>; }

export function Slider({ value: controlled, defaultValue = 84, onChange, ...props }) {
  const [value, setValue] = React.useState(defaultValue);
  const current = controlled === undefined ? value : controlled;
  return <label className="tui-component tui-slider" {...contract("slider", "Slider/Default")}><span data-slot="label" data-typography-role="body-m">透明度</span><input {...props} type="range" min="0" max="100" value={current} aria-label="透明度" onChange={(event) => { if (controlled === undefined) setValue(event.target.value); onChange?.(event.target.value); }} /><output data-typography-role="body-m">{current}</output></label>;
}
export function InputOtp({ length = 6, onComplete, ...props }) {
  const refs = React.useRef([]);
  const [values, setValues] = React.useState(() => Array(length).fill(""));
  const update = (index, value) => { const next = [...values]; next[index] = value.slice(-1); setValues(next); if (value && index < length - 1) refs.current[index + 1]?.focus(); if (next.every(Boolean)) onComplete?.(next.join("")); };
  return <fieldset className="tui-component tui-input-otp" {...contract("input-otp", "Input OTP/Default")}><legend data-typography-role="body-m">验证码</legend><div className="tui-input-otp__cells">{values.map((value, index) => <input {...props} key={index} ref={(node) => { refs.current[index] = node; }} className="tui-input-otp__cell" type="text" inputMode="numeric" maxLength={1} aria-label={`第 ${index + 1} 位验证码`} value={value} onChange={(event) => update(index, event.target.value)} data-typography-role="body-l" />)}</div><small data-typography-role="caption-l">请输入 6 位验证码</small></fieldset>;
}
export function Kbd() { return <kbd className="tui-component tui-kbd" {...contract("kbd", "Kbd/Default")} data-typography-role="body-m">⌘ K</kbd>; }

export function Chart() { return <figure className="tui-component tui-chart" {...contract("chart", "Chart/Default")}><figcaption data-typography-role="title-s">项目趋势</figcaption><svg className="tui-chart__svg" viewBox="0 0 240 96" role="img" aria-label="项目趋势图"><path d="M8 78L52 58L96 64L140 32L184 42L232 14" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 80H232" fill="none" stroke="currentColor" strokeWidth="1" opacity=".24" /></svg><span data-typography-role="caption-l">本周完成度 84%</span></figure>; }
export function Calendar() {
  const [selected, setSelected] = React.useState("7");
  return <section className="tui-component tui-calendar" {...contract("calendar", "Calendar/Default")}><header><strong data-typography-role="title-s">2026 年 08 月</strong><button className="tui-icon-button" type="button" aria-label="上个月">‹</button><button className="tui-icon-button" type="button" aria-label="下个月">›</button></header><div className="tui-calendar__week" data-typography-role="caption-l">{calendarWeekdays.map((day) => <span key={day} data-typography-role="caption-l">{day}</span>)}</div><div className="tui-calendar__days" role="grid">{calendarDays.map((day, index) => <button type="button" role="gridcell" key={`${day}-${index}`} className={day === selected && index === 12 ? "is-selected" : ""} onClick={() => setSelected(day)}>{day}</button>)}</div></section>;
}

function Picker({ id, logicalName, label, value, iconName, children }) {
  const [open, setOpen] = React.useState(false);
  return <div className="tui-component tui-picker" {...contract(id, logicalName, "default", open ? "open" : "default")}><label data-typography-role="body-m">{label}</label><button className="tui-picker__trigger" type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((v) => !v)}><span data-slot="value" data-typography-role="body-l">{value}</span><Icon name={iconName} size={20} /></button><div className="tui-picker__panel" role="dialog" hidden={!open}>{children}</div></div>;
}
export function DatePicker() { const [value, setValue] = React.useState("2026-08-07"); return <Picker id="date-picker" logicalName="Date Picker/Default" label="日期" value={value} iconName="field/calendar"><div className="tui-picker__calendar" data-typography-role="caption-l">{calendarWeekdays.map((day) => <span key={`week-${day}`} data-typography-role="caption-l">{day}</span>)}</div><div className="tui-picker__calendar" role="grid">{calendarDays.map((day, index) => <button key={`${day}-${index}`} type="button" role="gridcell" className={day === "7" && index === 12 ? "is-selected" : ""} onClick={() => setValue(`2026-08-${day.padStart(2, "0")}`)} data-typography-role="body-l">{day}</button>)}</div><footer><button type="button" data-typography-role="body-l" onClick={() => setValue("")}>清除</button><button type="button" data-typography-role="body-l" onClick={() => setValue("2026-08-07")}>今天</button></footer></Picker>; }
export function TimePicker() { const [value, setValue] = React.useState("09:30"); return <Picker id="time-picker" logicalName="Time Picker/Default" label="时间" value={value} iconName="field/clock"><div className="tui-picker__columns"><div><span data-typography-role="caption-l">时</span>{["08", "09", "10"].map((d) => <button key={d} type="button" className={d === "09" ? "is-selected" : ""} onClick={() => setValue(`${d}:${value.split(":")[1] ?? "30"}`)}>{d}</button>)}</div><b>:</b><div><span data-typography-role="caption-l">分</span>{["25", "30", "35"].map((d) => <button key={d} type="button" className={d === "30" ? "is-selected" : ""} onClick={() => setValue(`${value.split(":")[0] ?? "09"}:${d}`)}>{d}</button>)}</div></div><footer><button type="button" data-typography-role="body-l" onClick={() => setValue("")}>清除</button><button type="button" data-typography-role="body-l">确定</button></footer></Picker>; }

export function Attachment({ onDownload }) { return <article className="tui-component tui-attachment" {...contract("attachment", "Attachment/Default")}><span className="tui-attachment__type" data-typography-role="caption-l">PDF</span><div><strong data-typography-role="subtitle-s">项目说明.pdf</strong><small data-typography-role="body-s">2.4 MB · 已上传</small></div><button className="tui-icon-button tui-attachment__download" type="button" aria-label="下载" onClick={onDownload}><Icon name="action/download" size={20} /></button></article>; }
export function Carousel() { const [slide, setSlide] = React.useState(0); return <section className="tui-component tui-carousel" {...contract("carousel", "Carousel/Default")} aria-roledescription="carousel"><header><strong data-typography-role="title-s">项目概览</strong><span className="tui-carousel__count" data-typography-role="caption-l">{slide + 1} / 3</span></header><div className="tui-carousel__slide" data-typography-role="body-l">{["HarmonyOS PC 组件规范", "项目协作动态", "设计 Token 资产"][slide]}</div><footer><button className="tui-icon-button" type="button" aria-label="上一项" onClick={() => setSlide((slide + 2) % 3)}>‹</button><button className="tui-icon-button" type="button" aria-label="下一项" onClick={() => setSlide((slide + 1) % 3)}>›</button></footer></section>; }
