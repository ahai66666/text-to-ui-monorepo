#!/usr/bin/env node

/** Remove components that are no longer part of the client component library. */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(root, "packages/component-contracts/src/components.json");
const removedIds = new Set(["toggle", "spinner", "skeleton"]);
const registry = JSON.parse(await fs.readFile(registryPath, "utf8"));
const before = registry.components.length;

registry.components = registry.components.filter((component) => !removedIds.has(component.id));
for (const group of registry.registryPolicy?.comparisonGroups ?? []) {
  group.componentIds = (group.componentIds ?? []).filter((id) => !removedIds.has(id));
}
registry.registryPolicy = registry.registryPolicy ?? {};
registry.registryPolicy.deletedComponents = [
  ...new Set([...(registry.registryPolicy.deletedComponents ?? []), ...removedIds])
];

await fs.writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Removed ${before - registry.components.length} archived components: ${[...removedIds].join(", ")}.`);
