import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(
  fs.readFileSync(path.join(root, "assets/design-system/pixso-component-registry.json"), "utf8"),
);
const specs = JSON.parse(
  fs.readFileSync(path.join(root, "assets/design-system/pixso-component-specs.json"), "utf8"),
);
const aliases = JSON.parse(
  fs.readFileSync(path.join(root, "assets/icons/icon-aliases.json"), "utf8"),
).aliases;
const css = fs.readFileSync(path.join(root, "preview/component-gallery.css"), "utf8");

const names = Object.values(registry.categories).flat();
const specNames = Object.keys(specs.components);
const errors = [];

for (const name of names) {
  const item = specs.components[name];
  if (!item) {
    errors.push(`Missing component spec: ${name}`);
    continue;
  }
  if (!item.autoLayout) errors.push(`Auto Layout must be required: ${name}`);
  if (!item.sizing?.masterWidth || !item.sizing?.placementWidth || item.sizing?.height == null) {
    errors.push(`Incomplete sizing contract: ${name}`);
  }
  const selectorClasses = [...(item.previewSelector ?? "").matchAll(/\.([a-zA-Z0-9_-]+)/g)]
    .map((match) => `.${match[1]}`);
  if (!item.previewSelector || !selectorClasses.some((className) => css.includes(className))) {
    errors.push(`Preview selector is not represented in gallery CSS: ${name} -> ${item.previewSelector}`);
  }
  for (const style of Object.values(item.textRoles ?? {})) {
    if (!specs.shared.typographyPolicy.styles.includes(style)) {
      errors.push(`Unknown text style ${style} in ${name}`);
    }
  }
}

for (const name of specNames) {
  if (!names.includes(name)) errors.push(`Orphan component spec: ${name}`);
}

for (const [pattern, value] of Object.entries(registry.semanticIcons)) {
  for (const alias of Array.isArray(value) ? value : [value]) {
    if (!aliases[alias]) errors.push(`Missing icon alias ${alias} for ${pattern}`);
  }
}

if (specs.shared.alphaPolicy.rule !== "token-alpha-only") {
  errors.push("Alpha policy must be token-alpha-only.");
}
if (specs.shared.alphaPolicy.layerOpacity !== 1) {
  errors.push("Default layer opacity must be 1.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Pixso component specs valid: ${specNames.length} specs, complete registry coverage.`);
