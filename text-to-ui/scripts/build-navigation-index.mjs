#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  generatedIndexDir, locateMonorepo, parseArgs, readJson, resolveSkillRoot,
  sha256File, stableJson
} from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const located = locateMonorepo({ start: args.start || process.cwd(), explicitRepo: args.repo });
if (!located.root) throw new Error(`Text-to-UI Monorepo not found. Tried:\n${located.attempted.join('\n')}`);
const repo = located.root;
const skillRoot = resolveSkillRoot(repo, args['skill-root']);
const indexRoot = path.join(skillRoot, 'references', 'index');
const outputRoot = generatedIndexDir(skillRoot);

const sources = {
  components: path.join(repo, 'packages/component-contracts/src/components.json'),
  parity: path.join(repo, 'packages/component-contracts/src/parity-manifest.json'),
  tokens: path.join(repo, 'packages/tokens/src/token-runtime-map.json'),
  packages: path.join(repo, 'package.json'),
  tasks: path.join(indexRoot, 'task-routes.source.json'),
  layouts: path.join(indexRoot, 'layout-routes.source.json'),
  aliases: path.join(indexRoot, 'capability-aliases.source.json')
};
const sourceEvidence = Object.fromEntries(Object.entries(sources).map(([key, file]) => [key, {
  path: path.relative(repo, file), sha256: sha256File(file)
}]));

const registry = readJson(sources.components);
const parity = readJson(sources.parity);
const tokenMap = readJson(sources.tokens);
const packageJson = readJson(sources.packages);
const taskSource = readJson(sources.tasks);
const layoutSource = readJson(sources.layouts);
const aliasSource = readJson(sources.aliases);
const parityById = new Map(parity.components.map((item) => [item.id, item]));

function normalizedWords(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '');
}

function componentCapabilities(component) {
  const values = new Set([component.id, normalizedWords(component.logicalName?.split('/')[0]), component.category]);
  for (const [capability, aliases] of Object.entries(aliasSource.aliases)) {
    if ([capability, ...aliases].some((candidate) => candidate === component.id || candidate === normalizedWords(component.logicalName?.split('/')[0]))) values.add(capability);
  }
  return [...values].filter(Boolean).sort();
}

const components = registry.components.map((component) => {
  const frameworkSources = Object.fromEntries(['html', 'react', 'vue'].map((framework) => {
    const source = component.implementations?.[framework] || component.frameworks?.[framework]?.source || null;
    const file = source?.split('#')[0];
    return [framework, {
      package: `@text-to-ui/components-${framework}`,
      source,
      exists: Boolean(file && fs.existsSync(path.join(repo, file))),
      status: component.frameworks?.[framework]?.status || component.status
    }];
  }));
  const parityItem = parityById.get(component.id);
  return {
    id: component.id,
    logicalName: component.logicalName,
    capabilities: componentCapabilities(component),
    category: component.category,
    status: component.status,
    sourceStrategy: component.sourceStrategy,
    variants: component.variants || [],
    states: component.states || component.allowedStates || [],
    props: component.props || [],
    slots: component.slots || [],
    behaviors: component.behaviors || parityItem?.behaviorChecks || [],
    tokenRoles: component.tokenRoles || parityItem?.tokenRoles || [],
    iconAliases: component.iconAliases || [],
    contractPointer: `packages/component-contracts/src/components.json#${component.id}`,
    canonicalSelector: component.canonicalSelector,
    frameworks: frameworkSources
  };
}).sort((a, b) => a.id.localeCompare(b.id));

const taskRouter = {
  schemaVersion: 1,
  generatedFrom: [sourceEvidence.tasks, sourceEvidence.components, sourceEvidence.layouts],
  policy: {
    lookupOrder: ['task-route', 'layout', 'components', 'exact-contract'],
    componentSourceOrder: ['real-framework-component', 'matching-contract', 'token-based-custom'],
    exactContractReadRequiredAfterSelection: true
  },
  routes: taskSource.routes
};
const layoutIndex = {
  schemaVersion: 1,
  generatedFrom: [sourceEvidence.layouts, { path: 'text-to-ui/references/harmonyos-layout-patterns.md', sha256: sha256File(path.join(skillRoot, 'references/harmonyos-layout-patterns.md')) }],
  layouts: layoutSource.layouts
};
const componentIndex = {
  schemaVersion: 1,
  generatedFrom: [sourceEvidence.components, sourceEvidence.parity, sourceEvidence.aliases],
  frameworkPackages: {
    html: '@text-to-ui/components-html', react: '@text-to-ui/components-react', vue: '@text-to-ui/components-vue'
  },
  componentCount: components.length,
  components
};
const tokenIndex = {
  schemaVersion: 1,
  generatedFrom: [sourceEvidence.tokens],
  policy: tokenMap.policy,
  semanticRoles: tokenMap.semanticRoles,
  collections: Object.fromEntries(Object.entries(tokenMap.mappings.reduce((groups, item) => {
    (groups[item.pixsoCollection] ||= []).push({
      role: Object.entries(tokenMap.semanticRoles).find(([, value]) => value.cssVariable === item.cssVariable)?.[0] || null,
      cssVariable: item.cssVariable,
      pixsoVariable: item.pixsoVariable,
      value: item.resolvedCssValue,
      sourceToken: item.sourceToken
    });
    return groups;
  }, {})).map(([key, value]) => [key, value]))
};
const validationIndex = {
  schemaVersion: 1,
  generatedFrom: [sourceEvidence.packages],
  modes: {
    'fast-preview': {
      purpose: 'Reach the first browser-visible interactive page after blocking checks only.',
      commands: ['pnpm index:check', 'pnpm layout:contract:test', 'pnpm components:reuse:test'],
      requiredEvidence: ['layout-contract.json', 'component-usage.json', 'build-or-open-success', 'target-viewport', 'primary-path-operable']
    },
    'release-validation': {
      purpose: 'Run complete repository and delivery validation after visible direction approval.',
      commands: ['pnpm test', 'pnpm gallery:build'],
      requiredEvidence: ['direction-approval', 'full-validation-report', 'final-browser-review']
    }
  },
  availablePackageScripts: packageJson.scripts
};

const outputs = {
  'task-router.json': taskRouter,
  'layout-index.json': layoutIndex,
  'component-index.json': componentIndex,
  'token-index.json': tokenIndex,
  'validation-index.json': validationIndex
};
let drift = false;
for (const [name, value] of Object.entries(outputs)) {
  const file = path.join(outputRoot, name);
  const expected = stableJson(value);
  if (args.check) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== expected) {
      console.error(`Navigation index drift: ${path.relative(repo, file)}`);
      drift = true;
    }
  } else {
    fs.mkdirSync(outputRoot, { recursive: true });
    fs.writeFileSync(file, expected);
    console.log(`Generated ${path.relative(repo, file)}`);
    const deliveryMirror = path.join(repo, 'skill', 'references', 'index', 'generated', name);
    if (skillRoot === path.join(repo, 'text-to-ui') && fs.existsSync(path.join(repo, 'skill'))) {
      fs.mkdirSync(path.dirname(deliveryMirror), { recursive: true });
      fs.writeFileSync(deliveryMirror, expected);
      console.log(`Synced ${path.relative(repo, deliveryMirror)}`);
    }
  }
}
if (drift) process.exitCode = 1;
