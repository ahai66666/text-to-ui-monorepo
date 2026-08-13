#!/usr/bin/env node
import { findComponent, loadIndexes, locateMonorepo, normalizeList, parseArgs, print, resolveSkillRoot } from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
const located = locateMonorepo({ start: args.start || process.cwd(), explicitRepo: args.repo });
if (!located.root) throw new Error('Text-to-UI Monorepo not found. Run locate-monorepo.mjs and provide --repo.');
const skillRoot = resolveSkillRoot(located.root, args['skill-root']);
const index = loadIndexes(skillRoot)['component-index'];
const framework = args.framework || 'html';
if (!['html', 'react', 'vue'].includes(framework)) throw new Error(`Unsupported framework: ${framework}`);
const capabilities = normalizeList(args.capabilities || args.component);
if (!capabilities.length) throw new Error('Provide --capabilities search,checkbox,...');
const results = capabilities.map((capability) => {
  const component = findComponent(index, capability);
  if (!component) return { capability, resolution: 'custom', reason: 'No library component or indexed contract match. Verify the exact registry before custom drawing.' };
  const runtime = component.frameworks[framework];
  return {
    capability,
    resolution: runtime?.exists ? 'real-framework-component' : 'matching-contract',
    component: component.id,
    logicalName: component.logicalName,
    importPackage: runtime?.exists ? runtime.package : null,
    source: runtime?.source || null,
    status: runtime?.status || component.status,
    contractPointer: component.contractPointer,
    variants: component.variants,
    states: component.states,
    props: component.props,
    slots: component.slots,
    tokenRoles: component.tokenRoles,
    iconAliases: component.iconAliases
  };
});
print({ repo: located.root, framework, results });
