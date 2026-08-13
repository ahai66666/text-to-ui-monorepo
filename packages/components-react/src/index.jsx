import React from "react";
import "./styles.css";
import { Icon, contract } from "./shared.jsx";

const buttonLogicalName = ({ variant, mode }) => {
  if (mode === "icon-text") return "Button/Icon Text/Default";
  if (mode === "icon") return "Button/Icon/Default";
  if (mode === "selection-dropdown") return "Button/Selection Dropdown/Default";
  if (mode === "split-dropdown") return "Button/Split Dropdown/Default";
  return `Button/${variant[0].toUpperCase()}${variant.slice(1)}/Default`;
};

export function Button({ label, children, variant = "primary", size = "standard", mode = "text", state = "default", disabled = false, icon, onClick, menuOpen = false, className = "", ...props }) {
  const resolvedState = disabled ? "disabled" : state;
  const logicalName = buttonLogicalName({ variant, mode });
  const modeClass = mode === "icon" ? " tui-button--icon" : mode === "selection-dropdown" ? " tui-button--selection" : "";
  const labelContent = children ?? label;
  return <button type="button" className={`tui-component tui-button${modeClass}${className ? ` ${className}` : ""}`} {...props} {...contract("button", logicalName, variant, resolvedState, { "data-mode": mode, "data-size": size, "aria-expanded": mode === "selection-dropdown" ? menuOpen : undefined })} disabled={disabled} onClick={onClick}>
    {icon && <span data-slot="icon"><Icon name={icon} /></span>}
    {mode !== "icon" && <span data-slot="label" data-typography-role={size === "small" ? "body-m" : "body-l"}>{labelContent}</span>}
    {mode === "selection-dropdown" && <span data-slot="trigger"><Icon name="navigation/chevron-down" size={16} /></span>}
  </button>;
}

export function Input({ value, defaultValue, placeholder = "请输入内容", disabled = false, error = false, state, surface = "white", onChange, ...props }) {
  const [focused, setFocused] = React.useState(false);
  const resolvedState = disabled ? "disabled" : state ?? (error ? "error" : focused ? "focus" : "default");
  return <label className="tui-component tui-input" data-surface={surface} {...contract("input", "Input/White Surface/Default", "default", resolvedState)}>
    <input {...props} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} onChange={onChange} onFocus={(event) => { setFocused(true); props.onFocus?.(event); }} onBlur={(event) => { setFocused(false); props.onBlur?.(event); }} data-slot="value" data-typography-role="body-l" aria-invalid={error || state === "error" ? "true" : undefined} />
  </label>;
}

export function Search({ value, defaultValue, placeholder = "搜索", disabled = false, state = "default", surface = "white", advancedSearch = false, advancedSearchLabel = "高级搜索", onAdvancedSearch, onChange, onClear, ...props }) {
  const hasValue = value !== undefined ? Boolean(value) : Boolean(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const resolvedState = disabled ? "disabled" : state === "default" && focused ? "focus" : state;
  return <label className="tui-component tui-search" data-surface={surface} {...contract("search", "Search/White Surface/Default", advancedSearch ? "advanced-search" : hasValue ? "with-value" : "default", resolvedState)}>
    <span data-slot="leading"><Icon name="field/search" /></span>
    <input {...props} type="search" value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} onChange={onChange} onFocus={(event) => { setFocused(true); props.onFocus?.(event); }} onBlur={(event) => { setFocused(false); props.onBlur?.(event); }} data-slot="value" data-typography-role="body-l" />
    {hasValue && <button className="tui-icon-button" type="button" aria-label="清除" onClick={onClear} data-slot="clear"><Icon name="action/close" /></button>}
    {advancedSearch && <Button className="tui-search__advanced" label={advancedSearchLabel} variant="ghost" size="small" mode="text" type="button" aria-label={advancedSearchLabel} aria-haspopup="dialog" disabled={disabled} onClick={onAdvancedSearch} data-slot="advanced-search" data-typography-role="body-m" />}
  </label>;
}

export function Sidebar({ items = [], selected, onSelect, children, ...props }) {
  return <nav className="tui-component tui-sidebar" {...contract("sidebar", "Sidebar Item/Default", "default", "default")} aria-label="主导航" {...props}>
    {children ?? items.map((item) => <button className="tui-sidebar-item" key={item.id ?? item.label} type="button" data-state={item.id === selected ? "selected" : item.state ?? "default"} disabled={item.disabled || item.state === "disabled"} onClick={() => onSelect?.(item.id)}>
      <span data-slot="leading"><Icon name={item.iconAlias ?? item.icon ?? "navigation/grid"} /></span><span data-slot="label">{item.label}</span>{item.count !== undefined && <span className="tui-sidebar-item__count" data-slot="trailing">{item.count}</span>}
    </button>)}
  </nav>;
}

export function ListCard({ title = "项目设置", description = "", supporting = "", lines = description ? supporting ? 3 : 2 : 1, trailing = "text-arrow", trailingText = "详情", selected = false, unread = false, state, leading = "navigation/grid", children, onClick, ...props }) {
  const resolvedState = state ?? (selected ? "selected" : "default");
  const trailingNode = trailing === "icon"
    ? <span className="tui-item__trailing tui-item__trailing--icon" data-slot="trailing"><Icon name="action/more" size={20} /></span>
    : trailing === "radio"
      ? <label className="tui-item__trailing tui-choice" data-slot="trailing" aria-label="已选中"><input type="radio" defaultChecked /><span className="tui-radio__indicator" aria-hidden="true" /></label>
      : trailing === "checkbox"
        ? <label className="tui-item__trailing tui-choice tui-checkbox" data-slot="trailing" aria-label="已选中"><input type="checkbox" defaultChecked /><span className="tui-checkbox__indicator" aria-hidden="true"><Icon name="choice/check" size={16} /></span></label>
        : trailing === "switch"
          ? <label className="tui-item__trailing tui-choice tui-switch" data-slot="trailing" aria-label="已开启"><input type="checkbox" role="switch" defaultChecked /><span className="tui-switch__track" aria-hidden="true" /></label>
          : trailing === "notification-arrow"
            ? <span className="tui-item__trailing tui-item__trailing--notification-arrow" data-slot="trailing"><span className="tui-item__notification-dot" aria-label="有新事件" /><Icon name="navigation/chevron-right" size={20} /></span>
            : <span className="tui-item__trailing tui-item__trailing--text-arrow" data-slot="trailing" data-typography-role="body-m"><span>{trailingText}</span><Icon name="navigation/chevron-right" size={20} /></span>;
  return <div className="tui-component tui-list-card" role="button" tabIndex={resolvedState === "disabled" ? -1 : 0} {...contract("list-card", "List Item/White Surface/Default", `line-${lines}`, resolvedState, { "data-lines": lines })} aria-pressed={selected || resolvedState === "selected"} aria-disabled={resolvedState === "disabled" || undefined} onClick={resolvedState === "disabled" ? undefined : onClick} onKeyDown={(event) => { if (resolvedState !== "disabled" && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onClick?.(event); } }} {...props}>
    {children ?? <><span className="tui-item__leading" data-slot="leading"><Icon name={leading} size={24} /></span><span className="tui-item__content"><span data-slot="title" data-typography-role="body-l">{title}</span>{description && <span data-slot="description" data-typography-role="body-m">{description}</span>}{supporting && <span data-slot="supporting" data-typography-role="caption-l">{supporting}</span>}</span>{trailingNode}</>}
  </div>;
}

export function Titlebar({ label = "项目空间", paneTitle = "项目内容", size = "large", state = "default", disabled = false, layout = "standalone", paneRole = "global", mainDetailActions = [], onMainDetailAction, onAction, children, ...props }) {
  const actions = [
    ["minimize", "最小化"],
    ["maximize", "最大化"],
    ["close", "关闭"]
  ];
  const controlIconSize = size === "small" ? 16 : 24;
  const isFinalPane = paneRole === "final-pane";
  return <header className="tui-component tui-titlebar" {...contract("titlebar", "Titlebar/Default", size, disabled ? "disabled" : state, { "data-size": size, "data-layout": layout, "data-pane-role": paneRole })} {...props}>
    {(paneRole === "global" || paneRole === "primary-navigation") && <span className="tui-titlebar__brand" data-slot="leading"><Icon name="navigation/grid" size={24} /><span data-slot="label" data-typography-role="subtitle-m">{label}</span></span>}
    {children ?? <>{layout === "two-column" && isFinalPane && <strong className="tui-titlebar__pane-title" data-slot="main-content-title" data-action-scope="main-content-pane-global" data-typography-role="title-s">{paneTitle}</strong>}{layout === "three-column" && isFinalPane && mainDetailActions.length > 0 && <div className="tui-titlebar__pane-actions" data-slot="main-detail-actions" data-action-scope="main-detail-pane-global" aria-label="Main Detail 栏级操作">{mainDetailActions.map((action) => <button className={`tui-icon-button tui-titlebar__pane-action${action.showLabel ? " tui-titlebar__pane-action--text" : ""}`} type="button" data-slot="main-detail-action" data-action={action.id} aria-label={action.label} disabled={disabled || action.disabled} key={action.id} onClick={() => onMainDetailAction?.(action.id)}><Icon name={action.icon ?? "action/more"} size={20} />{action.showLabel && <span data-slot="label" data-typography-role="body-m">{action.label}</span>}</button>)}</div>}</>}
    {(paneRole === "global" || isFinalPane) && <div className="tui-titlebar__actions" data-slot="actions">{actions.map(([action, text]) => <button className="tui-icon-button tui-titlebar__action" type="button" data-slot="titlebar-action" data-action={action} aria-label={text} disabled={disabled} key={action} onClick={() => onAction?.(action)}><Icon name={`window/${action}`} size={controlIconSize} /></button>)}</div>}
  </header>;
}

export function Textarea({ label = "项目说明", value, defaultValue, placeholder = "请输入内容", help = "", disabled = false, error = false, state = "default", surface = "white", onChange, ...props }) {
  const [focused, setFocused] = React.useState(false);
  const resolvedState = disabled ? "disabled" : state !== "default" ? state : error ? "error" : focused ? "focus" : "default";
  return <label className="tui-component tui-textarea" data-surface={surface} {...contract("textarea", "Textarea/Default", "default", resolvedState)}>
    <span data-slot="label" data-typography-role="body-m">{label}</span>
    <textarea {...props} data-slot="value" data-typography-role="body-l" value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} aria-invalid={error || state === "error" ? "true" : undefined} onChange={onChange} onFocus={(event) => { setFocused(true); props.onFocus?.(event); }} onBlur={(event) => { setFocused(false); props.onBlur?.(event); }} />
    {help && <span data-slot="help" data-typography-role="caption-l">{help}</span>}
  </label>;
}

export function Field({ label = "项目名称", value, defaultValue, placeholder = "请输入内容", help = "", disabled = false, error = false, state = "default", surface = "white", onChange, ...props }) {
  const [focused, setFocused] = React.useState(false);
  const resolvedState = disabled ? "disabled" : state !== "default" ? state : error ? "error" : focused ? "focus" : "default";
  return <label className="tui-component tui-field" data-surface={surface} {...contract("field", "Field/Default", "default", resolvedState)}>
    <span data-slot="label" data-typography-role="body-m">{label}</span>
    <span className="tui-field__control"><input {...props} data-slot="value" data-typography-role="body-l" value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} aria-invalid={error || state === "error" ? "true" : undefined} onChange={onChange} onFocus={(event) => { setFocused(true); props.onFocus?.(event); }} onBlur={(event) => { setFocused(false); props.onBlur?.(event); }} /></span>
    {help && <span data-slot="help" data-typography-role="caption-l">{help}</span>}
  </label>;
}

const defaultSelectOptions = ["进行中", "已完成", "已归档"];
function SelectBase({ id, label = "状态", value, defaultValue = defaultSelectOptions[0], options = defaultSelectOptions, disabled = false, state = "default", surface = "white", onChange, combobox = false, ...props }) {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(value ?? defaultValue);
  const triggerRef = React.useRef(null);
  const controlled = value !== undefined;
  const selected = controlled ? value : current;
  const choose = (next) => { if (!controlled) setCurrent(next); onChange?.(next); setOpen(false); triggerRef.current?.focus(); };
  const onKeyDown = (event) => {
    if (disabled) return;
    const index = Math.max(0, options.indexOf(selected));
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); return; }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen((currentOpen) => !currentOpen); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); const next = options[(index + (event.key === "ArrowDown" ? 1 : options.length - 1)) % options.length]; if (open) choose(next); else setOpen(true); }
  };
  const resolvedState = disabled ? "disabled" : state;
  return <div className="tui-component tui-select" data-surface={surface} {...contract(id, id === "combobox" ? "Combobox/Default" : "Select/Default", "default", resolvedState)}>
    <span data-slot="label" data-typography-role="body-m">{label}</span>
    <button {...props} ref={triggerRef} className="tui-select__trigger" type="button" role={combobox ? "combobox" : "button"} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-options`} aria-disabled={disabled || undefined} disabled={disabled} onClick={() => setOpen((currentOpen) => !currentOpen)} onKeyDown={onKeyDown}>
      <span data-slot="value" data-typography-role="body-m">{selected}</span><Icon name="navigation/chevron-down" size={16} />
    </button>
    <div className="tui-select__menu" id={`${id}-options`} role="listbox" hidden={!open} aria-label={label}>{options.map((option) => <button key={option} type="button" role="option" aria-selected={option === selected} data-typography-role="body-l" onClick={() => choose(option)}>{option}</button>)}</div>
  </div>;
}

export function Select(props) { return <SelectBase {...props} id="select" />; }
export function Combobox(props) { return <SelectBase {...props} id="combobox" combobox />; }

export function NativeSelect({ label = "视图", value, defaultValue = "列表视图", options = ["列表视图", "网格视图", "紧凑视图"], disabled = false, state = "default", surface = "white", onChange, ...props }) {
  return <label className="tui-component tui-native-select" data-surface={surface} {...contract("native-select", "Native Select/Default", "default", disabled ? "disabled" : state)}>
    <span data-slot="label" data-typography-role="body-m">{label}</span>
    <span className="tui-native-select__control"><select {...props} data-slot="value" data-typography-role="body-l" value={value} defaultValue={value === undefined ? defaultValue : undefined} disabled={disabled} onChange={onChange}>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select><Icon name="navigation/chevron-down" size={16} /></span>
  </label>;
}

export function Checkbox({ checked, defaultChecked = true, label = "同步到云端", description = "保存后自动同步", disabled = false, onChange, ...props }) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = checked === undefined ? internalChecked : checked;
  return <label className="tui-component tui-choice tui-checkbox" data-surface="white" {...contract("checkbox", "Checkbox/Default", "default", disabled ? "disabled" : isChecked ? "selected" : "default")}><input {...props} type="checkbox" checked={isChecked} disabled={disabled} onChange={(event) => { if (checked === undefined) setInternalChecked(event.target.checked); onChange?.(event); }} /><span className="tui-checkbox__indicator" aria-hidden="true"><Icon name="choice/check" size={16} /></span><span data-slot="label" data-typography-role="body-m">{label}</span><span data-slot="description" data-typography-role="body-m">{description}</span></label>;
}

export function RadioGroup({ value, defaultValue = "邮件", options = ["邮件", "站内消息"], label = "通知方式", onChange, ...props }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selected = value === undefined ? internalValue : value;
  return <fieldset className="tui-component tui-choice tui-radio-group" {...contract("radio-group", "Radio Group/Default", "default", "default")} {...props}><legend data-slot="label" data-typography-role="body-m">{label}</legend>{options.map((option) => <label key={option}><input type="radio" name={props.name ?? "radio-group"} value={option} checked={selected === option} onChange={(event) => { if (value === undefined) setInternalValue(event.target.value); onChange?.(event.target.value); }} /><span className="tui-radio__indicator" aria-hidden="true" /><span data-typography-role="body-m">{option}</span></label>)}</fieldset>;
}

export function Switch({ checked, defaultChecked = true, label = "自动同步", description = "已开启", disabled = false, onChange, ...props }) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = checked === undefined ? internalChecked : checked;
  return <label className="tui-component tui-choice tui-switch" {...contract("switch", "Switch/Default", "default", disabled ? "disabled" : isChecked ? "selected" : "default")}><input {...props} type="checkbox" role="switch" checked={isChecked} disabled={disabled} onChange={(event) => { if (checked === undefined) setInternalChecked(event.target.checked); onChange?.(event); }} /><span className="tui-switch__track" aria-hidden="true" /><span data-slot="label" data-typography-role="body-m">{label}</span><span data-slot="description" data-typography-role="body-m">{description}</span></label>;
}

export function Tabs({ tabs = [{ id: "overview", label: "概览", content: "工作空间概览" }, { id: "projects", label: "项目", content: "项目列表" }, { id: "members", label: "成员", content: "成员列表" }], value, defaultValue = tabs[0]?.id, onChange, ...props }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selected = value === undefined ? internalValue : value;
  const choose = (next) => { if (value === undefined) setInternalValue(next); onChange?.(next); };
  const onKeyDown = (event) => { const index = Math.max(0, tabs.findIndex((tab) => tab.id === selected)); if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : tabs.length - 1; const next = tabs[(index + direction) % tabs.length]; choose(next.id); event.currentTarget.querySelector(`[data-tab="${next.id}"]`)?.focus(); } };
  return <div className="tui-component tui-tabs" {...contract("tabs", "Tabs/Default", "default", "default")} {...props}><div className="tui-tabs__list" role="tablist" aria-label="项目视图" onKeyDown={onKeyDown}>{tabs.map((tab) => <button type="button" role="tab" key={tab.id} data-tab={tab.id} aria-selected={selected === tab.id} className={selected === tab.id ? "is-selected" : ""} data-typography-role="body-m" onClick={() => choose(tab.id)}>{tab.label}</button>)}</div><div className="tui-tabs__panel" role="tabpanel" data-tab-panel={selected} data-typography-role="body-l">{tabs.find((tab) => tab.id === selected)?.content}</div></div>;
}

function Disclosure({ id, logicalName, title, detail, open, defaultOpen = false, onOpenChange, ...props }) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open === undefined ? internalOpen : open;
  const toggle = () => { const next = !isOpen; if (open === undefined) setInternalOpen(next); onOpenChange?.(next); };
  const contentId = `${id}-content`;
  const isAccordion = id === "accordion";
  const triggerContent = isAccordion
    ? <><Icon name="navigation/chevron-right" size={20} /><span data-slot="label" data-typography-role="body-l">{title}</span></>
    : <><span data-slot="label" data-typography-role="body-l">{title}</span><Icon name="navigation/chevron-down" size={20} /></>;
  return <div className="tui-component tui-disclosure" {...contract(id, `${logicalName}/Default`, "default", "default")} {...props}><button className="tui-disclosure__trigger" type="button" aria-expanded={isOpen} aria-controls={contentId} onClick={toggle}>{triggerContent}</button><div className="tui-disclosure__content" id={contentId} data-slot="content" hidden={!isOpen} data-typography-role="body-l">{detail}</div></div>;
}

export function Accordion(props) { return <Disclosure id="accordion" logicalName="Accordion" title="项目设置" detail="基础信息、成员与通知方式" {...props} />; }
export function Collapsible(props) { return <Disclosure id="collapsible" logicalName="Collapsible" title="更多信息" detail="点击展开查看详情" {...props} />; }

export function Avatar({ initials = "H", name = "HarmonyOS", size = 40, disabled = false, ...props }) {
  const resolvedSize = Number(size) === 32 ? 32 : 40;
  return <span className="tui-component tui-avatar" {...contract("avatar", `Avatar/${resolvedSize}/Fallback`, `size-${resolvedSize}`, disabled ? "disabled" : "default", { "data-size": resolvedSize })} aria-label={name} aria-disabled={disabled || undefined} data-typography-role="caption-l" {...props}>{initials}</span>;
}

export function Badge({ label = "进行中", tone = "info", disabled = false, ...props }) {
  const safeTone = ["info", "success", "warning", "danger", "neutral"].includes(tone) ? tone : "info";
  return <span className={`tui-component tui-badge tui-badge--${safeTone}`} {...contract("badge", `Badge/${safeTone[0].toUpperCase()}${safeTone.slice(1)}`, "default", disabled ? "disabled" : "default")} data-typography-role="caption-l" {...props}>{label}</span>;
}

export function Card({ title = "HarmonyOS 组件规范", description = "统一客户端中的布局、组件与交互规则。", children, ...props }) {
  return <article className="tui-component tui-card" {...contract("card", "Card/Default", "default", "default")} {...props}>
    <div className="tui-card__body"><h4 data-slot="title" data-typography-role="title-s">{title}</h4><p data-slot="description" data-typography-role="body-m">{description}</p>{children && <div data-slot="content" data-typography-role="body-l">{children}</div>}</div>
  </article>;
}

export function Item({ title = "项目设置", description = "", supporting = "", lines = description ? supporting ? 3 : 2 : 1, leadingIcon = "navigation/grid", trailing = "text-arrow", trailingText = "详情", disabled = false, onClick, ...props }) {
  const trailingNode = trailing === "icon"
    ? <span className="tui-item__trailing tui-item__trailing--icon" data-slot="trailing"><Icon name="action/more" size={20} /></span>
    : trailing === "radio"
      ? <label className="tui-item__trailing tui-choice" data-slot="trailing" aria-label="已选中"><input type="radio" defaultChecked /><span className="tui-radio__indicator" aria-hidden="true" /></label>
      : trailing === "checkbox"
        ? <label className="tui-item__trailing tui-choice tui-checkbox" data-slot="trailing" aria-label="已选中"><input type="checkbox" defaultChecked /><span className="tui-checkbox__indicator" aria-hidden="true"><Icon name="choice/check" size={16} /></span></label>
        : trailing === "switch"
          ? <label className="tui-item__trailing tui-choice tui-switch" data-slot="trailing" aria-label="已开启"><input type="checkbox" role="switch" defaultChecked /><span className="tui-switch__track" aria-hidden="true" /></label>
          : trailing === "notification-arrow"
            ? <span className="tui-item__trailing tui-item__trailing--notification-arrow" data-slot="trailing"><span className="tui-item__notification-dot" aria-label="有新事件" /><Icon name="navigation/chevron-right" size={20} /></span>
            : <span className="tui-item__trailing tui-item__trailing--text-arrow" data-slot="trailing" data-typography-role="body-m"><span>{trailingText}</span><Icon name="navigation/chevron-right" size={20} /></span>;
  return <div className="tui-component tui-item" role="button" tabIndex={disabled ? -1 : 0} {...contract("item", "Item/Default", "default", disabled ? "disabled" : "default")} data-lines={lines} aria-disabled={disabled || undefined} onClick={disabled ? undefined : onClick} onKeyDown={(event) => { if (!disabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onClick?.(event); } }} {...props}>
    <span className="tui-item__leading" data-slot="leading"><Icon name={leadingIcon} size={24} /></span><span className="tui-item__content"><span data-slot="title" data-typography-role="body-l">{title}</span>{description && <span data-slot="description" data-typography-role="body-m">{description}</span>}{supporting && <span data-slot="supporting" data-typography-role="caption-l">{supporting}</span>}</span>{trailingNode}
  </div>;
}

const defaultTableRows = [
  ["客户端设计系统", "赵博海", "进行中"],
  ["组件规范", "林晓", "已完成"]
];

export function Table({ id = "table", title = "项目列表", rows = defaultTableRows, ...props }) {
  const logicalName = id === "data-table" ? "Data Table/Default" : "Table/Default";
  return <div className="tui-component tui-table" {...contract(id, logicalName, "default", "default")} {...props}>
    <div className="tui-table__heading"><h4 data-slot="title" data-typography-role="title-s">{title}</h4><span data-slot="description" data-typography-role="caption-l">{rows.length} 个项目</span></div>
    <table><thead><tr><th scope="col" data-typography-role="body-m">名称</th><th scope="col" data-typography-role="body-m">负责人</th><th scope="col" data-typography-role="body-m">状态</th></tr></thead><tbody>{rows.map((row) => <tr key={row.join("-")}><td data-typography-role="body-l">{row[0]}</td><td data-typography-role="body-l">{row[1]}</td><td data-typography-role="body-l">{row[2] === "进行中" ? <Badge label={row[2]} tone="info" /> : row[2] === "已完成" ? <Badge label={row[2]} tone="success" /> : row[2]}</td></tr>)}</tbody></table>
  </div>;
}

export function DataTable(props) { return <Table {...props} id="data-table" />; }

export function Pagination({ page = 1, total = 3, onChange, disabled = false, ...props }) {
  const [current, setCurrent] = React.useState(page);
  const choose = (next) => { const clamped = Math.min(total, Math.max(1, next)); if (!disabled) { setCurrent(clamped); onChange?.(clamped); } };
  return <nav className="tui-component tui-pagination" {...contract("pagination", "Pagination/Default", "default", disabled ? "disabled" : "default")} aria-label="分页" {...props}>
    <button className="tui-icon-button" type="button" aria-label="上一页" disabled={disabled || current === 1} onClick={() => choose(current - 1)}><Icon name="navigation/back" size={20} /></button>
    {Array.from({ length: total }, (_, index) => index + 1).map((value) => <button type="button" key={value} aria-current={current === value ? "page" : undefined} disabled={disabled} onClick={() => choose(value)} data-typography-role="body-l">{value}</button>)}
    <button className="tui-icon-button" type="button" aria-label="下一页" disabled={disabled || current === total} onClick={() => choose(current + 1)}><Icon name="navigation/forward" size={20} /></button>
  </nav>;
}

export function Breadcrumb({ items = ["工作空间", "项目", "设置"], onNavigate, ...props }) {
  return <nav className="tui-component tui-breadcrumb" {...contract("breadcrumb", "Breadcrumb/Default", "default", "default")} aria-label="面包屑" {...props}>{items.map((item, index) => <React.Fragment key={`${item}-${index}`}>{index > 0 && <span aria-hidden="true">/</span>}{index === items.length - 1 ? <span aria-current="page" data-typography-role="subtitle-m">{item}</span> : <a href={`#${item}`} data-typography-role="body-l" onClick={(event) => { event.preventDefault(); onNavigate?.(item); }}>{item}</a>}</React.Fragment>)}</nav>;
}

export function Progress({ value = 68, label = "完成度", ...props }) {
  const clamped = Math.min(100, Math.max(0, value));
  return <div className="tui-component tui-progress" {...contract("progress", "Progress/Default", "default", "default")} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={clamped} style={{ "--progress-value": `${clamped}%` }} {...props}><span className="tui-progress__label" data-typography-role="caption-l">{label} · {clamped}%</span><div className="tui-progress__track"><span className="tui-progress__value" /></div></div>;
}

export function Empty({ title = "暂无项目", description = "创建项目后会显示在这里。", onCreate, ...props }) {
  return <section className="tui-component tui-empty" {...contract("empty", "Empty/Default", "default", "default")} aria-live="polite" {...props}><h4 data-slot="title" data-typography-role="title-s">{title}</h4><p data-slot="description" data-typography-role="body-m">{description}</p><button className="tui-button tui-empty__action" type="button" data-variant="primary" data-typography-role="body-l" onClick={onCreate}>新建项目</button></section>;
}

export function Separator({ orientation = "horizontal", ...props }) {
  return <hr className="tui-component tui-separator" {...contract("separator", "Separator/Default", "default", "default")} role="separator" aria-orientation={orientation} {...props} />;
}

export function Label({ children = "项目名称", htmlFor = "project-name", ...props }) {
  return <label className="tui-component tui-label" {...contract("label", "Label/Default", "default", "default")} htmlFor={htmlFor} data-typography-role="body-m" {...props}>{children}</label>;
}

function Feedback({ id, tone = "info", message, action, onAction, ...props }) {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;
  const iconName = id === "toast" && tone === "success" ? "action/check" : ({ info: "status/info", success: "status/success", warning: "status/warning", danger: "status/danger", neutral: "status/neutral" }[tone] ?? "status/info");
  const role = id === "alert" && (tone === "warning" || tone === "danger") ? "alert" : "status";
  const closeButton = <button className="tui-icon-button" data-slot="close" type="button" aria-label="关闭" onClick={() => setVisible(false)}><Icon name="action/close" size={20} /></button>;
  return <div className={`tui-component tui-${id} tui-${id}--${tone}`} {...contract(id, `${id[0].toUpperCase()}${id.slice(1)}/Default`, tone, "default")} role={role} {...props}><span className={`tui-${id}__icon`}><Icon name={iconName} size={20} /></span><span className={`tui-${id}__message`} data-slot="content" data-typography-role={id === "toast" ? "body-m" : "subtitle-s"}>{message}</span>{id === "alert" ? <span className="tui-alert__actions" data-slot="actions">{action && <button className="tui-button tui-button--ghost tui-alert__action" data-slot="action" type="button" data-variant="ghost" data-size="small" data-typography-role="body-m" onClick={onAction}>{action}</button>}{closeButton}</span> : closeButton}</div>;
}

export function Alert(props) { return <Feedback id="alert" tone="info" message="系统将在今晚自动完成更新。" action="查看详情" {...props} />; }
export function Tooltip({ label = "刷新列表", content = "刷新列表", ...props }) {
  return <div className="tui-component tui-tooltip" {...contract("tooltip", "Tooltip/Default", "default", "default")} {...props}><button className="tui-button tui-button--ghost" type="button" data-variant="ghost" data-typography-role="body-l">{label}</button><span className="tui-tooltip__panel" role="tooltip" data-slot="content" data-typography-role="body-l">{content}</span></div>;
}
export function Toast(props) { return <Feedback id="toast" tone="success" message="所有修改已经同步到云端。" {...props} />; }

export { Icon, contract };
export { AlertDialog, Attachment, Calendar, Carousel, Chart, ContextMenu, DatePicker, Dialog, DropdownMenu, HoverCard, InputOtp, Kbd, Menubar, NavigationMenu, Popover, Slider, SemiModal, TimePicker } from "./advanced.jsx";
export * from "./generated/index.jsx";
