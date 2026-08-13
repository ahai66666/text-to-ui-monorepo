#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs, readJson } from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const requiredArgs = ['context', 'layout-contract', 'component-usage', 'artifact'];
for (const name of requiredArgs) if (!args[name]) throw new Error(`Missing --${name}`);
for (const name of requiredArgs) {
  const file = path.resolve(args[name]);
  if (!fs.existsSync(file)) throw new Error(`${name} file not found: ${file}`);
}
const context = readJson(path.resolve(args.context));
if (context.request?.mode !== 'fast-preview') throw new Error('Context packet mode must be fast-preview');
const artifact = path.resolve(args.artifact);
if (fs.statSync(artifact).size === 0) throw new Error('Preview artifact is empty');
const projectRoot = path.resolve(args['project-root'] || path.dirname(artifact));
const skillRoot = path.resolve(args['skill-root'] || path.join(context.repository.root, 'text-to-ui'));
const commands = [
  [path.join(skillRoot, 'scripts/validate-pc-framework-layout.mjs'), ['--contract', path.resolve(args['layout-contract'])]],
  [path.join(skillRoot, 'scripts/validate-web-component-reuse.mjs'), ['--manifest', path.resolve(args['component-usage']), '--project-root', projectRoot]]
];
for (const [script, scriptArgs] of commands) {
  const result = spawnSync(process.execPath, [script, ...scriptArgs], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(JSON.stringify({
  status: 'fast-preview-ready', artifact, framework: context.request.framework,
  remainingManualChecks: context.browserChecks
}, null, 2));
