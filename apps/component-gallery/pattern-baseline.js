import legacyMarkup from "../../text-to-ui/preview/component-gallery.html?raw";
import "./pattern-framework.css";

const patternSectionIds = [
  "primary-navigation-shell",
  "three-pane-list-detail-shell",
  "secondary-page-pattern"
];

const selectAll = (selector, root) => [...root.querySelectorAll(selector)];

const setSelectedNavigationItem = (items, selectedItem) => {
  items.forEach((item) => {
    const selected = item === selectedItem;
    item.classList.toggle("selected", selected);
    if (selected) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
    if (item.dataset.logicalComponent === "Sidebar Item/Default") {
      item.dataset.state = selected ? "selected" : "default";
      item.dataset.variant = selected ? "selected" : "default";
    }
  });
};

const setupTabs = (root) => {
  selectAll("[data-tabs]", root).forEach((tabsRoot) => {
    const tabs = selectAll('[role="tab"]', tabsRoot).filter((tab) => !tab.disabled);
    if (!tabs.length) return;
    const orientation = tabsRoot.dataset.orientation || "horizontal";
    const activation = tabsRoot.dataset.activation || "automatic";
    const activate = (nextTab, moveFocus = false) => {
      tabs.forEach((tab) => {
        const selected = tab === nextTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        const panelId = tab.getAttribute("aria-controls");
        if (panelId) {
          const panel = tabsRoot.querySelector(`#${CSS.escape(panelId)}`);
          if (panel) panel.hidden = !selected;
        }
      });
      tabsRoot.dispatchEvent(new CustomEvent("tabs:change", { detail: { tab: nextTab } }));
      if (moveFocus) nextTab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = index;
        const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
        const previousKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
        if (event.key === nextKey) nextIndex = (index + 1) % tabs.length;
        else if (event.key === previousKey) nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else if (activation === "manual" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          activate(tab, true);
          return;
        } else return;
        event.preventDefault();
        if (activation === "manual") {
          tabs.forEach((candidate, candidateIndex) => { candidate.tabIndex = candidateIndex === nextIndex ? 0 : -1; });
          tabs[nextIndex].focus();
        } else activate(tabs[nextIndex], true);
      });
    });
  });
};

const setupPrimaryNavigation = (root) => {
  selectAll("[data-primary-navigation-shell]", root).forEach((shell) => {
    const section = shell.closest(".section") || shell.parentElement;
    const items = selectAll(".pattern-nav-item", shell);
    const pageTitle = shell.querySelector("[data-pattern-page-title]");
    items.forEach((item) => item.addEventListener("click", () => {
      setSelectedNavigationItem(items, item);
      if (pageTitle) pageTitle.textContent = item.dataset.patternPage || item.getAttribute("aria-label") || "";
    }));

    const collapseButton = shell.querySelector("[data-navigation-collapse]");
    const expandButton = shell.querySelector("[data-navigation-expand]");
    const setCollapsed = (collapsed, moveFocus = false) => {
      shell.dataset.navigationCollapsed = String(collapsed);
      if (collapseButton) {
        collapseButton.hidden = collapsed;
        collapseButton.setAttribute("aria-expanded", String(!collapsed));
      }
      if (expandButton) {
        expandButton.hidden = !collapsed;
        expandButton.setAttribute("aria-expanded", String(!collapsed));
      }
      if (moveFocus) (collapsed ? expandButton : collapseButton)?.focus();
    };
    collapseButton?.addEventListener("click", () => setCollapsed(true, true));
    expandButton?.addEventListener("click", () => setCollapsed(false, true));

    const levelPicker = section?.querySelector("[data-pattern-level-picker]");
    levelPicker?.addEventListener("tabs:change", ({ detail: { tab } }) => {
      const level = tab.dataset.patternLevelControl;
      shell.dataset.navigationLevels = level;
      const activeList = level === "two"
        ? shell.querySelector(".pattern-secondary-navigation .pattern-nav-list")
        : shell.querySelector(".pattern-single-navigation");
      const activeItem = activeList?.querySelector(".pattern-nav-item");
      if (activeItem) {
        setSelectedNavigationItem(items, activeItem);
        if (pageTitle) pageTitle.textContent = activeItem.dataset.patternPage || "";
      }
    });

    const surfacePicker = section?.querySelector("[data-pattern-surface-picker]");
    surfacePicker?.addEventListener("tabs:change", ({ detail: { tab } }) => {
      shell.dataset.contentSurface = tab.dataset.patternSurfaceControl;
    });

    const icons = selectAll(".pattern-primary-level-icon", shell);
    const sectionLabel = shell.querySelector("[data-primary-section-label]");
    icons.forEach((icon) => icon.addEventListener("click", () => {
      icons.forEach((candidate) => {
        const selected = candidate === icon;
        candidate.classList.toggle("selected", selected);
        candidate.setAttribute("aria-pressed", String(selected));
        candidate.dataset.state = selected ? "selected" : "default";
        candidate.dataset.variant = selected ? "selected" : "default";
      });
      if (sectionLabel) sectionLabel.textContent = icon.dataset.primarySection || "";
    }));
  });
};

const setupSecondaryMenus = (root) => {
  selectAll("[data-secondary-menu-trigger]", root).forEach((trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? root.querySelector(`#${CSS.escape(panelId)}`) : null;
    if (!panel) return;
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });
};

const setupSecondaryPages = (root) => {
  selectAll("[data-secondary-page-pattern]", root).forEach((pattern) => {
    const rootTitle = pattern.querySelector("[data-secondary-page-root-title]");
    const childTitle = pattern.querySelector("[data-secondary-page-child-title]");
    const rootPage = pattern.querySelector("[data-secondary-page-root]");
    const childPage = pattern.querySelector("[data-secondary-page-child]");
    const openButton = pattern.querySelector("[data-secondary-page-open]");
    const backButton = pattern.querySelector("[data-secondary-page-back]");
    const setDepth = (depth, moveFocus = true) => {
      const child = depth === "child";
      pattern.dataset.pageDepth = depth;
      if (rootTitle) rootTitle.hidden = child;
      if (rootPage) rootPage.hidden = child;
      if (childTitle) childTitle.hidden = !child;
      if (childPage) childPage.hidden = !child;
      if (moveFocus) (child ? backButton : openButton)?.focus();
    };
    openButton?.addEventListener("click", () => setDepth("child"));
    backButton?.addEventListener("click", () => setDepth("root"));
    pattern.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || pattern.dataset.pageDepth !== "child") return;
      event.preventDefault();
      setDepth("root");
    });
  });

  selectAll("[data-secondary-page-mode-switch]", root).forEach((switcher) => {
    const section = switcher.closest(".section") || switcher.parentElement;
    const buttons = selectAll("[data-secondary-page-mode]", switcher);
    const panels = selectAll("[data-secondary-page-mode-panel]", section);
    const setMode = (mode) => {
      buttons.forEach((button) => {
        const selected = button.dataset.secondaryPageMode === mode;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      panels.forEach((panel) => { panel.hidden = panel.dataset.secondaryPageModePanel !== mode; });
    };
    buttons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.secondaryPageMode)));
  });
};

const setupThreePane = (root) => {
  selectAll("[data-three-pane-list-detail]", root).forEach((pattern) => {
    const rows = selectAll("[data-three-pane-list-item]", pattern);
    rows.forEach((row) => row.addEventListener("click", () => {
      rows.forEach((candidate) => {
        const selected = candidate === row;
        candidate.classList.toggle("selected", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });
    }));
    const input = pattern.querySelector("[data-search-input]");
    const clearButton = pattern.querySelector("[data-search-clear]");
    if (input && clearButton) {
      const syncClearButton = () => { clearButton.hidden = input.value.length === 0; };
      input.addEventListener("input", syncClearButton);
      clearButton.addEventListener("click", () => {
        input.value = "";
        syncClearButton();
        input.focus();
      });
      syncClearButton();
    }

    const sortMenu = pattern.querySelector("[data-three-pane-sort-menu]");
    const sortLabel = sortMenu?.querySelector("[data-three-pane-sort-label]");
    const projectList = pattern.querySelector(".three-pane-project-list");
    const originalRows = rows.slice();
    const sortLabels = {
      updated: "最近更新",
      "name-asc": "名称升序",
      "name-desc": "名称降序"
    };
    if (sortMenu) {
      selectAll("[data-three-pane-sort]", sortMenu).forEach((sortButton) => {
        sortButton.addEventListener("click", () => {
          const sortKey = sortButton.dataset.threePaneSort || "updated";
          const sortedRows = sortKey === "updated"
            ? originalRows
            : originalRows.slice().sort((a, b) => {
              const direction = sortKey === "name-desc" ? -1 : 1;
              return direction * String(a.dataset.title || "").localeCompare(String(b.dataset.title || ""), "zh-CN");
            });
          if (projectList) projectList.replaceChildren(...sortedRows);
          selectAll("[data-three-pane-sort]", sortMenu).forEach((candidate) => {
            candidate.setAttribute("aria-checked", String(candidate === sortButton));
          });
          if (sortLabel) sortLabel.textContent = sortLabels[sortKey] || sortLabels.updated;
          sortMenu.open = false;
        });
      });
    }
  });
};

const setupPatternInteractions = (root) => {
  setupTabs(root);
  setupPrimaryNavigation(root);
  setupSecondaryMenus(root);
  setupSecondaryPages(root);
  setupThreePane(root);
};

export const mountPatternBaseline = (mount) => {
  if (!mount) return;
  const source = new DOMParser().parseFromString(legacyMarkup, "text/html");
  const sections = patternSectionIds
    .map((id) => source.getElementById(id))
    .filter(Boolean);
  if (!sections.length) {
    mount.innerHTML = '<p class="status">Pattern 基线暂时无法加载。</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  const sprite = source.querySelector(".hmos-sprite");
  if (sprite) fragment.append(document.importNode(sprite, true));
  sections.forEach((section) => {
    const card = document.createElement("article");
    card.className = "pattern-baseline-card";
    card.dataset.patternId = section.id;
    card.append(document.importNode(section, true));
    fragment.append(card);
  });
  mount.replaceChildren(fragment);
  mount.dataset.patternReady = "true";
  setupPatternInteractions(mount);
};
