# Existing HTML to Pixso — normal route

Use only for an existing, rendered page whose structure is already approved.
The task is exact-output conversion, not product design. Do not read the new-page
route or broad Pixso manuals during a normal run.

## Contract

- Restate URL, `1728 × 1152` CSS viewport unless the user supplied another,
  zoom `1.0`, requested visible state, and “no redesign”.
- Pass the URL through `resolve-pixso-import-url.mjs` before creating a run.
  When a static HTML root is known and a nonexistent suffix was accidentally
  appended to its directory URL, use the corrected directory entry and record
  both URLs in the run manifest. Preserve real files. Use
  `--allow-virtual-route` only for an intentional SPA route.
- Start managed services once.
- Use a fresh isolated run under the HTML root's `.text-to-ui/pixso-runs/` or an
  explicitly supplied runs root. Generated evidence is excluded from the HTML
  fingerprint.
- Capture the current browser-computed manifest and exact screenshot once.
- Apply the shared HTML text-sizing contract from
  `references/pixso-fidelity-import-pipeline.md`: fitting text stays intrinsic;
  only measured overflow with HTML ellipsis becomes fixed-width native Pixso
  `TRUNCATE`.
- Compile with the default `dom-visual-ir` pipeline. Browser bounds are the only
  geometry authority; compatible components and Tokens are applied afterward.
- Validate, publish once to the connected plugin, read back once, and compare the
  structured screenshot with the HTML screenshot.

## Normal sequence

```text
services → fresh run → capture → compile → validate → publish → readback/diff
```

Public lifecycle commands:

```bash
node scripts/start-text-to-ui-services.mjs start
node scripts/pixso-import-orchestrator.mjs start --html-root <root> --url <url> --width 1728 --height 1152 --mode normal
node scripts/pixso-import-orchestrator.mjs compile --run-manifest <run-manifest> --visual-manifest <visual-manifest> --component-map assets/design-system/mapping-registry.json --minimum-selector-coverage 0.95 --minimum-visual-evidence-coverage 0.95
node scripts/pixso-import-orchestrator.mjs publish --run-manifest <run-manifest>
node scripts/pixso-import-orchestrator.mjs diff --run-manifest <run-manifest> --reference <html-reference.png> --actual <pixso-structured.png> --out <visual-diff.json> --pixel-threshold 20 --max-different-ratio 0.005
```

Browser capture is the only browser-tool step. Save its manifest and screenshot
at the artifact paths declared by the run. Do not recapture or retry in normal
mode.

`publish` performs plan/run validation, checks plugin readiness once, starts the
execution stage, and publishes exactly once. If the plugin is unavailable, stop
and report its precise connection/runtime/protocol state. Do not auto-fallback
to MCP or repeatedly create new runs. Reconnect Permanent Agent Kernel `5.0.0`, then use
one fresh run.

The plugin creates one hidden managed draft. It swaps that draft into the
canonical position only after readback succeeds and removes it on pause or
failure, so a normal import leaves exactly one managed artboard.

## Stop conditions

Stop immediately when source hashes, run IDs, viewport/state, geometry coverage,
plugin version, execution, readback, or visual diff fails. Do not edit the
converter during that run. Cancel or fail it, then use `converter-diagnosis`.
Never weaken the gate or replay the plan.

Normal target: 30–90 seconds wall time. Capture and compile should normally take
seconds; if orchestration dominates, report its exact stage rather than calling
the converter slow.
