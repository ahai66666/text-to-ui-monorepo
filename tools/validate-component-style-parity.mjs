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
const sprite = read("packages/components-html/src/harmonyos-icons.svg");

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

for (const component of contracts.components) {
  for (const alias of component.iconAliases ?? []) {
    const symbolId = `hmos-${alias.replaceAll("/", "-")}`;
    if (!sprite.includes(`id=\"${symbolId}\"`)) failures.push(`${component.id}: icon alias ${alias} missing from sprite`);
  }
}

const titlebar = contracts.components.find((component) => component.id === "titlebar");
const expectedTitlebarSpecimens = ["small-normal", "small-unfocus", "medium-normal", "medium-unfocus", "large-normal", "large-unfocus", "xlarge-normal", "xlarge-unfocus"];
if (JSON.stringify(titlebar?.specimens?.map((specimen) => specimen.id)) !== JSON.stringify(expectedTitlebarSpecimens)) failures.push("titlebar: S/M/L/XL Normal/Unfocus specimens are incomplete");
const input = contracts.components.find((component) => component.id === "input");
if (input?.allowedStates?.includes("selected")) failures.push("input: selected is not a legal input state");
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
