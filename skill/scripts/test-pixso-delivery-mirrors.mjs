#!/usr/bin/env node

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repository = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const source = path.join(repository, "text-to-ui");
const mirrors = [
  { name: "repository skill mirror", root: path.join(repository, "skill") },
  { name: "installed skill", root: "/Users/zhaobohai/.codex/skills/text-to-ui" },
];
const files = [
  "SKILL.md",
  "package.json",
  "protocol/README.md",
  "protocol/permanent-agent-capabilities.json",
  "protocol/operation-plan-v5.schema.json",
  "protocol/bridge-message.schema.json",
  "protocol/compatibility-matrix.json",
  "assets/design-system/pixso-native-component-map.json",
  "assets/design-system/pixso-native-component-map.schema.json",
  "assets/design-system/pixso-component-specs.json",
  "assets/design-system/pixso-operation-plan.schema.json",
  "assets/design-system/pixso-component-library-plan.schema.json",
  "assets/design-system/pixso-scene.schema.json",
  "assets/design-system/ui-scene.schema.json",
  "assets/design-system/pattern-contracts.schema.json",
  "assets/design-system/pattern-contracts.json",
  "assets/design-system/page-spec.schema.json",
  "references/pixso-native-scene.md",
  "references/pixso-fidelity-import-pipeline.md",
  "references/pixso-component-maintenance.md",
  "references/pixso-component-usage.md",
  "references/routes/index.json",
  "references/routes/existing-html-to-pixso.md",
  "references/routes/new-page.md",
  "references/routes/micro-revision.md",
  "references/routes/pixso-component-library.md",
  "references/routes/converter-diagnosis.md",
  "scripts/build-pixso-native-renderer-plugin.mjs",
  "scripts/compile-ui-scene.mjs",
  "scripts/ui-scene-core.mjs",
  "scripts/framework-renderer-contract.mjs",
  "scripts/generate-framework-page.mjs",
  "scripts/validate-ui-scene-pattern-binding.mjs",
  "scripts/test-framework-page-generation.mjs",
  "scripts/test-ui-scene-pattern-binding.mjs",
  "scripts/pattern-contract-lib.mjs",
  "scripts/resolve-pattern-contract.mjs",
  "scripts/validate-pattern-contracts.mjs",
  "scripts/test-pattern-contract-resolution.mjs",
  "scripts/generate-pixso-operation-plan.mjs",
  "scripts/browser-visual-manifest.js",
  "scripts/compile-pixso-import.mjs",
  "scripts/compile-dom-visual-ir.mjs",
  "scripts/dom-visual-ir.mjs",
  "scripts/coremail-semantic-adapter.mjs",
  "scripts/pixso-import-orchestrator.mjs",
  "scripts/pixso-import-run-state.mjs",
  "scripts/resolve-workflow-route.mjs",
  "scripts/test-workflow-route.mjs",
  "scripts/compare-pixso-screenshots.mjs",
  "scripts/pixso-visual-reconcile.mjs",
  "scripts/create-pixso-import-run.mjs",
  "scripts/resolve-pixso-import-url.mjs",
  "scripts/test-pixso-import-url.mjs",
  "scripts/update-pixso-import-run.mjs",
  "scripts/validate-pixso-import-run.mjs",
  "scripts/test-pixso-import-run.mjs",
  "scripts/test-pixso-import-fast-path.mjs",
  "scripts/test-pixso-permanent-agent-protocol.mjs",
  "scripts/test-pixso-visual-diff.mjs",
  "scripts/test-dom-visual-ir.mjs",
  "scripts/test-browser-visual-manifest.mjs",
  "scripts/test-dom-visual-ir-publication.mjs",
  "scripts/generate-pixso-component-library-plan.mjs",
  "scripts/validate-pixso-component-library-plan.mjs",
  "scripts/generate-pixso-scene.mjs",
  "scripts/html-visual-contract.mjs",
  "scripts/pixso-native-execution-runtime.js",
  "scripts/pixso-plugin-bridge.mjs",
  "scripts/pixso-official-adapter.mjs",
  "scripts/test-pixso-official-adapter.mjs",
  "scripts/start-text-to-ui-services.mjs",
  "scripts/pixso-native-scene-lib.mjs",
  "scripts/prepare-pixso-mcp-batches.mjs",
  "scripts/prepare-pixso-operation-batches.mjs",
  "scripts/test-pixso-mcp-call-plan.mjs",
  "scripts/test-html-visual-contract.mjs",
  "scripts/test-pixso-native-scene.mjs",
  "scripts/test-pixso-gradient-runtime.mjs",
  "scripts/test-pixso-image-runtime.mjs",
  "scripts/test-pixso-radius-runtime.mjs",
  "scripts/test-pixso-two-phase-icons.mjs",
  "scripts/test-pixso-component-library-runtime.mjs",
  "scripts/test-pixso-icon-library-repair.mjs",
  "scripts/test-ui-scene-complex-benchmark.mjs",
  "scripts/ui-scene-lib.mjs",
  "scripts/pixso-native-renderer-plugin/main.js",
  "scripts/pixso-native-renderer-plugin/main.template.js",
  "scripts/pixso-native-renderer-plugin/manifest.json",
  "scripts/pixso-native-renderer-plugin/pixso-plugin-bridge.mjs",
  "scripts/pixso-native-renderer-plugin/pixso-official-adapter.mjs",
  "scripts/pixso-native-renderer-plugin/ui.html",
  "scripts/pixso-native-renderer-plugin/README.md",
  "scripts/pixso-native-renderer-plugin/permanent-agent-capabilities.json",
  "scripts/pixso-native-renderer-plugin/compatibility-matrix.json",
];
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
for (const mirror of mirrors) {
  for (const relative of files) {
    const expected = path.join(source, relative);
    const actual = path.join(mirror.root, relative);
    assert.ok(fs.existsSync(actual), `${mirror.name} is missing ${relative}`);
    assert.equal(digest(actual), digest(expected), `${mirror.name} differs for ${relative}`);
  }
}
const delivery = "/Users/zhaobohai/Desktop/资源管理/我的代码仓/pixso插件/text-to-ui-pixso-native-renderer";
for (const relative of ["main.js", "manifest.json", "ui.html", "README.md", "pixso-plugin-bridge.mjs", "pixso-official-adapter.mjs", "permanent-agent-capabilities.json", "compatibility-matrix.json"]) {
  assert.ok(fs.existsSync(path.join(delivery, relative)), `plugin delivery is missing ${relative}`);
  assert.equal(digest(path.join(delivery, relative)), digest(path.join(source, "scripts/pixso-native-renderer-plugin", relative)), `plugin delivery differs for ${relative}`);
}
assert.equal(digest(path.join(delivery, "pixso-native-component-map.json")), digest(path.join(source, "assets/design-system/pixso-native-component-map.json")), "plugin delivery differs for component map");
console.log(`Pixso delivery mirrors passed: ${mirrors.length} skill mirrors and installable plugin package.`);
