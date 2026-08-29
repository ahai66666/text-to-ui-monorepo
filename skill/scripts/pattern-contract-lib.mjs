import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
export const defaultPatternRegistryPath = path.resolve(scriptDirectory, "../assets/design-system/pattern-contracts.json");

export function readPatternRegistry(file = defaultPatternRegistryPath) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function validatePatternRegistry(registry) {
  const errors = [];
  if (registry?.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (registry?.kind !== "text-to-ui-pattern-contracts") errors.push("kind must be text-to-ui-pattern-contracts");
  if (registry?.authority !== "pattern-contract") errors.push("authority must be pattern-contract");
  const patterns = Array.isArray(registry?.patterns) ? registry.patterns : [];
  const ids = new Set();
  for (const pattern of patterns) {
    if (!/^pattern-[a-d]-[a-z0-9-]+$/.test(pattern.id ?? "")) errors.push(`invalid Pattern id: ${pattern.id}`);
    if (ids.has(pattern.id)) errors.push(`duplicate Pattern id: ${pattern.id}`);
    ids.add(pattern.id);
    if (pattern.compositionOnly !== true) errors.push(`${pattern.id}: Pattern must be compositionOnly`);
    if (pattern.rendererPolicy?.web !== "shared-resolved-pattern") errors.push(`${pattern.id}: web renderers must consume the shared resolved Pattern`);
    if (pattern.rendererPolicy?.pixso !== "native-frame-composition") errors.push(`${pattern.id}: Pixso Pattern must remain a Frame composition`);
    const paneOrder = pattern.paneOrder ?? [];
    const regionIds = (pattern.regions ?? []).map((region) => region.id);
    if (new Set(regionIds).size !== regionIds.length) errors.push(`${pattern.id}: duplicate region id`);
    if (paneOrder.join("|") !== regionIds.join("|")) errors.push(`${pattern.id}: region order must exactly match paneOrder`);
    const slotIds = (pattern.slots ?? []).map((slot) => slot.id);
    if (new Set(slotIds).size !== slotIds.length) errors.push(`${pattern.id}: duplicate slot id`);
    for (const segment of pattern.titleLayer?.segments ?? []) {
      if (!regionIds.includes(segment)) errors.push(`${pattern.id}: unknown title segment ${segment}`);
    }
    for (const slot of pattern.slots ?? []) {
      if (slot.owner !== "page" && !regionIds.includes(slot.owner)) errors.push(`${pattern.id}: slot ${slot.id} has unknown owner ${slot.owner}`);
    }
  }
  for (const required of ["pattern-a-two-pane", "pattern-b-three-pane", "pattern-c-tool-workspace", "pattern-d-inspector"]) {
    if (!ids.has(required)) errors.push(`missing canonical Pattern: ${required}`);
  }
  return errors;
}

function arrayEqual(left = [], right = []) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function resolvePatternContract(patternId, { registry = readPatternRegistry(), pageSpec = null, layoutContract = null } = {}) {
  const errors = validatePatternRegistry(registry);
  if (errors.length) throw new Error(`Invalid Pattern registry:\n${errors.join("\n")}`);
  const pattern = registry.patterns.find((entry) => entry.id === patternId);
  if (!pattern) throw new Error(`Unknown Pattern '${patternId}'`);
  const pagePattern = pageSpec?.shell?.pattern ?? null;
  const layoutPattern = layoutContract?.pattern ?? null;
  if (pagePattern && pagePattern !== patternId) throw new Error(`page-spec Pattern '${pagePattern}' does not match '${patternId}'`);
  if (layoutPattern && layoutPattern !== patternId) throw new Error(`layout-contract Pattern '${layoutPattern}' does not match '${patternId}'`);
  if (pageSpec?.shell?.paneOrder && !arrayEqual(pageSpec.shell.paneOrder, pattern.paneOrder)) throw new Error(`page-spec paneOrder does not match ${patternId}`);
  if (layoutContract?.paneOrder && !arrayEqual(layoutContract.paneOrder, pattern.paneOrder)) throw new Error(`layout-contract paneOrder does not match ${patternId}`);
  const requiredSlots = pattern.slots.filter((slot) => slot.cardinality === "1" || slot.cardinality === "1..n").map((slot) => slot.id);
  for (const source of [pageSpec?.shell?.requiredSlots, layoutContract?.requiredSlots].filter(Boolean)) {
    for (const slot of requiredSlots) if (!source.includes(slot)) throw new Error(`${patternId}: required slot '${slot}' is missing from the bound artifact`);
  }
  return {
    schemaVersion: 1,
    kind: "resolved-pattern-contract",
    authority: "assets/design-system/pattern-contracts.json",
    pattern: structuredClone(pattern),
    bindings: {
      pageSpec: pageSpec ? { pattern: pagePattern, paneOrder: pageSpec.shell?.paneOrder ?? null } : null,
      layoutContract: layoutContract ? { pattern: layoutPattern, paneOrder: layoutContract.paneOrder ?? null } : null
    }
  };
}
