#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync, spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "tui-framework-page-"));
const node = process.execPath;
const run = (script, args) => spawnSync(node, [path.join(root, "text-to-ui/scripts", script), ...args], { cwd: root, encoding: "utf8" });
const contexts = {};
for (const framework of ["html", "react", "vue"]) {
  const output = path.join(temp, `${framework}-context.json`);
  const result = run("resolve-context.mjs", ["--task", "tasks", "--framework", framework, "--mode", "fast-preview", "--confirmed", "--out", output]);
  assert.equal(result.status, 0, result.stderr);
  contexts[framework] = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.equal(contexts[framework].renderer.framework, framework);
}
assert.equal(new Set(Object.values(contexts).map((context) => context.patternContract.patternDigest)).size, 1, "all framework Context Packets must share one Pattern digest");

const layout = path.join(temp, "layout-contract.json");
let result = run("generate-layout-contract.mjs", ["--context", path.join(temp, "html-context.json"), "--out", layout]);
assert.equal(result.status, 0, result.stderr);
const blueprint = path.join(temp, "page-blueprint.json");
const testBlueprint = { schemaVersion: 1, id: "task-workbench", task: "任务工作台", user: "工作人员", workObject: "task", primaryJob: "处理任务", designRationale: "列表驱动详情并保持稳定导航", pattern: { id: "pattern-b-three-pane" }, regions: [{ id: "primary-navigation", purpose: "应用和导航" }, { id: "secondary-list", purpose: "任务列表" }, { id: "main-detail", purpose: "任务详情" }], contentGroups: [{ id: "navigation-content", region: "primary-navigation", purpose: "导航内容", order: 0, priority: "supporting" }, { id: "task-list", region: "secondary-list", purpose: "任务列表", order: 1, priority: "primary", dataEntities: ["task"] }, { id: "task-detail", region: "main-detail", purpose: "任务详情", order: 2, priority: "primary", dataEntities: ["task"] }], dataEntities: [{ id: "task", fields: ["title", "assignee", "status"] }], interactions: [{ id: "compose", sourceGroup: "navigation-content", targetGroup: "task-detail", trigger: "activate create", stateChange: "open task panel", preserves: ["Pattern shell"], taskOutcome: "打开任务面板" }, { id: "select-route", sourceGroup: "navigation-content", targetGroup: "task-list", trigger: "select route", stateChange: "replace task collection", preserves: ["Pattern shell"], taskOutcome: "切换任务分组" }, { id: "select-app", sourceGroup: "navigation-content", targetGroup: "task-list", trigger: "select app", stateChange: "replace task collection", preserves: ["Pattern shell"], taskOutcome: "切换应用" }, { id: "filter-list", sourceGroup: "task-list", targetGroup: "task-list", trigger: "type query", stateChange: "filter task collection", preserves: ["Pattern shell"], taskOutcome: "筛选任务" }, { id: "more-actions", sourceGroup: "task-detail", targetGroup: "task-detail", trigger: "activate more", stateChange: "open actions", preserves: ["Pattern shell"], taskOutcome: "打开操作菜单" }], states: [{ id: "selected", kind: "selection", appliesTo: ["task-list", "task-detail"] }, { id: "empty", kind: "empty", appliesTo: ["task-list"] }], successCriteria: ["能够选择并处理任务"], recoveryPaths: ["无结果时可恢复查看全部"], design: { readingOrder: ["primary-navigation", "secondary-list", "main-detail"], informationPriority: ["task-list", "task-detail"], regionResponsibilities: [{ region: "primary-navigation", responsibility: "应用和导航" }, { region: "secondary-list", responsibility: "任务筛选和选择" }, { region: "main-detail", responsibility: "任务处理" }], contentDensity: { "primary-navigation": "compact", "secondary-list": "comfortable", "main-detail": "comfortable" }, primaryActionIds: ["compose"], secondaryActionIds: ["select-route", "select-app", "filter-list", "more-actions"], relationships: [{ from: "task-list", to: "task-detail", kind: "selection" }], stateMatrix: [{ stateId: "selected", appliesTo: ["task-list", "task-detail"], entryCondition: "选择任务", recovery: "恢复默认任务" }, { stateId: "empty", appliesTo: ["task-list"], entryCondition: "筛选无结果", recovery: "清除筛选" }] } };
testBlueprint.design = { readingOrder: ["primary-navigation", "secondary-list", "main-detail"], informationPriority: ["task-list", "task-detail"], regionResponsibilities: [{ region: "primary-navigation", responsibility: "应用和导航" }, { region: "secondary-list", responsibility: "任务筛选和选择" }, { region: "main-detail", responsibility: "任务处理" }], contentDensity: { "primary-navigation": "compact", "secondary-list": "comfortable", "main-detail": "comfortable" }, primaryActionIds: ["compose"], secondaryActionIds: ["select-route", "select-app", "filter-list", "more-actions"], relationships: [{ from: "task-list", to: "task-detail", kind: "selection" }], stateMatrix: [{ stateId: "selected", appliesTo: ["task-list", "task-detail"], entryCondition: "选择任务", recovery: "恢复默认任务" }, { stateId: "empty", appliesTo: ["task-list"], entryCondition: "筛选无结果", recovery: "清除筛选" }] };
fs.writeFileSync(blueprint, JSON.stringify(testBlueprint, null, 2));
const bindings = path.join(temp, "bindings.json");
const contentRecipes = path.join(temp, "page-content-recipes.json");
const pageCss = path.join(temp, "page.css");
fs.writeFileSync(pageCss, ".task-list { display: grid; gap: var(--gap-button-group); color: var(--color-text); }\n");
fs.writeFileSync(contentRecipes, JSON.stringify({ schemaVersion: 1, blueprintRef: { id: "task-workbench" }, recipes: [
  { id: "navigation-recipe", contentGroupId: "navigation-content", region: "primary-navigation", compositionId: "nav-stack", kind: "registered-composition", bindingIds: ["title", "compose", "navigation", "primary-nav"] },
  { id: "task-row-recipe", contentGroupId: "task-list", region: "secondary-list", compositionId: "search-area", kind: "page-composite", entityId: "task", bindingIds: ["search"], fields: ["title", "assignee", "status"], states: ["default", "selected"], missingCapability: "task work-item row with assignee and status", registryQueries: ["repeated-list-row"], reviewedCandidates: [{ logicalName: "List Item/White Surface/Default", rejectionReason: "does not expose task assignee and status fields" }], tokenRoles: ["spacing.component-gap", "color.surface"], disposition: "page-owned" },
  { id: "detail-recipe", contentGroupId: "task-detail", region: "main-detail", compositionId: "detail-actions", kind: "registered-composition", bindingIds: ["action"] }
] }, null, 2));
fs.writeFileSync(bindings, `${JSON.stringify({ componentBindings: [
  { id: "title", logicalName: "Titlebar/Default", semanticContext: "global-titlebar", options: { layout: "three-column", segmentRole: "primary-navigation" }, slots: { label: "任务" }, region: "primary-navigation", slot: "global-title-layer" },
  { id: "compose", logicalName: "Button/Primary/Default", semanticContext: "page-primary-action", behaviorId: "compose", options: { label: "新增", variant: "primary", size: "standard", mode: "text" }, region: "primary-navigation", slot: "global-primary-action" },
  { id: "navigation", logicalName: "Sidebar Item/Default", semanticContext: "secondary-navigation", behaviorId: "select-route", options: { items: [{ label: "任务", icon: "navigation/grid", selected: true }] }, region: "primary-navigation", slot: "secondary-navigation-content" },
  { id: "primary-nav", logicalName: "Primary Navigation Item/Level 1", semanticContext: "primary-navigation-shell", behaviorId: "select-app", options: { label: "任务", ariaLabel: "任务", icon: "navigation/mail-unread", selected: true }, region: "primary-navigation", slot: "primary-navigation-bottom" },
  { id: "search", logicalName: "Search/White Surface/Default", semanticContext: "secondary-list-search", behaviorId: "filter-list", options: { surface: "white" }, region: "secondary-list" },
  { id: "action", logicalName: "Button/Primary/Default", semanticContext: "titlebar-main-detail-actions", behaviorId: "more-actions", options: { label: "更多", variant: "ghost", size: "small", mode: "icon" }, region: "main-detail", slot: "main-detail-actions" }
], patternMode: { navigation: "two-level" }, patternShell: { navigation: { mode: "two-level", slots: {
  "global-title-layer": [{ kind: "component", bindingId: "title" }],
  "global-primary-action": [{ kind: "component", bindingId: "compose" }],
  "secondary-navigation-content": [{ kind: "group", id: "nav-stack", tag: "nav", children: [{ kind: "component", bindingId: "navigation" }] }],
  "primary-navigation-bottom": [{ kind: "component", bindingId: "primary-nav" }]
} } }, stylePlan: { schemaVersion: 1, compositions: [
  { id: "nav-stack", region: "primary-navigation", tokenRoles: ["spacing.component-gap"], componentBoundary: "preserve" },
  { id: "search-area", region: "secondary-list", tokenRoles: ["spacing.component-gap"], componentBoundary: "preserve" },
  { id: "detail-actions", region: "main-detail", tokenRoles: ["spacing.component-gap"], componentBoundary: "preserve" }
] }, behaviorPlan: { schemaVersion: 1, interactions: [
  { id: "compose", kind: "open-overlay", triggerBindingIds: ["compose"], outcome: "打开新建面板" },
  { id: "select-route", kind: "set-selected", triggerBindingIds: ["navigation"], outcome: "切换二级导航" },
  { id: "select-app", kind: "set-selected", triggerBindingIds: ["primary-nav"], outcome: "切换一级应用" },
  { id: "filter-list", kind: "filter-collection", triggerBindingIds: ["search"], outcome: "更新列表结果" },
  { id: "more-actions", kind: "component-native", triggerBindingIds: ["action"], outcome: "打开操作菜单" }
] }, composition: { regions: {
  "secondary-list": [{ kind: "group", id: "search-area", tag: "section", children: [{ kind: "text", id: "heading", tag: "h1", text: "任务" }, { kind: "component", bindingId: "search" }] }],
  "main-detail": [{ kind: "group", id: "detail-actions", tag: "header", children: [{ kind: "component", bindingId: "action" }] }]
} } }, null, 2)}\n`);

const iconFallbackFixture = JSON.parse(fs.readFileSync(bindings, "utf8"));
iconFallbackFixture.componentBindings.find((binding) => binding.id === "action").options.icon = "mail/does-not-exist";
const invalidIconBindings = path.join(temp, "invalid-icon-bindings.json");
fs.writeFileSync(invalidIconBindings, JSON.stringify(iconFallbackFixture));

const manifests = [];
fs.writeFileSync(path.join(temp, 'business-list.js'), `export function mount(host, { renderComponent }) {
  const rows = ['路线评审', '设计更新'];
  host.innerHTML = '<h2>收件箱</h2>' + rows.map((label, index) => '<div data-row="' + index + '" tabindex="0" role="button">' + label + '</div>').join('') + renderComponent('button', { label: '刷新', variant: 'ghost', size: 'small', mode: 'text' }) + '<p data-selection>请选择邮件</p>';
  const select = (event) => { const row = event.target.closest('[data-row]'); if (row && (event.type === 'click' || event.key === 'Enter')) host.querySelector('[data-selection]').textContent = rows[Number(row.dataset.row)]; };
  host.addEventListener('click', select); host.addEventListener('keydown', select);
  return () => { host.removeEventListener('click', select); host.removeEventListener('keydown', select); };
}`);
for (const framework of ["html", "react", "vue"]) {
  const bindingInput = JSON.parse(fs.readFileSync(bindings, 'utf8'));
  bindingInput.pageModules = framework === 'html' ? [{ compositionId: 'search-area', source: './business-list.js' }] : [];
  fs.writeFileSync(bindings, JSON.stringify(bindingInput));
  const output = path.join(temp, `page-${framework}.${framework === "react" ? "jsx" : "js"}`);
  const manifest = path.join(temp, `${framework}-manifest.json`);
  const componentUsage = path.join(temp, `${framework}-component-usage.json`);
  const entry = path.join(temp, `entry-${framework}.${framework === "react" ? "jsx" : "js"}`);
  const generationArgs = ["--context", path.join(temp, `${framework}-context.json`), "--layout-contract", layout, "--bindings", bindings, "--out", output, "--entry-out", entry, "--manifest", manifest];
  if (framework === "html") generationArgs.push("--component-usage", componentUsage);
  generationArgs.push("--blueprint", blueprint, "--content-recipes", contentRecipes, "--page-css", pageCss, "--require-blueprint", "--require-content-recipes", "--require-slots");
  result = run("generate-framework-page.mjs", generationArgs);
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(fs.readFileSync(manifest, "utf8"));
  assert.equal(parsed.targetFramework, framework);
  assert.equal(parsed.iconResolution.policy, "registered-alias-required");
  assert.equal(parsed.iconResolution.diagnostics.length, 0);
  assert.ok(parsed.generatedSource?.sha256);
  assert.ok(parsed.generatedEntry?.sha256);
  assert.ok(parsed.uiScene?.sha256);
  assert.equal(JSON.parse(fs.readFileSync(path.join(path.dirname(manifest), parsed.uiScene.path), "utf8")).kind, "text-to-ui-scene");
  assert.ok(fs.existsSync(entry));
  if (framework === "html") {
    assert.ok(parsed.componentUsage?.sha256);
    const usage = JSON.parse(fs.readFileSync(componentUsage, "utf8"));
    assert.equal(usage.enforcement, "strict-source");
    assert.equal(usage.registered.length, 5);
  }
  manifests.push(parsed);
  const source = fs.readFileSync(output, "utf8");
  assert.match(source, /"structureDigest"/);
  assert.match(source, /export const stylePlan/);
  assert.match(source, /export const behaviorPlan/);
  assert.match(source, /export const pageContentRecipes/);
  assert.match(fs.readFileSync(entry, "utf8"), /GeneratedPage|mountGeneratedPage/);
  assert.match(source, new RegExp(`@text-to-ui/components-${framework}`));
  if (framework === "html") {
    assert.match(source, /renderPatternHtml/);
    assert.match(source, /"primary-navigation-bottom"/);
    assert.match(source, /@text-to-ui\/pattern-runtime\/styles\.css/);
    assert.match(source, /tui-pattern-runtime__title-segments/, "Pattern B title slots must compose into one pane-aligned global title layer");
    assert.match(fs.readFileSync(entry, "utf8"), /bindTitlebarOverflow/, "HTML entries must mount Titlebar overflow behavior");
  }
}
const literalPageCss = path.join(temp, "literal-page.css");
fs.writeFileSync(literalPageCss, ".task-list { color: #123456; padding: 12px; }\n");
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", bindings, "--out", path.join(temp, "literal-page.js"), "--entry-out", path.join(temp, "literal-page-entry.js"), "--manifest", path.join(temp, "literal-page.json"), "--component-usage", path.join(temp, "literal-page-usage.json"), "--blueprint", blueprint, "--content-recipes", contentRecipes, "--page-css", literalPageCss, "--require-blueprint", "--require-content-recipes", "--require-slots"]);
assert.notEqual(result.status, 0, "literal page CSS must block generation before an artifact is written");
assert.match(result.stderr, /Page CSS Token preflight failed/);
assert.equal(fs.existsSync(path.join(temp, "literal-page.js")), false, "failed Token preflight must not leave a page module");
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", invalidIconBindings, "--out", path.join(temp, "invalid-icon.js"), "--entry-out", path.join(temp, "invalid-icon-entry.js"), "--manifest", path.join(temp, "invalid-icon.json"), "--component-usage", path.join(temp, "invalid-icon-usage.json"), "--blueprint", blueprint, "--content-recipes", contentRecipes, "--page-css", pageCss, "--require-blueprint", "--require-content-recipes", "--require-slots"]);
assert.notEqual(result.status, 0, "unregistered icons must block page generation");
assert.match(result.stderr, /Icon resolution failed/);
const galleryDefaultBindings = JSON.parse(fs.readFileSync(bindings, "utf8"));
delete galleryDefaultBindings.componentBindings.find((binding) => binding.id === "navigation").options;
const galleryDefaultPath = path.join(temp, "gallery-default-bindings.json");
fs.writeFileSync(galleryDefaultPath, JSON.stringify(galleryDefaultBindings));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", galleryDefaultPath, "--out", path.join(temp, "gallery-default.js"), "--entry-out", path.join(temp, "gallery-default-entry.js"), "--manifest", path.join(temp, "gallery-default.json"), "--component-usage", path.join(temp, "gallery-default-usage.json"), "--blueprint", blueprint, "--content-recipes", contentRecipes, "--page-css", pageCss, "--require-blueprint", "--require-content-recipes", "--require-slots"]);
assert.notEqual(result.status, 0, "business pages must not inherit Sidebar gallery defaults");
assert.match(result.stderr, /business-page Sidebar requires explicit options\.items or options\.groups/);
const overlappingCustom = JSON.parse(fs.readFileSync(bindings, "utf8"));
overlappingCustom.custom = [{ id: "handwritten-button", missingCapability: "custom button", registryQueries: ["button"], contractQueries: ["canonical button contract"], reviewedCandidates: [], tokenRoles: ["color.primary"], disposition: "page-owned", exceptionKind: "no-matching-component" }];
const overlappingCustomPath = path.join(temp, "overlapping-custom.json");
fs.writeFileSync(overlappingCustomPath, JSON.stringify(overlappingCustom));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", overlappingCustomPath, "--out", path.join(temp, "overlapping-custom.js"), "--entry-out", path.join(temp, "overlapping-custom-entry.js"), "--manifest", path.join(temp, "overlapping-custom.json"), "--component-usage", path.join(temp, "overlapping-custom-usage.json"), "--blueprint", blueprint, "--content-recipes", contentRecipes, "--page-css", pageCss, "--require-blueprint", "--require-content-recipes", "--require-slots"]);
assert.notEqual(result.status, 0, "page-owned custom UI must not overlap an available component");
assert.match(result.stderr, /overlaps available html component/);
assert.equal(new Set(manifests.map((manifest) => manifest.patternContract.structureDigest)).size, 1, "HTML, React, and Vue must share one structure digest");
assert.equal(new Set(manifests.map((manifest) => manifest.navigationMode)).size, 1, "HTML, React, and Vue must share one navigation shell mode");

const invalidBindings = path.join(temp, "invalid-bindings.json");
fs.writeFileSync(invalidBindings, JSON.stringify({ componentBindings: [{ logicalName: "Button/Primary/Default", semanticContext: "page-primary-action", options: { label: "新增", variant: "primary", size: "standard", mode: "text" }, region: "invented-pane" }] }));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", bindings, "--out", path.join(temp, "missing-blueprint.js"), "--entry-out", path.join(temp, "missing-blueprint-entry.js"), "--manifest", path.join(temp, "missing-blueprint.json"), "--component-usage", path.join(temp, "missing-blueprint-usage.json"), "--require-blueprint"]);
assert.notEqual(result.status, 0, "new page generation must require a page blueprint");
assert.match(result.stderr, /requires --blueprint/);
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", invalidBindings, "--out", path.join(temp, "invalid.js"), "--entry-out", path.join(temp, "invalid-entry.js"), "--manifest", path.join(temp, "invalid.json")]);
assert.notEqual(result.status, 0, "an adapter must not invent a Pattern region");
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", bindings, "--out", path.join(temp, "missing-usage.js"), "--entry-out", path.join(temp, "missing-usage-entry.js"), "--manifest", path.join(temp, "missing-usage.json")]);
assert.notEqual(result.status, 0, "HTML generation must require component-usage evidence output");
const flatBindings = path.join(temp, "flat-bindings.json");
const flatInput = JSON.parse(fs.readFileSync(bindings, "utf8"));
delete flatInput.composition;
fs.writeFileSync(flatBindings, JSON.stringify(flatInput));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", flatBindings, "--out", path.join(temp, "flat.js"), "--entry-out", path.join(temp, "flat-entry.js"), "--manifest", path.join(temp, "flat.json"), "--component-usage", path.join(temp, "flat-usage.json")]);
assert.notEqual(result.status, 0, "HTML generation must reject a flat component inventory without page composition");
assert.match(result.stderr, /flat component list is not a complete page/);
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", bindings, "--out", path.join(temp, "missing-recipes.js"), "--entry-out", path.join(temp, "missing-recipes-entry.js"), "--manifest", path.join(temp, "missing-recipes.json"), "--component-usage", path.join(temp, "missing-recipes-usage.json"), "--blueprint", blueprint, "--page-css", pageCss, "--require-blueprint", "--require-content-recipes"]);
assert.notEqual(result.status, 0, "new page generation must require content recipes");
assert.match(result.stderr, /requires --content-recipes/);
const ambiguousBindings = JSON.parse(fs.readFileSync(bindings, "utf8"));
delete ambiguousBindings.componentBindings.find((binding) => binding.logicalName === "Button/Primary/Default").semanticContext;
const ambiguousPath = path.join(temp, "ambiguous-bindings.json");
fs.writeFileSync(ambiguousPath, JSON.stringify(ambiguousBindings));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", ambiguousPath, "--out", path.join(temp, "ambiguous.js"), "--entry-out", path.join(temp, "ambiguous-entry.js"), "--manifest", path.join(temp, "ambiguous.json"), "--component-usage", path.join(temp, "ambiguous-usage.json")]);
assert.notEqual(result.status, 0, "ambiguous component families must require semanticContext");
assert.match(result.stderr, /semanticContext is required/);
const misplacedNavigation = JSON.parse(fs.readFileSync(bindings, "utf8"));
misplacedNavigation.componentBindings.find((binding) => binding.id === "primary-nav").slot = "secondary-navigation-content";
const misplacedPath = path.join(temp, "misplaced-navigation.json");
fs.writeFileSync(misplacedPath, JSON.stringify(misplacedNavigation));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", misplacedPath, "--out", path.join(temp, "misplaced.js"), "--entry-out", path.join(temp, "misplaced-entry.js"), "--manifest", path.join(temp, "misplaced.json"), "--component-usage", path.join(temp, "misplaced-usage.json"), "--require-slots"]);
assert.notEqual(result.status, 0, "two-level navigation must reject a primary item outside its bottom slot");
assert.match(result.stderr, /requires semanticContext secondary-navigation/);
const missingStylePlan = JSON.parse(fs.readFileSync(bindings, "utf8"));
delete missingStylePlan.stylePlan;
const missingStylePlanPath = path.join(temp, "missing-style-plan.json");
fs.writeFileSync(missingStylePlanPath, JSON.stringify(missingStylePlan));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", missingStylePlanPath, "--out", path.join(temp, "missing-style.js"), "--entry-out", path.join(temp, "missing-style-entry.js"), "--manifest", path.join(temp, "missing-style.json"), "--component-usage", path.join(temp, "missing-style-usage.json")]);
assert.notEqual(result.status, 0, "page-owned composition must declare its Style Plan before generation");
assert.match(result.stderr, /requires stylePlan/);
const missingBehaviorPlan = JSON.parse(fs.readFileSync(bindings, "utf8"));
delete missingBehaviorPlan.behaviorPlan;
const missingBehaviorPlanPath = path.join(temp, "missing-behavior-plan.json");
fs.writeFileSync(missingBehaviorPlanPath, JSON.stringify(missingBehaviorPlan));
result = run("generate-framework-page.mjs", ["--context", path.join(temp, "html-context.json"), "--layout-contract", layout, "--bindings", missingBehaviorPlanPath, "--out", path.join(temp, "missing-behavior.js"), "--entry-out", path.join(temp, "missing-behavior-entry.js"), "--manifest", path.join(temp, "missing-behavior.json"), "--component-usage", path.join(temp, "missing-behavior-usage.json")]);
assert.notEqual(result.status, 0, "interactive components must declare their Behavior Plan before generation");
assert.match(result.stderr, /requires behaviorPlan/);
if (process.env.TUI_PLAYWRIGHT_MODULE) {
  result = run('scaffold-standalone-project.mjs', ['--project', temp, '--repo', root, '--entry', './entry-html.js']);
  assert.equal(result.status, 0, result.stderr);
  result = spawnSync('pnpm', ['install', '--ignore-scripts'], { cwd: temp, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  result = spawnSync('pnpm', ['build'], { cwd: temp, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const { chromium } = await import(pathToFileURL(process.env.TUI_PLAYWRIGHT_MODULE));
  const server = spawn(process.execPath, [path.join(temp, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '0'], { cwd: temp, stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  try {
    const url = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 15000);
      server.stdout.on('data', (chunk) => { const match = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+\//); if (match) { clearTimeout(timeout); resolve(match[0]); } });
      server.on('exit', (code) => { clearTimeout(timeout); reject(new Error('Preview exited: ' + code)); });
    });
    browser = await chromium.launch({ headless: true, ...(process.env.TUI_BROWSER_EXECUTABLE ? { executablePath: process.env.TUI_BROWSER_EXECUTABLE } : {}) });
    const page = await browser.newPage({ viewport: { width: 1728, height: 1152 } });
    const errors = []; page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url);
    await page.locator('[data-row="1"]').click();
    assert.equal(await page.locator('[data-selection]').textContent(), '设计更新');
    await page.locator('[data-row="0"]').focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-selection]').textContent(), '路线评审');
    const geometry = await page.evaluate(() => {
      const box = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
      const style = (selector) => {
        const node = document.querySelector(selector);
        const computed = getComputedStyle(node);
        return { paddingInlineStart: computed.paddingInlineStart, paddingInlineEnd: computed.paddingInlineEnd, paddingBlockStart: computed.paddingBlockStart, paddingBlockEnd: computed.paddingBlockEnd };
      };
      return { nav: box('[data-pattern-region="primary-navigation"]'), list: box('[data-pattern-region="secondary-list"]'), title: box('[data-pattern-title-segment="secondary-list"]'), bottom: box('[data-pattern-shell-slot="primary-navigation-bottom"]'), listBody: style('[data-pattern-region="secondary-list"] > [data-pattern-scroll-body]'), detailBody: style('[data-pattern-region="main-detail"] > [data-pattern-scroll-body]') };
    });
    assert.equal(geometry.nav.width, 240); assert.equal(geometry.list.width, 360); assert.equal(geometry.title.height, 64);
    assert.deepEqual(geometry.listBody, { paddingInlineStart: "16px", paddingInlineEnd: "16px", paddingBlockStart: "8px", paddingBlockEnd: "0px" });
    assert.deepEqual(geometry.detailBody, { paddingInlineStart: "24px", paddingInlineEnd: "24px", paddingBlockStart: "16px", paddingBlockEnd: "0px" });
    assert.ok(geometry.bottom.y > 1000); assert.deepEqual(errors, []);
    await page.screenshot({ path: path.join(temp, 'browser-proof.png'), fullPage: true });
    // A second imported CSS file must not bypass build-time shell ownership.
    fs.writeFileSync(path.join(temp, 'extra.css'), '[data-pattern] { grid-template-columns: 264px 512px 1fr; }');
    fs.appendFileSync(path.join(temp, 'main.js'), '\nimport "./extra.css";\n');
    result = spawnSync('pnpm', ['build'], { cwd: temp, encoding: 'utf8' });
    assert.notEqual(result.status, 0); assert.match(result.stderr + result.stdout, /Pattern-owned/);
    console.log('Browser verified: mounted entry, executable composite, pointer/keyboard interaction, 240/360 panes, 64px title, bottom navigation, imported CSS protection.');
  } finally { await browser?.close(); server.kill(); }
}
if (process.env.TUI_KEEP_FIXTURE) console.log('Fixture retained: ' + temp);
else fs.rmSync(temp, { recursive: true, force: true });
console.log("Cross-framework Pattern page generation tests passed.");
