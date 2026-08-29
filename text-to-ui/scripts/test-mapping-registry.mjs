#!/usr/bin/env node

import assert from "node:assert/strict";
import path from "node:path";
import {
  DEFAULT_MAPPING_REGISTRY,
  SKILL_ROOT,
  readMappingRegistry,
  runtimeSemanticMappingsForProfile,
  selectMappingProfile,
} from "./mapping-registry-lib.mjs";
import { loadComponentMap, loadTokenResources, readJson } from "./pixso-native-scene-lib.mjs";

const { value: registry } = readMappingRegistry(DEFAULT_MAPPING_REGISTRY);
const profile = selectMappingProfile(registry);
const runtimeMap = readJson(path.join(SKILL_ROOT, "assets/design-system/token-runtime-map.json"));
const nativeComponentMap = readJson(path.join(SKILL_ROOT, "assets/design-system/pixso-native-component-map.json"));
const componentIndex = readJson(path.join(SKILL_ROOT, "references/index/generated/component-index.json"));

assert.equal(profile.id, registry.defaultProfile);
assert.equal(profile.tokenMappings.length, profile.summary.canonicalTokenMappings);
assert.equal(profile.semanticTokenMappings.length, 290);
assert.equal(profile.runtimeSemanticAliases.length, 25);
assert.equal(Object.hasOwn(profile, "runtimeSemanticMappings"), false);
assert.equal(runtimeSemanticMappingsForProfile(profile).length, Object.keys(runtimeMap.semanticRoles).length);
assert.equal(profile.componentMappings.length, componentIndex.componentCount);
assert.equal(profile.summary.registeredPixsoTargets, 19);
assert.equal(profile.summary.htmlToPixsoExactMatches, 7);

const tokens = loadTokenResources();
assert.equal(tokens.mappingProfile.id, profile.id);
for (const name of ["brand/100", "color/text", "content/primary", "layout/sidebar-width"]) {
  assert.ok(tokens.resolve(name).name, `Token alias did not resolve: ${name}`);
}

const centralMap = loadComponentMap(DEFAULT_MAPPING_REGISTRY);
assert.equal(centralMap.mappingProfile.id, profile.id);
assert.equal(centralMap.map.get("Button/Primary/Default")?.pixsoName, "Button");
assert.equal(centralMap.map.get("Checkbox/Default")?.pixsoName, "CheckBox");
assert.equal(centralMap.map.get("Radio/Unselected/Default")?.pixsoName, "Radio");
assert.equal(centralMap.map.get("Switch/Default")?.pixsoName, "Switch");
assert.deepEqual(centralMap.map.get("Checkbox/Default")?.variant, { checked: "false", state: "Default" });
assert.deepEqual(centralMap.map.get("Switch/Default")?.variant, { checked: "false", state: "Default" });
assert.equal(
  profile.componentMappings.find((mapping) => mapping.htmlLogicalName === "Switch/Default")?.pixsoSpecKey,
  "Switch/Off/Default",
);
assert.deepEqual(
  profile.nativeSourceMappings.find((mapping) => mapping.source?.componentSet === "Radio")?.source?.variant,
  { checked: "false", state: "Default" },
);
assert.deepEqual(
  nativeComponentMap.mappings.find((mapping) => mapping.logicalName === "Checkbox/Unchecked/Default")?.variant,
  { checked: "false", state: "Default" },
);
assert.equal(centralMap.map.get("Sidebar Item/Default")?.pixsoName, "Sidebar Item");
assert.equal(centralMap.map.get("Alert/Default")?.availability, "blocked");

console.log(
  `Mapping registry integration valid: ${profile.tokenMappings.length} canonical Tokens, ` +
    `${runtimeSemanticMappingsForProfile(profile).length} runtime roles, ${profile.componentMappings.length} HTML Components.`,
);
