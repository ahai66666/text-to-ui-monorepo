import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function requirePath(relativePath, kind = "path") {
  if (!exists(relativePath)) {
    errors.push(`missing ${kind}: ${relativePath}`);
  }
}

function readText(relativePath) {
  try {
    return fs.readFileSync(absolute(relativePath), "utf8");
  } catch (error) {
    errors.push(`cannot read file: ${relativePath} (${error.message})`);
    return "";
  }
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    errors.push(`invalid JSON: ${relativePath} (${error.message})`);
    return null;
  }
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function walkFiles(relativeDirectory) {
  const directory = absolute(relativeDirectory);
  if (!fs.existsSync(directory)) return [];

  const files = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    if ([".DS_Store", "node_modules", "outputs"].includes(entry.name)) continue;
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(relativePath));
    else if (entry.isFile()) files.push(relativePath);
  }
  return files.sort();
}

function relativeSourcePath(source) {
  return String(source ?? "").split("#", 1)[0];
}

for (const directory of [
  "text-to-ui",
  "skill",
  "packages",
  "packages/tokens",
  "packages/component-contracts",
  "packages/component-styles",
  "packages/components-html",
  "packages/components-react",
  "packages/components-vue",
  "packages/pixso-mapping",
  "apps/component-gallery",
  "tools",
  "docs",
  "fixtures",
]) {
  requirePath(directory, "directory");
}

for (const file of [
  "README.md",
  "package.json",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml",
  "text-to-ui/SKILL.md",
  "text-to-ui/README.md",
  "text-to-ui/package.json",
  "text-to-ui/references/component-package-integration.md",
  "skill/SKILL.md",
  "skill/README.md",
  "skill/package.json",
  "skill/references/component-package-integration.md",
  "packages/component-contracts/src/components.json",
  "apps/component-gallery/index.html",
]) {
  requirePath(file, "file");
}

const rootPackage = readJson("package.json") ?? {};
const workspace = readText("pnpm-workspace.yaml");
const rootReadme = readText("README.md");
const canonicalSkill = readText("text-to-ui/SKILL.md");
const requirementSpec = readText("text-to-ui/references/requirement-spec.md");

assert(rootPackage.private === true, "root package must remain private");
assert(rootPackage.packageManager === "pnpm@10.0.0", "root package must pin pnpm@10.0.0");
assert(
  rootPackage.scripts?.["delivery:validate"] === "node tools/validate-repository-delivery.mjs",
  "root package must expose delivery:validate",
);
assert(
  rootPackage.scripts?.test?.includes("pnpm delivery:validate"),
  "root test script must run delivery:validate first",
);
assert(workspace.includes('packages:\n  - "packages/*"\n  - "apps/*"'), "workspace must include packages/* and apps/*");
assert(rootReadme.includes("完整代码仓交付边界"), "root README must document complete-repository delivery");
assert(rootReadme.includes("pnpm delivery:validate"), "root README must document delivery:validate");
assert(canonicalSkill.includes("Mandatory Gate 0: analyze, propose, confirm"), "Text-to-UI Skill must keep the requirement-analysis gate");
assert(canonicalSkill.includes("Confirmation: pending"), "Text-to-UI Skill must expose a pending confirmation state");
assert(canonicalSkill.includes("Do not silently infer confirmation"), "Text-to-UI Skill must require explicit confirmation");
assert(canonicalSkill.includes("Before confirmation, do **not** create or modify page HTML"), "Text-to-UI Skill must block page generation before confirmation");
assert(requirementSpec.includes("The proposal must also expose the task model"), "requirement spec must preserve task-model analysis");
assert(requirementSpec.includes("Do not start a renderer or create a page artifact while confirmation is `pending`"), "requirement spec must block renderers while pending");

const registry = readJson("packages/component-contracts/src/components.json") ?? {};
const components = Array.isArray(registry.components) ? registry.components : [];
const frameworks = ["html", "react", "vue"];
assert(components.length > 0, "component registry must contain components");

for (const [index, component] of components.entries()) {
  const implementations = component?.implementations ?? {};
  for (const framework of frameworks) {
    const source = relativeSourcePath(implementations[framework]);
    assert(source.length > 0, `component ${index} is missing ${framework} implementation`);
    if (source) {
      assert(exists(source), `component ${component.id ?? index} ${framework} source is missing: ${source}`);
    }
  }
}

const mirroredFiles = [
  "SKILL.md",
  "README.md",
  "package.json",
  "references/component-package-integration.md",
  "references/requirement-spec.md",
  "references/progressive-review-gates.md",
  "references/components/source-resolution.md",
  "references/layouts/framework-layout-routing.md",
  "references/workflows/fast-preview.md",
  "references/workflows/release-validation.md",
  "references/index/generated/task-router.json",
  "references/index/generated/layout-index.json",
  "references/index/generated/component-index.json",
  "references/index/generated/token-index.json",
  "references/index/generated/validation-index.json",
  "scripts/locate-monorepo.mjs",
  "scripts/query-layouts.mjs",
  "scripts/query-components.mjs",
  "scripts/query-tokens.mjs",
  "scripts/resolve-context.mjs",
  "scripts/validate-navigation-index.mjs",
  "scripts/verify-fast-preview.mjs",
];
for (const relativePath of mirroredFiles) {
  const canonicalPath = path.join("text-to-ui", relativePath);
  const mirrorPath = path.join("skill", relativePath);
  requirePath(canonicalPath, "canonical Skill file");
  requirePath(mirrorPath, "Skill mirror file");
  if (exists(canonicalPath) && exists(mirrorPath)) {
    const canonical = fs.readFileSync(absolute(canonicalPath));
    const mirror = fs.readFileSync(absolute(mirrorPath));
    if (!canonical.equals(mirror)) errors.push(`Skill mirror differs: ${relativePath}`);
  }
}

if (errors.length > 0) {
  console.error("repository delivery validation failed");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        ok: true,
        repositoryRoot: root,
        componentCount: components.length,
        frameworks,
        mirroredFiles,
      },
      null,
      2,
    ),
  );
}
