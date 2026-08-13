import { renderRuntimeHtmlComponent } from "../../packages/components-html/src/index.js?rev=20260812-1";
import { cardClass, cardDescription, comparisonMetaFor, componentTitle, feedbackSpecimensFor, runtimeCategories, runtimeComponents, specimensFor } from "./runtime-catalog.js";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const renderCard = (component) => {
  const comparison = comparisonMetaFor(component);
  return `<article class="${cardClass(component)}" data-component-card="${escapeHtml(component.id)}" data-contract-id="${escapeHtml(component.id)}" data-category="${escapeHtml(comparison.groupId)}" data-order="${comparison.comparisonOrder}" data-registry-category="${escapeHtml(component.category)}" data-registry-order="${component.order}" data-fixture-id="${escapeHtml(component.fixtureId)}" data-framework="html" data-readiness="${component.status}" aria-labelledby="runtime-html-${escapeHtml(component.id)}-title">
  <header class="tui-runtime-card__head"><div><h3 id="runtime-html-${escapeHtml(component.id)}-title">${escapeHtml(componentTitle(component))}</h3></div></header>
  <div class="tui-runtime-card__preview" data-fixture-id="${escapeHtml(component.fixtureId)}">${renderRuntimeHtmlComponent(component.id, { specimens: component.id === "alert" ? feedbackSpecimensFor(component) : specimensFor(component), fixtureId: component.fixtureId })}</div>
</article>`;
};

const renderCategory = (category) => `<section class="tui-runtime-category" data-runtime-category="${escapeHtml(category.id)}" aria-labelledby="runtime-category-${escapeHtml(category.id)}"><h4 class="tui-runtime-category__title" id="runtime-category-${escapeHtml(category.id)}">${escapeHtml(category.label)}</h4><div class="tui-runtime-category__grid">${category.components.map(renderCard).join("")}</div></section>`;

const syncMenu = (trigger, menu, open) => {
  trigger?.setAttribute("aria-expanded", String(open));
  if (menu) menu.hidden = !open;
};

/**
 * Runtime behavior belongs to this adapter, not to the gallery shell. The
 * listener is scoped to this mounted HTML runtime and only handles controls
 * emitted by the HTML components themselves.
 */
const bindRuntimeInteractions = (root, setStatus) => {
  root.dataset.interactionsBound = "true";
  const overlayTriggers = new Map();
  const closeOverlay = (layer, reason = "关闭") => {
    if (!layer) return;
    layer.hidden = true;
    const dialog = layer.querySelector(".tui-dialog");
    const componentId = dialog?.dataset.component ?? "dialog";
    dialog && (dialog.dataset.state = "closed");
    overlayTriggers.get(layer)?.focus();
    overlayTriggers.delete(layer);
    setStatus(`${componentId === "alert-dialog" ? "Alert Dialog" : componentId === "semi-modal" ? "Semi-modal" : "Dialog"} · ${reason}`);
  };
  const closeMenus = () => {
    root.querySelectorAll(".tui-button-dropdown__menu, .tui-generated__menu, .tui-generated__panel, .tui-advanced-menu__panel, .tui-advanced-popover__panel, .tui-picker__panel").forEach((menu) => {
      menu.hidden = true;
      menu.classList.remove("is-open");
      const trigger = menu.previousElementSibling;
      if (trigger?.matches("button")) trigger.setAttribute("aria-expanded", "false");
    });
  };
  const onClick = (event) => {
    const target = event.target.closest("button, input, textarea, select, a");
    if (!target || !root.contains(target) || target.disabled) return;
    const owner = target.closest("[data-component-card]");
    const id = owner?.dataset.componentCard;
    if (target.matches("[data-overlay-trigger]")) {
      const layer = root.querySelector(`[data-overlay-id="${CSS.escape(target.dataset.overlayTrigger)}"]`);
      if (layer) {
        overlayTriggers.set(layer, target);
        layer.hidden = false;
        const dialog = layer.querySelector(".tui-dialog");
        dialog && (dialog.dataset.state = "open");
        queueMicrotask(() => dialog?.focus());
        setStatus(`${dialog?.dataset.component === "alert-dialog" ? "Alert Dialog" : dialog?.dataset.component === "semi-modal" ? "Semi-modal" : "Dialog"} · 已打开`);
      }
      return;
    }
    if (target.matches("[data-overlay-close], [data-overlay-action]")) {
      const action = target.dataset.overlayAction;
      closeOverlay(target.closest(".tui-overlay-layer"), action === "confirm" ? target.textContent.trim() : action === "cancel" ? "取消" : "关闭");
      return;
    }
    if (target.matches(".tui-button--selection, .tui-split-button__trigger")) {
      event.stopPropagation();
      const menu = target.closest(".tui-button-dropdown, .tui-split-button")?.querySelector(":scope > .tui-button-dropdown__menu");
      if (menu) { const open = menu.hidden; closeMenus(); syncMenu(target, menu, open); setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "Button" })} · ${open ? "打开" : "收起"}`); }
      return;
    }
    if (target.matches(".tui-button-dropdown__item")) {
      const rootButton = target.closest(".tui-button-dropdown")?.querySelector("[data-slot=label]");
      if (rootButton) rootButton.textContent = target.textContent;
      closeMenus();
      setStatus(`已选择 ${target.textContent.trim()}`);
      return;
    }
    if (target.matches(".tui-titlebar__action, .tui-titlebar__pane-action")) {
      setStatus(`Titlebar · ${target.matches(".tui-titlebar__pane-action") ? "Main Detail · " : ""}${target.dataset.action ?? "action"}`);
      return;
    }
    if (target.matches('.tui-search [data-slot="advanced-search"]')) {
      setStatus("Search · 高级搜索");
      return;
    }
    if (target.matches(".tui-alert .tui-icon-button, .tui-toast .tui-icon-button")) {
      target.closest(".tui-alert, .tui-toast")?.remove();
      setStatus(`${id === "toast" ? "Toast" : "Alert"} · 已关闭`);
      return;
    }
    if (target.matches(".tui-select__trigger")) {
      const component = target.closest(".tui-select");
      const menu = component?.querySelector(":scope > .tui-select__menu");
      if (menu) {
        const open = menu.hidden;
        closeMenus();
        menu.hidden = !open;
        target.setAttribute("aria-expanded", String(open));
        if (open) menu.querySelector('[role="option"]')?.focus();
        setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "选择控件" })} · ${open ? "打开" : "收起"}`);
      }
      return;
    }
    if (target.matches('.tui-select__menu [role="option"]')) {
      const component = target.closest(".tui-select");
      component?.querySelector('[data-slot="value"]')?.replaceChildren(document.createTextNode(target.textContent.trim()));
      component?.querySelectorAll('[role="option"]').forEach((option) => option.setAttribute("aria-selected", String(option === target)));
      closeMenus();
      setStatus(`已选择 ${target.textContent.trim()}`);
      return;
    }
    if (target.matches(".tui-disclosure__trigger")) {
      const content = target.closest(".tui-disclosure")?.querySelector(":scope > .tui-disclosure__content");
      const open = target.getAttribute("aria-expanded") !== "true";
      target.setAttribute("aria-expanded", String(open));
      if (content) content.hidden = !open;
      setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "披露组件" })} · ${open ? "展开" : "收起"}`);
      return;
    }
    if (target.matches('.tui-tabs__list [role="tab"]')) {
      const tablist = target.closest('[role="tablist"]');
      tablist?.querySelectorAll('[role="tab"]').forEach((tab) => {
        const selected = tab === target;
        tab.classList.toggle("is-selected", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      const panel = target.closest(".tui-tabs")?.querySelector('[role="tabpanel"]');
      if (panel) panel.textContent = target.dataset.tab === "projects" ? "项目列表" : target.dataset.tab === "members" ? "成员列表" : "工作空间概览";
      setStatus(`Tabs · ${target.textContent.trim()}`);
      return;
    }
    if (target.matches(".tui-advanced-menu__trigger")) {
      const component = target.closest(".tui-advanced-menu, .tui-advanced-menubar");
      const panel = component?.querySelector(":scope > .tui-advanced-menu__panel");
      if (panel) {
        const open = panel.hidden;
        closeMenus();
        panel.hidden = !open;
        panel.classList.toggle("is-open", open);
        target.setAttribute("aria-expanded", String(open));
        setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "菜单" })} · ${open ? "打开" : "收起"}`);
      }
      return;
    }
    if (target.matches(".tui-advanced-menu__item")) {
      const component = target.closest(".tui-advanced-menu, .tui-advanced-menubar");
      component?.querySelector('[data-slot="value"]')?.replaceChildren(document.createTextNode(target.textContent.trim()));
      closeMenus();
      setStatus(`已选择 ${target.textContent.trim()}`);
      return;
    }
    if (target.matches(".tui-advanced-popover > .tui-button")) {
      const component = target.closest(".tui-advanced-popover");
      const panel = component?.querySelector(":scope > .tui-advanced-popover__panel");
      if (panel) {
        const open = panel.hidden;
        closeMenus();
        panel.hidden = !open;
        target.setAttribute("aria-expanded", String(open));
        setStatus(`Popover · ${open ? "打开" : "收起"}`);
      }
      return;
    }
    if (target.matches(".tui-picker__trigger")) {
      const component = target.closest(".tui-picker");
      const panel = component?.querySelector(":scope > .tui-picker__panel");
      if (panel) {
        const open = panel.hidden;
        closeMenus();
        panel.hidden = !open;
        target.setAttribute("aria-expanded", String(open));
        setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "选择器" })} · ${open ? "打开" : "收起"}`);
      }
      return;
    }
    if (target.matches(".tui-picker__calendar button[data-day], .tui-picker__columns button[data-time-hour], .tui-picker__columns button[data-time-minute]")) {
      target.closest(".tui-picker__calendar, .tui-picker__columns")?.querySelectorAll("button").forEach((button) => button.classList.remove("is-selected"));
      target.classList.add("is-selected");
      const value = target.closest(".tui-picker")?.querySelector('[data-slot="value"]');
      if (value) {
        const picker = target.closest(".tui-picker");
        if (target.dataset.day) value.textContent = `2026-08-${target.dataset.day.padStart(2, "0")}`;
        if (target.dataset.timeHour) value.textContent = `${target.dataset.timeHour}:${value.textContent.split(":")[1] ?? "30"}`;
        if (target.dataset.timeMinute) value.textContent = `${value.textContent.split(":")[0] ?? "09"}:${target.dataset.timeMinute}`;
        picker?.dataset && (picker.dataset.state = "selected");
      }
      setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "选择器" })} · 已选择`);
      return;
    }
    if (target.matches(".tui-dialog__form input")) {
      setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "表单" })} · 已编辑`);
      return;
    }
    if (target.matches(".tui-attachment__download")) {
      setStatus("Attachment · 已下载");
      return;
    }
    if (target.matches(".tui-carousel__prev, .tui-carousel__next")) {
      const carousel = target.closest(".tui-carousel");
      const slide = carousel?.querySelector(".tui-carousel__slide");
      const count = carousel?.querySelector(".tui-carousel__count");
      const items = ["HarmonyOS PC 组件规范", "项目协作动态", "设计 Token 资产"];
      const current = Number(slide?.dataset.slide ?? 0);
      const next = (current + (target.matches(".tui-carousel__next") ? 1 : items.length - 1)) % items.length;
      if (slide) { slide.dataset.slide = String(next); slide.textContent = items[next]; }
      if (count) count.textContent = `${next + 1} / ${items.length}`;
      setStatus(`Carousel · ${next + 1} / ${items.length}`);
      return;
    }
    if (target.matches(".tui-checkbox input, .tui-switch input, .tui-radio-group input")) {
      const owner = target.closest(".tui-checkbox, .tui-switch, .tui-radio-group");
      if (owner && target.type !== "radio") owner.dataset.state = target.checked ? "selected" : "default";
      setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "选择控件" })} · ${target.checked ? "选中" : "取消"}`);
      return;
    }
    if (target.matches(".tui-generated__control")) {
      const component = target.closest(".tui-generated--menu, .tui-generated--picker");
      const panel = component?.querySelector(":scope > .tui-generated__menu, :scope > .tui-generated__panel");
      if (panel) {
        const open = panel.hidden;
        closeMenus();
        panel.hidden = !open;
        panel.classList.toggle("is-open", open);
        target.setAttribute("aria-expanded", String(open));
        setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "组件" })} · ${open ? "打开" : "收起"}`);
      }
      return;
    }
    if (target.matches(".tui-generated__disclosure")) {
      const content = target.parentElement?.querySelector(":scope > .tui-generated__disclosure-content");
      const open = target.getAttribute("aria-expanded") !== "true";
      target.setAttribute("aria-expanded", String(open));
      if (content) content.hidden = !open;
      setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "披露组件" })} · ${open ? "展开" : "收起"}`);
      return;
    }
    if (target.matches(".tui-generated__tab")) {
      const tablist = target.closest('[role="tablist"]');
      tablist?.querySelectorAll('[role="tab"]').forEach((tab) => {
        const selected = tab === target;
        tab.classList.toggle("is-selected", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      setStatus(`Tabs · ${target.textContent.trim()}`);
      return;
    }
    if (target.matches('.tui-generated__menu [role="menuitem"]')) {
      const component = target.closest(".tui-generated--menu");
      const value = component?.querySelector('[data-slot="value"]');
      if (value) value.textContent = target.textContent.trim();
      closeMenus();
      setStatus(`已选择 ${target.textContent.trim()}`);
      return;
    }
    if (target.matches(".tui-sidebar-item")) {
      target.closest(".tui-sidebar")?.querySelectorAll(".tui-sidebar-item").forEach((item) => { if (!item.disabled) item.dataset.state = item === target ? "selected" : "default"; });
      setStatus(`Sidebar · ${target.textContent.trim()}`);
    } else if (target.matches(".tui-list-card")) {
      target.dataset.state = "selected";
      target.setAttribute("aria-pressed", "true");
      setStatus(`List Card · ${target.querySelector('[data-slot="title"]')?.textContent.trim() ?? "已选择"}`);
    } else if (target.matches(".tui-item")) {
      setStatus(`Item · ${target.querySelector('[data-slot="title"]')?.textContent.trim() ?? "已触发"}`);
    } else if (target.matches(".tui-pagination button")) {
      const pagination = target.closest(".tui-pagination");
      const pages = [...(pagination?.querySelectorAll("button[data-page]") ?? [])];
      const current = Number(pagination?.querySelector('[aria-current="page"]')?.dataset.page ?? 1);
      const raw = target.dataset.page;
      const next = raw === "prev" ? Math.max(1, current - 1) : raw === "next" ? Math.min(pages.filter((button) => !["prev", "next"].includes(button.dataset.page)).length, current + 1) : Number(raw);
      pages.forEach((button) => button.removeAttribute("aria-current"));
      pagination?.querySelector(`button[data-page="${next}"]`)?.setAttribute("aria-current", "page");
      setStatus(`Pagination · 第 ${next} 页`);
    } else if (target.matches(".tui-breadcrumb a")) {
      event.preventDefault();
      setStatus(`Breadcrumb · ${target.textContent.trim()}`);
    } else if (target.matches(".tui-button")) {
      setStatus(`${componentTitle(runtimeComponents.find((item) => item.id === id) ?? { logicalName: "组件" })} · 已触发`);
    }
  };
  const onKeydown = (event) => {
    if (event.key === "Escape") {
      const layer = [...root.querySelectorAll(".tui-overlay-layer:not([hidden])")].at(-1);
      if (layer) { event.preventDefault(); closeOverlay(layer, "取消"); return; }
    }
    const target = event.target.closest?.(".tui-select__trigger, .tui-select__menu [role=option], .tui-tabs__list [role=tab], .tui-advanced-menu__trigger, .tui-picker__trigger");
    if (!target || !root.contains(target)) return;
    if (event.key === "Escape") { event.preventDefault(); closeMenus(); (target.closest(".tui-select, .tui-advanced-menu, .tui-advanced-menubar, .tui-picker")?.querySelector(".tui-select__trigger, .tui-advanced-menu__trigger, .tui-picker__trigger"))?.focus(); return; }
    if (target.matches('[role="tab"]') && ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const tabs = [...target.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]') ?? []];
      const index = Math.max(0, tabs.indexOf(target));
      const next = tabs[(index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : tabs.length - 1)) % tabs.length];
      next?.focus(); next?.click();
      return;
    }
    if (!target.matches('[role="option"]')) return;
    const options = [...target.closest(".tui-select__menu")?.querySelectorAll('[role="option"]') ?? []];
    if (!options.length || !["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const index = Math.max(0, options.indexOf(target));
    options[(index + (event.key === "ArrowDown" ? 1 : options.length - 1)) % options.length].focus();
  };
  const onChange = (event) => {
    const control = event.target.closest?.("[data-semi-axis]");
    if (!control || !root.contains(control)) return;
    const example = control.closest('[data-overlay-example="semi-modal"]');
    const layer = example?.querySelector('[data-overlay-id="semi-modal"]');
    if (!layer) return;
    layer.dataset[control.dataset.semiAxis] = control.value;
    const dialog = layer.querySelector(".tui-dialog--semi");
    if (dialog) {
      dialog.setAttribute("aria-modal", String(layer.dataset.mode === "modal"));
      dialog.dataset.variant = `${layer.dataset.size}-${layer.dataset.surface}-${layer.dataset.mode}`;
      dialog.querySelectorAll("[data-field-control]").forEach((field) => { field.dataset.surface = layer.dataset.surface; });
    }
    setStatus(`Semi-modal · ${layer.dataset.size.toUpperCase()} · ${layer.dataset.surface} · ${layer.dataset.mode}`);
  };
  const onInput = (event) => {
    const input = event.target.closest(".tui-search input, .tui-field__control input, .tui-textarea textarea, .tui-generated--field input, .tui-generated--field textarea, .tui-input-otp__cell, .tui-slider input");
    if (!input || !root.contains(input)) return;
    const search = input.closest(".tui-search");
    const clear = search?.querySelector("[data-slot=clear]");
    if (clear) clear.hidden = !input.value;
    search?.dataset && (search.dataset.variant = input.value ? "with-value" : "default");
    if (input.matches(".tui-input-otp__cell") && input.value) {
      const cells = [...input.closest(".tui-input-otp__cells")?.querySelectorAll(".tui-input-otp__cell") ?? []];
      cells[cells.indexOf(input) + 1]?.focus();
    }
    if (input.matches(".tui-slider input")) input.closest(".tui-slider")?.querySelector("output")?.replaceChildren(document.createTextNode(input.value));
  };
  const onFocusin = (event) => {
    const input = event.target.closest?.(".tui-input input, .tui-search input, .tui-textarea textarea");
    if (!input || !root.contains(input) || input.disabled) return;
    const owner = input.closest(".tui-input, .tui-search, .tui-textarea");
    if (!owner || owner.dataset.state === "error") return;
    owner.dataset.state = "focus";
  };
  const onFocusout = (event) => {
    const input = event.target.closest?.(".tui-input input, .tui-search input, .tui-textarea textarea");
    if (!input || !root.contains(input)) return;
    const owner = input.closest(".tui-input, .tui-search, .tui-textarea");
    if (!owner || owner.dataset.state === "error" || input.disabled) return;
    owner.dataset.state = input.value ? "filled" : "default";
  };
  const onDocumentClick = (event) => { if (!root.contains(event.target)) closeMenus(); };
  const directOverlayAbort = new AbortController();
  root.querySelectorAll("[data-overlay-trigger]").forEach((trigger) => trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const layer = root.querySelector(`[data-overlay-id="${CSS.escape(trigger.dataset.overlayTrigger)}"]`);
    if (!layer) return;
    overlayTriggers.set(layer, trigger);
    layer.hidden = false;
    const dialog = layer.querySelector(".tui-dialog");
    dialog && (dialog.dataset.state = "open");
    queueMicrotask(() => dialog?.focus());
    setStatus(`${dialog?.dataset.component === "alert-dialog" ? "Alert Dialog" : dialog?.dataset.component === "semi-modal" ? "Semi-modal" : "Dialog"} · 已打开`);
  }, { signal: directOverlayAbort.signal }));
  root.querySelectorAll("[data-overlay-close], [data-overlay-action]").forEach((control) => control.addEventListener("click", (event) => {
    event.stopPropagation();
    const action = control.dataset.overlayAction;
    closeOverlay(control.closest(".tui-overlay-layer"), action === "confirm" ? control.textContent.trim() : action === "cancel" ? "取消" : "关闭");
  }, { signal: directOverlayAbort.signal }));
  root.addEventListener("click", onClick);
  root.addEventListener("input", onInput);
  root.addEventListener("focusin", onFocusin);
  root.addEventListener("focusout", onFocusout);
  root.addEventListener("keydown", onKeydown);
  root.addEventListener("change", onChange);
  document.addEventListener("click", onDocumentClick);
  return () => {
    delete root.dataset.interactionsBound;
    root.removeEventListener("click", onClick);
    root.removeEventListener("input", onInput);
    root.removeEventListener("focusin", onFocusin);
    root.removeEventListener("focusout", onFocusout);
    root.removeEventListener("keydown", onKeydown);
    root.removeEventListener("change", onChange);
    document.removeEventListener("click", onDocumentClick);
    directOverlayAbort.abort();
  };
};

export function mountHtmlRuntime(container, { onStatus = () => {} } = {}) {
  container.dataset.framework = "html";
  container.innerHTML = `<div class="tui-runtime-directory-grid" data-runtime-framework="html">${runtimeCategories.map(renderCategory).join("")}<p class="status" aria-live="polite">${escapeHtml(cardDescription(runtimeComponents.find((item) => item.id === "button") ?? { status: "partial" }))}</p></div>`;
  return bindRuntimeInteractions(container, onStatus);
}
