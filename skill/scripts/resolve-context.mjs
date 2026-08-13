#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { findComponent, loadIndexes, locateMonorepo, parseArgs, print, resolveSkillRoot, stableJson } from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const located = locateMonorepo({ start: args.start || process.cwd(), explicitRepo: args.repo });
if (!located.root) throw new Error(`Text-to-UI Monorepo not found. Tried:\n${located.attempted.join('\n')}`);
const repo = located.root;
const skillRoot = resolveSkillRoot(repo, args['skill-root']);
const indexes = loadIndexes(skillRoot);
const framework = args.framework || 'html';
const mode = args.mode || 'fast-preview';
const query = String(args.task || args.domain || '').toLowerCase();
if (!query) throw new Error('Provide --task or --domain.');
if (!['html', 'react', 'vue'].includes(framework)) throw new Error(`Unsupported framework: ${framework}`);
if (!indexes['validation-index'].modes[mode]) throw new Error(`Unsupported mode: ${mode}`);

const route = indexes['task-router'].routes.find((item) => [item.id, ...item.aliases, ...item.domains].some((value) => value.toLowerCase().includes(query) || query.includes(value.toLowerCase())));
if (!route) throw new Error(`No task route matches '${query}'. Add a route source entry or use a supported task/domain.`);
const layout = indexes['layout-index'].layouts.find((item) => item.id === route.layout);
const resolveCapability = (capability, required) => {
  const component = findComponent(indexes['component-index'], capability);
  if (!component) return { capability, required, sourceLevel: 'custom', evidence: 'index-miss; exact registry search required before drawing' };
  const runtime = component.frameworks[framework];
  return {
    capability,
    required,
    sourceLevel: runtime?.exists ? 'real-framework-component' : 'matching-contract',
    component: component.id,
    logicalName: component.logicalName,
    importPackage: runtime?.exists ? runtime.package : null,
    source: runtime?.source || null,
    contractPointer: component.contractPointer,
    variants: component.variants,
    states: component.states,
    props: component.props,
    slots: component.slots,
    tokenRoles: component.tokenRoles,
    iconAliases: component.iconAliases
  };
};
const components = [
  ...route.requiredCapabilities.map((item) => resolveCapability(item, true)),
  ...route.optionalCapabilities.map((item) => resolveCapability(item, false))
];
const tokenRoleNames = [...new Set(components.flatMap((item) => item.tokenRoles || []))];
const tokens = Object.fromEntries(tokenRoleNames.map((role) => [role, indexes['token-index'].semanticRoles[role] || { lookup: `packages/tokens; role=${role}` }]));
const packet = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  repository: { root: repo, strategy: located.strategy },
  request: { task: args.task || null, domain: args.domain || null, framework, mode },
  route: { id: route.id, aliases: route.aliases, domains: route.domains },
  layout,
  components,
  customCompositions: route.customCompositions,
  tokens,
  exactReferencesToRead: [
    'references/requirement-spec.md',
    'references/layouts/framework-layout-routing.md',
    ...layout.references,
    'references/components/source-resolution.md',
    mode === 'fast-preview' ? 'references/workflows/fast-preview.md' : 'references/workflows/release-validation.md'
  ],
  validation: indexes['validation-index'].modes[mode],
  browserChecks: mode === 'fast-preview'
    ? ['target desktop viewport', 'shell/pane geometry', 'primary path', 'critical overlay', 'keyboard recovery']
    : ['all required states', 'accessibility', 'responsive minimum window', 'visual parity', 'final artifact reopening']
};

function markdown(value) {
  const lines = [
    '# Text-to-UI Context Packet', '',
    `- Task route: ${value.route.id}`,
    `- Framework: ${value.request.framework}`,
    `- Mode: ${value.request.mode}`,
    `- Monorepo: ${value.repository.root} (${value.repository.strategy})`, '',
    '## Layout', '',
    `- ${value.layout.label}`,
    `- Pane order: ${value.layout.paneOrder.join(' → ')}`,
    `- Required slots: ${value.layout.requiredSlots.join(', ')}`, '',
    '## Component resolution', ''
  ];
  for (const item of value.components) lines.push(`- ${item.required ? 'Required' : 'Optional'} ${item.capability}: ${item.sourceLevel}${item.component ? ` → ${item.component} (${item.source || item.contractPointer})` : ''}`);
  lines.push('', '## Page-owned compositions', '', ...value.customCompositions.map((item) => `- ${item}`), '', '## Read only these references', '', ...value.exactReferencesToRead.map((item) => `- ${item}`), '', '## Validation', '', ...value.validation.commands.map((item) => `- \`${item}\``), '');
  return `${lines.join('\n')}\n`;
}

if (args.out) {
  const output = path.resolve(args.out);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const format = args.format || (path.extname(output) === '.md' ? 'markdown' : 'json');
  fs.writeFileSync(output, format === 'markdown' ? markdown(packet) : stableJson(packet));
  console.log(`Context packet written: ${output}`);
} else if (args.format === 'markdown') {
  process.stdout.write(markdown(packet));
} else print(packet);
