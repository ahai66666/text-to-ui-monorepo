import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

const manifestArg = valueFor("--manifest");
const projectRoot = path.resolve(valueFor("--project-root") ?? process.cwd());
if (!manifestArg) {
  console.error("Usage: validate-web-component-reuse.mjs --manifest <file> [--project-root <dir>]");
  process.exit(2);
}

const manifestPath = path.resolve(manifestArg);
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const manifest = readJson(manifestPath);
const failures = [];
const warnings = [];
const packageByFramework = {
  html: "@text-to-ui/components-html",
  react: "@text-to-ui/components-react",
  vue: "@text-to-ui/components-vue",
};

if (![1, 2].includes(manifest.schemaVersion)) failures.push("schemaVersion must equal 1 or 2");
const strictSource = manifest.schemaVersion === 2 || manifest.enforcement === "strict-source";
if (strictSource && manifest.targetFramework !== "html") failures.push("strict-source schemaVersion 2 currently supports targetFramework html only");
if (!packageByFramework[manifest.targetFramework]) failures.push("targetFramework must be html, react, or vue");
if (manifest.previousOutputReuse !== false) failures.push("previousOutputReuse must be false unless a separately approved continuation contract is used");

const approvedPatterns = new Set(["pattern-a-two-pane", "pattern-b-three-pane", "pattern-c-tool-workspace", "pattern-d-inspector"]);
const normalizePane = (value) => ({ navigation: "primary-navigation", primary: "primary-navigation", list: "secondary-list", detail: "main-detail", main: "main-content", workspace: "tool-workspace", canvas: "secondary-or-canvas" }[value] || value);
if (strictSource) {
  const layout = manifest.layout;
  if (!layout || typeof layout !== "object") failures.push("strict-source component-usage.layout is required");
  else {
    if (!approvedPatterns.has(layout.pattern)) failures.push("component-usage.layout.pattern must be a canonical Pattern ID");
    if (!Array.isArray(layout.paneOrder) || layout.paneOrder.length === 0) failures.push("component-usage.layout.paneOrder must declare the selected Pattern panes");
    if (!layout.contractPath) failures.push("component-usage.layout.contractPath is required");
    const contractPath = layout.contractPath ? path.resolve(path.dirname(manifestPath), layout.contractPath) : null;
    if (contractPath && !fs.existsSync(contractPath)) failures.push(`layout contract not found: ${contractPath}`);
    if (contractPath && fs.existsSync(contractPath)) {
      const contract = readJson(contractPath);
      if (contract.pattern !== layout.pattern) failures.push("component-usage.layout.pattern must equal layout-contract.pattern");
      if (JSON.stringify(contract.paneOrder) !== JSON.stringify(layout.paneOrder)) failures.push("component-usage.layout.paneOrder must equal layout-contract.paneOrder");
      for (const [groupName, entries] of [["registered", manifest.registered], ["contractBased", manifest.contractBased], ["custom", manifest.custom]]) for (const [index, entry] of (Array.isArray(entries) ? entries : []).entries()) {
        const regions = entry.regions || (entry.region ? [entry.region] : entry.pane ? [entry.pane] : []);
        for (const region of regions) if (!contract.paneOrder.includes(normalizePane(region))) failures.push(`${groupName}[${index}] region '${region}' is outside the selected Pattern pane order`);
      }
    }
  }
}

const registryRelative = manifest.registry ?? "packages/component-contracts/src/components.json";
const registryPath = path.resolve(projectRoot, registryRelative);
if (!fs.existsSync(registryPath)) failures.push(`component registry not found: ${registryPath}`);
let registry = [];
if (fs.existsSync(registryPath)) {
  const parsed = readJson(registryPath);
  registry = Array.isArray(parsed) ? parsed : parsed.components ?? [];
}
const registryByLogicalName = new Map(registry.map((item) => [item.logicalName, item]));

const registered = Array.isArray(manifest.registered) ? manifest.registered : [];
for (const [index, usage] of registered.entries()) {
  if (!usage.logicalName) {
    failures.push(`registered[${index}].logicalName is required`);
    continue;
  }
  const contract = registryByLogicalName.get(usage.logicalName);
  if (!contract) {
    failures.push(`registered component is not in the canonical registry: ${usage.logicalName}`);
    continue;
  }
  const implementation = contract.implementations?.[manifest.targetFramework] ?? contract.frameworks?.[manifest.targetFramework]?.source;
  if (!implementation) failures.push(`${usage.logicalName} has no ${manifest.targetFramework} implementation`);
  if (contract.readiness?.sourceReady !== true) failures.push(`${usage.logicalName} is not sourceReady; record it as a blocked gap, not a page replacement`);
  const unverified = Object.entries(contract.readiness ?? {}).filter(([, ready]) => ready !== true).map(([dimension]) => dimension);
  if (unverified.length > 0) warnings.push(`${usage.logicalName} remains partial: ${unverified.join(", ")}`);
  if (strictSource) {
    if (!usage.rendererKey) failures.push(`registered[${index}].rendererKey is required in strict-source mode`);
    if (!usage.usage) failures.push(`registered[${index}].usage is required in strict-source mode`);
    if (!Number.isInteger(usage.requiredCallSites) || usage.requiredCallSites < 1) failures.push(`registered[${index}].requiredCallSites must be a positive integer`);
  }
}

const validatePageOwnedBase = (usage, label, index) => {
  if (!usage.id) failures.push(`${label}[${index}].id is required`);
  if (!usage.missingCapability) failures.push(`${label}[${index}].missingCapability is required`);
  if (!Array.isArray(usage.registryQueries) || usage.registryQueries.length === 0) failures.push(`${label}[${index}].registryQueries must document registry discovery`);
  if (!Array.isArray(usage.tokenRoles) || usage.tokenRoles.length === 0) failures.push(`${label}[${index}].tokenRoles must list shared Token roles`);
  if (!Array.isArray(usage.reviewedCandidates)) failures.push(`${label}[${index}].reviewedCandidates must be an array`);
  else for (const [candidateIndex, candidate] of usage.reviewedCandidates.entries()) {
    if (!candidate.logicalName || !registryByLogicalName.has(candidate.logicalName)) failures.push(`${label}[${index}].reviewedCandidates[${candidateIndex}] must name a registered logicalName`);
    if (!candidate.rejectionReason) failures.push(`${label}[${index}].reviewedCandidates[${candidateIndex}].rejectionReason is required`);
  }
  if (!["page-owned", "promote-to-library"].includes(usage.disposition)) failures.push(`${label}[${index}].disposition must be page-owned or promote-to-library`);
};

const contractBased = Array.isArray(manifest.contractBased) ? manifest.contractBased : [];
for (const [index, usage] of contractBased.entries()) {
  validatePageOwnedBase(usage, "contractBased", index);
  if (!usage.contractLogicalName || !registryByLogicalName.has(usage.contractLogicalName)) failures.push(`contractBased[${index}].contractLogicalName must name a canonical contract`);
  if (!usage.contractEvidence || typeof usage.contractEvidence !== "string") failures.push(`contractBased[${index}].contractEvidence is required`);
}
const custom = Array.isArray(manifest.custom) ? manifest.custom : [];
for (const [index, usage] of custom.entries()) {
  validatePageOwnedBase(usage, "custom", index);
  if (!Array.isArray(usage.contractQueries) || usage.contractQueries.length === 0) failures.push(`custom[${index}].contractQueries must prove no matching contract exists`);
}
if (registered.length + contractBased.length + custom.length === 0) failures.push("component-usage must declare at least one registered, contractBased, or custom UI region");

const sourceRoots = Array.isArray(manifest.sourceRoots) ? manifest.sourceRoots : [];
if (sourceRoots.length === 0) failures.push("sourceRoots must contain at least one editable source directory or file");
const sourceExtensions = new Set([".html", ".js", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]);
const sourceFiles = [];
const styleFiles = [];
const collect = (candidate) => {
  if (!fs.existsSync(candidate)) { failures.push(`source root not found: ${candidate}`); return; }
  const stat = fs.statSync(candidate);
  if (stat.isFile()) { if (sourceExtensions.has(path.extname(candidate))) sourceFiles.push(candidate); return; }
  for (const entry of fs.readdirSync(candidate, { withFileTypes: true })) {
    if (["node_modules", "dist", "coverage", ".git"].includes(entry.name)) continue;
    collect(path.join(candidate, entry.name));
  }
};
for (const root of sourceRoots) collect(path.resolve(projectRoot, root));
const collectStyles = (candidate) => {
  if (!fs.existsSync(candidate)) return;
  const stat = fs.statSync(candidate);
  if (stat.isFile()) { if (path.extname(candidate) === ".css") styleFiles.push(candidate); return; }
  for (const entry of fs.readdirSync(candidate, { withFileTypes: true })) {
    if (["node_modules", "dist", "coverage", ".git"].includes(entry.name)) continue;
    collectStyles(path.join(candidate, entry.name));
  }
};
for (const root of sourceRoots) collectStyles(path.resolve(projectRoot, root));
const source = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const expectedPackage = packageByFramework[manifest.targetFramework];
const hasImport = (packageName) => {
  const escapedPackage = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:import\\s+(?:["']|[\\s\\S]*?\\s+from\\s*["']|\\(\\s*["'])|require\\s*\\(\\s*["']|@import\\s+["'])${escapedPackage}(?:\\/[^"']*)?["']`).test(source);
};
const hasProductionImport = expectedPackage ? hasImport(expectedPackage) : false;
if (registered.length > 0 && expectedPackage && !hasProductionImport) failures.push(`editable page source must import ${expectedPackage}; contract markers, comments, or copied markup are not reuse evidence`);
if (registered.length > 0 && /data-(?:logical-)?component\s*=/.test(source) && !hasProductionImport) failures.push("data-component markers exist without a production component-package import");
if (contractBased.length + custom.length > 0) {
  if (!hasImport("@text-to-ui/tokens")) failures.push("contractBased and custom source must import @text-to-ui/tokens");
  if (!hasImport("@text-to-ui/component-styles")) failures.push("contractBased and custom source must import @text-to-ui/component-styles");
}

if (strictSource) {
  const renderer = manifest.renderer ?? {};
  if (renderer.package !== "@text-to-ui/components-html") failures.push("renderer.package must equal @text-to-ui/components-html");
  if (renderer.factoryImport !== "renderHtmlComponent") failures.push("renderer.factoryImport must equal renderHtmlComponent");
  for (const styleImport of ["@text-to-ui/tokens", "@text-to-ui/components-html/styles.css"]) {
    if (!hasImport(styleImport)) failures.push(`strict HTML source must import ${styleImport}`);
  }
  if (!/import\s*\{[^}]*\brenderHtmlComponent\b[^}]*\}\s*from\s*["']@text-to-ui\/components-html["']/.test(source)) failures.push("strict HTML source must import the renderHtmlComponent factory");
  for (const usage of registered) {
    if (!usage.rendererKey) continue;
    const escapedKey = usage.rendererKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const direct = new RegExp(`renderHtmlComponent\\s*\\(\\s*["']${escapedKey}["']`, "g");
    const helper = new RegExp(`(?:component|renderComponent)\\s*\\(\\s*["']${escapedKey}["']`, "g");
    const calls = (source.match(direct) ?? []).length + (source.match(helper) ?? []).length;
    if (calls < (usage.requiredCallSites ?? 1)) failures.push(`registered component is declared but never rendered enough times: ${usage.logicalName}; rendererKey=${usage.rendererKey}; expected call sites=${usage.requiredCallSites ?? 1}; found=${calls}`);
  }
  const renderedVariables = [...source.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:node\s*\(\s*)?(?:renderHtmlComponent|component|renderComponent)\s*\(/g)].map((match) => match[1]);
  for (const variable of renderedVariables) {
    const escapedVariable = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escapedVariable}\\s*\\.\\s*(?:replaceChildren\\s*\\(|innerHTML\\s*=)`).test(source)) failures.push(`rendered component '${variable}' is destructively rewritten; pass business content through renderer props or slots`);
  }
  if (/<(?:button|nav|article|header|div|label)[^>]+class\s*=\s*["'][^"']*\btui-(?:button|sidebar|list-card|item|checkbox|attachment|titlebar)\b/i.test(source)) failures.push("strict source contains handwritten registered-component markup; call the renderer instead");
}

if (failures.length > 0) {
  console.error("Web component reuse validation failed");
  failures.forEach((failure) => console.error(`- ${failure}`));
  warnings.forEach((warning) => console.error(`warning: ${warning}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, enforcement: strictSource ? "strict-source" : "legacy-import", targetFramework: manifest.targetFramework, componentPackage: expectedPackage, registeredCount: registered.length, contractBasedCount: contractBased.length, customCount: custom.length, sourceFileCount: sourceFiles.length, styleFileCount: styleFiles.length, warnings }, null, 2));
