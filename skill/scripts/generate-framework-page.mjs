#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { validateSemanticIcons } from "./page-runtime-preflight.mjs";
import { readPatternRegistry, resolvePatternContract } from "./pattern-contract-lib.mjs";
import { buildPatternStructure, validatePatternBindings } from "./ui-scene-core.mjs";
import { loadReadinessPolicy, resolveComponentReadiness } from "./component-readiness-policy.mjs";
import { blueprintDigest, readPageBlueprint } from "./page-blueprint.mjs";
import { readPageContentRecipes } from "./page-content-recipes.mjs";
import { materialSnapshot } from "./route-material-lib.mjs";
import { normalizePageUiScene } from "./page-ui-scene.mjs";
import { validatePageTokenUsage } from "./page-token-usage-lib.mjs";

const args = process.argv.slice(2);
const valueFor = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : null; };
const contextPath = valueFor("--context");
const layoutPath = valueFor("--layout-contract");
const bindingsPath = valueFor("--bindings") ?? valueFor("--page-spec");
const outputPath = valueFor("--out");
const entryOutputPath = valueFor("--entry-out");
const manifestPath = valueFor("--manifest");
const componentUsagePath = valueFor("--component-usage");
const blueprintPath = valueFor("--blueprint");
const contentRecipesPath = valueFor("--content-recipes");
const pageCssPath = valueFor("--page-css");
const uiSceneOutputPath = valueFor("--ui-scene");
if (!contextPath || !layoutPath || !bindingsPath || !outputPath || !entryOutputPath || !manifestPath) {
  throw new Error("Usage: generate-framework-page.mjs --context <context.json> --layout-contract <layout-contract.json> --blueprint <page-blueprint.json> --content-recipes <page-content-recipes.json> --bindings <page-bindings.json> --out <page module> --entry-out <generated entry module> --manifest <framework-page-manifest.json> [--component-usage <component-usage.json>] [--require-slots]");
}

const read = (file) => JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
const context = read(contextPath);
const layoutContract = read(layoutPath);
const input = read(bindingsPath);
if (context.materialsDigest && Array.isArray(context.materials)) {
  const currentMaterials = materialSnapshot({
    repo: context.repository?.root ?? process.cwd(),
    definitions: context.materials.map(({ path: materialPath, role, required }) => ({ path: materialPath, role, required }))
  });
  if (currentMaterials.digest !== context.materialsDigest) {
    throw new Error(`Context Packet route materials are stale. Expected ${context.materialsDigest}, got ${currentMaterials.digest}. Re-resolve the route before generation.`);
  }
}
if (args.includes("--require-blueprint") && !blueprintPath) throw new Error("New page generation requires --blueprint <page-blueprint.json>");
if (args.includes("--require-content-recipes") && !contentRecipesPath) throw new Error("New page generation requires --content-recipes <page-content-recipes.json>");
if (blueprintPath && !contentRecipesPath) throw new Error("New page generation with a blueprint requires --content-recipes <page-content-recipes.json>");
if (blueprintPath && !pageCssPath) throw new Error("New page generation with a blueprint requires --page-css <page-composition.css> so Pattern boundaries are checked before compilation");
const pageBlueprint = blueprintPath ? readPageBlueprint(blueprintPath, { patternId: layoutContract.pattern }) : null;
if (pageBlueprint && input.blueprintRef && input.blueprintRef.id !== pageBlueprint.id) throw new Error("page-bindings blueprintRef.id does not match page blueprint");
const navigationMode = input.patternMode?.navigation ?? null;
if (context.request?.confirmed !== true || context.request?.confirmation?.status !== "confirmed") throw new Error("Context Packet must be explicitly confirmed");
const framework = context.request?.framework;
if (!context.renderer || context.renderer.framework !== framework) throw new Error(`Context Packet is missing the ${framework} renderer contract`);
if (framework === "html" && !componentUsagePath) throw new Error("HTML page generation requires --component-usage <component-usage.json>");
const resolvedPattern = resolvePatternContract(layoutContract.pattern, { registry: readPatternRegistry(), layoutContract });
if (context.layout?.id !== resolvedPattern.pattern.id) throw new Error("Context Packet Pattern does not match layout-contract Pattern");
const rawBindings = input.componentBindings ?? input.components ?? input.bindings ?? [];
if (!Array.isArray(rawBindings) || rawBindings.length === 0) throw new Error("Bindings must contain at least one registered component");
const available = new Map((context.renderer.components ?? []).map((component) => [component.logicalName, component]));
const selectionRulesPath = path.join(context.repository.root, "text-to-ui/references/components/component-selection-rules.json");
const selectionRules = fs.existsSync(selectionRulesPath) ? read(selectionRulesPath).rules ?? [] : [];
const readinessPolicy = loadReadinessPolicy(path.join(context.repository.root, "text-to-ui"));
const componentRegistry = read(path.join(context.repository.root, "packages/component-contracts/src/components.json")).components;
const iconRegistry = read(path.join(context.repository.root, "text-to-ui/assets/icons/icon-aliases.json")).aliases ?? {};
const iconDiagnostics = [];
const { renderHtmlComponent: preflightRender } = await import(pathToFileURL(path.join(context.repository.root, "packages/components-html/src/index.js")).href);
const registryByLogicalName = new Map(componentRegistry.map((component) => [component.logicalName, component]));
const contextRequiredLogicalNames = new Set(selectionRules.map((rule) => rule.logicalName));
const bindings = rawBindings.map((binding, index) => {
  if (binding.patternSlot && binding.slot && binding.patternSlot !== binding.slot) throw new Error(`${binding.id ?? `binding-${index + 1}`}: slot and patternSlot disagree; use patternSlot for Pattern placement`);
  const renderer = available.get(binding.logicalName);
  if (!renderer) throw new Error(`No ${framework} renderer resolved for binding ${index}: ${binding.logicalName}`);
  const canonicalComponent = registryByLogicalName.get(binding.logicalName);
  if (!canonicalComponent) throw new Error(`No canonical component contract found for binding ${index}: ${binding.logicalName}`);
  const readiness = resolveComponentReadiness(canonicalComponent, readinessPolicy);
  if (!readiness.allowedInFastPreview) throw new Error(`${binding.logicalName}: component readiness is ${readiness.level}; ${readiness.reason}`);
  const slots = binding.slots && typeof binding.slots === "object" && !Array.isArray(binding.slots) ? binding.slots : {};
  const unsupportedSlots = Object.keys(slots).filter((key) => !(renderer.supportedSlots ?? []).includes(key));
  if (unsupportedSlots.length) throw new Error(`${binding.logicalName}: unsupported slots ${unsupportedSlots.join(", ")}`);
  const options = { ...(binding.options ?? {}) };
  if (binding.slot === "primary-navigation-footer" && (canonicalComponent.id !== "button" || options.variant !== "ghost" || options.mode !== "icon-text")) {
    throw new Error('primary-navigation-footer requires a library icon-text-ghost Button (variant=ghost, mode=icon-text)');
  }
  if (canonicalComponent.id === "titlebar" && Object.keys(slots).length) {
    if (options.slots) throw new Error('Titlebar slots must be declared once, on the binding');
    options.slots = slots;
  }
  const slotIcon = [slots.icon, slots.leading].find((value) => typeof value === "string" && value.trim()) ?? null;
  if (renderer.rendererKey === "button" && options.icon == null && slotIcon) options.icon = slotIcon;
  if (renderer.rendererKey === "button" && options.icon == null && typeof options.iconName === "string" && options.iconName.trim()) {
    options.icon = options.iconName;
    delete options.iconName;
  }
  const iconCandidates = [options.icon, options.iconName, slots.icon, slots.leading].filter((value) => typeof value === "string" && value.trim());
  for (const alias of iconCandidates) {
    if (!iconRegistry[alias] && !iconDiagnostics.some((entry) => entry.path === `binding[${index}](${binding.logicalName}).icon` && entry.alias === alias)) {
      iconDiagnostics.push({ bindingId: binding.id ?? `binding-${index + 1}`, logicalName: binding.logicalName, alias, path: `binding[${index}](${binding.logicalName}).icon`, resolution: "unregistered-non-blocking" });
    }
  }
  const nestedIconDiagnostics = validateSemanticIcons(options, iconRegistry, `binding[${index}](${binding.logicalName}).options`);
  for (const entry of nestedIconDiagnostics) {
    if (!iconDiagnostics.some((current) => current.path === entry.path && current.alias === entry.alias)) {
      iconDiagnostics.push({ bindingId: binding.id ?? `binding-${index + 1}`, logicalName: binding.logicalName, ...entry });
    }
  }
  const unsupportedProps = Object.keys(options).filter((key) => !(renderer.supportedProps ?? []).includes(key));
  if (unsupportedProps.length) throw new Error(`${binding.logicalName}: unsupported props ${unsupportedProps.join(", ")}`);
  const semanticContext = binding.semanticContext ?? null;
  if (contextRequiredLogicalNames.has(binding.logicalName) && !semanticContext) throw new Error(`${binding.logicalName}: semanticContext is required; resolve the component with query-components.mjs --context before generation`);
  const selectionRule = semanticContext ? selectionRules.find((rule) => rule.logicalName === binding.logicalName && rule.context === semanticContext) : null;
  if (semanticContext && contextRequiredLogicalNames.has(binding.logicalName) && !selectionRule) throw new Error(`${binding.logicalName}: no component selection rule for semanticContext '${semanticContext}'`);
  // Gallery specimens may use a renderer's illustrative defaults. A business
  // page may not: navigation data is page-owned and must be supplied by the
  // binding so the adapter cannot silently leak demo labels/counts into a
  // generated product surface.
  if (canonicalComponent.id === "sidebar" && semanticContext === "secondary-navigation" && !Object.hasOwn(options, "items") && !Object.hasOwn(options, "groups")) {
    throw new Error(`${binding.logicalName}: business-page Sidebar requires explicit options.items or options.groups; gallery defaults are not allowed`);
  }
  for (const [key, expected] of Object.entries(selectionRule?.requiredOptions ?? {})) {
    const actual = canonicalComponent.id === "titlebar" && key === "paneRole" ? options.segmentRole ?? options.paneRole : options?.[key];
    if (actual !== expected) throw new Error(`${binding.logicalName}: semanticContext '${semanticContext}' requires options.${key}=${JSON.stringify(expected)}`);
  }
  if (selectionRule?.allowedModes && !selectionRule.allowedModes.includes(options?.mode)) throw new Error(`${binding.logicalName}: semanticContext '${semanticContext}' requires mode ${selectionRule.allowedModes.join(" or ")}`);
  // Shared contract preflight catches renderer exceptions before writing any
  // application output. Browser evidence is still required for real mounting.
  try { preflightRender(renderer.rendererKey ?? canonicalComponent.id, options); }
  catch (error) { throw new Error(`Render preflight failed for binding[${index}] ${binding.logicalName}: ${error.message}`, { cause: error }); }
  const expectedRuntimeCount = binding.expectedRuntimeCount ?? binding.count ?? 1;
  if (!Number.isInteger(expectedRuntimeCount) || expectedRuntimeCount < 1) throw new Error(`${binding.logicalName}: expectedRuntimeCount must be a positive integer`);
  return {
    id: binding.id ?? `binding-${index + 1}`,
    logicalName: binding.logicalName,
    rendererKey: renderer.rendererKey,
    exportName: renderer.exportName,
    region: binding.region ?? binding.pane,
    slot: binding.patternSlot ?? binding.slot ?? null,
    patternSlot: binding.patternSlot ?? binding.slot ?? null,
    componentSlot: binding.componentSlot ?? null,
    options,
    slots,
    semanticContext,
    behaviorId: binding.behaviorId ?? null,
    expectedRuntimeCount,
    source: renderer.source,
    readiness,
  };
});
const errors = validatePatternBindings({ resolvedPattern, layoutContract, bindings, requireSlots: args.includes("--require-slots"), navigationMode });
if (errors.length) throw new Error(`Framework page Pattern binding failed:\n${errors.join("\n")}`);
if (iconDiagnostics.length) {
  const details = iconDiagnostics.map((entry) => `${entry.path}: '${entry.alias}' is not a registered semantic icon alias`).join("\n");
  throw new Error(`Icon resolution failed. Use aliases from text-to-ui/assets/icons/icon-aliases.json:\n${details}`);
}
const { patternDigest, structureDigest: bindingStructureDigest, structure: bindingStructure } = buildPatternStructure({ resolvedPattern, layoutContract, bindings, navigationMode });
let structureDigest = bindingStructureDigest;
let structure = bindingStructure;
if (context.patternContract?.patternDigest && context.patternContract.patternDigest !== patternDigest) throw new Error("Context Packet Pattern digest is stale");

const imports = context.renderer.styleImports.map((source) => `import ${JSON.stringify(source)};`);
const grouped = Object.fromEntries(resolvedPattern.pattern.paneOrder.map((region) => [region, bindings.filter((binding) => binding.region === region)]));
const compositionRegions = input.composition?.regions ?? null;
const navigationShell = input.patternShell?.navigation ?? null;
const stylePlan = input.stylePlan;
const behaviorPlan = input.behaviorPlan;
const bindingById = new Map(bindings.map((binding) => [binding.id, binding]));
const collectGroupIds = (nodes, target = new Set()) => {
  for (const node of nodes ?? []) {
    if (node?.kind !== "group") continue;
    if (node.id) target.add(node.id);
    collectGroupIds(node.children, target);
  }
  return target;
};
const escapeHtml = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const allowedGroupTags = new Set(["div", "section", "header", "nav", "article", "aside", "footer"]);
const allowedTextTags = new Set(["span", "p", "h1", "h2", "h3", "h4", "strong", "small"]);
const referencedBindings = [];
const componentExpression = (binding) => {
  const rendered = binding.expectedRuntimeCount === 1
  ? `renderHtmlComponent(${JSON.stringify(binding.rendererKey)}, ${JSON.stringify(binding.options)})`
  : `Array.from({ length: ${binding.expectedRuntimeCount} }, () => renderHtmlComponent(${JSON.stringify(binding.rendererKey)}, ${JSON.stringify(binding.options)})).join("")`;
  return binding.behaviorId
    ? `${JSON.stringify(`<span data-tui-behavior="${escapeHtml(binding.behaviorId)}">`)} + ${rendered} + "</span>"`
    : rendered;
};
const htmlCompositionExpression = (node, region) => {
  if (!node || typeof node !== "object") throw new Error(`Invalid composition node in region ${region}`);
  if (node.kind === "component") {
    const binding = bindingById.get(node.bindingId);
    if (!binding) throw new Error(`Composition references unknown binding: ${node.bindingId}`);
    if (binding.region !== region) throw new Error(`Composition binding ${node.bindingId} belongs to ${binding.region}, not ${region}`);
    referencedBindings.push(node.bindingId);
    return componentExpression(binding);
  }
  if (node.kind === "text") {
    const tag = node.tag ?? "span";
    if (!allowedTextTags.has(tag)) throw new Error(`Unsupported composition text tag: ${tag}`);
    return JSON.stringify(`<${tag} data-composition-id="${escapeHtml(node.id ?? "text")}">${escapeHtml(node.text)}</${tag}>`);
  }
  if (node.kind === "group") {
    const tag = node.tag ?? "div";
    if (!allowedGroupTags.has(tag)) throw new Error(`Unsupported composition group tag: ${tag}`);
    const attributes = [
      `data-composition-id="${escapeHtml(node.id ?? "group")}"`,
      recipeByCompositionId.has(node.id) ? `data-content-recipe="${escapeHtml(recipeByCompositionId.get(node.id).id)}"` : "",
      node.className ? `class="${escapeHtml(node.className)}"` : "",
      node.ariaLabel ? `aria-label="${escapeHtml(node.ariaLabel)}"` : "",
      node.customUi ? `data-custom-ui="${escapeHtml(node.customUi)}"` : ""
    ].filter(Boolean).join(" ");
    const children = (node.children ?? []).map((child) => htmlCompositionExpression(child, region)).join(" + ") || JSON.stringify("");
    return `${JSON.stringify(`<${tag} ${attributes}>`)} + ${children} + ${JSON.stringify(`</${tag}>`)}`;
  }
  throw new Error(`Unsupported composition node kind: ${node.kind}`);
};
const frameworkComponentExpression = (binding, create) => {
  const props = JSON.stringify({ ...binding.options, key: binding.id });
  const rendered = binding.expectedRuntimeCount === 1
    ? `${create}(${binding.exportName}, ${props})`
    : `Array.from({ length: ${binding.expectedRuntimeCount} }, (_, index) => ${create}(${binding.exportName}, { ...${props}, key: ${JSON.stringify(binding.id)} + "-" + index }))`;
  return binding.behaviorId
    ? `${create}("span", { "data-tui-behavior": ${JSON.stringify(binding.behaviorId)}, onClick: (event) => event.currentTarget.dispatchEvent(new CustomEvent("text-to-ui:behavior", { bubbles: true, detail: { behaviorId: ${JSON.stringify(binding.behaviorId)} } })) }, ${rendered})`
    : rendered;
};
const frameworkCompositionExpression = (node, region, create) => {
  if (!node || typeof node !== "object") throw new Error(`Invalid composition node in region ${region}`);
  if (node.kind === "component") {
    const binding = bindingById.get(node.bindingId);
    if (!binding) throw new Error(`Composition references unknown binding: ${node.bindingId}`);
    if (binding.region !== region) throw new Error(`Composition binding ${node.bindingId} belongs to ${binding.region}, not ${region}`);
    referencedBindings.push(node.bindingId);
    return frameworkComponentExpression(binding, create);
  }
  if (node.kind === "text") {
    const tag = node.tag ?? "span";
    if (!allowedTextTags.has(tag)) throw new Error(`Unsupported composition text tag: ${tag}`);
    return `${create}(${JSON.stringify(tag)}, { "data-composition-id": ${JSON.stringify(node.id ?? "text")} }, ${JSON.stringify(String(node.text ?? ""))})`;
  }
  if (node.kind === "group") {
    const tag = node.tag ?? "div";
    if (!allowedGroupTags.has(tag)) throw new Error(`Unsupported composition group tag: ${tag}`);
    const props = { "data-composition-id": node.id ?? "group", ...(recipeByCompositionId.has(node.id) ? { "data-content-recipe": recipeByCompositionId.get(node.id).id } : {}), ...(node.className ? { className: node.className, class: node.className } : {}), ...(node.ariaLabel ? { "aria-label": node.ariaLabel } : {}), ...(node.customUi ? { "data-custom-ui": node.customUi } : {}) };
    const children = (node.children ?? []).map((child) => frameworkCompositionExpression(child, region, create)).join(", ");
    return `${create}(${JSON.stringify(tag)}, ${JSON.stringify(props)}${children ? `, [${children}]` : ""})`;
  }
  throw new Error(`Unsupported composition node kind: ${node.kind}`);
};
const navigationShellDefinition = navigationMode
  ? (resolvedPattern.pattern.navigationModes ?? []).find((mode) => mode.id === navigationMode)
  : null;
if (!compositionRegions || typeof compositionRegions !== "object") throw new Error("Framework page generation requires composition.regions; a flat component list is not a complete page");
for (const region of Object.keys(compositionRegions)) if (!resolvedPattern.pattern.paneOrder.includes(region)) throw new Error(`Composition contains undeclared Pattern region: ${region}`);
if (pageBlueprint) {
  const blueprintRegions = new Set((pageBlueprint.regions ?? []).map((region) => region.id));
  for (const region of resolvedPattern.pattern.paneOrder) if (!blueprintRegions.has(region)) throw new Error(`pageBlueprint is missing Pattern region '${region}'`);
  for (const group of pageBlueprint.contentGroups ?? []) if (!resolvedPattern.pattern.paneOrder.includes(group.region)) throw new Error(`pageBlueprint content group '${group.id}' belongs to undeclared Pattern region '${group.region}'`);
}
if (!stylePlan || stylePlan.schemaVersion !== 1 || !Array.isArray(stylePlan.compositions)) throw new Error("Framework page generation requires stylePlan schemaVersion 1 with compositions");
if (!behaviorPlan || behaviorPlan.schemaVersion !== 1 || !Array.isArray(behaviorPlan.interactions)) throw new Error("Framework page generation requires behaviorPlan schemaVersion 1 with interactions");
const stylePlanById = new Map(stylePlan.compositions.map((entry) => [entry.id, entry]));
if (stylePlanById.size !== stylePlan.compositions.length) throw new Error("stylePlan composition ids must be unique");
const behaviorPlanById = new Map(behaviorPlan.interactions.map((entry) => [entry.id, entry]));
if (behaviorPlanById.size !== behaviorPlan.interactions.length) throw new Error("behaviorPlan interaction ids must be unique");
const interactiveRendererKeys = new Set(["button", "primary-navigation-item", "sidebar", "search", "checkbox", "input", "select", "date-picker", "number-selector", "tabs"]);
for (const interaction of behaviorPlan.interactions) {
  if (!interaction.id || !["component-native", "toggle-hidden", "set-selected", "filter-collection", "open-overlay", "close-overlay"].includes(interaction.kind)) throw new Error(`behaviorPlan interaction '${interaction.id ?? "unknown"}' has an unsupported kind`);
  if (!Array.isArray(interaction.triggerBindingIds) || interaction.triggerBindingIds.length === 0) throw new Error(`behaviorPlan interaction '${interaction.id}' requires triggerBindingIds`);
  if (!interaction.outcome || typeof interaction.outcome !== "string") throw new Error(`behaviorPlan interaction '${interaction.id}' requires an observable outcome`);
  if (pageBlueprint && interaction.sourceGroup && !pageBlueprint.contentGroups?.some((group) => group.id === interaction.sourceGroup)) throw new Error(`behaviorPlan interaction '${interaction.id}' references undeclared sourceGroup '${interaction.sourceGroup}'`);
  for (const bindingId of interaction.triggerBindingIds) if (!bindings.some((binding) => binding.id === bindingId)) throw new Error(`behaviorPlan interaction '${interaction.id}' references unknown binding '${bindingId}'`);
}
for (const binding of bindings) {
  if (interactiveRendererKeys.has(binding.rendererKey) && !binding.behaviorId) throw new Error(`${binding.id}: interactive component '${binding.logicalName}' requires behaviorId before generation`);
  if (binding.behaviorId && !behaviorPlanById.has(binding.behaviorId)) throw new Error(`${binding.id}: behaviorId '${binding.behaviorId}' is not declared in behaviorPlan`);
  if (binding.behaviorId && !behaviorPlanById.get(binding.behaviorId).triggerBindingIds.includes(binding.id)) throw new Error(`${binding.id}: behaviorPlan '${binding.behaviorId}' must list this binding as a trigger`);
}
for (const interaction of behaviorPlan.interactions) {
  for (const bindingId of interaction.triggerBindingIds) {
    if (bindings.find((binding) => binding.id === bindingId)?.behaviorId !== interaction.id) throw new Error(`behaviorPlan interaction '${interaction.id}' trigger '${bindingId}' must reference the same behaviorId`);
  }
}
const validateStylePlanNodes = (nodes, region) => {
  for (const node of nodes ?? []) {
    if (node?.kind === "group") {
      const plan = stylePlanById.get(node.id);
      if (!plan) throw new Error(`Composition group '${node.id ?? "unknown"}' is missing from stylePlan`);
      if (plan.region !== region) throw new Error(`stylePlan composition '${node.id}' belongs to '${plan.region}', not '${region}'`);
      if (!Array.isArray(plan.tokenRoles) || plan.tokenRoles.length === 0) throw new Error(`stylePlan composition '${node.id}' must declare Token roles before generation`);
      if (plan.componentBoundary !== "preserve") throw new Error(`stylePlan composition '${node.id}' must preserve registered component boundaries`);
      if (node.className && plan.className !== node.className) throw new Error(`stylePlan composition '${node.id}' must declare className '${node.className}'`);
      validateStylePlanNodes(node.children, region);
    }
  }
};
for (const [region, nodes] of Object.entries(compositionRegions)) validateStylePlanNodes(nodes, region);
if (navigationMode) {
  if (!navigationShellDefinition) throw new Error(`Unknown Pattern navigation mode '${navigationMode}'`);
  if (!navigationShell || navigationShell.mode !== navigationMode || !navigationShell.slots || typeof navigationShell.slots !== "object") {
    throw new Error(`Navigation mode '${navigationMode}' requires patternShell.navigation with matching mode and slots`);
  }
  if (compositionRegions?.[navigationShellDefinition.region]) {
    throw new Error(`Navigation mode '${navigationMode}' owns '${navigationShellDefinition.region}' structure; place its content in patternShell.navigation.slots, not composition.regions`);
  }
  const allowedSlots = new Set(navigationShellDefinition.shellSlots.map((slot) => slot.id));
  for (const slot of Object.keys(navigationShell.slots)) if (!allowedSlots.has(slot)) throw new Error(`Navigation shell contains undeclared slot '${slot}'`);
  for (const slot of navigationShellDefinition.shellSlots) {
    const nodes = navigationShell.slots[slot.id];
    if (!Array.isArray(nodes)) throw new Error(`Navigation shell slot '${slot.id}' must be an array`);
    validateStylePlanNodes(nodes, navigationShellDefinition.region);
  }
}
const canonicalUiSceneResult = normalizePageUiScene({
  resolvedPattern,
  input,
  bindings,
  layoutContract,
  blueprint: pageBlueprint,
  navigationMode
});
if (canonicalUiSceneResult.patternDigest !== patternDigest) throw new Error("Canonical UI Scene Pattern digest does not match the binding contract");
structureDigest = canonicalUiSceneResult.structureDigest;
structure = canonicalUiSceneResult.structure;
const absoluteUiScenePath = path.resolve(uiSceneOutputPath ?? path.join(path.dirname(path.resolve(manifestPath)), "ui-scene.json"));
const compositionIds = collectGroupIds(Object.values(compositionRegions).flat());
if (navigationMode) for (const nodes of Object.values(navigationShell.slots)) collectGroupIds(nodes, compositionIds);
const pageContentRecipes = contentRecipesPath
  ? readPageContentRecipes(contentRecipesPath, { blueprint: pageBlueprint, bindings, compositionIds })
  : null;
if (pageCssPath) {
  const cssFile = path.resolve(pageCssPath);
  if (!fs.existsSync(cssFile)) throw new Error(`Page CSS file not found: ${cssFile}`);
  // The validator is a CLI by design; keep this generation-time equivalent
  // small and explicit so an invalid page never reaches a preview artifact.
  const css = fs.readFileSync(cssFile, "utf8");
  const forbiddenPatternSelectors = /(?:\[data-(?:pattern|tui-pane-role|pattern-region|pattern-shell-slot)|\.tui-(?:pattern|runtime-card|sidebar|titlebar)\b)/;
  if (forbiddenPatternSelectors.test(css)) throw new Error(`Page CSS '${cssFile}' overrides Pattern-owned selectors`);
  if (/(?:^|,)\s*(?:html|body|main|#app)\b[^{}]*\{[^}]*\b(?:width|height)\s*:\s*\d+(?:\.\d+)?px\b/is.test(css) || /(?:^|,)\s*(?:html|body|main|#app)\b[^{}]*\{[^}]*\btransform\s*:\s*scale\s*\(/is.test(css)) throw new Error(`Page CSS '${cssFile}' fixes or scales the HTML runtime canvas; use responsive layout and reserve 1728×1152 for Pixso import only`);
  const tokenReport = validatePageTokenUsage({ sourcePaths: [cssFile], projectRoot: context.repository.root, layoutContract });
  if (tokenReport.failures.length) {
    throw new Error(`Page CSS Token preflight failed for '${cssFile}':\n${tokenReport.failures.map((failure) => `- ${failure}`).join("\n")}`);
  }
}
const recipeByCompositionId = new Map((pageContentRecipes?.recipes ?? []).map((recipe) => [recipe.compositionId, recipe]));
const pageCompositeUsage = (pageContentRecipes?.recipes ?? [])
  .filter((recipe) => recipe.kind === "page-composite")
  .map((recipe) => ({
    id: recipe.id,
    missingCapability: recipe.missingCapability,
    registryQueries: recipe.registryQueries,
    contractQueries: recipe.registryQueries,
    reviewedCandidates: recipe.reviewedCandidates,
    tokenRoles: recipe.tokenRoles,
    disposition: recipe.disposition,
    regions: [recipe.region],
    exceptionKind: "specialized-business-surface"
  }));
const customUsage = [...(input.custom ?? []), ...pageCompositeUsage];
const normalizeCapability = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const registryCapabilityMatches = (query) => {
  const normalized = normalizeCapability(query);
  if (!normalized) return [];
  return componentRegistry.filter((component) => {
    const names = [component.id, component.logicalName, String(component.logicalName ?? "").split("/")[0]];
    return names.some((name) => normalizeCapability(name) === normalized);
  });
};
const implementationFor = (component) => component?.implementations?.[framework] ?? component?.frameworks?.[framework]?.source;
const validatePageOwnedUsage = (entries, label) => {
  for (const [index, entry] of entries.entries()) {
    if (!entry?.id || !entry?.missingCapability) throw new Error(`${label}[${index}] must declare id and missingCapability before generation`);
    if (!Array.isArray(entry.registryQueries) || entry.registryQueries.length === 0) throw new Error(`${label}[${index}] must declare registryQueries before generation`);
    if (!Array.isArray(entry.tokenRoles) || entry.tokenRoles.length === 0) throw new Error(`${label}[${index}] must declare Token roles before generation`);
    if (!Array.isArray(entry.reviewedCandidates)) throw new Error(`${label}[${index}] must declare reviewedCandidates before generation`);
    if (label === "custom" && (!Array.isArray(entry.contractQueries) || entry.contractQueries.length === 0)) throw new Error(`${label}[${index}] must declare contractQueries before generation`);
    if (!['page-owned', 'promote-to-library'].includes(entry.disposition)) throw new Error(`${label}[${index}] must declare disposition before generation`);
    if (label === "custom" && !["no-matching-component", "specialized-business-surface"].includes(entry.exceptionKind)) throw new Error(`${label}[${index}] must declare a valid exceptionKind before generation`);
    for (const query of entry.registryQueries) {
      if (label !== "custom") continue;
      const matches = registryCapabilityMatches(query).filter((component) => implementationFor(component) && component.readiness?.sourceReady === true);
      if (matches.length) {
        throw new Error(`${label}[${index}] overlaps available ${framework} component(s) for query '${query}': ${matches.map((component) => component.logicalName).join(', ')}; use the registered component or a contract-based composition`);
      }
    }
  }
};
validatePageOwnedUsage(input.contractBased ?? [], "contractBased");
validatePageOwnedUsage(customUsage, "custom");
for (const [index, entry] of (input.contractBased ?? []).entries()) {
  if (!entry.contractLogicalName || !registryByLogicalName.has(entry.contractLogicalName)) throw new Error(`contractBased[${index}].contractLogicalName must name a canonical component contract`);
  if (!entry.contractEvidence || typeof entry.contractEvidence !== "string") throw new Error(`contractBased[${index}].contractEvidence must document the matching contract before generation`);
}
const pageModules = (input.pageModules ?? []).map((item) => {
  if (framework !== 'html') throw new Error('pageModules currently supports HTML only; use framework composition for React/Vue');
  const recipe = recipeByCompositionId.get(item.compositionId);
  if (!recipe || recipe.kind !== 'page-composite') throw new Error(`Page module requires a page-composite recipe: ${item.compositionId}`);
  const file = path.resolve(path.dirname(path.resolve(bindingsPath)), item.source);
  if (!fs.existsSync(file)) throw new Error(`Page module not found: ${file}`);
  const source = fs.readFileSync(file, "utf8");
  const prohibited = /<\/?(?:button|input|select|textarea|svg|use)\b|\bdocument\.querySelector(?:All)?\s*\(|\bstyle\s*=|\.style\.|\.style\.setProperty\s*\(|data-(?:pattern|tui-pane-role|pattern-region|pattern-shell-slot)\s*=/i;
  if (prohibited.test(source)) throw new Error(`Page module '${file}' bypasses the component or Pattern adapter; composites may use only the supplied host and renderComponent`);
  if (/\b(?:function\s+)?mount\s*(?:=)?\s*\([^)]*\brenderComponent\b/s.test(source) && !/\brenderComponent\s*\(/.test(source)) throw new Error(`Page module '${file}' accepts renderComponent but never calls it; registered controls must use the adapter`);
  return { compositionId: item.compositionId, file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') };
});
if (new Set(pageModules.map((item) => item.compositionId)).size !== pageModules.length) throw new Error('Only one page module may own each composition host');
if (new Set(customUsage.map((entry) => entry.id)).size !== customUsage.length) throw new Error("Custom page-owned composition ids must be unique across bindings and content recipes");
// Do not leave a partial UI Scene behind when a later preflight fails. The
// scene is written only after all page-owned CSS and module boundaries pass.
fs.mkdirSync(path.dirname(absoluteUiScenePath), { recursive: true });
fs.writeFileSync(absoluteUiScenePath, `${JSON.stringify(canonicalUiSceneResult.scene, null, 2)}\n`);
const htmlNavigationShellExpression = () => {
  const region = navigationShellDefinition.region;
  const slots = navigationShellDefinition.shellSlots.map((slot) => {
    const nodes = navigationShell.slots[slot.id] ?? [];
    const children = nodes.map((node) => htmlCompositionExpression(node, region)).join(" + ") || '""';
    const tag = slot.placement === "bottom" ? "nav" : slot.placement === "top" ? "header" : "div";
    const attributes = [`data-pattern-shell-slot=${JSON.stringify(slot.id)}`, `data-pattern-shell-placement=${JSON.stringify(slot.placement)}`];
    if (slot.id === "secondary-navigation-content") attributes.push('aria-label="二级导航"');
    if (slot.id === "primary-navigation-bottom") attributes.push('aria-label="一级导航"');
    return `${JSON.stringify(`<${tag} ${attributes.join(" ")}>`)} + ${children} + ${JSON.stringify(`</${tag}>`)}`;
  });
  return `${JSON.stringify(`<section data-pattern-region=${JSON.stringify(region)} data-tui-pane-role=${JSON.stringify(region)} data-navigation-mode=${JSON.stringify(navigationMode)}>`)} + ${slots.join(" + ")} + ${JSON.stringify("</section>")}`;
};
const frameworkNavigationShellExpression = (create) => {
  const region = navigationShellDefinition.region;
  const slots = navigationShellDefinition.shellSlots.map((slot) => {
    const tag = slot.placement === "bottom" ? "nav" : slot.placement === "top" ? "header" : "div";
    const props = {
      "data-pattern-shell-slot": slot.id,
      "data-pattern-shell-placement": slot.placement,
      ...(slot.id === "secondary-navigation-content" ? { "aria-label": "二级导航" } : {}),
      ...(slot.id === "primary-navigation-bottom" ? { "aria-label": "一级导航" } : {})
    };
    const children = (navigationShell.slots[slot.id] ?? []).map((node) => frameworkCompositionExpression(node, region, create)).join(", ");
    return `${create}(${JSON.stringify(tag)}, ${JSON.stringify(props)}${children ? `, [${children}]` : ""})`;
  });
  return `${create}("section", { "data-pattern-region": ${JSON.stringify(region)}, "data-tui-pane-role": ${JSON.stringify(region)}, "data-navigation-mode": ${JSON.stringify(navigationMode)} }, [${slots.join(", ")}])`;
};
// Pattern B owns the title segment and scroll body, including placement of
// search and detail actions. Both framework paths consume this partition.
const paneContent = (nodes, region) => {
  const title = [];
  const walk = (items) => items.flatMap((node) => {
    const binding = node.kind === 'component' ? bindingById.get(node.bindingId) : null;
    if (binding && ((region === 'secondary-list' && binding.semanticContext === 'secondary-list-search') ||
      (region === 'main-detail' && (binding.slot === 'main-detail-actions' || binding.semanticContext === 'main-detail-titlebar')))) {
      title.push(node); return [];
    }
    return [{ ...node, ...(node.kind === 'group' ? { children: walk(node.children ?? []) } : {}) }];
  });
  return { body: walk(nodes), title };
};
// Slots are removed from page-owned composition before the Runtime receives
// region content. This keeps every Pattern shell authoritative, not only B.
const declaredPatternSlotIds = new Set(resolvedPattern.pattern.slots.map((slot) => slot.id));
const partitionDeclaredSlots = (nodes, region) => {
  const slots = [];
  const walk = (items) => items.flatMap((node) => {
    const binding = node.kind === "component" ? bindingById.get(node.bindingId) : null;
    if (binding?.slot && declaredPatternSlotIds.has(binding.slot)) { slots.push(node); return []; }
    return [{ ...node, ...(node.kind === "group" ? { children: walk(node.children ?? []) } : {}) }];
  });
  return { body: walk(nodes), slots };
};
let source;
if (framework === "html") {
  imports.push(`import { renderHtmlComponent } from ${JSON.stringify(context.renderer.package)};`);
  imports.push('import { renderPatternHtml } from "@text-to-ui/pattern-runtime";');
  imports.push('import "@text-to-ui/pattern-runtime/styles.css";');
  if (customUsage.length > 0 || (input.contractBased ?? []).length > 0) imports.push('import "@text-to-ui/component-styles";');
  const runtimeSlots = new Map();
  const addRuntimeSlot = (slotId, nodes, region) => {
    const rendered = nodes.map((node) => htmlCompositionExpression(node, region)).join(" + ");
    if (!rendered) return;
    const previous = runtimeSlots.get(slotId);
    runtimeSlots.set(slotId, previous ? `${previous} + ${rendered}` : rendered);
  };
  if (navigationShellDefinition) {
    for (const slot of navigationShellDefinition.shellSlots) addRuntimeSlot(slot.id, navigationShell.slots[slot.id] ?? [], navigationShellDefinition.region);
  }
  const regionContent = new Map();
  for (const region of resolvedPattern.pattern.paneOrder) {
    if (navigationShellDefinition?.region === region) { regionContent.set(region, '""'); continue; }
    const nodes = compositionRegions[region];
    if (!Array.isArray(nodes)) throw new Error(`Composition region must be an array: ${region}`);
    const declared = partitionDeclaredSlots(nodes, region);
    for (const node of declared.slots) addRuntimeSlot(bindingById.get(node.bindingId).slot, [node], region);
    if (resolvedPattern.pattern.id === 'pattern-b-three-pane' && region !== 'primary-navigation') {
      const parts = paneContent(declared.body, region);
      for (const node of parts.title) {
        const binding = node.kind === "component" ? bindingById.get(node.bindingId) : null;
        const slotId = binding?.slot ?? (region === "secondary-list" ? "secondary-list-title" : binding?.semanticContext === "main-detail-titlebar" ? "main-detail-title" : "main-detail-actions");
        addRuntimeSlot(slotId, [node], region);
      }
      regionContent.set(region, parts.body.map((node) => htmlCompositionExpression(node, region)).join(" + ") || '""');
      continue;
    }
    regionContent.set(region, declared.body.map((node) => htmlCompositionExpression(node, region)).join(" + ") || '""');
  }
  const missingBindings = bindings.filter((binding) => !referencedBindings.includes(binding.id)).map((binding) => binding.id);
  const duplicateBindings = referencedBindings.filter((id, index) => referencedBindings.indexOf(id) !== index);
  if (missingBindings.length) throw new Error(`Composition does not place registered binding(s): ${missingBindings.join(", ")}`);
  if (duplicateBindings.length) throw new Error(`Composition places a binding more than once: ${[...new Set(duplicateBindings)].join(", ")}`);
  // Pattern titleLayer is global and must align to every pane boundary. When
  // a page supplies pane title slots (for example secondary-list search and
  // main-detail Titlebar), compose those values into the single global title
  // layer. Leaving them in the pane headers creates a second title row and
  // makes the shell look like an extra column; the shared Runtime CSS hides
  // the now-empty pane title headers once this wrapper is present.
  const titleSegments = resolvedPattern.pattern.titleLayer?.segments ?? [];
  if (titleSegments.length > 1) {
    const titleSlotIds = new Set();
    const segmentExpressions = titleSegments.map((region, index) => {
      const candidates = index === 0
        ? ["global-title-layer"]
        : resolvedPattern.pattern.slots
          .filter((slot) => slot.owner === region && /(?:-title|-actions|-toolbar|-toggle)$/.test(slot.id))
          .map((slot) => slot.id);
      const available = candidates.filter((slotId) => runtimeSlots.has(slotId));
      // A full Titlebar owns its action slot. If both are declared, prefer
      // the Titlebar so business actions are not rendered a second time.
      const titleSlot = available.find((slotId) => slotId.endsWith("-title"));
      const selected = titleSlot ? [titleSlot] : available;
      // A full Titlebar already owns its action group. Remove every title
      // candidate from the pane-local slot map so a legacy companion binding
      // cannot render a hidden duplicate or bind the same action twice.
      const consumed = titleSlot ? available : selected;
      consumed.forEach((slotId) => { if (index > 0) titleSlotIds.add(slotId); });
      const content = selected.length
        ? selected.map((slotId) => `(${runtimeSlots.get(slotId)})`).join(" + ")
        : '""';
      return `${JSON.stringify(`<div class="tui-pattern-runtime__title-segment" data-pattern-title-segment="${escapeHtml(region)}">`)} + ${content} + ${JSON.stringify("</div>")}`;
    });
    const hasPaneTitleContent = titleSegments.slice(1).some((region, index) => {
      const candidates = resolvedPattern.pattern.slots
        .filter((slot) => slot.owner === region && /(?:-title|-actions|-toolbar|-toggle)$/.test(slot.id))
        .map((slot) => slot.id);
      return candidates.some((slotId) => runtimeSlots.has(slotId));
    });
    if (hasPaneTitleContent) {
      runtimeSlots.set("global-title-layer", `${JSON.stringify('<div class="tui-pattern-runtime__title-segments">')} + ${segmentExpressions.join(" + ")} + ${JSON.stringify("</div>")}`);
      titleSlotIds.forEach((slotId) => runtimeSlots.delete(slotId));
    }
  }
  const runtimeSlotsSource = [...runtimeSlots.entries()].map(([slotId, rendered]) => `    ${JSON.stringify(slotId)}: ${rendered}`).join(",\n") || "";
  const regionContentSource = [...regionContent.entries()].map(([region, rendered]) => `    ${JSON.stringify(region)}: ${rendered}`).join(",\n");
  source = `${imports.join("\n")}\n\nexport const patternContract = ${JSON.stringify({ id: resolvedPattern.pattern.id, source: resolvedPattern.authority, schemaVersion: 1, patternDigest, structureDigest }, null, 2)};\nexport const stylePlan = ${JSON.stringify(stylePlan, null, 2)};\nexport const behaviorPlan = ${JSON.stringify(behaviorPlan, null, 2)};\nexport function renderGeneratedPage() {\n  return renderPatternHtml({\n    contract: runtimePatternContract,\n    mode: \"runtime\",\n    framework: \"html\",\n    structureDigest: ${JSON.stringify(structureDigest)},\n    slots: {\n${runtimeSlotsSource}\n    },\n    regionContent: {\n${regionContentSource}\n    }\n  });\n}\n`;
} else {
  const exportNames = [...new Set(bindings.map((binding) => binding.exportName).filter(Boolean))];
  if (framework === "react") imports.unshift('import React from "react";');
  else imports.unshift('import { h } from "vue";');
  if (exportNames.length) imports.push(`import { ${exportNames.join(", ")} } from ${JSON.stringify(context.renderer.package)};`);
  const create = framework === "react" ? "React.createElement" : "h";
  const paneExpressions = resolvedPattern.pattern.paneOrder.map((region) => {
    if (navigationShellDefinition?.region === region) return frameworkNavigationShellExpression(create);
    const nodes = compositionRegions[region];
    if (!Array.isArray(nodes)) throw new Error(`Composition region must be an array: ${region}`);
    if (resolvedPattern.pattern.id === 'pattern-b-three-pane' && region !== 'primary-navigation') {
      const parts = paneContent(nodes, region);
      const title = parts.title.map((node) => frameworkCompositionExpression(node, region, create)).join(', ');
      const body = parts.body.map((node) => frameworkCompositionExpression(node, region, create)).join(', ');
      return `${create}("section", { "data-pattern-region": ${JSON.stringify(region)}, "data-tui-pane-role": ${JSON.stringify(region)}, "data-pattern-segmented": "" }, [${create}("header", { "data-pattern-title-segment": ${JSON.stringify(region)} }, [${title}]), ${create}("div", { "data-pattern-scroll-body": "" }, [${body}])])`;
    }
    const children = nodes.map((node) => frameworkCompositionExpression(node, region, create)).join(", ");
    return `${create}("section", { key: ${JSON.stringify(region)}, "data-pattern-region": ${JSON.stringify(region)}, "data-tui-pane-role": ${JSON.stringify(region)} }${children ? `, [${children}]` : ""})`;
  });
  const missingBindings = bindings.filter((binding) => !referencedBindings.includes(binding.id)).map((binding) => binding.id);
  const duplicateBindings = referencedBindings.filter((id, index) => referencedBindings.indexOf(id) !== index);
  if (missingBindings.length) throw new Error(`Composition does not place registered binding(s): ${missingBindings.join(", ")}`);
  if (duplicateBindings.length) throw new Error(`Composition places a binding more than once: ${[...new Set(duplicateBindings)].join(", ")}`);
  source = `${imports.join("\n")}\n\nexport const patternContract = ${JSON.stringify({ id: resolvedPattern.pattern.id, source: resolvedPattern.authority, schemaVersion: 1, patternDigest, structureDigest }, null, 2)};\nexport const stylePlan = ${JSON.stringify(stylePlan, null, 2)};\nexport const behaviorPlan = ${JSON.stringify(behaviorPlan, null, 2)};\nexport function GeneratedPage() {\n  return ${create}("main", { "data-pattern": ${JSON.stringify(resolvedPattern.pattern.id)}, "data-structure-digest": ${JSON.stringify(structureDigest)}, "data-tui-behavior-plan": ${JSON.stringify(JSON.stringify(behaviorPlan))} },\n    ${paneExpressions.join(",\n    ")}\n  );\n}\n`;
}

source = source.replace("export const stylePlan", `export const pageBlueprint = ${JSON.stringify(pageBlueprint, null, 2)};\nexport const pageContentRecipes = ${JSON.stringify(pageContentRecipes, null, 2)};\nexport const stylePlan`);
if (framework === "html") {
  source = source.replace(
    "export const pageBlueprint",
    `export const runtimePatternContract = ${JSON.stringify(resolvedPattern.pattern, null, 2)};\nexport const pageBlueprint`
  );
}

const manifest = {
  schemaVersion: 1,
  kind: "text-to-ui-framework-page-manifest",
  targetFramework: framework,
  renderer: context.renderer,
  patternContract: { id: resolvedPattern.pattern.id, source: resolvedPattern.authority, schemaVersion: 1, patternDigest, structureDigest },
  structure,
  navigationMode,
  stylePlan: { schemaVersion: stylePlan.schemaVersion, sha256: crypto.createHash("sha256").update(JSON.stringify(stylePlan)).digest("hex") },
  behaviorPlan: { schemaVersion: behaviorPlan.schemaVersion, sha256: crypto.createHash("sha256").update(JSON.stringify(behaviorPlan)).digest("hex") },
  pageBlueprint: pageBlueprint ? { id: pageBlueprint.id, sha256: blueprintDigest(pageBlueprint), path: path.relative(path.dirname(path.resolve(manifestPath)), path.resolve(blueprintPath)) || path.basename(path.resolve(blueprintPath)) } : null,
  pageContentRecipes: pageContentRecipes ? { schemaVersion: pageContentRecipes.schemaVersion, sha256: crypto.createHash("sha256").update(JSON.stringify(pageContentRecipes)).digest("hex"), path: path.relative(path.dirname(path.resolve(manifestPath)), path.resolve(contentRecipesPath)) || path.basename(path.resolve(contentRecipesPath)) } : null,
  uiScene: {
    schemaVersion: canonicalUiSceneResult.scene.schemaVersion,
    kind: canonicalUiSceneResult.scene.kind,
    path: path.relative(path.dirname(path.resolve(manifestPath)), absoluteUiScenePath) || path.basename(absoluteUiScenePath),
    sha256: crypto.createHash("sha256").update(fs.readFileSync(absoluteUiScenePath)).digest("hex")
  },
  registered: bindings,
  iconResolution: {
    policy: "registered-alias-required",
    canonicalRegistry: "text-to-ui/assets/icons/icon-aliases.json",
    diagnostics: iconDiagnostics,
  },
  composition: compositionRegions ? { schemaVersion: 1, sha256: crypto.createHash("sha256").update(JSON.stringify(compositionRegions)).digest("hex") } : null,
};
const sha256 = (contents) => crypto.createHash("sha256").update(contents).digest("hex");
const absoluteOutputPath = path.resolve(outputPath);
fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
fs.writeFileSync(absoluteOutputPath, source);
manifest.generatedSource = {
  path: path.relative(path.dirname(path.resolve(manifestPath)), absoluteOutputPath) || path.basename(absoluteOutputPath),
  sha256: sha256(source)
};
const absoluteEntryOutputPath = path.resolve(entryOutputPath);
const pageImport = `./${path.relative(path.dirname(absoluteEntryOutputPath), absoluteOutputPath).replace(/\\/g, "/")}`;
const relativeImport = (file) => `./${path.relative(path.dirname(absoluteEntryOutputPath), file).replace(/\\/g, "/")}`;
const moduleImports = pageModules.map((item, index) => `import { mount as mountComposite${index} } from ${JSON.stringify(relativeImport(item.file))};`).join("\n");
const moduleMounts = pageModules.map((item, index) => `  { const host = root.querySelector(${JSON.stringify(`[data-composition-id="${item.compositionId}"]`)}); if (!host) throw new Error("Missing composite host"); const cleanup = mountComposite${index}(host, { renderComponent: renderHtmlComponent }); if (typeof cleanup === "function") cleanups.push(cleanup); }`).join("\n");
let entrySource = framework === "html" ? `
import { renderGeneratedPage, patternContract, runtimePatternContract, pageBlueprint, stylePlan, behaviorPlan } from ${JSON.stringify(pageImport)};
import { bindTitlebarOverflow, renderHtmlComponent } from "@text-to-ui/components-html";
${pageCssPath ? `import ${JSON.stringify(relativeImport(path.resolve(pageCssPath)))};` : ""}
${moduleImports}
export { patternContract, pageBlueprint, stylePlan, behaviorPlan };
export function mountGeneratedPage(root = document.querySelector("#app")) {
  if (!root) throw new Error("Generated page mount root was not found");
  root.__tuiDispose?.();
  root.innerHTML = renderGeneratedPage();
  const patternRoot = root.querySelector("[data-tui-pattern]");
  if (!patternRoot) throw new Error("Generated Pattern root was not found");
  const cleanups = [];
  // Titlebar main-detail actions are responsive: the renderer keeps the
  // More trigger visible and this adapter collapses trailing business actions
  // into its menu before they can overlap the fixed window controls. Keep the
  // behavior in the generated entry so every HTML page gets the same runtime
  // contract instead of relying on page-owned scripts to remember it.
  const titlebarOverflowCleanup = bindTitlebarOverflow(root);
  if (typeof titlebarOverflowCleanup === "function") cleanups.push(titlebarOverflowCleanup);
  const behaviors = new Map(behaviorPlan.interactions.map((item) => [item.id, item]));
  const execute = (event) => {
    const host = event.target.closest?.("[data-tui-behavior]");
    if (!host || !root.contains(host)) return;
    const behavior = behaviors.get(host.dataset.tuiBehavior);
    if (!behavior) return;
    if (event.type === "click" && behavior.kind === "set-selected") {
      root.querySelectorAll("[data-tui-behavior]").forEach((item) => { if (item.dataset.tuiBehavior === host.dataset.tuiBehavior) item.dataset.tuiSelected = String(item === host); });
    }
    if (behavior.kind === "filter-collection" && ["input", "change"].includes(event.type)) {
      const query = String(event.target.value ?? "").trim().toLocaleLowerCase();
      root.querySelectorAll(behavior.targetSelector || "[data-tui-collection-item]").forEach((item) => { item.hidden = Boolean(query) && !item.textContent.toLocaleLowerCase().includes(query); });
    }
    if (event.type === "click" && behavior.targetSelector && ["toggle-hidden", "open-overlay", "close-overlay"].includes(behavior.kind)) {
      const target = root.querySelector(behavior.targetSelector);
      if (target) target.hidden = behavior.kind === "toggle-hidden" ? !target.hidden : behavior.kind === "close-overlay";
    }
    root.dispatchEvent(new CustomEvent("text-to-ui:behavior", { bubbles: true, detail: { behaviorId: behavior.id, outcome: behavior.outcome, plan: behaviorPlan } }));
  };
  for (const type of ["click", "input", "change"]) root.addEventListener(type, execute);
${moduleMounts}
  root.__tuiDispose = () => { for (const type of ["click", "input", "change"]) root.removeEventListener(type, execute); cleanups.forEach((cleanup) => cleanup()); delete root.__tuiDispose; };
  return root;
}
` : `export { GeneratedPage as default, GeneratedPage, patternContract, pageBlueprint, stylePlan, behaviorPlan } from ${JSON.stringify(pageImport)};\n`;
manifest.pageModules = pageModules.map(({ compositionId, file, sha256 }) => ({ compositionId, path: path.relative(path.dirname(path.resolve(manifestPath)), file), sha256 }));
fs.mkdirSync(path.dirname(absoluteEntryOutputPath), { recursive: true });
fs.writeFileSync(absoluteEntryOutputPath, entrySource);
manifest.generatedEntry = {
  path: path.relative(path.dirname(path.resolve(manifestPath)), absoluteEntryOutputPath) || path.basename(absoluteEntryOutputPath),
  sha256: sha256(entrySource)
};

if (framework === "html") {
const runtimeLogicalName = (binding) => binding.logicalName;
const groupedUsage = new Map();
  for (const binding of bindings) {
    const current = groupedUsage.get(runtimeLogicalName(binding));
    if (current) {
      current.expectedRuntimeCount += binding.expectedRuntimeCount;
      current.usage.push(binding.id);
      if (binding.region && !current.regions.includes(binding.region)) current.regions.push(binding.region);
    } else groupedUsage.set(runtimeLogicalName(binding), {
      logicalName: runtimeLogicalName(binding),
      rendererKey: binding.rendererKey,
      usage: [binding.id],
      requiredCallSites: 1,
      expectedRuntimeCount: binding.expectedRuntimeCount,
      regions: binding.region ? [binding.region] : [],
      readinessLevel: binding.readiness.level,
      unresolvedParity: binding.readiness.unresolvedDimensions
    });
  }
  const usageManifest = {
    $schema: path.relative(path.dirname(path.resolve(componentUsagePath)), path.join(context.repository.root, "text-to-ui/assets/design-system/component-usage.schema.json")),
    schemaVersion: 2,
    targetFramework: "html",
    enforcement: "strict-source",
    registry: "packages/component-contracts/src/components.json",
    sourceRoots: [...new Set([
      path.relative(path.resolve(context.repository.root), absoluteOutputPath),
      ...pageModules.map((item) => path.relative(path.resolve(context.repository.root), item.file)),
      ...(pageCssPath ? [path.relative(path.resolve(context.repository.root), path.resolve(pageCssPath))] : []),
      ...(input.sourceRoots ?? [])
    ])],
    renderer: {
      package: context.renderer.package,
      factoryImport: context.renderer.factoryImport,
      evidenceImport: context.renderer.evidenceImport,
      styleImports: context.renderer.styleImports
    },
    layout: {
      contractPath: path.relative(path.dirname(path.resolve(componentUsagePath)), path.resolve(layoutPath)) || path.basename(path.resolve(layoutPath)),
      pattern: layoutContract.pattern,
      paneOrder: layoutContract.paneOrder,
      geometry: layoutContract.geometry,
      patternDigest,
      structureDigest,
      blueprint: pageBlueprint ? { id: pageBlueprint.id, digest: blueprintDigest(pageBlueprint) } : null
    },
    registered: [...groupedUsage.values()].map((entry) => ({ ...entry, usage: entry.usage.join(", ") })),
    contractBased: input.contractBased ?? [],
    custom: customUsage,
    previousOutputReuse: false,
    validationStage: "fast-preview"
  };
  const usageContents = `${JSON.stringify(usageManifest, null, 2)}\n`;
  const absoluteUsagePath = path.resolve(componentUsagePath);
  fs.mkdirSync(path.dirname(absoluteUsagePath), { recursive: true });
  fs.writeFileSync(absoluteUsagePath, usageContents);
  manifest.componentUsage = {
    path: path.relative(path.dirname(path.resolve(manifestPath)), absoluteUsagePath) || path.basename(absoluteUsagePath),
    sha256: sha256(usageContents)
  };
}
const absoluteManifestPath = path.resolve(manifestPath);
fs.mkdirSync(path.dirname(absoluteManifestPath), { recursive: true });
fs.writeFileSync(absoluteManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ ok: true, framework, patternId: resolvedPattern.pattern.id, patternDigest, structureDigest, unresolvedIconCount: iconDiagnostics.length, output: path.resolve(outputPath), manifest: path.resolve(manifestPath) }, null, 2));
