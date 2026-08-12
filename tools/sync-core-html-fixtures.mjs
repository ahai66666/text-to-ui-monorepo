#!/usr/bin/env node

/**
 * Keep the small standalone HTML fixtures on the same inline-icon path as the
 * HTML renderer.  These files are useful when a component is opened directly,
 * so leaving a relative <use> reference here would reintroduce the file://
 * sprite/CORS failure that the runtime renderer has already removed.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { iconMarkup } from "../packages/components-html/src/icon-map.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "packages/components-html/src/search.html",
  "packages/components-html/src/sidebar.html",
  "packages/components-html/src/list-card.html"
];
const externalIconPattern = /<svg\b[^>]*data-icon-alias="([^"]+)"[^>]*>\s*<use\b[^>]*><\/use>\s*<\/svg>/g;

for (const relative of files) {
  const file = path.join(root, relative);
  const source = await fs.readFile(file, "utf8");
  const output = source.replace(externalIconPattern, (_, alias) => iconMarkup(alias, { size: 20 }));
  if (output !== source) await fs.writeFile(file, output);
}

console.log(`Synchronized ${files.length} standalone HTML fixtures to inline SVG icons.`);
