import "./styles.css";
import { legacyCatalogMarkup, legacyCatalogComponentNames } from "../../component-contracts/src/legacy-catalog.js";

export { legacyCatalogComponentNames };

export function LegacyCatalog({ className = "", ...props }) {
  return <div className={`tui-legacy-catalog${className ? ` ${className}` : ""}`} data-component="legacy-catalog" data-logical-component="Catalog/Legacy Skill Baseline" data-variant="canonical" data-state="default" data-framework="react" dangerouslySetInnerHTML={{ __html: legacyCatalogMarkup }} {...props} />;
}
