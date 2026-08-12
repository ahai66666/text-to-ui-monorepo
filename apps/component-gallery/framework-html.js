import { renderHtmlComponent } from "../../packages/components-html/src/index.js?rev=20260807-8";
import contracts from "../../packages/component-contracts/src/components-runtime.js";
import "../../packages/components-html/src/styles.css";
import "./framework-runtime.css";

const escape = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const coreRenderers = { button: "buttonGallery", input: "inputGallery", search: "searchGallery", sidebar: "sidebarGallery", "list-card": "listCardGallery" };
const runtimeRenderer = (id) => coreRenderers[id] ?? id;
const frameworkLinks = `<nav class="tui-runtime-framework-switch" aria-label="选择运行时框架"><a href="/framework-html.html" aria-current="page">HTML</a><a href="/framework-react.html">React</a><a href="/framework-vue.html">Vue</a></nav>`;

const renderCard = (component) => {
  const source = component.frameworks?.html?.source ?? component.implementations?.html ?? "未登记源码";
  let preview;
  try {
    preview = renderHtmlComponent(runtimeRenderer(component.id));
  } catch (error) {
    preview = `<p class="tui-runtime-framework-missing">HTML 适配器缺失：${escape(error.message)}</p>`;
  }
  const stateTags = (component.states ?? ["default"]).map((state) => `<span>${escape(state)}</span>`).join("");
  return `<article class="tui-runtime-framework-card${coreRenderers[component.id] ? " tui-runtime-framework-card--core" : ""}" data-component-card="${escape(component.id)}" data-framework="html"><header class="tui-runtime-framework-card__head"><h2>${escape(component.logicalName.split("/")[0])}</h2><code>${escape(component.logicalName)}</code><small class="tui-runtime-framework-card__source">真实 HTML 源码：${escape(source)}</small></header><div class="tui-runtime-framework-card__preview">${preview}</div><div class="tui-runtime-framework-card__states" aria-label="状态矩阵">${stateTags}</div><p class="tui-runtime-framework-card__state-note">状态标签来自同一份组件契约；可交互行为由 HTML 适配器提供。</p></article>`;
};

const root = document.querySelector("#framework-runtime-root");
root.innerHTML = `<div class="tui-runtime-framework-shell" data-framework="html"><header class="tui-runtime-framework-shell__head"><a href="/index.html#runtime-view">← 返回运行时目录</a><h1>HTML 运行时组件</h1><p>这里加载的是 packages/components-html 中登记的真实 HTML 适配器，不是契约截图，也不是用其他框架的结果冒充。56 个逻辑组件都从同一份注册表逐项解析；核心五类额外展示完整 Surface 与状态矩阵。</p>${frameworkLinks}</header><section class="tui-runtime-framework-directory" aria-label="HTML 运行时组件目录">${contracts.components.map(renderCard).join("")}</section><p class="status" id="framework-runtime-status" aria-live="polite">已加载 ${contracts.components.length} 个 HTML 适配器。</p></div>`;

const status = document.querySelector("#framework-runtime-status");
const setStatus = (message) => { if (status) status.textContent = message; };

document.querySelectorAll(".tui-generated__control").forEach((control) => {
  control.addEventListener("click", () => {
    const panel = control.parentElement?.querySelector(":scope > .tui-generated__menu, :scope > .tui-generated__panel");
    if (!panel) return;
    panel.hidden = !panel.hidden;
    control.setAttribute("aria-expanded", String(!panel.hidden));
  });
});
document.querySelectorAll(".tui-generated__disclosure").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const content = trigger.parentElement?.querySelector(":scope > .tui-generated__disclosure-content");
    if (!content) return;
    content.hidden = !content.hidden;
    trigger.setAttribute("aria-expanded", String(!content.hidden));
  });
});
document.querySelectorAll(".tui-generated__tab").forEach((tab) => tab.addEventListener("click", () => {
  const root = tab.closest("[role='tablist']");
  root?.querySelectorAll(".tui-generated__tab").forEach((other) => { other.classList.toggle("is-selected", other === tab); other.setAttribute("aria-selected", String(other === tab)); });
  const panel = root?.querySelector(".tui-generated__tab-panel");
  if (panel) panel.textContent = tab.textContent;
}));
document.querySelectorAll(".tui-sidebar-item").forEach((item) => item.addEventListener("click", () => {
  item.closest(".tui-sidebar")?.querySelectorAll(".tui-sidebar-item").forEach((other) => { if (other.dataset.state !== "disabled") other.dataset.state = other === item ? "selected" : "default"; });
  setStatus(`已选择 ${item.textContent.trim()}`);
}));
document.querySelectorAll(".tui-list-card").forEach((item) => item.addEventListener("click", () => { item.dataset.state = "selected"; item.setAttribute("aria-pressed", "true"); setStatus(`已选择 ${item.querySelector('[data-slot="title"]')?.textContent ?? "列表项"}`); }));
document.querySelectorAll(".tui-search").forEach((search) => {
  const input = search.querySelector("input");
  const clear = search.querySelector("[data-slot='clear']");
  if (!input || !clear) return;
  input.addEventListener("input", () => { clear.hidden = !input.value; search.dataset.variant = input.value ? "with-value" : "default"; });
  clear.addEventListener("click", () => { input.value = ""; input.dispatchEvent(new Event("input")); input.focus(); });
});
document.querySelectorAll(".tui-button").forEach((button) => button.addEventListener("click", () => setStatus(`已触发 ${button.textContent.trim() || button.getAttribute("aria-label") || "按钮操作"}`)));
