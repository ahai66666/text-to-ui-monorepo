#!/usr/bin/env node
import assert from "node:assert/strict";
import { createResolutionPlan, assertStrictResolution } from "../packages/pixso-mapping/resolve.js";

const live = Object.keys((await import("../packages/pixso-mapping/index.json", { with: { type: "json" } })).default.components).map((logicalName, index) => ({ logicalName, pageName: "NewComponents", componentKey: `key-${index}`, variantGuid: `variant-${index}` }));
const plan = createResolutionPlan({ liveComponents: live });
assert.equal(plan.every((entry) => entry.status === "resolved"), true);
assert.equal(assertStrictResolution(plan).length, plan.length);
assert.equal(createResolutionPlan({ liveComponents: [] })[0].status, "missing-target");
console.log(`Pixso mapping tests passed: ${plan.length} logical components resolved without persisted GUIDs.`);
