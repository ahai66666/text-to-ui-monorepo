import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(root, "assets/design-system/pixso-component-registry.json");
const iconMapPath = path.join(root, "assets/design-system/pixso-icon-map.json");
const outputPath = path.join(root, "assets/design-system/pixso-component-specs.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const iconMap = JSON.parse(fs.readFileSync(iconMapPath, "utf8"));
const componentNames = Object.values(registry.categories).flat();

const shared = {
  componentStateScope: "static-default-only",
  alphaPolicy: {
    rule: "token-alpha-only",
    layerOpacity: 1,
    exception: "Only whole-component Disabled treatment may bind the disabled opacity token.",
  },
  typographyPolicy: {
    rule: "shared-text-style-required",
    styles: [
      "Title_S",
      "Subtitle_S",
      "Subtitle_M",
      "Body_L",
      "Body_M",
      "Caption_L",
      "Display_M",
    ],
  },
  iconPolicy: {
    aliases: "assets/icons/icon-aliases.json",
    pixsoMap: "assets/design-system/pixso-icon-map.json",
    sourceArtboard: iconMap.sourceArtboard,
    lucide: "exact-package-svg",
    harmonyos: "exact-approved-svg",
    titlebar: "exact-titlebar-svg",
    prohibitIconFontsForGeneratedNodes: true,
    resizeRootAndVectorsTogether: true,
    forbidApproximation: true,
  },
  placementPolicy: {
    autoLayoutRequired: true,
    forbidOverlappingDirectChildren: true,
    pageComposition: "instances-only",
  },
};

const spec = (
  family,
  previewSelector,
  masterWidth,
  placementWidth,
  height,
  textRoles = {},
  extra = {},
) => ({
  family,
  previewSelector,
  sizing: { masterWidth, placementWidth, height },
  autoLayout: true,
  textRoles,
  ...extra,
});

function componentSpec(name) {
  if (name.startsWith("Button/")) {
    return spec("Button", ".btn", "hug", "hug", 40, { Label: "Body_L" }, {
      direction: "horizontal",
      gapToken: null,
      paddingXToken: "padding/button-x",
      radiusToken: "radius/control",
    });
  }
  if (name.startsWith("Icon Text Button/")) {
    return spec("Icon Text Button", ".btn.btn-icon-text", "hug", "hug", 40, { Label: "Body_L" }, {
      direction: "horizontal",
      gapToken: "gap/button-icon-label",
      paddingXToken: "padding/button-x",
      iconSize: 20,
      radiusToken: "radius/control",
    });
  }
  if (name.startsWith("Icon Button/")) {
    return spec("Icon Button", ".icon-btn", 40, "fixed", 40, {}, {
      direction: "horizontal",
      iconSize: 20,
      radiusToken: "radius/control",
    });
  }
  if (name === "Selection Dropdown/Default") {
    return spec("Selection Dropdown", ".selection-dropdown-trigger", "hug", "hug", 40, { Value: "Body_L" }, {
      minWidth: 132,
      direction: "horizontal",
      gapToken: "gap/button-icon-label",
      paddingXToken: "padding/button-x",
      iconSize: 16,
    });
  }
  if (name === "Split Dropdown Button/Icon Text/Default") {
    return spec("Split Dropdown Button", ".split-control", "hug", "hug", 40, { Label: "Body_L" }, {
      direction: "horizontal",
      nestedGroups: ["Main Action", "Dropdown Trigger"],
      gapToken: "gap/button-icon-label",
      iconSizes: [20, 16],
    });
  }
  if (name === "Split Dropdown Button/Icon Only/Default") {
    return spec("Split Dropdown Button", ".split-control", "hug", "hug", 40, {}, {
      direction: "horizontal",
      gapToken: "gap/button-icon-label",
      iconSizes: [20, 16],
    });
  }
  if (name === "Toggle/Off/Default") {
    return spec("Toggle", ".toggle-btn", 56, "fixed", 32, {}, { iconSize: 20 });
  }
  if (name.startsWith("Field/")) {
    return spec("Field", ".form-field", 280, "fill", name.endsWith("With Description") ? 92 : 68, {
      Label: "Body_L",
      Value: "Body_L",
      Description: "Body_M",
    }, {
      direction: "vertical",
      gapToken: "gap/field-label",
      nestedGroups: ["Control"],
    });
  }
  if (/^(Input|Search|Textarea|Select|Combobox)\//.test(name)) {
    const family = name.split("/")[0];
    const selectors = {
      Input: ".field",
      Search: ".field.search",
      Textarea: ".textarea",
      Select: ".select-trigger",
      Combobox: ".combobox-trigger",
    };
    const height = family === "Textarea" ? 80 : 40;
    return spec(family, selectors[family], 280, "fill", height, {
      Value: "Body_L",
      Placeholder: "Body_L",
    }, {
      direction: family === "Textarea" ? "vertical" : "horizontal",
      gapToken: ["Search", "Select", "Combobox"].includes(family) ? "gap/button-icon-label" : null,
      iconSize: ["Search", "Select", "Combobox"].includes(family) ? 16 : null,
      clearActionReserve: family === "Search" ? 32 : null,
    });
  }
  if (name === "Input OTP/Default") {
    return spec("Input OTP", ".otp", "hug", "hug", 44, { Digit: "Body_L" }, {
      direction: "horizontal",
      gapToken: "gap/button-icon-label",
    });
  }
  if (name === "Checkbox/Unchecked/Default") {
    return spec("Checkbox", ".choice", "hug", "hug", 20, { Label: "Body_M" }, {
      direction: "horizontal",
      gapToken: "gap/choice-label",
      controlSize: 20,
    });
  }
  if (name === "Radio/Unselected/Default") {
    return spec("Radio", ".choice", "hug", "hug", 20, { Label: "Body_M" }, {
      direction: "horizontal",
      gapToken: "gap/choice-label",
      controlSize: 20,
    });
  }
  if (name === "Switch/Off/Default") {
    return spec("Switch", ".choice .switch", "hug", "hug", 24, { Label: "Body_M" }, {
      direction: "horizontal",
      gapToken: "gap/choice-label",
      trackSize: [44, 24],
      thumbSize: 20,
    });
  }
  if (name === "Slider/Default") {
    return spec("Slider", ".range-field", 280, "fill", 24, {}, {
      trackHeight: 4,
      thumbSize: 20,
      intentionalOverlapWrapper: "Slider Visual",
    });
  }
  if (name === "Date Picker/Default" || name === "Time Picker/Default") {
    const isDate = name.startsWith("Date");
    return spec(isDate ? "Date Picker" : "Time Picker", isDate ? ".date-picker-trigger" : ".time-picker-trigger", 280, "fill", 40, {
      Value: "Body_L",
    }, {
      direction: "horizontal",
      gapToken: "gap/button-icon-label",
      iconSize: 16,
    });
  }
  if (name.startsWith("Titlebar/")) {
    const size = name.split("/")[1];
    return spec("Titlebar", `.pc-titlebar-${size.toLowerCase()}`, 640, "fill", {
      S: 40,
      M: 56,
      L: 64,
      XL: 72,
    }[size], { "App Name": "Subtitle_M" }, {
      direction: "horizontal",
      transparent: true,
      nestedGroups: ["Leading", "Window Controls"],
      exactAssetIcons: ["window/minimize", "window/maximize", "window/close"],
    });
  }
  if (name === "Sidebar Item/Default") {
    return spec("Sidebar Item", ".nav-link", 240, "fill", 40, { Label: "Body_L" }, {
      direction: "horizontal",
      gapToken: "gap/button-icon-label",
      iconSize: 20,
    });
  }
  if (name === "Sidebar Group Header/Collapsed") {
    return spec("Sidebar Group Header", ".pattern-secondary-heading", 240, "fill", 40, { Label: "Subtitle_S" }, {
      direction: "horizontal",
      iconSize: 16,
    });
  }
  if (name === "Primary Level Icon/Default") {
    return spec("Primary Level Icon", ".pattern-primary-level-icon", 40, "fixed", 40, {}, {
      iconSize: 20,
      exactAssetIcons: ["primary-level/overview"],
      transparent: true,
    });
  }
  if (name.startsWith("Tabs/")) {
    const type = name.split("/")[1];
    return spec("Tabs", type === "Filled" ? ".tabs-filled" : type === "Line" ? ".tabs-line" : ".tabs-vertical", type === "Vertical" ? 220 : 360, "fill", type === "Vertical" ? "hug" : 40, {
      Label: "Body_M",
    }, { direction: type === "Vertical" ? "vertical" : "horizontal" });
  }
  if (name === "Breadcrumb/Default") {
    return spec("Breadcrumb", ".breadcrumb", "hug", "hug", 40, { Label: "Body_M" }, {
      direction: "horizontal",
      gapToken: "gap/breadcrumb-item",
      iconSize: 16,
    });
  }
  if (name === "Pagination Item/Default") {
    return spec("Pagination Item", ".pagination-item", 32, "fixed", 32, { Label: "Body_M" });
  }
  if (name === "Accordion/Collapsed" || name === "Collapsible/Collapsed") {
    const accordion = name.startsWith("Accordion");
    return spec(accordion ? "Accordion" : "Collapsible", accordion ? ".accordion-trigger" : ".collapsible-trigger", 360, "fill", 44, {
      Label: "Body_L",
    }, { direction: "horizontal", iconSize: 16 });
  }
  if (name.startsWith("Card/")) {
    return spec("Card", ".card", 320, "fill", name.endsWith("Header Body Footer") ? 200 : 160, {
      Title: "Title_S",
      Body: "Body_M",
      Footer: "Body_M",
    }, {
      direction: "vertical",
      paddingToken: "padding/card",
      radiusToken: "radius/card",
    });
  }
  if (name === "Metric Card/Default") {
    return spec("Metric Card", ".metric-card", 320, "fill", 148, {
      Label: "Body_M",
      Value: "Display_M",
      Context: "Subtitle_S",
    }, { direction: "vertical", paddingToken: "padding/card" });
  }
  if (name.startsWith("List Item/")) {
    return spec("List Item", ".list-item", 360, "fill", 48, {
      Primary: "Body_L",
      Secondary: "Body_M",
    }, {
      direction: "horizontal",
      gap: 12,
      paddingX: 12,
      radiusToken: "radius/list-item",
    });
  }
  if (name.startsWith("List Container/")) {
    return spec("List Container", ".list", 360, "fill", "hug", {
      Primary: "Body_L",
      Secondary: "Body_M",
    }, { direction: "vertical", gapToken: "gap/list-item" });
  }
  if (name === "Table/Default") {
    return spec("Table", ".table-card", 720, "fill", "hug", {
      Header: "Subtitle_S",
      Cell: "Body_L",
    }, { direction: "vertical", paddingToken: "padding/table" });
  }
  if (name === "Table Header/Default") {
    return spec("Table Header", ".data-table thead tr", 720, "fill", 40, { Cell: "Subtitle_S" }, {
      direction: "horizontal",
    });
  }
  if (name === "Table Row/Default") {
    return spec("Table Row", ".data-table tbody tr", 720, "fill", 48, { Cell: "Body_L" }, {
      direction: "horizontal",
    });
  }
  if (name.startsWith("Badge/")) {
    return spec("Badge", ".badge", "hug", "hug", 24, { Label: "Caption_L" }, {
      direction: "horizontal",
      paddingX: 8,
      radiusToken: "radius/badge",
    });
  }
  if (name.startsWith("Avatar/")) {
    const size = Number(name.split("/")[1]);
    return spec("Avatar", ".avatar", size, "fixed", size, { Initials: "Caption_L" }, {
      iconSize: size === 32 ? 20 : 24,
      radiusToken: "radius/avatar",
    });
  }
  if (name === "Progress/Default") {
    return spec("Progress", ".progress", 320, "fill", 8, {}, {
      intentionalOverlapWrapper: "Progress Visual",
    });
  }
  if (name === "Spinner/Default") {
    return spec("Spinner", ".spinner", 20, "fixed", 20, {}, { exactGeometry: "css-ring" });
  }
  if (name.startsWith("Skeleton/")) {
    const type = name.split("/")[1];
    return spec("Skeleton", ".skeleton", {
      Text: 280,
      Avatar: 48,
      "List Row": 360,
      Card: 320,
    }[type], type === "Text" || type === "Card" || type === "List Row" ? "fill" : "fixed", {
      Text: 52,
      Avatar: 48,
      "List Row": 64,
      Card: 160,
    }[type], {}, {
      direction: type === "List Row" ? "horizontal" : "vertical",
    });
  }
  if (name.startsWith("Alert/")) {
    return spec("Alert", ".alert", 720, "fill", 40, {
      Detail: "Subtitle_S",
      "Text Action": "Body_M",
    }, {
      direction: "horizontal",
      nestedGroups: ["Alert Main", "Alert Actions"],
      iconSize: 20,
      closeTargetSize: 32,
      closeIconSize: 16,
      paddingLeftToken: "padding/alert-left",
      paddingRightToken: "padding/alert-right",
    });
  }
  if (name === "Snackbar/Default") {
    return spec("Snackbar", ".toast", "hug", "hug", 48, { Message: "Body_L" }, {
      minWidth: 240,
      maxWidth: 480,
      effectStyle: "Effect/Foundation/shadow-3",
    });
  }
  if (name === "Tooltip/Default") {
    return spec("Tooltip", ".tooltip", "hug", "hug", "hug", { Message: "Caption_L" }, {
      maxWidth: 240,
      paddingToken: "padding/tooltip",
      effectStyle: "Effect/Foundation/shadow-1",
    });
  }
  throw new Error(`No component specification rule for ${name}`);
}

const components = Object.fromEntries(componentNames.map((name) => [name, componentSpec(name)]));
const output = {
  schemaVersion: 1,
  generatedFrom: [
    "assets/design-system/pixso-component-registry.json",
    "preview/component-gallery.html",
    "preview/component-gallery.css",
    "assets/design-system/tokens.*.json",
    "assets/icons/icon-aliases.json",
    "assets/design-system/pixso-icon-map.json",
  ],
  shared,
  components,
};

const serialized = `${JSON.stringify(output, null, 2)}\n`;
const check = process.argv.includes("--check");
if (check) {
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== serialized) {
    console.error(`Stale or missing: ${outputPath}`);
    process.exit(1);
  }
  console.log(`Pixso component specs current: ${componentNames.length} components.`);
} else {
  fs.writeFileSync(outputPath, serialized);
  console.log(`Wrote ${outputPath} (${componentNames.length} components).`);
}
