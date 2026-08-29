#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "./pixso-native-scene-lib.mjs";

const args = parseArgs(process.argv.slice(2));
const routeId = String(args.route ?? "").trim();
const skillRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const indexPath = path.join(skillRoot, "references/routes/index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));

if (args.list) {
  process.stdout.write(`${JSON.stringify({ ok: true, routes: Object.entries(index.routes).map(([id, route]) => ({ id, description: route.description })) }, null, 2)}\n`);
  process.exit(0);
}
if (!routeId || !index.routes[routeId]) {
  const available = Object.keys(index.routes).join(", ");
  throw new Error(`Unknown or missing --route. Available routes: ${available}`);
}
const route = index.routes[routeId];
const references = route.exactReferencesToRead.map((relative) => {
  const absolute = path.join(skillRoot, relative);
  if (!fs.existsSync(absolute)) throw new Error(`Route ${routeId} points to a missing reference: ${relative}`);
  return { relative, absolute };
});
process.stdout.write(`${JSON.stringify({ ok: true, routeId, description: route.description, exactReferencesToRead: references }, null, 2)}\n`);
