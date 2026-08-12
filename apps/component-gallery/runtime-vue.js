import { createApp, h, ref } from "vue";
import { Button, Input, Search, Sidebar, ListCard, Titlebar, Textarea, Field, Select, Combobox, NativeSelect, Checkbox, RadioGroup, Switch, Tabs, Accordion, Collapsible, Avatar, Badge, Card, Item, Table, DataTable, Pagination, Breadcrumb, Progress, Empty, Separator, Label, Alert, Tooltip, Toast, Icon } from "../../packages/components-vue/src/index.js?rev=20260812-1";
import { AlertDialog, Attachment, Calendar, Carousel, Chart, ContextMenu, DatePicker, Dialog, DropdownMenu, HoverCard, InputOtp, Kbd, Menubar, NavigationMenu, Popover, Slider, SemiModal, TimePicker } from "../../packages/components-vue/src/advanced.js?rev=20260812-1";
import * as Generated from "../../packages/components-vue/src/generated/index.js?rev=20260810-1";
import { cardClass, comparisonMetaFor, componentTitle, coreIds, feedbackSpecimensFor, runtimeCategories } from "./runtime-catalog.js";
import "./framework-runtime.css";

const pascal = (value) => value.split(/[-_]/g).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
const iconNode = (name, size = 20) => h(Icon, { name, size });

const InteractiveButtonVariant = {
  props: { mode: String, variant: String, label: String, setStatus: Function },
  setup(props) {
    const open = ref(false);
    return () => {
      if (props.mode === "selection-dropdown") return h("div", { class: "tui-button-dropdown" }, [
        h(Button, { label: props.label, variant: props.variant, mode: props.mode, menuOpen: open.value, onClick: () => { open.value = !open.value; } }),
        h("div", { class: "tui-button-dropdown__menu", role: "menu", hidden: !open.value }, ["列表视图", "网格视图", "紧凑视图"].map((item) => h("button", { type: "button", role: "menuitem", class: "tui-button-dropdown__item", key: item, onClick: () => { open.value = false; props.setStatus?.(`已选择 ${item}`); } }, item)))
      ]);
      return h("div", { class: "tui-split-button" }, [
        h("div", { class: "tui-split-button__control" }, [
          h(Button, { label: props.label, variant: "ghost", mode: "split-dropdown", icon: "action/download", onClick: () => props.setStatus?.("Split Dropdown · 主操作") }),
          h("button", { type: "button", class: "tui-component tui-button tui-split-button__trigger", "aria-label": "展开更多操作", "aria-haspopup": "menu", "aria-expanded": open.value, onClick: () => { open.value = !open.value; } }, iconNode("navigation/chevron-down"))
        ]),
        h("div", { class: "tui-button-dropdown__menu", role: "menu", hidden: !open.value }, ["导出为 PDF", "复制分享链接", "发送到设备"].map((item) => h("button", { type: "button", role: "menuitem", class: "tui-button-dropdown__item", key: item, onClick: () => { open.value = false; props.setStatus?.(`已选择 ${item}`); } }, item)))
      ]);
    };
  }
};

const RuntimeStructuralButton = (props) => h("div", { class: "tui-runtime-structural-grid", "data-runtime-component": "button" }, [
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
].map(([id, variant, label, mode, size]) => h("div", { class: "tui-runtime-structural-cell", key: id }, [
  h("span", { class: "tui-runtime-surface-label", key: "label" }, id),
  (mode === "selection-dropdown" || mode === "split-dropdown")
    ? h(InteractiveButtonVariant, { key: "button", mode, variant, label, setStatus: props.setStatus })
    : h(Button, { key: "button", label, variant, mode, size, icon: mode === "icon-text" ? "action/add" : mode === "icon" ? "action/more" : undefined, state: "default", onClick: () => props.setStatus(`Button · ${id} · 已触发`) })
])));

const RuntimeTitlebarGallery = (props) => h("div", { class: "tui-runtime-titlebar-gallery", "data-runtime-component": "titlebar" }, [
  ["small", "S · 40px"],
  ["medium", "M · 56px"],
  ["large", "L · 64px"],
  ["xlarge", "XL · 72px"]
].map(([size, label]) => h("div", { class: "tui-runtime-titlebar-row", key: size }, [
  h("span", { class: "tui-runtime-surface-label", key: "label" }, label),
  h(Titlebar, { key: "normal", label: "项目空间", size, state: "default", onAction: (action) => props.setStatus?.(`Titlebar · ${size} · ${action}`) }),
  h(Titlebar, { key: "unfocus", label: "项目空间", size, state: "unfocus", onAction: (action) => props.setStatus?.(`Titlebar · ${size} · ${action}`) })
])));

const RuntimeSemiModal = {
  props: { setStatus: Function },
  setup(props) {
    const size = ref("m"); const surface = ref("white"); const mode = ref("non-modal");
    const select = (label, value, onChange, options) => h("label", { "data-typography-role": "body-m", key: label }, [label, h("select", { value: value.value, onChange: (event) => onChange(event.target.value) }, options.map(([id, text]) => h("option", { value: id, key: id }, text)))]);
    return () => h("div", { class: "tui-overlay-example" }, [
      h("div", { class: "tui-specimen-controls" }, [
        select("尺寸", size, (value) => { size.value = value; }, [["s", "S · 480"], ["m", "M · 640"], ["l", "L · 800"]]),
        select("背景", surface, (value) => { surface.value = value; }, [["white", "White"], ["gray", "Gray"]]),
        select("模式", mode, (value) => { mode.value = value; }, [["non-modal", "Non-modal"], ["modal", "Modal"]])
      ]),
      h(SemiModal, { key: `${size.value}-${surface.value}-${mode.value}`, size: size.value, surface: surface.value, mode: mode.value, onConfirm: () => props.setStatus?.("Semi-modal · 已保存"), onCancel: () => props.setStatus?.("Semi-modal · 已取消"), onClose: () => props.setStatus?.("Semi-modal · 已关闭") })
    ]);
  }
};

const runtimeCore = (id, setStatus, component) => {
  if (id === "button") return h(RuntimeStructuralButton, { setStatus });
  if (id === "input") return h("div", { class: "tui-runtime-surface-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色输入面"), h(Input, { key: "input", placeholder: "项目名称", surface: "white" })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色输入面"), h(Input, { key: "input", placeholder: "项目名称", surface: "gray" })])
  ]);
  if (id === "search") return h("div", { class: "tui-runtime-surface-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色搜索面"), h(Search, { key: "search", placeholder: "搜索项目", surface: "white" })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色搜索面"), h(Search, { key: "search", placeholder: "搜索项目", surface: "gray" })])
  ]);
  if (id === "sidebar") return h(Sidebar, { items: [
    { id: "projects", label: "项目", icon: "navigation/grid", count: 24, state: "selected" },
    { id: "recent", label: "最近访问", icon: "navigation/recent" },
    { id: "shared", label: "与我共享", icon: "action/more" }
  ], onSelect: (selected) => setStatus(`Sidebar · ${selected}`) });
  if (id === "list-card") return h("div", { class: "tui-list-card-group", role: "list" }, [
    h(ListCard, { key: "one", title: "项目设置", lines: 1, trailing: "text-arrow", trailingText: "详情", onClick: () => setStatus("List Item · 项目设置") }),
    h(ListCard, { key: "two", title: "成员权限", description: "管理角色和访问范围", lines: 2, trailing: "icon", onClick: () => setStatus("List Item · 成员权限") }),
    h(ListCard, { key: "three", title: "通知方式", description: "邮件通知", supporting: "已同步到云端", lines: 3, trailing: "radio", onClick: () => setStatus("List Item · 通知方式") }),
    h(ListCard, { key: "switch", title: "自动同步", lines: 1, trailing: "switch", onClick: () => setStatus("List Item · 自动同步") }),
    h(ListCard, { key: "checkbox", title: "项目归档", lines: 1, trailing: "checkbox", onClick: () => setStatus("List Item · 项目归档") }),
    h(ListCard, { key: "event", title: "更新动态", lines: 1, trailing: "notification-arrow", onClick: () => setStatus("List Item · 更新动态") })
  ]);
  if (id === "titlebar") return h(RuntimeTitlebarGallery, { setStatus });
  if (id === "textarea") return h("div", { class: "tui-runtime-surface-pair tui-runtime-textarea-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色输入面"), h(Textarea, { key: "textarea", label: "项目说明", modelValue: "统一 HarmonyOS PC 客户端中的布局、组件与交互规则。", help: "支持多行输入，最多 500 字", surface: "white", "onUpdate:modelValue": () => setStatus("Textarea · 已输入") })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色输入面"), h(Textarea, { key: "textarea", label: "项目说明", modelValue: "统一 HarmonyOS PC 客户端中的布局、组件与交互规则。", help: "支持多行输入，最多 500 字", surface: "gray", "onUpdate:modelValue": () => setStatus("Textarea · 已输入") })])
  ]);
  if (id === "field") return h(Field, { label: "项目名称", modelValue: "客户端设计系统", help: "这是一个必填字段", "onUpdate:modelValue": () => setStatus("Field · 已输入") });
  if (id === "select") return h("div", { class: "tui-runtime-surface-pair" }, [
    h("div", { key: "white", "data-surface-context": "white" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "白色内容面 · 灰色选择面"), h(Select, { key: "select", label: "状态", surface: "white", onChange: (value) => setStatus(`Select · ${value}`) })]),
    h("div", { key: "gray", "data-surface-context": "gray" }, [h("span", { class: "tui-runtime-surface-label", key: "label" }, "灰色内容面 · 白色选择面"), h(Select, { key: "select", label: "状态", surface: "gray", onChange: (value) => setStatus(`Select · ${value}`) })])
  ]);
  if (id === "combobox") return h(Combobox, { label: "负责人", options: ["选择成员", "林晓", "赵博海"], onChange: (value) => setStatus(`Combobox · ${value}`) });
  if (id === "native-select") return h(NativeSelect, { label: "视图", onChange: (event) => setStatus(`Native Select · ${event?.target?.value ?? event}`) });
  if (id === "checkbox") return h(Checkbox, { onChange: (value) => setStatus(`Checkbox · ${value ? "选中" : "取消"}`) });
  if (id === "radio-group") return h(RadioGroup, { onChange: (value) => setStatus(`Radio Group · ${value}`) });
  if (id === "switch") return h(Switch, { onChange: (value) => setStatus(`Switch · ${value ? "开启" : "关闭"}`) });
  if (id === "tabs") return h(Tabs, { onChange: (value) => setStatus(`Tabs · ${value}`) });
  if (id === "accordion") return h(Accordion, { onChange: (open) => setStatus(`Accordion · ${open ? "展开" : "收起"}`) });
  if (id === "collapsible") return h(Collapsible, { onChange: (open) => setStatus(`Collapsible · ${open ? "展开" : "收起"}`) });
  if (id === "avatar") return h("div", { class: "tui-runtime-avatar-pair" }, [
    h("div", { key: "32" }, [h("span", { class: "tui-runtime-surface-label" }, "32 × 32"), h(Avatar, { initials: "H", name: "HarmonyOS 32", size: 32 })]),
    h("div", { key: "40" }, [h("span", { class: "tui-runtime-surface-label" }, "40 × 40"), h(Avatar, { initials: "H", name: "HarmonyOS 40", size: 40 })])
  ]);
  if (id === "badge") return h("div", { class: "tui-badge-group", "aria-label": "Badge 颜色示例" }, [
    h(Badge, { key: "info", label: "进行中", tone: "info" }),
    h(Badge, { key: "success", label: "已完成", tone: "success" }),
    h(Badge, { key: "warning", label: "待处理", tone: "warning" }),
    h(Badge, { key: "danger", label: "错误", tone: "danger" }),
    h(Badge, { key: "neutral", label: "未开始", tone: "neutral" })
  ]);
  if (id === "card") return h(Card, { title: "HarmonyOS 组件规范", description: "统一客户端中的布局、组件与交互规则。" });
  if (id === "item") return h("div", { class: "tui-item-group", role: "list" }, [
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
  if (id === "label") return h(Label, { text: "项目名称", forId: "runtime-project-name" });
  if (id === "alert") return h("div", { class: "tui-feedback-specimens", "data-runtime-component": "alert" }, feedbackSpecimensFor(component).map((specimen) => h("div", { class: "tui-feedback-specimen", "data-specimen": specimen.id, key: specimen.id }, [h("span", { class: "tui-runtime-surface-label" }, specimen.label), h(Alert, { tone: specimen.variant, message: specimen.message, action: specimen.action, onAction: () => setStatus(`Alert · ${specimen.variant}`) })])));
  if (id === "tooltip") return h(Tooltip);
  if (id === "toast") return h(Toast);
  if (id === "dialog") return h("div", { class: "tui-overlay-specimens" }, [h(Dialog, { key: "single", actionLayout: "single", onConfirm: () => setStatus("Dialog · 已确认") }), h(Dialog, { key: "double", actionLayout: "double", onConfirm: () => setStatus("Dialog · 已确认"), onCancel: () => setStatus("Dialog · 已取消") })]);
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

const RuntimeCard = (props) => {
  const Component = Generated[pascal(props.component.id)];
  const comparison = comparisonMetaFor(props.component);
  const preview = coreIds.has(props.component.id)
    ? runtimeCore(props.component.id, props.setStatus, props.component)
    : (Component ? h(Component, { state: "default", fixtureId: props.component.fixtureId }) : h("p", { class: "tui-runtime-framework-missing" }, `Vue 适配器缺失：${props.component.id}`));
  return h("article", {
    class: cardClass(props.component),
    "data-component-card": props.component.id,
    "data-contract-id": props.component.id,
    "data-category": comparison.groupId,
    "data-order": String(comparison.comparisonOrder),
    "data-registry-category": props.component.category,
    "data-registry-order": String(props.component.order),
    "data-fixture-id": props.component.fixtureId,
    "data-framework": "vue",
    "data-readiness": props.component.status,
    "aria-labelledby": `runtime-vue-${props.component.id}-title`
  }, [
    h("header", { class: "tui-runtime-card__head", key: "head" }, h("div", null, h("h3", { id: `runtime-vue-${props.component.id}-title` }, componentTitle(props.component)))),
    h("div", { class: "tui-runtime-card__preview", key: "preview", "data-fixture-id": props.component.fixtureId }, preview)
  ]);
};

const RuntimeApp = {
  props: { onStatus: { type: Function, default: () => {} } },
  setup(props) {
    const status = ref("Vue 运行时已加载");
    const setStatus = (message) => { status.value = message; props.onStatus(message); };
    return () => h("div", { class: "tui-runtime-directory-grid", "data-runtime-framework": "vue" }, [
      ...runtimeCategories.map((category) => h("section", { class: "tui-runtime-category", key: category.id, "data-runtime-category": category.id }, [
        h("h4", { class: "tui-runtime-category__title", key: "title" }, category.label),
        h("div", { class: "tui-runtime-category__grid", key: "grid" }, category.components.map((component) => h(RuntimeCard, { key: component.id, component, setStatus })))
      ])),
      h("p", { class: "status", "aria-live": "polite", key: "status" }, status.value)
    ]);
  }
};

export function mountVueRuntime(container, { onStatus = () => {} } = {}) {
  container.dataset.framework = "vue";
  const app = createApp(RuntimeApp, { onStatus });
  app.mount(container);
  return () => app.unmount();
}
