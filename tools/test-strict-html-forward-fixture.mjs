import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { renderHtmlComponent } from "../packages/components-html/src/index.js";

const repo = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "tui-forward-list-detail-"));
const run = (script, args) => spawnSync(process.execPath, [path.join(repo, script), ...args], { cwd: repo, encoding: "utf8" });
const contextPath = path.join(temp, "context.json");
const layoutPath = path.join(temp, "layout-contract.json");
let result = run("text-to-ui/scripts/resolve-context.mjs", ["--task", "tasks", "--framework", "html", "--mode", "fast-preview", "--confirmed", "--out", contextPath]);
assert.equal(result.status, 0, result.stderr);
result = run("text-to-ui/scripts/generate-layout-contract.mjs", ["--context", contextPath, "--out", layoutPath]);
assert.equal(result.status, 0, result.stderr);
const skeletonPath = path.join(repo, "fixtures/html-strict-list-detail/src/component-skeleton.generated.js");
const manifestPath = path.join(temp, "component-usage.json");
result = run("text-to-ui/scripts/generate-html-component-skeleton.mjs", ["--context", contextPath, "--layout-contract", layoutPath, "--bindings", "fixtures/html-strict-list-detail/component-bindings.json", "--out", skeletonPath, "--manifest", manifestPath]);
assert.equal(result.status, 0, result.stderr);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifest.sourceRoots = ["fixtures/html-strict-list-detail/src"];
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
result = run("text-to-ui/scripts/validate-web-component-reuse.mjs", ["--manifest", manifestPath, "--project-root", repo]);
assert.equal(result.status, 0, result.stderr);
result = run("text-to-ui/scripts/validate-page-token-usage.mjs", ["--project-root", repo, "--source", "fixtures/html-strict-list-detail/src/page.css", "--layout-contract", "fixtures/html-strict-list-detail/layout-contract.json"]);
assert.equal(result.status, 0, result.stderr);
const rendererOptions = {
  "Titlebar/Default": { paneTitle: "任务详情", layout: "three-column", paneRole: "final-pane", mainDetailActions: [{ id: "save", label: "保存", icon: "action/save", buttonType: "icon" }], size: "medium" },
  "Sidebar Item/Default": { items: [{ label: "我的任务", selected: true }] },
  "Search/White Surface/Default": { placeholder: "搜索任务" },
  "List Item/White Surface/Default": { title: "任务", description: "今天" },
  "Button/Primary/Default": { label: "新增任务", variant: "primary" },
  "Checkbox/Default": { label: "标记为完成", description: "同步到任务记录", checked: false }
};
const evidence = { schemaVersion: 1, url: "fixture://html-strict-list-detail", components: [] };
for (const usage of manifest.registered) {
  const markup = renderHtmlComponent(usage.rendererKey, rendererOptions[usage.logicalName] ?? {});
  const count = usage.expectedRuntimeCount ?? 1;
  for (let index = 0; index < count; index += 1) evidence.components.push({
    rendererKey: markup.match(/data-renderer-key="([^"]+)"/)?.[1],
    logicalName: markup.match(/data-logical-component="([^"]+)"/)?.[1],
    variant: markup.match(/data-variant="([^"]+)"/)?.[1],
    state: markup.match(/data-state="([^"]+)"/)?.[1],
    region: usage.regions?.[0] ?? null,
    slots: [...markup.matchAll(/data-slot="([^"]+)"/g)].map((match) => match[1]),
    visible: true
  });
}
const evidencePath = path.join(temp, "runtime-evidence.json");
fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
const pageSpecPath = path.join(temp, "page-spec.json");
const pageSpec = JSON.parse(fs.readFileSync(path.join(repo, "fixtures/html-strict-list-detail/page-spec.json"), "utf8"));
pageSpec.layoutContractPath = path.basename(layoutPath);
fs.writeFileSync(pageSpecPath, JSON.stringify(pageSpec, null, 2));
result = run("text-to-ui/scripts/verify-fast-preview.mjs", ["--context", contextPath, "--layout-contract", layoutPath, "--page-spec", pageSpecPath, "--component-usage", manifestPath, "--artifact", "fixtures/html-strict-list-detail/index.html", "--runtime-evidence", evidencePath, "--project-root", repo]);
assert.equal(result.status, 0, result.stderr);
result = run("text-to-ui/scripts/validate-runtime-component-reuse.mjs", ["--manifest", manifestPath, "--evidence", evidencePath]);
assert.equal(result.status, 0, result.stderr);
fs.rmSync(skeletonPath, { force: true });
fs.rmSync(temp, { recursive: true, force: true });
console.log("Strict HTML non-mail list-detail forward fixture passed.");
