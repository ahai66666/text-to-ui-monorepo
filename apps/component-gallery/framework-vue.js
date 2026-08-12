import { createApp, h, ref } from "vue";
import { Alert, Attachment, Button, Input, Search, Sidebar, ListCard, Toast, Tooltip } from "../../packages/components-vue/src/index.js?rev=20260812-1";
import * as Generated from "../../packages/components-vue/src/generated/index.js?rev=20260807-1";
import contracts from "../../packages/component-contracts/src/components-runtime.js";
import { feedbackSpecimensFor } from "./runtime-catalog.js";
import "./framework-runtime.css";

const pascal = (value) => value.split(/[-_]/g).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
const stateLabels = { default: "Default", hover: "Hover", pressed: "Pressed", focus: "Focus", disabled: "Disabled", selected: "Selected", error: "Error", open: "Open" };
const coreIds = new Set(["button", "input", "search", "sidebar", "list-card"]);
const stateTags = (component) => (component.states ?? ["default"]).map((state) => h("span", { key: state }, stateLabels[state] ?? state));
const directComponents = { alert: Alert, attachment: Attachment, toast: Toast, tooltip: Tooltip };

const ButtonPreview = (props) => {
  const variants = [["primary", "确认操作"], ["secondary", "次要操作"], ["ghost", "文本操作"], ["danger", "删除项目"]];
  const buttonStates = ["default", "hover", "pressed", "focus", "disabled"];
  return h("div", { class: "tui-runtime-core-gallery" }, [h("p", { class: "tui-runtime-note" }, "真实 Vue Button 适配器；状态通过契约 state/disabled 传入，事件由 Vue 组件执行。"), h("div", { class: "tui-runtime-state-grid tui-runtime-state-grid--single" }, buttonStates.map((state) => h("div", { class: "tui-runtime-state-cell", key: state }, [h("span", null, stateLabels[state]), h("div", { class: "tui-runtime-surface-grid" }, variants.map(([variant, label]) => h(Button, { key: `${state}-${variant}`, label, variant, state, disabled: state === "disabled", onClick: () => props.setStatus(`Vue Button · ${variant} · ${state}`) }))) ]))) ]);
};

const InputPreview = () => {
  const inputStates = ["default", "hover", "focus", "disabled", "error"];
  const context = (surface, label) => h("section", { class: "tui-runtime-state-group", key: surface }, [h("strong", null, label), h("div", { class: "tui-runtime-state-grid" }, inputStates.map((state) => h("div", { class: "tui-runtime-state-cell", key: state }, [h("span", null, stateLabels[state]), h(Input, { surface, state, disabled: state === "disabled", error: state === "error", placeholder: "项目名称" })]))) ]);
  return h("div", { class: "tui-runtime-core-gallery" }, [h("p", { class: "tui-runtime-note" }, "白色内容面使用灰色输入面，灰色内容面使用白色输入面；以下全部是同一个 Vue Input 组件的真实 Surface / state 组合。"), context("white", "White content surface"), context("gray", "Gray content surface")]);
};

const SearchPreview = {
  setup() {
    const value = ref("搜索项目");
    return () => h("div", { class: "tui-runtime-core-gallery" }, [h("p", { class: "tui-runtime-note", key: "note" }, "真实 Vue Search 适配器，包含 Surface、with-value、清除和 disabled 状态。"), h("div", { class: "tui-runtime-surface-grid", key: "surfaces" }, [h("div", { class: "tui-runtime-state-cell", key: "white" }, [h("span", { key: "label" }, "White content surface"), h(Search, { key: "search", surface: "white", modelValue: value.value, "onUpdate:modelValue": (next) => { value.value = next; }, onClear: () => { value.value = ""; } })]), h("div", { class: "tui-runtime-state-cell", key: "gray" }, [h("span", { key: "label" }, "Gray content surface"), h(Search, { key: "search", surface: "gray", placeholder: "搜索项目" })]), h("div", { class: "tui-runtime-state-cell", key: "disabled" }, [h("span", { key: "label" }, "Disabled"), h(Search, { key: "search", disabled: true, surface: "white" })])])]);
  }
};

const SidebarPreview = (props) => {
  const items = [{ id: "default", label: "项目", icon: "navigation/grid", count: 24 }, { id: "hover", label: "Hover", icon: "navigation/recent", state: "hover" }, { id: "pressed", label: "Pressed", icon: "navigation/recent", state: "pressed" }, { id: "focus", label: "Focus", icon: "navigation/recent", state: "focus" }, { id: "selected", label: "Selected", icon: "navigation/list", state: "selected" }, { id: "disabled", label: "Disabled", icon: "action/settings", state: "disabled" }];
  return h("div", { class: "tui-runtime-core-gallery" }, [h("p", { class: "tui-runtime-note" }, "真实 Vue Sidebar 适配器；未选中保持二级颜色，Selected 使用 Sidebar Selected，点击项目会触发真实 select 事件。"), h(Sidebar, { items, onSelect: (id) => props.setStatus(`Vue Sidebar · ${id}`) })]);
};

const ListCardPreview = (props) => {
  const cardStates = ["default", "hover", "pressed", "focus", "selected", "disabled"];
  return h("div", { class: "tui-runtime-core-gallery" }, [h("p", { class: "tui-runtime-note" }, "真实 Vue List Card 适配器；主标题、摘要、元信息和所有状态沿用契约 CSS。"), h("div", { class: "tui-runtime-state-grid tui-runtime-state-grid--single" }, cardStates.map((state) => h("div", { class: "tui-runtime-state-cell", key: state }, [h("span", null, stateLabels[state]), h(ListCard, { title: state === "selected" ? "已选中的项目" : "HarmonyOS 组件规范", description: "刚刚更新 · 12 位成员", meta: stateLabels[state], state, selected: state === "selected", onClick: () => props.setStatus(`Vue List Card · ${state}`) })]))) ]);
};

const CorePreview = (props) => {
  if (props.id === "button") return h(ButtonPreview, { setStatus: props.setStatus });
  if (props.id === "input") return h(InputPreview);
  if (props.id === "search") return h(SearchPreview);
  if (props.id === "sidebar") return h(SidebarPreview, { setStatus: props.setStatus });
  if (props.id === "list-card") return h(ListCardPreview, { setStatus: props.setStatus });
  return null;
};

const FeedbackPreview = (props) => h("div", { class: "tui-feedback-specimens", "data-runtime-component": "alert" }, feedbackSpecimensFor(props.component).map((specimen) => h("div", { class: "tui-feedback-specimen", "data-specimen": specimen.id, key: specimen.id }, [h("span", { class: "tui-runtime-surface-label" }, specimen.label), h(Alert, { tone: specimen.variant, message: specimen.message, action: specimen.action })])));

const RuntimeCard = { props: { component: Object, setStatus: Function }, setup(props) {
  const Component = directComponents[props.component.id] ?? Generated[pascal(props.component.id)];
  return () => {
    const preview = props.component.id === "alert" ? h(FeedbackPreview, { component: props.component }) : coreIds.has(props.component.id) ? h(CorePreview, { id: props.component.id, setStatus: props.setStatus }) : (Component ? h(Component, { state: "default" }) : h("p", { class: "tui-runtime-framework-missing" }, `Vue 适配器缺失：${props.component.id}`));
    return h("article", { class: `tui-runtime-framework-card${coreIds.has(props.component.id) ? " tui-runtime-framework-card--core" : ""}`, "data-component-card": props.component.id, "data-framework": "vue" }, [h("header", { class: "tui-runtime-framework-card__head" }, [h("h2", null, props.component.logicalName.split("/")[0]), h("code", null, props.component.logicalName), h("small", { class: "tui-runtime-framework-card__source" }, ["真实 Vue 源码：", props.component.frameworks?.vue?.source ?? props.component.implementations?.vue ?? "未登记源码"])]), h("div", { class: "tui-runtime-framework-card__preview" }, [preview]), h("div", { class: "tui-runtime-framework-card__states", "aria-label": "状态矩阵" }, stateTags(props.component)), h("p", { class: "tui-runtime-framework-card__state-note" }, "卡片使用的是该框架的实际导出组件；状态标签来自统一契约，不是另造一套演示数据。")]);
  };
} };

const App = { setup() {
  const status = ref(`已加载 ${contracts.components.length} 个 Vue 适配器。`);
  const setStatus = (message) => { status.value = message; };
  return () => h("div", { class: "tui-runtime-framework-shell", "data-framework": "vue" }, [h("header", { class: "tui-runtime-framework-shell__head" }, [h("a", { href: "/index.html#runtime-view" }, "← 返回运行时目录"), h("h1", null, "Vue 运行时组件"), h("p", null, "这里加载 packages/components-vue 中登记的真实 Vue SFC。它们与 HTML / React 共享契约和 component-styles，但渲染、事件和状态由 Vue 自己执行；不会用其他框架或假数据冒充 Vue。"), h("nav", { class: "tui-runtime-framework-switch", "aria-label": "选择运行时框架" }, [h("a", { href: "/framework-html.html" }, "HTML"), h("a", { href: "/framework-react.html" }, "React"), h("a", { href: "/framework-vue.html", "aria-current": "page" }, "Vue")])]), h("section", { class: "tui-runtime-framework-directory", "aria-label": "Vue 运行时组件目录" }, contracts.components.map((component) => h(RuntimeCard, { key: component.id, component, setStatus }))), h("p", { class: "status", "aria-live": "polite" }, status.value)]);
} };

createApp(App).mount("#framework-runtime-root");
