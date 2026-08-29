import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SKILL_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const DEFAULT_MAPPING_REGISTRY = path.join(
  SKILL_ROOT,
  "assets",
  "design-system",
  "mapping-registry.json",
);

export function readMappingRegistry(file = DEFAULT_MAPPING_REGISTRY) {
  const absolute = path.resolve(file);
  return {
    file: absolute,
    value: JSON.parse(fs.readFileSync(absolute, "utf8")),
  };
}

export function selectMappingProfile(registry, profileId = null) {
  const selectedId = profileId || registry.defaultProfile;
  const profile = (registry.profiles || []).find(
    (item) => item.id === selectedId,
  );
  if (!profile) {
    throw new Error(
      `Unknown mapping profile: ${selectedId || "(missing defaultProfile)"}`,
    );
  }
  return profile;
}

export function resolveRegistryPath(registryFile, relativePath) {
  if (!relativePath) return null;
  if (path.isAbsolute(relativePath)) return relativePath;
  return path.resolve(SKILL_ROOT, relativePath);
}

export function registryTargetDocument(registry, profile) {
  return (registry.sources?.pixso || []).find(
    (item) => item.id === profile.targetPixsoDocument,
  ) || null;
}

export function registryTargetLibrary(registry, profile) {
  return (registry.componentLibraries || []).find(
    (item) => item.id === profile.targetComponentLibrary,
  ) || null;
}

export function componentFactsEntries(facts) {
  return [
    ...(facts?.componentSets || []).map((item) => ({
      ...(typeof item === "string" ? { name: item } : item),
      kind: "component-set",
    })),
    ...(facts?.standaloneComponents || []).map((item) => ({
      ...(typeof item === "string" ? { name: item } : item),
      kind: "component",
    })),
  ];
}

export function componentFactsNames(facts) {
  return new Set(
    componentFactsEntries(facts)
      .map((item) => item.name)
      .filter(Boolean),
  );
}

export function runtimeSemanticAliasesForProfile(profile) {
  if (Array.isArray(profile?.runtimeSemanticAliases)) {
    return profile.runtimeSemanticAliases;
  }
  const semanticRoles = new Set(
    (profile?.semanticTokenMappings || []).map((mapping) => mapping.role),
  );
  return (profile?.runtimeSemanticMappings || []).filter(
    (mapping) => !semanticRoles.has(mapping.role),
  );
}

export function runtimeSemanticMappingsForProfile(profile) {
  const semantic = profile?.semanticTokenMappings || [];
  const aliases = runtimeSemanticAliasesForProfile(profile);
  return [...semantic, ...aliases];
}

export function tokenAliasesForProfile(profile) {
  const aliases = new Map();
  for (const mapping of profile.tokenMappings || []) {
    if (mapping.htmlCssVariable && mapping.pixsoVariable) {
      aliases.set(
        mapping.htmlCssVariable.replace(/^--/, ""),
        mapping.pixsoVariable,
      );
    }
  }
  for (const mapping of profile.semanticTokenMappings || []) {
    if (mapping.role && mapping.pixsoVariable) {
      aliases.set(mapping.role, mapping.pixsoVariable);
    }
    if (mapping.htmlCssVariable && mapping.pixsoVariable) {
      aliases.set(
        mapping.htmlCssVariable.replace(/^--/, ""),
        mapping.pixsoVariable,
      );
    }
  }
  for (const mapping of runtimeSemanticMappingsForProfile(profile)) {
    if (mapping.role && mapping.pixsoVariable) {
      aliases.set(mapping.role, mapping.pixsoVariable);
    }
    if (mapping.htmlCssVariable && mapping.pixsoVariable) {
      aliases.set(
        mapping.htmlCssVariable.replace(/^--/, ""),
        mapping.pixsoVariable,
      );
    }
  }
  for (const mapping of profile.semanticColorMappings || []) {
    if (mapping.pixsoVariables?.length !== 1) continue;
    for (const cssVariable of mapping.htmlCssVariables || []) {
      aliases.set(cssVariable.replace(/^--/, ""), mapping.pixsoVariables[0]);
    }
  }
  return aliases;
}

export function styleAliasesForProfile(profile) {
  const text = new Map();
  const effect = new Map();
  for (const mapping of profile.styleMappings || []) {
    if (!mapping.htmlToken || !mapping.pixsoStyle) continue;
    const destination = `$style/${mapping.pixsoStyle.replace(/^\$style\//, "")}`;
    if (mapping.kind === "effect") effect.set(mapping.htmlToken, destination);
    else text.set(mapping.htmlToken, destination);
  }
  return { text, effect };
}

export function isMappingRegistryFile(file) {
  return path.basename(path.resolve(file)) === "mapping-registry.json";
}
