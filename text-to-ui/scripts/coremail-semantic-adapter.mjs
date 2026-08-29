// Legacy domain adapter. It may provide Coremail content semantics for
// diagnostics, but it is not allowed to decide geometry for an existing HTML
// import. The production import path is DOM Visual IR.
export { buildCoremailScene, collectSceneStats } from "./pixso-native-scene-lib.mjs";

export const COREMAIL_SEMANTIC_ADAPTER_STATUS = "legacy-diagnostic-only";
