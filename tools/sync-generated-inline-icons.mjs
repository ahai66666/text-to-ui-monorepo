#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { iconMarkup } from "../packages/components-html/src/icon-map.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directories = [
  "packages/components-html/src/generated",
  "packages/components-vue/src/generated"
];
const inlineIconPattern = /<svg\b[^>]*data-icon-alias="([^"]+)"[^>]*>[\s\S]*?<\/svg>/g;
let fileCount = 0;
let iconCount = 0;

for (const relativeDirectory of directories) {
  const directory = path.join(root, relativeDirectory);
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(?:html|vue)$/.test(entry.name)) continue;
    const file = path.join(directory, entry.name);
    const source = await fs.readFile(file, "utf8");
    let replacements = 0;
    const output = source.replace(inlineIconPattern, (_, alias) => {
      replacements += 1;
      return iconMarkup(alias, { size: 20 });
    });
    if (output !== source) {
      await fs.writeFile(file, output);
      fileCount += 1;
      iconCount += replacements;
    }
  }
}

console.log(`Synchronized ${iconCount} icons across ${fileCount} generated HTML/Vue adapters.`);
