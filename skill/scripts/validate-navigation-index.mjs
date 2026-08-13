#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { findComponent, generatedIndexDir, loadIndexes, locateMonorepo, parseArgs, resolveSkillRoot } from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const located = locateMonorepo({ start: args.start || process.cwd(), explicitRepo: args.repo });
if (!located.root) throw new Error('Text-to-UI Monorepo not found');
const repo = located.root;
const skillRoot = resolveSkillRoot(repo, args['skill-root']);
const build = spawnSync(process.execPath, [path.join(skillRoot, 'scripts/build-navigation-index.mjs'), '--repo', repo, '--skill-root', path.relative(repo, skillRoot), '--check'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status || 1);
const indexes = loadIndexes(skillRoot);
const errors = [];
for (const route of indexes['task-router'].routes) {
  if (!indexes['layout-index'].layouts.some((layout) => layout.id === route.layout)) errors.push(`${route.id}: missing layout ${route.layout}`);
  for (const capability of route.requiredCapabilities) {
    if (!findComponent(indexes['component-index'], capability)) errors.push(`${route.id}: missing required capability ${capability}`);
  }
}
for (const component of indexes['component-index'].components) {
  for (const [framework, entry] of Object.entries(component.frameworks)) {
    if (!entry.exists) errors.push(`${component.id}: ${framework} source missing (${entry.source})`);
  }
}
for (const file of fs.readdirSync(generatedIndexDir(skillRoot))) {
  if (!file.endsWith('.json')) continue;
  JSON.parse(fs.readFileSync(path.join(generatedIndexDir(skillRoot), file), 'utf8'));
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Navigation indexes valid: ${indexes['component-index'].componentCount} components, ${indexes['task-router'].routes.length} task routes.`);
