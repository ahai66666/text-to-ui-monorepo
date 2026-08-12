import { legacyCatalogComponentNames, legacyCatalogMarkup } from "../../component-contracts/src/legacy-catalog.js";

export { legacyCatalogComponentNames };

export function renderLegacyCatalog({ framework = "html" } = {}) {
  return `<div class="tui-legacy-catalog" data-component="legacy-catalog" data-logical-component="Catalog/Legacy Skill Baseline" data-variant="canonical" data-state="default" data-framework="${framework}">${legacyCatalogMarkup}</div>`;
}

export function renderLegacyComponent(logicalName, options = {}) {
  const name = String(logicalName).split("/")[0];
  if (!legacyCatalogComponentNames.includes(name)) throw new Error(`Unknown legacy Skill component: ${logicalName}`);
  return renderLegacyCatalog(options);
}
