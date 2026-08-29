#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs, readJson } from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const requiredArgs = ['context', 'layout-contract', 'page-spec', 'component-usage', 'artifact'];
for (const name of requiredArgs) if (!args[name]) throw new Error(`Missing --${name}`);
for (const name of requiredArgs) {
  const file = path.resolve(args[name]);
  if (!fs.existsSync(file)) throw new Error(`${name} file not found: ${file}`);
}
const context = readJson(path.resolve(args.context));
const componentUsage = readJson(path.resolve(args['component-usage']));
if (context.request?.mode !== 'fast-preview') throw new Error('Context packet mode must be fast-preview');
if (context.request?.confirmed !== true || context.request?.confirmation?.status !== 'confirmed') throw new Error('Fast Preview requires an explicitly confirmed Context Packet');
const artifact = path.resolve(args.artifact);
if (fs.statSync(artifact).size === 0) throw new Error('Preview artifact is empty');
const projectRoot = path.resolve(args['project-root'] || path.dirname(artifact));
const skillRoot = path.resolve(args['skill-root'] || path.join(context.repository.root, 'text-to-ui'));
const commands = [
  [path.join(skillRoot, 'scripts/validate-pc-framework-layout.mjs'), ['--contract', path.resolve(args['layout-contract'])]],
  [path.join(skillRoot, 'scripts/validate-page-spec.mjs'), [path.resolve(args['page-spec'])]],
  [path.join(skillRoot, 'scripts/validate-page-layout-binding.mjs'), ['--page-spec', path.resolve(args['page-spec']), '--layout-contract', path.resolve(args['layout-contract']), '--component-usage', path.resolve(args['component-usage'])]],
  [path.join(skillRoot, 'scripts/validate-layout-markers.mjs'), ['--artifact', artifact, '--layout-contract', path.resolve(args['layout-contract']), ...((componentUsage.sourceRoots || []).flatMap((sourceRoot) => ['--source', path.resolve(projectRoot, sourceRoot)]))]],
  [path.join(skillRoot, 'scripts/validate-web-component-reuse.mjs'), ['--manifest', path.resolve(args['component-usage']), '--project-root', projectRoot]]
];
if (componentUsage.schemaVersion === 2 || componentUsage.enforcement === 'strict-source') {
  if (!args['runtime-evidence']) throw new Error('Strict HTML Fast Preview requires --runtime-evidence captured from collectHtmlComponentEvidence(document)');
  commands.push(
    [path.join(skillRoot, 'scripts/validate-page-token-usage.mjs'), ['--project-root', projectRoot, '--layout-contract', path.resolve(args['layout-contract']), ...componentUsage.sourceRoots.flatMap((sourceRoot) => ['--source', sourceRoot])]],
    [path.join(skillRoot, 'scripts/validate-runtime-component-reuse.mjs'), ['--manifest', path.resolve(args['component-usage']), '--evidence', path.resolve(args['runtime-evidence'])]]
  );
}
for (const [script, scriptArgs] of commands) {
  const result = spawnSync(process.execPath, [script, ...scriptArgs], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(JSON.stringify({
  status: 'fast-preview-ready', artifact, framework: context.request.framework,
  enforcement: componentUsage.enforcement ?? 'legacy-import',
  remainingManualChecks: context.browserChecks
}, null, 2));
