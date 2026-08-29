#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tui-context-gate-'));
const output = path.join(temp, 'context.json');
const resolver = path.resolve('text-to-ui/scripts/resolve-context.mjs');
const run = (...args) => spawnSync(process.execPath, [resolver, ...args], { encoding: 'utf8' });
assert.notEqual(run('--task', 'tasks', '--framework', 'html', '--mode', 'fast-preview').status, 0, 'unconfirmed context must fail');
const known = run('--task', 'tasks', '--framework', 'html', '--mode', 'fast-preview', '--confirmed', '--out', output);
assert.equal(known.status, 0, known.stderr);
assert.equal(JSON.parse(fs.readFileSync(output, 'utf8')).layout.id, 'pattern-b-three-pane');
assert.notEqual(run('--task', 'unrouted-workflow', '--framework', 'html', '--mode', 'fast-preview', '--confirmed').status, 0, 'unknown task without Pattern must fail');
const unknown = run('--task', 'unrouted-workflow', '--framework', 'html', '--mode', 'fast-preview', '--confirmed', '--pattern', 'pattern-a-two-pane', '--capabilities', 'titlebar,button', '--out', output);
assert.equal(unknown.status, 0, unknown.stderr);
assert.equal(JSON.parse(fs.readFileSync(output, 'utf8')).layout.id, 'pattern-a-two-pane');
fs.rmSync(temp, { recursive: true, force: true });
console.log('Context Pattern gate tests passed.');
