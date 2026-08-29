#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { findComponent, loadIndexes, locateMonorepo, normalizeList, parseArgs, print, resolveSkillRoot, stableJson } from './navigation-index-lib.mjs';
import { readPatternRegistry, resolvePatternContract } from './pattern-contract-lib.mjs';
import { buildFrameworkRendererContract, componentRendererBinding } from './framework-renderer-contract.mjs';
import { stableDigest } from './ui-scene-core.mjs';

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
const confirmed = args.confirmed === true || String(args.confirmed).toLowerCase() === 'true';
if (!confirmed) throw new Error('Pattern and requirements are not confirmed. Resolve a Context Packet only after explicit user confirmation with --confirmed.');

const requestedPattern = args.pattern ? String(args.pattern) : null;
const matchedRoute = indexes['task-router'].routes.find((item) => [item.id, ...item.aliases, ...item.domains].some((value) => value.toLowerCase().includes(query) || query.includes(value.toLowerCase())));
let route = matchedRoute;
if (!route) {
  if (!requestedPattern) throw new Error(`No task route matches '${query}'. Unknown tasks require an explicitly confirmed --pattern <pattern-id> and --capabilities <capability,...>; the Skill must not guess a Pattern.`);
  const adHocLayout = indexes['layout-index'].layouts.find((item) => item.id === requestedPattern);
  if (!adHocLayout) throw new Error(`Unknown Pattern '${requestedPattern}'. Use one of the approved Pattern IDs from the layout index.`);
  const capabilities = normalizeList(args.capabilities || args['required-capabilities']);
  if (capabilities.length === 0) throw new Error('Unknown tasks require --capabilities <capability,...> so component selection is explicit.');
  route = {
    id: `ad-hoc-${adHocLayout.id}`,
    aliases: [],
    domains: [],
    layout: adHocLayout.id,
    requiredCapabilities: capabilities,
    optionalCapabilities: normalizeList(args['optional-capabilities']),
    customCompositions: []
  };
} else if (requestedPattern && requestedPattern !== matchedRoute.layout) {
  throw new Error(`Confirmed task route '${matchedRoute.id}' resolves to '${matchedRoute.layout}', not '${requestedPattern}'. Revise the analysis or task route before continuing.`);
}
const layout = indexes['layout-index'].layouts.find((item) => item.id === route.layout);
if (!layout) throw new Error(`Task route '${route.id}' references a missing approved Pattern: ${route.layout}`);
const resolvedPattern = resolvePatternContract(route.layout, {
  registry: readPatternRegistry(path.join(skillRoot, 'assets', 'design-system', 'pattern-contracts.json'))
});
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
    rendererKey: runtime?.rendererKey || null,
    rendererPackage: runtime?.package || null,
    factoryImport: runtime?.factoryImport || null,
    styleImports: runtime?.styleImports || [],
    source: runtime?.source || null,
    contractPointer: component.contractPointer,
    variants: component.variants,
    states: component.states,
    props: component.props,
    slots: component.slots,
    supportedProps: component.props,
    supportedSlots: component.slots,
    slotContracts: component.slotContracts || {},
    tokenRoles: component.tokenRoles,
    iconAliases: component.iconAliases
  };
};
const components = [
  ...route.requiredCapabilities.map((item) => resolveCapability(item, true)),
  ...route.optionalCapabilities.map((item) => resolveCapability(item, false))
];
const rendererComponents = components
  .filter((item) => item.sourceLevel === 'real-framework-component')
  .map((item) => {
    const indexed = indexes['component-index'].components.find((component) => component.logicalName === item.logicalName);
    const binding = indexed ? componentRendererBinding(indexed, framework) : null;
    return binding ? { ...binding, capability: item.capability } : null;
  });
const renderer = buildFrameworkRendererContract(framework, rendererComponents);
const patternDigest = stableDigest(resolvedPattern.pattern);
const tokenRoleNames = [...new Set(components.flatMap((item) => item.tokenRoles || []))];
const tokens = Object.fromEntries(tokenRoleNames.map((role) => [role, indexes['token-index'].semanticRoles[role] || { lookup: `packages/tokens; role=${role}` }]));
const packet = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  repository: { root: repo, strategy: located.strategy },
  request: {
    task: args.task || null,
    domain: args.domain || null,
    framework,
    mode,
    confirmed: true,
    confirmation: { status: 'confirmed', source: 'explicit-cli-flag' }
  },
  route: { id: route.id, aliases: route.aliases, domains: route.domains, source: matchedRoute ? 'task-route' : 'explicit-pattern' },
  layout,
  patternContract: { ...resolvedPattern, patternDigest },
  components,
  renderer,
  customCompositions: route.customCompositions,
  tokens,
  exactReferencesToRead: [
    'references/requirement-spec.md',
    'references/layouts/framework-layout-routing.md',
    ...layout.references,
    'assets/design-system/pattern-contracts.json',
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
