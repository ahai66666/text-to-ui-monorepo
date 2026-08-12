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

if (manifest.schemaVersion !== 1) failures.push("schemaVersion must equal 1");
if (!packageByFramework[manifest.targetFramework]) failures.push("targetFramework must be html, react, or vue");
if (manifest.previousOutputReuse !== false) failures.push("previousOutputReuse must be false unless a separately approved continuation contract is used");

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
  const framework = manifest.targetFramework;
  const implementation = contract.implementations?.[framework] ?? contract.frameworks?.[framework]?.source;
  if (!implementation) failures.push(`${usage.logicalName} has no ${framework} implementation`);
  if (contract.readiness?.sourceReady !== true) failures.push(`${usage.logicalName} is not sourceReady; record it as a blocked gap, not a page replacement`);
  const unverified = Object.entries(contract.readiness ?? {}).filter(([, ready]) => ready !== true).map(([dimension]) => dimension);
  if (unverified.length > 0) warnings.push(`${usage.logicalName} remains partial: ${unverified.join(", ")}`);
}

const validatePageOwnedBase = (usage, label, index) => {
  if (!usage.id) failures.push(`${label}[${index}].id is required`);
  if (!usage.missingCapability) failures.push(`${label}[${index}].missingCapability is required`);
  if (!Array.isArray(usage.registryQueries) || usage.registryQueries.length === 0) failures.push(`${label}[${index}].registryQueries must document registry discovery`);
  if (!Array.isArray(usage.tokenRoles) || usage.tokenRoles.length === 0) failures.push(`${label}[${index}].tokenRoles must list shared Token roles`);
  if (!Array.isArray(usage.reviewedCandidates)) {
    failures.push(`${label}[${index}].reviewedCandidates must be an array`);
  } else {
    for (const [candidateIndex, candidate] of usage.reviewedCandidates.entries()) {
      if (!candidate.logicalName || !registryByLogicalName.has(candidate.logicalName)) failures.push(`${label}[${index}].reviewedCandidates[${candidateIndex}] must name a registered logicalName`);
      if (!candidate.rejectionReason) failures.push(`${label}[${index}].reviewedCandidates[${candidateIndex}].rejectionReason is required`);
    }
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
const collect = (candidate) => {
  if (!fs.existsSync(candidate)) {
    failures.push(`source root not found: ${candidate}`);
    return;
  }
  const stat = fs.statSync(candidate);
  if (stat.isFile()) {
    if (sourceExtensions.has(path.extname(candidate))) sourceFiles.push(candidate);
    return;
  }
  for (const entry of fs.readdirSync(candidate, { withFileTypes: true })) {
    if (["node_modules", "dist", "coverage", ".git"].includes(entry.name)) continue;
    collect(path.join(candidate, entry.name));
  }
};
for (const root of sourceRoots) collect(path.resolve(projectRoot, root));
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

if (failures.length > 0) {
  console.error("Web component reuse validation failed");
  failures.forEach((failure) => console.error(`- ${failure}`));
  warnings.forEach((warning) => console.error(`warning: ${warning}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, targetFramework: manifest.targetFramework, componentPackage: expectedPackage, registeredCount: registered.length, contractBasedCount: contractBased.length, customCount: custom.length, sourceFileCount: sourceFiles.length, warnings }, null, 2));
