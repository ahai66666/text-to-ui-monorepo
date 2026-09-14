import contracts from "../../packages/component-contracts/src/components-runtime.js";
import "../../packages/components-html/src/styles.css";
import "./framework-runtime.css";
import "./gallery.css";
import { mountPatternBaseline } from "./pattern-baseline.js";

const viewAliases = {
  "contract-view": "runtime",
  "pattern-view": "pattern",
  "runtime-view": "runtime",
  "regression-view": "regression",
  "contract-components": "runtime",
  "all-components": "runtime",
  "framework-runtime": "runtime",
  "legacy-catalog": "regression",
  "skill-baseline": "regression",
  coverage: "regression"
};
const views = [...document.querySelectorAll("[data-view]")];
const viewLinks = [...document.querySelectorAll("[data-view-link]")];
const viewTabs = [...document.querySelectorAll("[data-view-tab]")];
const setPreviewView = (requested, updateHash = false) => {
  const alias = viewAliases[requested] ?? requested;
  const view = ["pattern", "runtime", "regression"].includes(alias) ? alias : "runtime";
  views.forEach((section) => { section.hidden = section.dataset.view !== view; });
  viewLinks.forEach((link) => {
    const selected = link.dataset.viewLink === view;
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  viewTabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.viewTab === view)));
  const migratedContractRoute = ["contract-view", "contract-components", "all-components"].includes(requested);
  if ((updateHash || migratedContractRoute) && location.hash !== `#${view}-view`) history.replaceState(null, "", `#${view}-view`);
};
viewTabs.forEach((tab) => tab.addEventListener("click", () => setPreviewView(tab.dataset.viewTab, true)));
window.addEventListener("hashchange", () => setPreviewView(location.hash.slice(1)));
setPreviewView(location.hash.slice(1));

const galleryShell = document.querySelector(".gallery-shell");
const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
if (galleryShell && sidebarToggle && sidebarToggle.dataset.bound !== "true") {
  const setSidebarCollapsed = (collapsed) => {
    galleryShell.dataset.sidebarCollapsed = String(collapsed);
    sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    sidebarToggle.setAttribute("aria-label", collapsed ? "展开导航" : "收起导航");
    sidebarToggle.title = collapsed ? "展开导航" : "收起导航";
  };
  sidebarToggle.dataset.bound = "true";
  sidebarToggle.addEventListener("click", () => {
    setSidebarCollapsed(galleryShell.dataset.sidebarCollapsed !== "true");
  });
  setSidebarCollapsed(false);
}

mountPatternBaseline(document.querySelector("[data-pattern-baseline]"));

const status = document.querySelector("#gallery-status");
const setStatus = (message) => { if (status) status.textContent = message; };
const runtimeCoverageCount = document.querySelector("#runtime-coverage-count");
const verifiedCount = contracts.components.filter((component) => component.status === "ready").length;
const pendingCount = contracts.components.length - verifiedCount;
if (runtimeCoverageCount) runtimeCoverageCount.textContent = `${contracts.components.length} 个已注册 · ${verifiedCount} 个已完成验收 · ${pendingCount} 个待验收`;
const runtimeDirectoryTitle = document.querySelector("#runtime-directory-title");
if (runtimeDirectoryTitle) runtimeDirectoryTitle.textContent = `框架组件适配器目录 · ${contracts.components.length} 个`;

const runtimeMount = document.querySelector('[data-component-mount="component-catalog"]');
const runtimeFrameworkButtons = [...document.querySelectorAll("[data-runtime-framework]")].filter((element) => element.matches("button"));
const standaloneFile = location.protocol === "file:";
let runtimeUnmount = () => {};
const requestedFramework = new URLSearchParams(location.search).get("framework");
let selectedRuntimeFramework = standaloneFile || !["html", "react", "vue"].includes(requestedFramework) ? "html" : requestedFramework;

if (standaloneFile) {
  runtimeFrameworkButtons.forEach((button) => {
    const isHtml = button.dataset.runtimeFramework === "html";
    button.disabled = !isHtml;
    button.setAttribute("aria-disabled", String(!isHtml));
    if (!isHtml) button.title = "直接打开文件时仅提供 HTML 静态 fallback；请使用 HTTP 开发服务器查看真实 React/Vue。";
  });
}

const loadRuntimeFramework = async (framework) => {
  if (!runtimeMount || !["html", "react", "vue"].includes(framework)) return;
  selectedRuntimeFramework = framework;
  if (!standaloneFile) {
    const url = new URL(location.href);
    url.searchParams.set("framework", framework);
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }
  runtimeFrameworkButtons.forEach((button) => {
    const selected = button.dataset.runtimeFramework === framework;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  // A file:// document cannot load the React/Vue package graph, and browsers
  // may reject even the module entry itself because of local CORS rules. The
  // classic fallback already mounted the native HTML snapshot; keep it in
  // place instead of clearing it and replacing it with an error state.
  if (standaloneFile) {
    setStatus(framework === "html"
      ? "HTML 静态 fallback 已加载；React/Vue 已禁用，请使用 HTTP 开发服务器验收三框架。"
      : `${framework.toUpperCase()} 需要 HTTP 开发服务器，直接打开文件不可用。`);
    return;
  }
  runtimeUnmount();
  runtimeMount.replaceChildren();
  setStatus(`正在加载 ${framework.toUpperCase()} 真实运行时…`);
  try {
    const module = framework === "html"
      ? await import("./runtime-html.js?rev=20260812-1")
      : framework === "react"
        ? await import("./runtime-react.jsx?rev=20260812-1")
        : await import("./runtime-vue.js?rev=20260812-1");
    const mount = module[`mount${framework[0].toUpperCase()}${framework.slice(1)}Runtime`];
    if (typeof mount !== "function") throw new Error(`缺少 ${framework} runtime mount`);
    runtimeUnmount = mount(runtimeMount, { onStatus: setStatus });
    const ready = contracts.components.filter((component) => component.status === "ready").length;
    setStatus(`${framework.toUpperCase()} 运行时已加载 ${contracts.components.length} 个组件；${ready} 个已完成验收，${contracts.components.length - ready} 个按批次验收中；默认态可直接交互`);
  } catch (error) {
    console.error(`Failed to mount ${framework} runtime`, error);
    runtimeMount.innerHTML = `<p class="status tui-runtime-framework-missing">${framework.toUpperCase()} 运行时加载失败，请查看控制台。</p>`;
    setStatus(`${framework.toUpperCase()} 运行时加载失败：${error instanceof Error ? error.message : String(error)}`);
  }
};

runtimeFrameworkButtons.forEach((button) => {
  button.addEventListener("click", () => loadRuntimeFramework(button.dataset.runtimeFramework));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = runtimeFrameworkButtons.indexOf(button);
    const next = event.key === "ArrowRight" ? (index + 1) % runtimeFrameworkButtons.length : (index - 1 + runtimeFrameworkButtons.length) % runtimeFrameworkButtons.length;
    runtimeFrameworkButtons[next].focus();
    loadRuntimeFramework(runtimeFrameworkButtons[next].dataset.runtimeFramework);
  });
});
if (standaloneFile) {
  setStatus("HTML 静态 fallback 已加载；React/Vue 已禁用，请使用 HTTP 开发服务器验收三框架。");
} else {
  loadRuntimeFramework(selectedRuntimeFramework);
}

const coverageBody = document.querySelector("#coverage-body");
if (coverageBody) {
  const cell = (status) => `<span class="coverage-status coverage-status--${status}">${status}</span>`;
  coverageBody.innerHTML = contracts.components.map((component) => `<tr><td>${component.logicalName}</td><td>${cell(component.frameworks?.html?.status ?? "pending")}</td><td>${cell(component.frameworks?.react?.status ?? "pending")}</td><td>${cell(component.frameworks?.vue?.status ?? "pending")}</td><td><code>NewComponents · logical mapping</code></td></tr>`).join("");
}

const runtimeFrameworkSummary = document.querySelector("#runtime-framework-summary");
if (runtimeFrameworkSummary) {
  const frameworkLabels = [["html", "HTML"], ["react", "React"], ["vue", "Vue"]];
  runtimeFrameworkSummary.innerHTML = frameworkLabels.map(([key, label]) => {
    const ready = contracts.components.filter((component) => component.frameworks?.[key]?.status === "ready").length;
    const state = ready === contracts.components.length ? "ready" : "partial";
    return `<span class="runtime-framework-summary__${state}" data-framework="${key}">${label} <strong>${ready}/${contracts.components.length} 已完成验收</strong></span>`;
  }).join("");
}

// Runtime behavior is owned by each framework adapter. The gallery shell only
// switches views and reports loading status; it does not patch component DOM.
