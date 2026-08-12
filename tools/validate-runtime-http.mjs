#!/usr/bin/env node

/**
 * HTTP smoke gate for the three-framework gallery.
 *
 * This is intentionally separate from the static contract gate: file:// can
 * only serve the HTML fallback, while the Vite URL must expose all three real
 * runtime entry points. A browser screenshot/interaction runner can build on
 * this same URL after the smoke check passes.
 */
import process from "node:process";

const base = (process.env.RUNTIME_BASE_URL ?? "http://127.0.0.1:4183").replace(/\/$/, "");
const required = [
  ["index", "/index.html"],
  ["HTML runtime", "/runtime-html.js"],
  ["React runtime", "/runtime-react.jsx"],
  ["Vue runtime", "/runtime-vue.js"],
  ["runtime catalog", "/runtime-catalog.js"]
];
const failures = [];
const results = [];
for (const [label, pathname] of required) {
  try {
    const response = await fetch(`${base}${pathname}`);
    const body = await response.text();
    results.push({ label, status: response.status, bytes: body.length });
    if (!response.ok) failures.push(`${label} returned HTTP ${response.status}`);
    if (!body.trim()) failures.push(`${label} returned an empty response`);
  } catch (error) {
    failures.push(`${label} is unreachable: ${error.message}`);
  }
}
try {
  const index = await (await fetch(`${base}/index.html`)).text();
  for (const marker of ["data-component-mount=\"component-catalog\"", "runtime-file-fallback.js", "data-runtime-framework=\"html\"", "data-runtime-framework=\"react\"", "data-runtime-framework=\"vue\""]) {
    if (!index.includes(marker)) failures.push(`index is missing ${marker}`);
  }
} catch {
  // The request failure is already reported above.
}
console.log(JSON.stringify({ ok: failures.length === 0, base, results, failures }, null, 2));
if (failures.length) process.exit(1);
