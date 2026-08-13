import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const canonicalCss = read("text-to-ui/preview/component-gallery.css");
const fixtureCss = read("text-to-ui/fixtures/framework-component-contract/shared/interactive-components.css");
const packageCss = read("packages/component-styles/src/index.css");
const compatibilityCss = read("packages/component-contracts/src/components.css");
const gallery = read("apps/component-gallery/index.html");
const galleryCss = read("apps/component-gallery/gallery.css");
const galleryRuntime = read("apps/component-gallery/preview.js");
const contracts = JSON.parse(read("packages/component-contracts/src/components.json"));
const iconAliases = JSON.parse(read("text-to-ui/assets/icons/icon-aliases.json"));
const sprite = read("packages/components-html/src/component-icons.svg");

const failures = [];
const requireText = (source, text, label) => { if (!source.includes(text)) failures.push(`${label}: missing ${text}`); };

for (const token of [
  "--height-button",
  "--padding-button-x",
  "--gap-button-icon-label",
  "--type-body-l-size",
  "--type-body-m-size",
  "--height-input",
  "--height-titlebar-sm",
  "--height-titlebar-md",
  "--height-titlebar-lg",
  "--height-titlebar-xl",
  "--size-icon-button",
  "--color-sidebar-selected",
  "--state-layer-pressed"
]) requireText(canonicalCss, token, "canonical Skill CSS");

for (const selector of [
  ".tui-button",
  ".tui-input",
  ".tui-search",
  ".tui-sidebar-item",
  ".tui-list-card",
  ".tui-titlebar[data-size=\"small\"]",
  ".tui-titlebar[data-size=\"medium\"]",
  ".tui-titlebar[data-size=\"large\"]",
  ".tui-titlebar[data-size=\"xlarge\"]",
  ".tui-button--icon[data-variant=\"ghost\"]",
  ".tui-split-button__control > .tui-button[data-variant=\"ghost\"]"
]) requireText(packageCss, selector, "component contract CSS");
for (const token of ["--height-button", "--padding-button-x", "--type-body-l-size", "--height-input", "--height-titlebar-sm", "--height-titlebar-md", "--height-titlebar-lg", "--height-titlebar-xl", "--size-icon-button", "--color-sidebar-selected", "--state-layer-pressed"]) requireText(packageCss, token, "component contract CSS");
for (const rule of [
  "min-width: var(--size-icon-button)",
  "max-width: var(--size-icon-button)",
  "border: 2px solid var(--color-input-hover-border-on-subtle)",
  "linear-gradient(var(--color-input-hover-bg-on-subtle-layer)",
  "padding-inline: 11px",
  ".tui-titlebar[data-state=\"unfocus\"]"
]) requireText(packageCss, rule, "component geometry/state CSS");
requireText(fixtureCss, ".hm-sidebar-item[data-state=\"selected\"]", "framework fixture CSS");
requireText(gallery, "/legacy-skill/preview/component-gallery.html", "component gallery canonical baseline");
requireText(gallery, "/legacy-skill/preview/framework-component-contract/preview.html", "component gallery framework runtime baseline");
requireText(galleryRuntime, 'import "../../packages/components-html/src/styles.css"', "component gallery component stylesheet entry");
requireText(galleryRuntime, 'import "./framework-runtime.css"', "component gallery runtime stylesheet entry");
requireText(galleryRuntime, 'import "./gallery.css"', "component gallery shell stylesheet entry");
if (galleryCss.includes("@import")) failures.push("component gallery shell CSS must not contain unresolved imports");
requireText(compatibilityCss, "../../component-styles/src/index.css", "component contract compatibility stylesheet");

if (Object.values(iconAliases.aliases).some((entry) => entry.source === "harmonyos")) failures.push("HarmonyOS icon aliases are forbidden; use pinned Lucide or an approved special asset");
if (sprite.includes("data-harmonyos-symbol")) failures.push("component icon sprite still contains HarmonyOS symbols");
if (packageCss.includes("tui-icon--filled")) failures.push("component CSS still exposes the removed Filled icon mode");
for (const relative of [
  "packages/components-html/src/icon-map.js",
  "packages/components-react/src/icon-map.js",
  "packages/components-vue/src/icon-map.js",
  "packages/components-html/src/search.html",
  "packages/components-html/src/sidebar.html",
  "packages/components-html/src/list-card.html"
]) {
  const source = read(relative);
  if (source.includes('data-icon-kind="filled"') || source.includes("tui-icon--filled") || source.includes('"kind": "filled"')) failures.push(`${relative}: contains removed Filled icon mode`);
}
const collectIconFiles = (directory) => fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap((entry) => {
  const relative = path.join(directory, entry.name);
  return entry.isDirectory() ? collectIconFiles(relative) : [relative];
});
const filledHarmonyFiles = collectIconFiles("text-to-ui/assets/icons/harmonyos").filter((file) => /(?:^|_)fill(?:ed)?(?:_|\.svg$)/i.test(path.basename(file)));
if (filledHarmonyFiles.length) failures.push(`HarmonyOS Filled asset files remain: ${filledHarmonyFiles.length}`);

for (const component of contracts.components) {
  for (const alias of component.iconAliases ?? []) {
    const symbolId = `tui-${alias.replaceAll("/", "-")}`;
    if (!sprite.includes(`id=\"${symbolId}\"`)) failures.push(`${component.id}: icon alias ${alias} missing from sprite`);
  }
}

const titlebar = contracts.components.find((component) => component.id === "titlebar");
const expectedTitlebarSpecimens = ["small-normal", "small-unfocus", "medium-normal", "medium-unfocus", "large-normal", "large-unfocus", "xlarge-normal", "xlarge-unfocus"];
if (JSON.stringify(titlebar?.specimens?.map((specimen) => specimen.id)) !== JSON.stringify(expectedTitlebarSpecimens)) failures.push("titlebar: S/M/L/XL Normal/Unfocus specimens are incomplete");
for (const value of ["standalone", "two-column", "three-column"]) if (!titlebar?.structuralAxes?.layout?.includes(value)) failures.push(`titlebar: missing layout axis ${value}`);
for (const value of ["global", "primary-navigation", "secondary-pane", "final-pane"]) if (!titlebar?.structuralAxes?.paneRole?.includes(value)) failures.push(`titlebar: missing paneRole axis ${value}`);
if (titlebar?.slotContracts?.["main-content-title"]?.activeWhen?.layout !== "two-column") failures.push("titlebar: two-column title slot contract is missing");
if (titlebar?.slotContracts?.["main-detail-actions"]?.activeWhen?.layout !== "three-column") failures.push("titlebar: three-column Main Detail action slot contract is missing");
if (titlebar?.dividerRules?.["two-column"]?.["primary-navigation"] !== "no-horizontal-divider") failures.push("titlebar: two-column primary-navigation divider rule is missing");
if (titlebar?.dividerRules?.["two-column"]?.["final-pane"] !== "no-horizontal-divider") failures.push("titlebar: two-column final-pane divider rule is missing");
if (titlebar?.dividerRules?.["three-column"]?.["primary-navigation"] !== "no-horizontal-divider") failures.push("titlebar: three-column primary-navigation divider rule is missing");
if (titlebar?.dividerRules?.["three-column"]?.["final-pane"] !== "bottom-divider") failures.push("titlebar: three-column final-pane divider rule is missing");
for (const rule of [
  ".tui-titlebar {",
  "border-bottom: 0",
  ".tui-titlebar[data-layout=\"two-column\"][data-pane-role=\"final-pane\"] { border-bottom: 0",
  ".tui-titlebar[data-layout=\"three-column\"][data-pane-role=\"final-pane\"] { border-bottom: var(--layout-navigation-divider-width) solid var(--color-border)"
]) requireText(packageCss, rule, "Titlebar layout CSS");
const input = contracts.components.find((component) => component.id === "input");
if (input?.allowedStates?.includes("selected")) failures.push("input: selected is not a legal input state");
const search = contracts.components.find((component) => component.id === "search");
if (!search?.slots?.includes("advanced-search")) failures.push("search: advanced-search slot is missing");
if (search?.slotContracts?.["advanced-search"]?.defaultPlacement !== "trailing-after-clear") failures.push("search: advanced-search placement contract is missing");
if (JSON.stringify(search?.slotContracts?.["advanced-search"]?.coexistenceOrder) !== JSON.stringify(["clear", "advanced-search"])) failures.push("search: clear and advanced-search order is invalid");
if (search?.slotContracts?.["advanced-search"]?.control !== "small-text-button") failures.push("search: advanced-search must use a small text button");
if (search?.slotContracts?.["advanced-search"]?.variant !== "ghost") failures.push("search: advanced-search button variant must be ghost");
if (search?.slotContracts?.["advanced-search"]?.size !== "small") failures.push("search: advanced-search button size must be small");
if (search?.slotContracts?.["advanced-search"]?.mode !== "text") failures.push("search: advanced-search button mode must be text");
if (search?.slotContracts?.["advanced-search"]?.trailingInsetToken !== "space/2") failures.push("search: advanced-search trailing inset must use space/2");
requireText(packageCss, ".tui-search__advanced", "Search advanced slot CSS");
requireText(packageCss, ".tui-search__advanced { flex: 0 0 auto;", "Search advanced text button sizing");
requireText(packageCss, ".tui-search:has([data-slot=\"advanced-search\"]) { padding-right: var(--space-2);", "Search advanced trailing inset");
const textarea = contracts.components.find((component) => component.id === "textarea");
if (JSON.stringify(textarea?.specimens?.map((specimen) => specimen.surface)) !== JSON.stringify(["white", "gray"])) failures.push("textarea: white/gray surface specimens are incomplete");
if (JSON.stringify(textarea?.allowedStates) !== JSON.stringify(["default", "hover", "focus", "filled", "error", "disabled"])) failures.push("textarea: state matrix must match Input without selected");
if (textarea?.allowedStates?.includes("selected")) failures.push("textarea: selected is not a legal textarea state");
for (const rule of [
  ".tui-textarea[data-surface=\"gray\"][data-state=\"hover\"] > textarea",
  ".tui-textarea[data-surface=\"gray\"][data-state=\"focus\"] > textarea",
  "padding-inline: 11px",
  "--min-height-textarea"
]) requireText(packageCss, rule, "textarea parity CSS");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Component style parity: ok (canonical Skill rules, contract adapters, and icon aliases are aligned)");
