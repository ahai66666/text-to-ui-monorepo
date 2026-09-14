import mapping from "./index.json" with { type: "json" };

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function createResolutionPlan({ liveComponents = [], requested = Object.keys(mapping.components), libraryPage = mapping.policy.libraryPage } = {}) {
  const candidates = liveComponents.filter((component) => normalize(component.pageName ?? component.containingPage) === normalize(libraryPage));
  return requested.map((logicalName) => {
    const rule = mapping.components[logicalName];
    if (!rule) return { logicalName, status: "missing-mapping" };
    if (rule.availability === "excluded") return { logicalName, status: "excluded", libraryPage, reason: rule.mappingReason ?? null };
    if (!rule.pixsoTarget || rule.availability !== "mapped") return { logicalName, status: "unregistered-target", libraryPage };
    const matches = candidates.filter((component) => normalize(component.componentSetName ?? component.name ?? component.logicalName) === normalize(rule.pixsoTarget) && Object.entries(rule.variant ?? {}).every(([axis, value]) => String(component.variantProperties?.[axis] ?? component.variant?.[axis] ?? "") === String(value)));
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
      pixsoTarget: rule.pixsoTarget,
      variant: rule.variant,
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
