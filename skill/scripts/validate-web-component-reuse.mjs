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
if (registered.length === 0) failures.push("registered must list at least one production component");
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

const pageOwned = Array.isArray(manifest.pageOwned) ? manifest.pageOwned : [];
for (const [index, usage] of pageOwned.entries()) {
  if (!usage.id) failures.push(`pageOwned[${index}].id is required`);
  if (!usage.missingCapability) failures.push(`pageOwned[${index}].missingCapability is required`);
  if (!Array.isArray(usage.registryQueries) || usage.registryQueries.length === 0) failures.push(`pageOwned[${index}].registryQueries must document registry discovery`);
  if (!Array.isArray(usage.reviewedCandidates)) {
    failures.push(`pageOwned[${index}].reviewedCandidates must be an array`);
  } else {
    for (const [candidateIndex, candidate] of usage.reviewedCandidates.entries()) {
      if (!candidate.logicalName || !registryByLogicalName.has(candidate.logicalName)) failures.push(`pageOwned[${index}].reviewedCandidates[${candidateIndex}] must name a registered logicalName`);
      if (!candidate.rejectionReason) failures.push(`pageOwned[${index}].reviewedCandidates[${candidateIndex}].rejectionReason is required`);
    }
  }
  if (!["page-owned", "promote-to-library"].includes(usage.disposition)) failures.push(`pageOwned[${index}].disposition must be page-owned or promote-to-library`);
}

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
const escapedPackage = expectedPackage?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasProductionImport = escapedPackage
  ? new RegExp(`(?:import\\s+[\\s\\S]*?\\s+from\\s*|import\\s*\\(|require\\s*\\()\\s*["']${escapedPackage}(?:\\/[^"']*)?["']`).test(source)
  : false;
if (expectedPackage && !hasProductionImport) failures.push(`editable page source must import ${expectedPackage}; contract markers, comments, or copied markup are not reuse evidence`);
if (registered.length > 0 && /data-(?:logical-)?component\s*=/.test(source) && !hasProductionImport) failures.push("data-component markers exist without a production component-package import");

if (failures.length > 0) {
  console.error("Web component reuse validation failed");
  failures.forEach((failure) => console.error(`- ${failure}`));
  warnings.forEach((warning) => console.error(`warning: ${warning}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, targetFramework: manifest.targetFramework, componentPackage: expectedPackage, registeredCount: registered.length, pageOwnedCount: pageOwned.length, sourceFileCount: sourceFiles.length, warnings }, null, 2));
