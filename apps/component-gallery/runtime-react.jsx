import React from "react";
import { createRoot } from "react-dom/client";
import { Button, Input, Search, Sidebar, ListCard, Titlebar, Textarea, Field, Select, Combobox, NativeSelect, Checkbox, RadioGroup, Switch, Tabs, Accordion, Collapsible, Avatar, Badge, Card, Item, Table, DataTable, Pagination, Breadcrumb, Progress, Empty, Separator, Label, Alert, Tooltip, Toast, Icon } from "../../packages/components-react/src/index.jsx?rev=20260812-1";
import { AlertDialog, Attachment, Calendar, Carousel, Chart, ContextMenu, DatePicker, Dialog, DropdownMenu, HoverCard, InputOtp, Kbd, Menubar, NavigationMenu, Popover, Slider, SemiModal, TimePicker } from "../../packages/components-react/src/advanced.jsx?rev=20260812-1";
import * as Generated from "../../packages/components-react/src/generated/index.jsx?rev=20260810-1";
import { cardClass, cardDescription, comparisonMetaFor, componentTitle, coreIds, feedbackSpecimensFor, runtimeCategories, runtimeComponents, specimensFor } from "./runtime-catalog.js";
import "./framework-runtime.css";

const h = React.createElement;
const pascal = (value) => value.split(/[-_]/g).map((part) => part[0].toUpperCase() + part.slice(1)).join("");

function InteractiveButtonVariant({ mode, variant, label, setStatus }) {
  const [open, setOpen] = React.useState(false);
  if (mode === "selection-dropdown") return h("div", { className: "tui-button-dropdown" }, [
    h(Button, { label, variant, mode, menuOpen: open, onClick: () => setOpen((value) => !value), key: "trigger" }),
    h("div", { className: "tui-button-dropdown__menu", role: "menu", hidden: !open, key: "menu" }, ["列表视图", "网格视图", "紧凑视图"].map((item) => h("button", { type: "button", role: "menuitem", className: "tui-button-dropdown__item", key: item, onClick: () => { setOpen(false); setStatus(`已选择 ${item}`); } }, item)))
  ]);
  if (mode === "split-dropdown") return h("div", { className: "tui-split-button" }, [
    h("div", { className: "tui-split-button__control", key: "control" }, [
      h(Button, { label, variant: "ghost", mode: "split-dropdown", icon: "action/download", onClick: () => setStatus("Split Dropdown · 主操作"), key: "primary" }),
      h("button", { type: "button", className: "tui-component tui-button tui-split-button__trigger", "aria-label": "展开更多操作", "aria-haspopup": "menu", "aria-expanded": open, onClick: () => setOpen((value) => !value), key: "trigger" }, h(Icon, { name: "navigation/chevron-down" }))
    ]),
    h("div", { className: "tui-button-dropdown__menu", role: "menu", hidden: !open, key: "menu" }, ["导出为 PDF", "复制分享链接", "发送到设备"].map((item) => h("button", { type: "button", role: "menuitem", className: "tui-button-dropdown__item", key: item, onClick: () => { setOpen(false); setStatus(`已选择 ${item}`); } }, item)))
  ]);
  return null;
}

const RuntimeStructuralButton = ({ setStatus }) => h("div", { className: "tui-runtime-structural-grid", "data-runtime-component": "button" }, [
  ["primary", "primary", "确认操作", "text"],
  ["secondary", "secondary", "次要操作", "text"],
  ["ghost", "ghost", "文本操作", "text"],
  ["danger", "danger", "删除项目", "text"],
  ["small-primary", "primary", "确认操作", "text", "small"],
  ["small-secondary", "secondary", "次要操作", "text", "small"],
  ["small-ghost", "ghost", "文本操作", "text", "small"],
  ["small-danger", "danger", "删除项目", "text", "small"],
  ["icon", "ghost", "更多操作", "icon"],
  ["icon-text-primary", "primary", "新建项目", "icon-text"],
  ["icon-text-secondary", "secondary", "导出文件", "icon-text"],
  ["icon-text-ghost", "ghost", "更多设置", "icon-text"],
  ["selection-dropdown", "secondary", "列表视图", "selection-dropdown"],
  ["split-dropdown", "ghost", "导出文件", "split-dropdown"]
].map(([id, variant, label, mode, size]) => h("div", { className: "tui-runtime-structural-cell", key: id }, [
  h("span", { className: "tui-runtime-surface-label", key: "label" }, id),
  (mode === "selection-dropdown" || mode === "split-dropdown")
    ? h(InteractiveButtonVariant, { key: "button", mode, label, variant, setStatus })
    : h(Button, { key: "button", label, variant, mode, size, icon: mode === "icon-text" ? "action/add" : mode === "icon" ? "action/more" : undefined, state: "default", onClick: () => setStatus(`Button · ${id} · 已触发`) })
])));

const RuntimeTitlebarGallery = ({ setStatus }) => h("div", { className: "tui-runtime-titlebar-gallery", "data-runtime-component": "titlebar" }, [
  ["small", "S · 40px"],
  ["medium", "M · 56px"],
  ["large", "L · 64px"],
  ["xlarge", "XL · 72px"]
].map(([size, label]) => h("div", { className: "tui-runtime-titlebar-row", key: size }, [
  h("span", { className: "tui-runtime-surface-label", key: "label" }, label),
  h(Titlebar, { key: "normal", label: "项目空间", size, state: "default", mainDetailActions: size === "large" ? [{ id: "save", label: "保存", icon: "action/save" }, { id: "expand", label: "展开", icon: "window/maximize" }, { id: "more", label: "更多", icon: "action/more" }] : [], onMainDetailAction: (action) => setStatus(`Titlebar · Main Detail · ${action}`), onAction: (action) => setStatus(`Titlebar · ${size} · ${action}`) }),
  h(Titlebar, { key: "unfocus", label: "项目空间", size, state: "unfocus", onAction: (action) => setStatus(`Titlebar · ${size} · ${action}`) })
])));

function RuntimeSemiModal({ setStatus }) {
  const [size, setSize] = React.useState("m");
  const [surface, setSurface] = React.useState("white");
  const [mode, setMode] = React.useState("non-modal");
  const select = (label, value, onChange, options) => h("label", { "data-typography-role": "body-m", key: label }, [label, h("select", { value, onChange: (event) => onChange(event.target.value), key: "select" }, options.map(([id, text]) => h("option", { value: id, key: id }, text)))]);
  return h("div", { className: "tui-overlay-example" }, [
    h("div", { className: "tui-specimen-controls", key: "controls" }, [
      select("尺寸", size, setSize, [["s", "S · 480"], ["m", "M · 640"], ["l", "L · 800"]]),
      select("背景", surface, setSurface, [["white", "White"], ["gray", "Gray"]]),
      select("模式", mode, setMode, [["non-modal", "Non-modal"], ["modal", "Modal"]])
    ]),
    h(SemiModal, { key: `${size}-${surface}-${mode}`, size, surface, mode, onConfirm: () => setStatus("Semi-modal · 已保存"), onCancel: () => setStatus("Semi-modal · 已取消"), onClose: () => setStatus("Semi-modal · 已关闭") })
  ]);
}

const runtimeCore = (id, setStatus, component) => {
  if (id === "button") return h(RuntimeStructuralButton, { setStatus });
  if (id === "input") return h("div", { className: "tui-runtime-surface-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色输入面"), h(Input, { key: "input", placeholder: "项目名称", surface: "white" })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色输入面"), h(Input, { key: "input", placeholder: "项目名称", surface: "gray" })])
  ]);
  if (id === "search") return h("div", { className: "tui-runtime-surface-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色搜索面"), h(Search, { key: "search", placeholder: "搜索项目", surface: "white" })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色搜索面"), h(Search, { key: "search", placeholder: "搜索项目", surface: "gray" })])
  ]);
  if (id === "sidebar") return h(Sidebar, { items: [
    { id: "projects", label: "项目", icon: "navigation/grid", count: 24, state: "selected" },
    { id: "recent", label: "最近访问", icon: "navigation/recent" },
    { id: "shared", label: "与我共享", icon: "action/more" }
  ], onSelect: (selected) => setStatus(`Sidebar · ${selected}`) });
  if (id === "list-card") return h("div", { className: "tui-list-card-group", role: "list" }, [
    h(ListCard, { key: "one", title: "项目设置", lines: 1, trailing: "text-arrow", trailingText: "详情", onClick: () => setStatus("List Item · 项目设置") }),
    h(ListCard, { key: "two", title: "成员权限", description: "管理角色和访问范围", lines: 2, trailing: "icon", onClick: () => setStatus("List Item · 成员权限") }),
    h(ListCard, { key: "three", title: "通知方式", description: "邮件通知", supporting: "已同步到云端", lines: 3, trailing: "radio", onClick: () => setStatus("List Item · 通知方式") }),
    h(ListCard, { key: "switch", title: "自动同步", lines: 1, trailing: "switch", onClick: () => setStatus("List Item · 自动同步") }),
    h(ListCard, { key: "checkbox", title: "项目归档", lines: 1, trailing: "checkbox", onClick: () => setStatus("List Item · 项目归档") }),
    h(ListCard, { key: "event", title: "更新动态", lines: 1, trailing: "notification-arrow", onClick: () => setStatus("List Item · 更新动态") })
  ]);
  if (id === "titlebar") return h(RuntimeTitlebarGallery, { setStatus });
  if (id === "textarea") return h("div", { className: "tui-runtime-surface-pair tui-runtime-textarea-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色输入面"), h(Textarea, { key: "textarea", label: "项目说明", defaultValue: "统一 HarmonyOS PC 客户端中的布局、组件与交互规则。", help: "支持多行输入，最多 500 字", surface: "white", onChange: () => setStatus("Textarea · 已输入") })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色输入面"), h(Textarea, { key: "textarea", label: "项目说明", defaultValue: "统一 HarmonyOS PC 客户端中的布局、组件与交互规则。", help: "支持多行输入，最多 500 字", surface: "gray", onChange: () => setStatus("Textarea · 已输入") })])
  ]);
  if (id === "field") return h(Field, { label: "项目名称", defaultValue: "客户端设计系统", help: "这是一个必填字段", onChange: () => setStatus("Field · 已输入") });
  if (id === "select") return h("div", { className: "tui-runtime-surface-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色选择面"), h(Select, { key: "select", label: "状态", surface: "white", onChange: (value) => setStatus(`Select · ${value}`) })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { className: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色选择面"), h(Select, { key: "select", label: "状态", surface: "gray", onChange: (value) => setStatus(`Select · ${value}`) })])
  ]);
  if (id === "combobox") return h(Combobox, { label: "负责人", options: ["选择成员", "林晓", "赵博海"], onChange: (value) => setStatus(`Combobox · ${value}`) });
  if (id === "native-select") return h(NativeSelect, { label: "视图", onChange: (event) => setStatus(`Native Select · ${event.target?.value ?? event}`) });
  if (id === "checkbox") return h(Checkbox, { onChange: (event) => setStatus(`Checkbox · ${event.target.checked ? "选中" : "取消"}`) });
  if (id === "radio-group") return h(RadioGroup, { onChange: (value) => setStatus(`Radio Group · ${value}`) });
  if (id === "switch") return h(Switch, { onChange: (event) => setStatus(`Switch · ${event.target.checked ? "开启" : "关闭"}`) });
  if (id === "tabs") return h(Tabs, { onChange: (value) => setStatus(`Tabs · ${value}`) });
  if (id === "accordion") return h(Accordion, { onOpenChange: (open) => setStatus(`Accordion · ${open ? "展开" : "收起"}`) });
  if (id === "collapsible") return h(Collapsible, { onOpenChange: (open) => setStatus(`Collapsible · ${open ? "展开" : "收起"}`) });
  if (id === "avatar") return h("div", { className: "tui-runtime-avatar-pair" }, [
    h("div", { key: "32" }, [h("span", { className: "tui-runtime-surface-label" }, "32 × 32"), h(Avatar, { initials: "H", name: "HarmonyOS 32", size: 32 })]),
    h("div", { key: "40" }, [h("span", { className: "tui-runtime-surface-label" }, "40 × 40"), h(Avatar, { initials: "H", name: "HarmonyOS 40", size: 40 })])
  ]);
  if (id === "badge") return h("div", { className: "tui-badge-group", "aria-label": "Badge 颜色示例" }, [
    h(Badge, { key: "info", label: "进行中", tone: "info" }),
    h(Badge, { key: "success", label: "已完成", tone: "success" }),
    h(Badge, { key: "warning", label: "待处理", tone: "warning" }),
    h(Badge, { key: "danger", label: "错误", tone: "danger" }),
    h(Badge, { key: "neutral", label: "未开始", tone: "neutral" })
  ]);
  if (id === "card") return h(Card, { title: "HarmonyOS 组件规范", description: "统一客户端中的布局、组件与交互规则。" });
  if (id === "item") return h("div", { className: "tui-item-group", role: "list" }, [
    h(Item, { key: "one", title: "项目设置", lines: 1, trailing: "text-arrow", trailingText: "详情", onClick: () => setStatus("Item · 项目设置") }),
    h(Item, { key: "two", title: "成员权限", description: "管理角色和访问范围", lines: 2, trailing: "icon", onClick: () => setStatus("Item · 成员权限") }),
    h(Item, { key: "three", title: "通知方式", description: "邮件通知", supporting: "已同步到云端", lines: 3, trailing: "radio", onClick: () => setStatus("Item · 通知方式") }),
    h(Item, { key: "switch", title: "自动同步", lines: 1, trailing: "switch", onClick: () => setStatus("Item · 自动同步") }),
    h(Item, { key: "checkbox", title: "项目归档", lines: 1, trailing: "checkbox", onClick: () => setStatus("Item · 项目归档") }),
    h(Item, { key: "event", title: "更新动态", lines: 1, trailing: "notification-arrow", onClick: () => setStatus("Item · 更新动态") })
  ]);
  if (id === "table") return h(Table, { title: "项目列表" });
  if (id === "data-table") return h(DataTable, { title: "数据列表" });
  if (id === "pagination") return h(Pagination, { onChange: (page) => setStatus(`Pagination · 第 ${page} 页`) });
  if (id === "breadcrumb") return h(Breadcrumb, { onNavigate: (item) => setStatus(`Breadcrumb · ${item}`) });
  if (id === "progress") return h(Progress, { value: 68 });
  if (id === "empty") return h(Empty, { onCreate: () => setStatus("Empty · 新建项目") });
  if (id === "separator") return h(Separator);
  if (id === "label") return h(Label, { children: "项目名称", htmlFor: "runtime-project-name" });
  if (id === "alert") return h("div", { className: "tui-feedback-specimens", "data-runtime-component": "alert" }, feedbackSpecimensFor(component).map((specimen) => h("div", { className: "tui-feedback-specimen", "data-specimen": specimen.id, key: specimen.id }, [h("span", { className: "tui-runtime-surface-label" }, specimen.label), h(Alert, { tone: specimen.variant, message: specimen.message, action: specimen.action, onAction: () => setStatus(`Alert · ${specimen.variant}`) })])));
  if (id === "tooltip") return h(Tooltip);
  if (id === "toast") return h(Toast);
  if (id === "dialog") return h("div", { className: "tui-overlay-specimens" }, [h(Dialog, { key: "single", actionLayout: "single", onConfirm: () => setStatus("Dialog · 已确认") }), h(Dialog, { key: "double", actionLayout: "double", onConfirm: () => setStatus("Dialog · 已确认"), onCancel: () => setStatus("Dialog · 已取消") })]);
  if (id === "alert-dialog") return h(AlertDialog, { onConfirm: () => setStatus("Alert Dialog · 已删除"), onCancel: () => setStatus("Alert Dialog · 已取消") });
  if (id === "semi-modal") return h(RuntimeSemiModal, { setStatus });
  if (id === "navigation-menu") return h(NavigationMenu);
  if (id === "menubar") return h(Menubar);
  if (id === "context-menu") return h(ContextMenu);
  if (id === "dropdown-menu") return h(DropdownMenu);
  if (id === "popover") return h(Popover);
  if (id === "hover-card") return h(HoverCard);
  if (id === "slider") return h(Slider, { onChange: (value) => setStatus(`Slider · ${value}`) });
  if (id === "input-otp") return h(InputOtp, { onComplete: () => setStatus("Input OTP · 已完成") });
  if (id === "kbd") return h(Kbd);
  if (id === "chart") return h(Chart);
  if (id === "calendar") return h(Calendar);
  if (id === "date-picker") return h(DatePicker);
  if (id === "time-picker") return h(TimePicker);
  if (id === "attachment") return h(Attachment, { onDownload: () => setStatus("Attachment · 已下载") });
  if (id === "carousel") return h(Carousel);
  return null;
};

function RuntimeCard({ component, setStatus }) {
  const Component = Generated[pascal(component.id)];
  const comparison = comparisonMetaFor(component);
  const preview = coreIds.has(component.id)
    ? runtimeCore(component.id, setStatus, component)
    : (Component ? h(Component, { state: "default", fixtureId: component.fixtureId }) : h("p", { className: "tui-runtime-framework-missing" }, `React 适配器缺失：${component.id}`));
  return h("article", {
    className: cardClass(component),
    "data-component-card": component.id,
    "data-contract-id": component.id,
    "data-category": comparison.groupId,
    "data-order": String(comparison.comparisonOrder),
    "data-registry-category": component.category,
    "data-registry-order": String(component.order),
    "data-fixture-id": component.fixtureId,
    "data-framework": "react",
    "data-readiness": component.status,
    "aria-labelledby": `runtime-react-${component.id}-title`
  }, [
    h("header", { className: "tui-runtime-card__head", key: "head" }, h("div", null, h("h3", { id: `runtime-react-${component.id}-title` }, componentTitle(component)))),
    h("div", { className: "tui-runtime-card__preview", key: "preview", "data-fixture-id": component.fixtureId }, preview)
  ]);
}

function RuntimeApp({ onStatus }) {
  const [status, setStatus] = React.useState("React 运行时已加载");
  const updateStatus = (message) => { setStatus(message); onStatus(message); };
  return h("div", { className: "tui-runtime-directory-grid", "data-runtime-framework": "react" }, [
    ...runtimeCategories.map((category) => h("section", { className: "tui-runtime-category", key: category.id, "data-runtime-category": category.id }, [
      h("h4", { className: "tui-runtime-category__title", key: "title" }, category.label),
      h("div", { className: "tui-runtime-category__grid", key: "grid" }, category.components.map((component) => h(RuntimeCard, { key: component.id, component, setStatus: updateStatus })))
    ])),
    h("p", { className: "status", "aria-live": "polite", key: "status" }, status)
  ]);
}

export function mountReactRuntime(container, { onStatus = () => {} } = {}) {
  container.dataset.framework = "react";
  const root = createRoot(container);
  root.render(h(RuntimeApp, { onStatus }));
  return () => root.unmount();
}
