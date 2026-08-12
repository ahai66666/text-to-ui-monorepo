import { legacyCatalogMarkup, legacyCatalogSectionIds } from "./legacy-catalog.generated.js";

/**
 * Old Skill gallery output is a visual regression fixture, not a production
 * component. Keep the entry point explicit so it cannot be selected as a
 * React/Vue implementation by the contract resolver.
 */
export function renderLegacyBaseline({ framework = "html" } = {}) {
  return `<div class="tui-legacy-catalog" data-component="legacy-baseline" data-logical-component="Catalog/Legacy Skill Baseline" data-variant="canonical" data-state="default" data-framework="${framework}">${legacyCatalogMarkup}</div>`;
}

export { legacyCatalogSectionIds };
