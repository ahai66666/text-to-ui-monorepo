#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, readJson } from './navigation-index-lib.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.artifact || !args['layout-contract']) throw new Error('Usage: validate-layout-markers.mjs --artifact <index.html> --layout-contract <layout-contract.json> [--source <file-or-dir>]');
const contract = readJson(path.resolve(args['layout-contract']));
const sources = [args.artifact, ...(Array.isArray(args.source) ? args.source : args.source ? [args.source] : [])];
const files = [];
const collect = (candidate) => {
  const absolute = path.resolve(candidate);
  if (!fs.existsSync(absolute)) throw new Error(`Layout marker source not found: ${absolute}`);
  if (fs.statSync(absolute).isFile()) { files.push(absolute); return; }
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'coverage', '.git'].includes(entry.name)) continue;
    collect(path.join(absolute, entry.name));
  }
};
sources.forEach(collect);
const source = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const failures = [];
const quote = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasValue = (attribute, value) => new RegExp(`${attribute}\\s*(?:=|:)\\s*["']${quote(value)}["']`).test(source);
const hasDatasetValue = (property, value) => new RegExp(`(?:dataset\\.${property}\\s*=\\s*|setAttribute\\(\\s*["']data-${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}["']\\s*,\\s*)["']${quote(value)}["']`).test(source);
const hasMarker = (attribute, datasetProperty, value) => hasValue(attribute, value) || hasDatasetValue(datasetProperty, value);
if (!hasMarker('data-tui-pattern', 'tuiPattern', contract.pattern)) failures.push(`page root must declare data-tui-pattern=${contract.pattern}`);
const paneOrderValue = contract.paneOrder.join(' ');
if (!hasMarker('data-tui-pane-order', 'tuiPaneOrder', paneOrderValue)) failures.push(`page root must declare data-tui-pane-order="${paneOrderValue}"`);
for (const pane of contract.paneOrder) if (!hasMarker('data-tui-pane-role', 'tuiPaneRole', pane)) failures.push(`Pattern pane must declare data-tui-pane-role=${pane}`);
if (contract.pattern === 'pattern-b-three-pane') {
  if (!/layout\s*:\s*["']three-column["']/.test(source)) failures.push('Pattern B Titlebar must use layout="three-column"');
  if (!/paneRole\s*:\s*["']final-pane["']/.test(source)) failures.push('Pattern B final Titlebar must declare paneRole="final-pane"');
  if (!/(mainDetailActions|main-detail-actions)/.test(source)) failures.push('Pattern B must bind the third-pane global actions to main-detail-actions');
}

if (failures.length) { console.error('Layout marker validation failed'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(JSON.stringify({ ok: true, pattern: contract.pattern, paneOrder: contract.paneOrder, scannedFiles: files.length }, null, 2));
