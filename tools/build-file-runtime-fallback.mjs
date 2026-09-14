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
import { contractDialogId, renderContractDialogHtml } from "../apps/component-gallery/contract-inspector.js";

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
  <header class="tui-runtime-card__head"><div><h3>${escapeHtml(componentTitle(component))}</h3></div><button type="button" class="tui-component tui-button tui-runtime-card__contract-trigger" data-component="button" data-renderer-key="button" data-logical-component="Icon Text Button/Ghost/Default" data-variant="ghost" data-state="default" data-framework="html" data-mode="icon-text" data-size="small" data-button-type="icon-text-ghost" data-contract-dialog-trigger aria-haspopup="dialog" aria-controls="${escapeHtml(contractDialogId(component, "html"))}" aria-expanded="false">组件规范</button></header>
  <div class="tui-runtime-card__preview" data-fixture-id="${escapeHtml(component.fixtureId)}">${renderRuntimeHtmlComponent(component.id, { specimens: specimensFor(component), fixtureId: component.fixtureId })}</div>
  ${renderContractDialogHtml(component, "html", escapeHtml)}
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
  '  const closeMenus = () => root.querySelectorAll(".tui-button-dropdown__menu, .tui-generated__menu, .tui-generated__panel, .tui-attachment__menu, .tui-advanced-menu__panel, .tui-advanced-menu__submenu").forEach((menu) => { menu.hidden = true; menu.classList.remove("is-open"); const trigger = menu.previousElementSibling; const controls = trigger?.matches("button") ? [trigger] : [...(trigger?.querySelectorAll?.("button[aria-expanded]") ?? [])]; controls.forEach((control) => control.setAttribute("aria-expanded", "false")); });',
  '  const closeAdvancedSubmenus = (component, except = null) => component?.querySelectorAll(".tui-advanced-menu__submenu").forEach((submenu) => { if (submenu === except) return; submenu.hidden = true; submenu.classList.remove("is-open"); submenu.previousElementSibling?.setAttribute("aria-expanded", "false"); });',
  '  const closeContractDialog = (dialog) => { if (!dialog || dialog.hidden) return; dialog.hidden = true; const trigger = root.querySelector(`[aria-controls="${dialog.id}"]`); trigger?.setAttribute("aria-expanded", "false"); trigger?.focus(); setStatus("组件规范 · 已关闭"); };',
  '  root.addEventListener("click", (event) => {',
  '    const contractTrigger = event.target.closest("[data-contract-dialog-trigger]");',
  '    if (contractTrigger && root.contains(contractTrigger)) { const dialog = root.querySelector(`#${CSS.escape(contractTrigger.getAttribute("aria-controls") || "")}`); if (dialog) { dialog.hidden = false; contractTrigger.setAttribute("aria-expanded", "true"); dialog.querySelector(".tui-contract-dialog__close")?.focus(); setStatus("组件规范 · 已打开"); } return; }',
  '    const contractClose = event.target.closest("[data-contract-dialog-close]");',
  '    if (contractClose && root.contains(contractClose)) { closeContractDialog(contractClose.closest("[data-contract-dialog]")); return; }',
  '    const target = event.target.closest("button, input");',
  '    if (!target || !root.contains(target) || target.disabled) return;',
  '    const owner = target.closest("[data-component-card]");',
  '    const isAdvancedMenuInteraction = event.target.closest?.(".tui-advanced-menu__trigger, .tui-advanced-menu__item");',
  '    if (root.contains(event.target) && !event.target.closest(".tui-attachment__actions") && !isAdvancedMenuInteraction) closeMenus();',
  '    if (target.matches(".tui-advanced-menu__trigger")) { const component = target.closest(".tui-advanced-menu, .tui-advanced-menubar"); const panel = component?.querySelector(":scope > .tui-advanced-menu__panel"); if (panel) { const open = panel.hidden; closeMenus(); panel.hidden = !open; panel.classList.toggle("is-open", open); target.setAttribute("aria-expanded", String(open)); } return; }',
  '    if (target.matches(".tui-advanced-menu__item.has-submenu")) { const component = target.closest(".tui-advanced-menubar"); const submenu = target.parentElement?.querySelector(":scope > .tui-advanced-menu__submenu"); if (component && submenu) { closeAdvancedSubmenus(component, submenu); submenu.hidden = false; submenu.classList.add("is-open"); target.setAttribute("aria-expanded", "true"); } return; }',
  '    if (target.matches(".tui-advanced-menu__item")) { closeMenus(); setStatus("已选择 " + target.textContent.trim()); return; }',
  '    if (target.matches(".tui-button--selection, .tui-split-button__trigger")) {',
  '      const menu = target.closest(".tui-button-dropdown, .tui-split-button")?.querySelector(":scope > .tui-button-dropdown__menu");',
  '      if (menu) { const open = menu.hidden; closeMenus(); menu.hidden = !open; menu.classList.toggle("is-open", open); target.setAttribute("aria-expanded", String(open)); setStatus(open ? "下拉菜单已打开" : "下拉菜单已收起"); }',
  '      return;',
  '    }',
  '    if (target.matches(".tui-attachment__menu-trigger")) {',
  '      const menu = target.closest(".tui-attachment")?.querySelector(":scope > .tui-attachment__actions > .tui-attachment__menu");',
  '      if (menu) { const open = menu.hidden; closeMenus(); menu.hidden = !open; menu.classList.toggle("is-open", open); target.setAttribute("aria-expanded", String(open)); menu.querySelector("[role=menuitem]")?.focus(); setStatus(open ? "附件操作菜单已打开" : "附件操作菜单已收起"); }',
  '      return;',
  '    }',
  '    if (target.matches(".tui-attachment__menu [role=menuitem]")) {',
  '      closeMenus(); setStatus("Attachment · " + (target.dataset.action === "preview" ? "已预览" : "已下载")); return;',
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
    '    if (target.matches(".tui-primary-navigation-item")) {',
    '      target.closest(".tui-primary-navigation-items")?.querySelectorAll(".tui-primary-navigation-item").forEach((item) => { if (!item.disabled) { const selected = item === target; item.dataset.state = selected ? "selected" : "default"; item.dataset.variant = selected ? "selected" : "default"; item.setAttribute("aria-pressed", String(selected)); } });',
    '      setStatus("Primary Navigation Item · " + (target.getAttribute("aria-label") || "已选择")); return;',
    '    }',
    '    if (target.matches(".tui-list-card")) { target.dataset.state = "selected"; target.setAttribute("aria-pressed", "true"); setStatus("List Card · 已选择"); return; }',
  '    if (target.matches(".tui-button")) setStatus("已触发 " + (owner?.querySelector("h3")?.textContent ?? "组件"));',
  '  });',
  '  root.addEventListener("mouseover", (event) => { const target = event.target.closest?.(".tui-advanced-menu__item"); const component = target?.closest(".tui-advanced-menubar"); if (!target || !component || target.closest(".tui-advanced-menu__submenu")) return; const submenu = target.classList.contains("has-submenu") ? target.parentElement?.querySelector(":scope > .tui-advanced-menu__submenu") : null; if (!submenu) { closeAdvancedSubmenus(component); return; } closeAdvancedSubmenus(component, submenu); submenu.hidden = false; submenu.classList.add("is-open"); target.setAttribute("aria-expanded", "true"); setStatus("Menubar · 打开子菜单"); });',
  '  root.addEventListener("mouseout", (event) => { const component = event.target.closest?.(".tui-advanced-menubar"); if (component && (!event.relatedTarget || !component.contains(event.relatedTarget))) closeAdvancedSubmenus(component); });',
  '  root.addEventListener("keydown", (event) => {',
  '    if (event.key === "Escape") { const dialog = [...root.querySelectorAll("[data-contract-dialog]:not([hidden])")].at(-1); if (dialog) { event.preventDefault(); closeContractDialog(dialog); return; } }',
  '    const target = event.target.closest(".tui-attachment__menu-trigger, .tui-attachment__menu [role=menuitem]");',
  '    if (!target || !root.contains(target)) return;',
  '    if (event.key === "Escape") { event.preventDefault(); closeMenus(); target.closest(".tui-attachment")?.querySelector(".tui-attachment__menu-trigger")?.focus(); return; }',
  '    if (["ArrowDown", "ArrowUp"].includes(event.key) && target.matches("[role=menuitem]")) { const items = [...target.closest(".tui-attachment__menu")?.querySelectorAll("[role=menuitem]") ?? []]; if (!items.length) return; event.preventDefault(); const index = Math.max(0, items.indexOf(target)); items[(index + (event.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus(); }',
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
