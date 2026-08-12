#!/usr/bin/env node

/**
 * Build the classic-script fallback used when the gallery is opened as
 * file://. Browsers intentionally block ES module requests from a file
 * document, so this snapshot keeps the native HTML gallery usable without a
 * local server. The normal Vite path still mounts the real adapter module.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderRuntimeHtmlComponent } from "../packages/components-html/src/index.js";
import { cardClass, comparisonMetaFor, componentTitle, runtimeCategories, runtimeComponents, specimensFor } from "../apps/component-gallery/runtime-catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "apps/component-gallery/runtime-file-fallback.js");
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const renderCard = (component) => {
  const comparison = comparisonMetaFor(component);
  return `<article class="${cardClass(component)}" data-component-card="${escapeHtml(component.id)}" data-contract-id="${escapeHtml(component.id)}" data-category="${escapeHtml(comparison.groupId)}" data-order="${comparison.comparisonOrder}" data-registry-category="${escapeHtml(component.category)}" data-registry-order="${component.order}" data-fixture-id="${escapeHtml(component.fixtureId)}" data-framework="html" data-readiness="${component.status}">
  <header class="tui-runtime-card__head"><div><h3>${escapeHtml(componentTitle(component))}</h3></div></header>
  <div class="tui-runtime-card__preview" data-fixture-id="${escapeHtml(component.fixtureId)}">${renderRuntimeHtmlComponent(component.id, { specimens: specimensFor(component), fixtureId: component.fixtureId })}</div>
</article>`;
};
const markup = `<div class="tui-runtime-directory-grid" data-runtime-framework="html">${runtimeCategories.map((category) => `<section class="tui-runtime-category" data-runtime-category="${escapeHtml(category.id)}"><h4 class="tui-runtime-category__title">${escapeHtml(category.label)}</h4><div class="tui-runtime-category__grid">${category.components.map(renderCard).join("")}</div></section>`).join("")}<p class="status" aria-live="polite">原生 HTML 组件已加载 ${runtimeComponents.length} 项；可直接点击查看基础交互。</p></div>`;

const runtimeScript = [
  "// Generated from the canonical HTML adapter for standalone file:// preview.",
  "(() => {",
  '  if (location.protocol !== "file:") return;',
  '  const root = document.querySelector(\'[data-component-mount="component-catalog"]\');',
  "  if (!root) return;",
  `  root.innerHTML = ${JSON.stringify(markup)};`,
  '  const status = document.querySelector("#gallery-status");',
  '  const setStatus = (message) => { if (status) status.textContent = message; };',
  '  const closeMenus = () => root.querySelectorAll(".tui-button-dropdown__menu, .tui-generated__menu, .tui-generated__panel").forEach((menu) => { menu.hidden = true; menu.classList.remove("is-open"); const trigger = menu.previousElementSibling; trigger?.setAttribute("aria-expanded", "false"); });',
  '  root.addEventListener("click", (event) => {',
  '    const target = event.target.closest("button, input");',
  '    if (!target || !root.contains(target) || target.disabled) return;',
  '    const owner = target.closest("[data-component-card]");',
  '    if (target.matches(".tui-button--selection, .tui-split-button__trigger")) {',
  '      const menu = target.closest(".tui-button-dropdown, .tui-split-button")?.querySelector(":scope > .tui-button-dropdown__menu");',
  '      if (menu) { const open = menu.hidden; closeMenus(); menu.hidden = !open; menu.classList.toggle("is-open", open); target.setAttribute("aria-expanded", String(open)); setStatus(open ? "下拉菜单已打开" : "下拉菜单已收起"); }',
  '      return;',
  '    }',
  '    if (target.matches(".tui-button-dropdown__item")) {',
  '      const label = target.closest(".tui-button-dropdown")?.querySelector("[data-slot=label]");',
  '      if (label) label.textContent = target.textContent;',
  '      closeMenus(); setStatus("已选择 " + target.textContent.trim()); return;',
  '    }',
  '    if (target.matches(".tui-generated__control")) {',
  '      const panel = target.parentElement?.querySelector(":scope > .tui-generated__menu, :scope > .tui-generated__panel");',
  '      if (panel) { const open = panel.hidden || !panel.classList.contains("is-open"); closeMenus(); panel.hidden = !open; panel.classList.toggle("is-open", open); target.setAttribute("aria-expanded", String(open)); }',
  '      return;',
  '    }',
  '    if (target.matches(".tui-generated__disclosure")) {',
  '      const content = target.parentElement?.querySelector(":scope > .tui-generated__disclosure-content");',
  '      const open = target.getAttribute("aria-expanded") !== "true"; target.setAttribute("aria-expanded", String(open)); if (content) content.hidden = !open; return;',
  '    }',
  '    if (target.matches(".tui-generated__tab")) {',
  '      const tabs = target.parentElement?.querySelectorAll(".tui-generated__tab") ?? []; tabs.forEach((tab) => { const selected = tab === target; tab.setAttribute("aria-selected", String(selected)); tab.classList.toggle("is-selected", selected); }); return;',
  '    }',
  '    if (target.matches(".tui-sidebar-item")) {',
  '      target.closest(".tui-sidebar")?.querySelectorAll(".tui-sidebar-item").forEach((item) => { if (!item.disabled) item.dataset.state = item === target ? "selected" : "default"; });',
  '      setStatus("Sidebar · " + target.textContent.trim()); return;',
  '    }',
  '    if (target.matches(".tui-list-card")) { target.dataset.state = "selected"; target.setAttribute("aria-pressed", "true"); setStatus("List Card · 已选择"); return; }',
  '    if (target.matches(".tui-button")) setStatus("已触发 " + (owner?.querySelector("h3")?.textContent ?? "组件"));',
  '  });',
  '  root.addEventListener("input", (event) => {',
  '    const input = event.target.closest(".tui-search input"); if (!input) return; const clear = input.closest(".tui-search")?.querySelector("[data-slot=clear]"); if (clear) clear.hidden = !input.value;',
  '  });',
  '  document.addEventListener("click", (event) => { if (!root.contains(event.target)) closeMenus(); });',
  "})();",
  ""
].join("\n");

await fs.writeFile(target, runtimeScript, "utf8");
console.log(`Generated ${path.relative(root, target)} (${markup.length} characters of static HTML)`);
