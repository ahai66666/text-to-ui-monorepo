#!/usr/bin/env node
import assert from "node:assert/strict";
import mapping from "../packages/pixso-mapping/index.json" with { type: "json" };
import contracts from "../packages/component-contracts/src/components.json" with { type: "json" };
import { createResolutionPlan, assertStrictResolution } from "../packages/pixso-mapping/resolve.js";
assert.deepEqual(Object.keys(mapping.components).sort(), contracts.components.map(c => c.logicalName).sort(), "deleted components must not survive in generated mapping");
const requested = ["Checkbox/Default"];
const rule = mapping.components[requested[0]];
const target = { name: rule.pixsoTarget, pageName: mapping.policy.libraryPage, variantProperties: rule.variant, key: "test-key", guid: "test-guid" };
assert.notEqual(target.name, requested[0], "fixture exercises HTML to Pixso renaming");
assert.equal(assertStrictResolution(createResolutionPlan({ requested, liveComponents: [target] })).length, 1);
assert.equal(createResolutionPlan({ requested, liveComponents: [] })[0].status, "missing-target");
assert.equal(createResolutionPlan({ requested, liveComponents: [target, target] })[0].status, "ambiguous-target");
assert.equal(createResolutionPlan({ requested, liveComponents: [{ ...target, variantProperties: { state: "wrong" } }] })[0].status, "missing-target");
assert.throws(() => assertStrictResolution(createResolutionPlan({ requested, liveComponents: [{ ...target, guid: null }] })));
assert.equal(mapping.components["Form Field/Default"].availability, "mapped");
assert.equal(mapping.components["Form Field/Default"].pixsoTarget, "Form Field");
for (const logicalName of ["Context Menu/Default", "Dropdown Menu/Default", "Field/Default"]) {
  assert.equal(mapping.components[logicalName].availability, "excluded");
  const excluded = createResolutionPlan({ requested: [logicalName], liveComponents: [] })[0];
  assert.equal(excluded.status, "excluded");
  assert.ok(excluded.reason);
}
console.log("Pixso mapping tests passed: canonical catalog, renamed targets, variants, ambiguity, and live identity.");
