import mapping from "./index.json" with { type: "json" };

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function createResolutionPlan({ liveComponents = [], requested = Object.keys(mapping.components), libraryPage = "NewComponents" } = {}) {
  const candidates = liveComponents.filter((component) => normalize(component.pageName ?? component.containingPage) === normalize(libraryPage));
  return requested.map((logicalName) => {
    const rule = mapping.components[logicalName];
    if (!rule) return { logicalName, status: "missing-mapping" };
    const matches = candidates.filter((component) => normalize(component.logicalName ?? component.name) === normalize(logicalName));
    if (matches.length === 0) return { logicalName, status: "missing-target", libraryPage };
    if (matches.length > 1) return { logicalName, status: "ambiguous-target", libraryPage, candidateCount: matches.length };
    const source = matches[0];
    return {
      logicalName,
      status: "resolved",
      libraryPage,
      componentKey: source.componentKey ?? source.key ?? null,
      variantGuid: source.variantGuid ?? source.guid ?? null,
      variantAxes: rule.variantAxes,
      slots: rule.slots,
      colorVariables: rule.colorVariables,
      requiresReadback: true
    };
  });
}

export function assertStrictResolution(plan) {
  const blocked = plan.filter((entry) => entry.status !== "resolved" || !entry.componentKey || !entry.variantGuid);
  if (blocked.length) {
    throw new Error(`Pixso strict resolution blocked: ${blocked.map((entry) => `${entry.logicalName}:${entry.status}`).join(", ")}`);
  }
  return plan;
}
