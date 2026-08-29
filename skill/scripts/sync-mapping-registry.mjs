#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  readMappingRegistry,
  resolveRegistryPath,
  runtimeSemanticMappingsForProfile,
  selectMappingProfile,
} from "./mapping-registry-lib.mjs";

const args = {};
for (let index = 2; index < process.argv.length; index += 1) {
  const value = process.argv[index];
  if (!value.startsWith("--")) continue;
  const key = value.slice(2);
  const next = process.argv[index + 1];
  args[key] = next && !next.startsWith("--") ? next : true;
  if (args[key] !== true) index += 1;
}

const defaultRegistry = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../assets/design-system/mapping-registry.json",
);
const registryFile = path.resolve(args.registry || defaultRegistry);
const { value: registry } = readMappingRegistry(registryFile);
const profile = selectMappingProfile(registry, args.profile || null);
const writeMode = args.write === true || String(args.write).toLowerCase() === "true";
const checkMode = args.check === true || String(args.check).toLowerCase() === "true";
if (writeMode && checkMode) throw new Error("Choose only one of --write or --check.");
if (!writeMode && !checkMode) throw new Error("Use --check to inspect or --write to update projections.");

const read = (relativePath) => {
  const file = resolveRegistryPath(registryFile, relativePath);
  return { file, value: JSON.parse(fs.readFileSync(file, "utf8")) };
};
const stable = (value) => JSON.stringify(value, null, 2) + "\n";
const changes = [];
const fail = (message) => {
  throw new Error(message);
};

const runCoverageProjectionCheck = (mode, projectionPaths) => {
  if (profile.id !== registry.defaultProfile) return;
  const configuredCoverage = resolveRegistryPath(
    registryFile,
    projectionPaths.harmonyosCoverageTable,
  );
  const defaultCoverage = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../assets/design-system/harmonyos-component-mapping-table.json",
  );
  if (!configuredCoverage || path.resolve(configuredCoverage) !== path.resolve(defaultCoverage)) return;
  const builder = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "build-harmonyos-component-mapping-table.mjs",
  );
  const result = spawnSync(process.execPath, [builder, mode], {
    cwd: path.dirname(path.dirname(builder)),
    encoding: "utf8",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
};

const projectionPaths = {
  ...(registry.projections || {}),
  ...(profile.projections || {}),
};
if (!projectionPaths) fail(`Profile ${profile.id} has no projection paths.`);
const runtimeProjection = read(projectionPaths.tokenRuntimeMap);
const dualProjection = read(projectionPaths.dualOutputTokenMap);
const nativeProjection = read(projectionPaths.pixsoNativeComponentMap);
const adapterProjection = read(projectionPaths.harmonyosComponentAdapterMap);

const canonicalByCss = new Map(
  (profile.tokenMappings || []).map((mapping) => [mapping.htmlCssVariable, mapping]),
);
const semanticByRole = new Map(
  (profile.semanticTokenMappings || []).map((mapping) => [mapping.role, mapping]),
);
const runtimeSemanticByRole = new Map(
  runtimeSemanticMappingsForProfile(profile).map((mapping) => [mapping.role, mapping]),
);
const colorByRole = new Map(
  (profile.semanticColorMappings || []).map((mapping) => [mapping.role, mapping]),
);

const nextRuntime = {
  ...runtimeProjection.value,
  mappings: (runtimeProjection.value.mappings || []).map((mapping) => {
    const central = canonicalByCss.get(mapping.cssVariable);
    if (!central) fail(`Central registry has no canonical mapping for ${mapping.cssVariable}`);
    return {
      ...mapping,
      pixsoCollection: central.pixsoCollection ?? mapping.pixsoCollection,
      pixsoMode: central.pixsoMode ?? mapping.pixsoMode,
      pixsoVariable: central.pixsoVariable,
      sourceToken: central.htmlSourceToken ?? mapping.sourceToken,
      valueTransform: central.valueTransform || "identity",
    };
  }),
  semanticRoles: Object.fromEntries(
    Object.entries(runtimeProjection.value.semanticRoles || {}).map(([role, mapping]) => {
      const central = runtimeSemanticByRole.get(role);
      if (!central) fail(`Central registry has no semantic mapping for ${role}`);
      return [
        role,
        {
          ...mapping,
          cssVariable: central.htmlCssVariable ?? mapping.cssVariable,
          pixsoVariable: central.pixsoVariable,
          sourceToken: central.htmlSourceToken ?? mapping.sourceToken,
          valueTransform: central.valueTransform || "identity",
        },
      ];
    }),
  ),
};

const nextDual = {
  ...dualProjection.value,
  variableMappings: (dualProjection.value.variableMappings || []).map((mapping) => {
    const central = canonicalByCss.get(mapping.webCssVariable);
    if (!central) fail(`Central registry has no canonical mapping for ${mapping.webCssVariable}`);
    return {
      ...mapping,
      pixsoVariable: central.pixsoVariable,
      collection: central.pixsoCollection ?? mapping.collection,
      sourceToken: central.htmlSourceToken ?? mapping.sourceToken,
      valueTransform: central.valueTransform || "identity",
    };
  }),
  semanticTokenMappings: (dualProjection.value.semanticTokenMappings || []).map((mapping) => {
    const central = semanticByRole.get(mapping.role);
    if (!central) fail(`Central registry has no semantic mapping for ${mapping.role}`);
    return {
      ...mapping,
      webCssVariable: central.htmlCssVariable,
      pixsoVariable: central.pixsoVariable,
      sourceToken: central.htmlSourceToken ?? mapping.sourceToken,
      valueTransform: central.valueTransform || "identity",
    };
  }),
  semanticColorMappings: (dualProjection.value.semanticColorMappings || []).map((mapping) => {
    const central = colorByRole.get(mapping.role);
    if (!central) fail(`Central registry has no semantic color mapping for ${mapping.role}`);
    return {
      ...mapping,
      webCssVariables: central.htmlCssVariables,
      pixsoVariables: central.pixsoVariables,
      composition: central.composition,
    };
  }),
};

const centralComponentByHtml = new Map(
  (profile.componentMappings || []).map((mapping) => [mapping.htmlLogicalName, mapping]),
);
const nativeSourceByHtml = new Map(
  (profile.nativeSourceMappings || [])
    .map((mapping) => [mapping.targetHtmlLogicalName || mapping.target, mapping])
    .filter(([target]) => target),
);
const nextNative = {
  ...nativeProjection.value,
  libraryPage: profile.targetComponentLibrary
    ? registry.componentLibraries?.find((item) => item.id === profile.targetComponentLibrary)?.page ||
      nativeProjection.value.libraryPage
    : nativeProjection.value.libraryPage,
  // This legacy projection contains renderer bindings that predate the central
  // registry. Overlay entries represented by the profile, while preserving
  // native runtime entries that are not HTML contract components.
  mappings: (nativeProjection.value.mappings || []).map((mapping) => {
    const central = centralComponentByHtml.get(mapping.logicalName) ||
      (mapping.logicalName.startsWith("Titlebar/") ? centralComponentByHtml.get("Titlebar/Default") : null);
    const hasExactCentralIdentity = centralComponentByHtml.has(mapping.logicalName);
    const nativeSource = nativeSourceByHtml.get(mapping.logicalName);
    const projectedBase = central?.runtimeBinding ? {
      ...mapping,
      ...(hasExactCentralIdentity ? { logicalName: central.htmlLogicalName } : {}),
      ...central.runtimeBinding,
      ...(central.subcomponentMappings ? { subcomponentMappings: central.subcomponentMappings } : {}),
    } : central?.subcomponentMappings ? {
      ...mapping,
      subcomponentMappings: central.subcomponentMappings,
    } : { ...mapping };
    // nativeSourceMappings is the authoritative live-library identity for
    // entries that do not have a central runtimeBinding (and it also wins over
    // stale legacy projections). Keep the HTML logical name stable, but always
    // project the exact current Pixso component-set name into the runtime map.
    const sourceComponentSet = nativeSource?.source?.componentSet;
    const sourceVariant = nativeSource?.source?.variant;
    const projected = sourceComponentSet
      ? {
        ...projectedBase,
        pixsoName: sourceComponentSet,
        componentSetName: sourceComponentSet,
        ...(sourceVariant ? { variant: sourceVariant } : {}),
      }
      : projectedBase;
    const content = projected.contentColor || nativeSource?.contentColor || nativeSource?.tokens?.content;
    if (typeof content !== "string" || !content.trim()) return projected;
    const ref = content.startsWith("$variable/") ? content : `$variable/${content}`;
    return { ...projected, contentColor: { text: ref, icon: ref } };
  }),
};

const nextAdapter = {
  ...adapterProjection.value,
  adapters: (profile.nativeSourceMappings || []).map((mapping) => {
    const { sourceLibrary, targetHtmlLogicalName, ...projected } = mapping;
    return projected;
  }),
  sourceOnly: (profile.sourceOnly || []).map((mapping) => {
    const { sourceLibrary, ...projected } = mapping;
    return projected;
  }),
};

for (const [label, current, next] of [
  ["token runtime map", runtimeProjection.value, nextRuntime],
  ["dual-output token map", dualProjection.value, nextDual],
  ["Pixso native component map", nativeProjection.value, nextNative],
  ["HarmonyOS component adapter map", adapterProjection.value, nextAdapter],
]) {
  const currentText = stable(current);
  const nextText = stable(next);
  if (currentText !== nextText) changes.push({ label, file: current === runtimeProjection.value ? runtimeProjection.file : current === dualProjection.value ? dualProjection.file : current === nativeProjection.value ? nativeProjection.file : adapterProjection.file, next });
}

if (checkMode) {
  if (changes.length) {
    console.error("Mapping registry projections are out of date:");
    for (const change of changes) console.error("- " + change.label + ": " + change.file);
    process.exit(1);
  }
  runCoverageProjectionCheck("--check", projectionPaths);
  console.log("Mapping registry projections are current for profile " + profile.id + ".");
} else {
  for (const change of changes) {
    fs.writeFileSync(change.file, stable(change.next));
    console.log("Updated " + change.file);
  }
  runCoverageProjectionCheck("--write", projectionPaths);
  console.log("Mapping registry projections synchronized for profile " + profile.id + ".");
}
