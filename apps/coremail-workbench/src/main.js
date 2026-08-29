import "@text-to-ui/components-html/styles.css";
import { bindTitlebarOverflow, renderHtmlComponent } from "@text-to-ui/components-html";
import { iconMarkup } from "../../../packages/components-html/src/icon-map.js";
import pageData from "../pixso/page-data.json";
import "./page.css";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const node = (markup) => {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
};
const component = (name, options = {}) => node(renderHtmlComponent(name, options));
const icon = (name, size = 20) => iconMarkup(name, { size });

const accounts = pageData.accounts ?? [];
const primaryApps = pageData.primaryApps ?? [];
const detail = pageData.detail ?? {};
const detailActions = pageData.detailActions ?? [];
const messages = pageData.mailList?.items ?? [];

const app = document.querySelector("#app");
app.innerHTML = `
  <main class="desktop-shell" aria-label="Coremail 邮件工作台首页">
    <section class="workbench" data-pattern="Mail Workbench/Three Pane">
      <aside class="app-nav" aria-label="应用导航栏">
        <div class="nav-titlebar"></div>
        <div class="compose-slot"></div>
        <div class="account-block">
          <button class="account-switch" type="button" aria-label="切换邮箱账户">
            <span class="account-avatar">${accounts[0]?.email?.[0]?.toUpperCase() ?? "M"}</span>
            <span class="account-copy"><strong>${accounts[0]?.email ?? ""}</strong><small>企业邮箱</small></span>
            ${icon("navigation/chevron-down", 16)}
          </button>
        </div>
        <div class="folder-scroll">
          <div class="nav-section-label">收藏夹</div>
          <nav class="folder-nav" aria-label="邮箱文件夹"></nav>
        </div>
        <nav class="app-switcher" aria-label="Coremail 应用"></nav>
      </aside>
      <div class="splitter splitter-nav" role="separator" aria-label="调整应用导航栏宽度" aria-orientation="vertical"></div>
      <section class="mail-list-pane" aria-label="邮件列表区">
        <header class="list-header">
          <div class="search-row"><div class="scope-filter"></div><div class="search-slot"></div><div class="advanced-slot"></div></div>
          <div class="inbox-heading"><h1>${pageData.mailList?.title ?? "收件箱"}</h1><div class="list-tools"></div></div>
        </header>
        <div class="message-scroll" role="list" aria-label="收件箱邮件"></div>
      </section>
      <div class="splitter splitter-reader" role="separator" aria-label="调整邮件列表宽度" aria-orientation="vertical"></div>
      <section class="reader-pane" aria-label="邮件阅读区">
        <header class="reader-toolbar"><div class="mail-actions"></div><div class="window-actions"></div></header>
        <article class="reader-scroll">
            <div class="message-head">
            <div class="message-kicker"><span class="unread-dot"></span> ${pageData.mailList?.title ?? "收件箱"}</div>
            <h2>${pageData.detail?.subject ?? messages[0]?.subject ?? "Q2 路线评审会：材料更新与会前确认"}</h2>
            <div class="sender-row"><div class="sender-avatar"></div><div><strong>${pageData.detail?.sender?.name ?? messages[0]?.sender ?? "林简"}</strong><p>产品策略组 &lt;${pageData.detail?.sender?.email ?? messages[0]?.email ?? "linjian@calendarpro.io"}&gt;</p></div><div class="message-meta"><time>${pageData.detail?.time ?? messages[0]?.time ?? "10:42"}</time><span>发送给 我、产品体验团队</span></div></div>
          </div>
          <div class="mail-body">
            <p>${pageData.detail?.paragraphs?.[0] ?? "各位好，"}</p>
            <p>${pageData.detail?.paragraphs?.[1] ?? "Q2 路线评审材料已经更新。"}</p>
            <div class="update-card">
              <strong>${detail.roadmap?.title ?? "本次更新"}</strong>
              <ul>${(detail.orderedItems ?? []).map((item) => `<li>${item}</li>`).join("")}</ul>
            </div>
            <p>请大家在周四 14:00 评审会前完成确认。如有阻塞项，请直接在材料中评论并 @ 对应负责人。</p>
            <p>谢谢。</p>
            <p class="signature">${pageData.detail?.sender?.name ?? "林简"}<br><span>产品策略组</span></p>
            <section class="attachment-section"><header><strong>附件 ${(detail.attachments ?? []).length}</strong><span>正文附件</span></header><div class="attachments"></div></section>
          </div>
        </article>
      </section>
      <button class="restore-reader" type="button" hidden aria-label="恢复邮件阅读区">${icon("navigation/back", 20)}<span>打开阅读区</span></button>
    </section>
    <div class="overlay-host"></div>
    <div class="toast-host" aria-live="polite"></div>
  </main>`;

function makeButton(label, iconName, { variant = "ghost", mode = "icon", title = label, action = "" } = {}) {
  const el = component("button", { label, iconName, variant, mode });
  el.title = title;
  if (action) el.dataset.action = action;
  return el;
}

function populateTitlebar() {
  const brandName = pageData.brand?.name ?? "Coremail";
  const bar = component("titlebar", { label: brandName, size: "medium" });
  bar.classList.add("brand-titlebar");
  const leading = $("[data-slot='leading']", bar);
  leading.innerHTML = `<span class="coremail-logo">${brandName[0] ?? "C"}</span><span data-slot="label">${brandName}</span>`;
  const actions = $("[data-slot='actions']", bar);
  actions.replaceChildren(makeButton("收起导航栏", "navigation/panel-left", { action: "toggle-nav" }));
  $(".nav-titlebar").append(bar);
}

function populateSidebar() {
  const compose = makeButton(pageData.primaryAction?.label ?? "写邮件", "action/add", { variant: "primary", mode: "icon-text", action: "compose" });
  compose.classList.add("compose-button");
  $(".compose-slot").append(compose);
  const nav = component("sidebar");
  nav.classList.add("mail-folder-component");
  nav.replaceChildren();
  for (const [accountIndex, account] of accounts.entries()) {
    if (accountIndex > 0) {
      const accountLabel = document.createElement("div");
      accountLabel.className = "nav-section-label";
      accountLabel.textContent = account.email;
      nav.append(accountLabel);
    }
    for (const folder of account.folders ?? []) {
      const item = document.createElement("button");
      item.className = "tui-sidebar-item";
      item.type = "button";
      item.dataset.state = folder.selected ? "selected" : "default";
      item.setAttribute("aria-current", folder.selected ? "page" : "false");
      item.innerHTML = `<span data-slot="leading">${icon(folder.icon, 20)}</span><span data-slot="label">${folder.label}</span>${folder.count ? `<span class="tui-sidebar-item__count" data-slot="trailing">${folder.count}</span>` : ""}`;
      nav.append(item);
    }
  }
  $(".folder-nav").append(nav);
  const switcher = $(".app-switcher");
  primaryApps.forEach((appItem) => {
    const { label, icon: iconName, selected = false } = appItem;
    const btn = makeButton(label, iconName, { mode: "icon-text", action: `app-${label}` });
    btn.classList.add("app-entry");
    btn.dataset.state = selected ? "selected" : "default";
    switcher.append(btn);
  });
}

function populateListHeader() {
  const scope = component("button", { label: "全部", variant: "secondary", mode: "selection-dropdown" });
  $(".scope-filter").append(scope);
  const search = component("search", { placeholder: "搜索邮件" });
  $(".search-slot").append(search);
  $(".advanced-slot").append(makeButton("高级", "action/filter", { variant: "secondary", mode: "icon-text", action: "advanced-search" }));
  const tools = $(".list-tools");
  tools.append(
    makeButton("刷新", "action/refresh", { action: "refresh" }),
    makeButton("多选", "action/multi-select", { action: "multi-select" }),
    makeButton("筛选和排序", "action/filter", { action: "filter" })
  );
}

function makeCheckbox() {
  const checkbox = component("checkbox", { checked: false });
  checkbox.setAttribute("aria-label", "选择邮件");
  $$('[data-slot="label"], [data-slot="description"]', checkbox).forEach((el) => el.remove());
  return checkbox;
}

function makeMailCard(mail, index) {
  const card = component("listCard");
  card.classList.add("mail-card");
  card.dataset.index = index;
  card.dataset.state = index === 0 ? "selected" : mail.unread ? "unread" : "default";
  card.dataset.variant = index === 0 ? "selected" : "default";
  card.setAttribute("aria-pressed", index === 0 ? "true" : "false");
  card.replaceChildren();
  const checkbox = makeCheckbox();
  checkbox.classList.add("mail-checkbox");
  const content = document.createElement("span");
  content.className = "mail-card-content";
  content.innerHTML = `<span class="sender-line"><strong>${mail.sender}</strong>${mail.unread ? '<i class="unread-dot" aria-label="未读"></i>' : ""}</span><span class="subject-line">${mail.subject}</span><span class="summary-line">${mail.summary}</span>`;
  const meta = document.createElement("span");
  meta.className = "mail-card-meta";
  meta.innerHTML = `<time>${mail.time}</time><span class="mail-signals">${mail.calendar ? `<span title="关联日程">${icon("field/calendar", 16)}</span>` : ""}${mail.attachments ? `<span title="${mail.attachments} 个附件">${icon("object/attachment", 16)}<b>${mail.attachments}</b></span>` : ""}${mail.flagged ? `<span class="is-flagged" title="已旗标">${icon("action/mark-important", 16)}</span>` : ""}</span>`;
  const quick = document.createElement("span");
  quick.className = "mail-quick-actions";
  quick.append(
    makeButton("标记已读", "action/mark-unread", { action: "mark-read" }),
    makeButton("旗标", "action/mark-important", { action: "flag" }),
    makeButton("删除", "action/delete", { action: "delete-message" })
  );
  card.append(checkbox, content, meta, quick);
  return card;
}

function populateMessages() {
  const container = $(".message-scroll");
  let group = "";
  messages.forEach((mail, index) => {
    if (mail.group !== group) {
      group = mail.group;
      const heading = document.createElement("div");
      heading.className = "date-group";
      heading.textContent = group;
      container.append(heading);
    }
    container.append(makeMailCard(mail, index));
  });
}

function populateReader() {
  const toolbar = component("titlebar", {
    size: "medium",
    layout: "three-column",
    paneRole: "final-pane",
    mainDetailActions: detailActions,
    actionOverflow: { strategy: "collapse-to-more", fit: "available-width" }
  });
  toolbar.classList.add("reader-toolbar");
  const close = $("[data-slot='titlebar-action'][data-action='close']", toolbar);
  if (close) {
    close.dataset.action = "hide-reader";
    close.setAttribute("aria-label", "关闭阅读区");
  }
  $(".reader-toolbar").replaceWith(toolbar);
  bindTitlebarOverflow(toolbar, {
    onAction: (action) => showToast(`${action}操作已执行`)
  });
  $(".sender-avatar").append(component("avatar", { initials: detail.sender?.initials ?? "林", name: detail.sender?.name ?? "林简", size: 40 }));
  (detail.attachments ?? []).forEach(({ name, type, meta }) => {
    const attachment = component("attachment", { type, name, meta });
    $(".attachments").append(attachment);
  });
}

function showToast(message) {
  const toast = component("toast");
  toast.classList.add("workbench-toast");
  const text = $("[data-slot='message']", toast) || $("span", toast) || toast;
  text.textContent = message;
  const host = $(".toast-host");
  host.replaceChildren(toast);
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.remove(), 2200);
}

function openCompose() {
  const shell = component("semi-modal");
  const layer = $(".tui-overlay-layer", shell);
  layer.hidden = false;
  layer.dataset.mode = "modal";
  const dialog = $(".tui-dialog", shell);
  dialog.setAttribute("aria-modal", "true");
  $("h4", dialog).textContent = "写邮件";
  const content = $(".tui-dialog__content", dialog);
  content.innerHTML = `<div class="compose-form"><label>收件人<input type="email" placeholder="输入邮箱地址" /></label><label>主题<input type="text" placeholder="输入邮件主题" /></label><label>正文<textarea rows="8" placeholder="输入邮件正文"></textarea></label></div>`;
  const footer = $(".tui-dialog__actions", dialog);
  footer.innerHTML = "";
  footer.append(makeButton("取消", "action/close", { variant: "secondary", mode: "icon-text", action: "close-compose" }), makeButton("发送", "navigation/sent", { variant: "primary", mode: "icon-text", action: "send-compose" }));
  $(".overlay-host").replaceChildren(shell);
  dialog.focus();
}

function setupInteractions() {
  app.addEventListener("click", (event) => {
    const actionNode = event.target.closest("[data-action]");
    const card = event.target.closest(".mail-card");
    if (card && !event.target.closest(".mail-checkbox, .mail-quick-actions")) {
      $$(".mail-card").forEach((el) => { el.dataset.state = "default"; el.dataset.variant = "default"; el.setAttribute("aria-pressed", "false"); });
      card.dataset.state = "selected";
      card.dataset.variant = "selected";
      card.setAttribute("aria-pressed", "true");
      $(".reader-pane").classList.remove("is-hidden");
      $(".restore-reader").hidden = true;
    }
    if (!actionNode) return;
    const action = actionNode.dataset.action;
    if (action === "toggle-nav") {
      $(".workbench").classList.toggle("nav-collapsed");
      showToast($(".workbench").classList.contains("nav-collapsed") ? "导航栏已收起" : "导航栏已展开");
    } else if (action === "compose") openCompose();
    else if (action === "close-compose") $(".overlay-host").replaceChildren();
    else if (action === "send-compose") { $(".overlay-host").replaceChildren(); showToast("邮件已发送"); }
    else if (action === "hide-reader") { $(".reader-pane").classList.add("is-hidden"); $(".restore-reader").hidden = false; }
    else if (action === "refresh") { actionNode.dataset.state = "loading"; setTimeout(() => { actionNode.dataset.state = "default"; showToast("邮件已刷新"); }, 500); }
    else if (action === "delete-message") { event.target.closest(".mail-card")?.remove(); showToast("邮件已移至已删除邮件"); }
    else if (action.startsWith("mail-") || action.startsWith("window-") || ["mark-read", "flag", "filter", "multi-select", "advanced-search"].includes(action)) showToast(`${actionNode.getAttribute("aria-label") || actionNode.textContent.trim()} 操作已执行`);
  });
  $(".restore-reader").addEventListener("click", () => { $(".reader-pane").classList.remove("is-hidden"); $(".restore-reader").hidden = true; });
  const searchInput = $(".tui-search input");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    $$(".mail-card").forEach((card) => { card.hidden = query && !card.textContent.toLowerCase().includes(query); });
    const search = searchInput.closest(".tui-search");
    search.dataset.variant = query ? "with-value" : "default";
    $("[data-slot='clear']", search).hidden = !query;
  });
  $("[data-slot='clear']", searchInput.closest(".tui-search")).addEventListener("click", () => { searchInput.value = ""; searchInput.dispatchEvent(new Event("input")); searchInput.focus(); });
  setupSplitter($(".splitter-reader"), (delta) => {
    const root = $(".workbench");
    const current = parseFloat(getComputedStyle(root).getPropertyValue("--list-width"));
    root.style.setProperty("--list-width", `${Math.min(520, Math.max(300, current + delta))}px`);
  });
}

function setupSplitter(handle, onMove) {
  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    let x = event.clientX;
    handle.setPointerCapture(event.pointerId);
    const move = (next) => { onMove(next.clientX - x); x = next.clientX; };
    const up = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", up); };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
}

window.__bootErrors = [];
[
  ["titlebar", populateTitlebar],
  ["sidebar", populateSidebar],
  ["list-header", populateListHeader],
  ["messages", populateMessages],
  ["reader", populateReader],
  ["interactions", setupInteractions]
].forEach(([stage, run]) => {
  try { run(); }
  catch (error) {
    window.__bootErrors.push({ stage, message: error.message, stack: error.stack });
    document.documentElement.dataset.bootErrors = JSON.stringify(window.__bootErrors);
  }
});

document.documentElement.dataset.componentSource = "@text-to-ui/components-html";
