# Skill maintenance

Use for Skill audits, code refactoring, mapping cleanup, and delivery repair.
An audit is read-only; an explicit request to fix authorizes the scoped changes.
Do not send maintenance through the new-page approval gate.

For every MAJOR version update, use
`references/governance/major-version-update-checklist.md`. The update report
must list route-material changes, Pattern/component/Token/icon contract
changes, generator and gate changes, mirror synchronization, migration notes,
and the complete validation result. A user can provide only the desired
change; the maintenance route owns the impact analysis and checklist.

- Work in the canonical `text-to-ui/` and `packages/` sources; run root commands from the repository.
- Inspect existing changes and keep delivery-only edits backed up before synchronization.
- Component identities and aliases live in `mapping-registry.json`; `component-mapping-resolver.mjs` is the shared normalization implementation. Generated maps are not inputs to canonical resolution.
- `componentMappings` is the formal catalog; `componentAliases` contains explicit compatibility variants only, with unique non-shadowing names. `packages/pixso-mapping/index.json` is generated with `pnpm mappings:sync`, never hand maintained.
- Keep product-specific diagnostic builders in `coremail-semantic-adapter.mjs`.
- Validate the affected mapping, import, or rendering behavior before synchronization.
- Run `node text-to-ui/scripts/skill-delivery.mjs --write` after source checks pass, then `--check`. The canonical `text-to-ui/` tree is the only authoring source; `skill/`, the installed Skill, and the Pixso plugin are delivery mirrors. The check verifies every managed file, detects deleted-but-still-managed files in mirrors, verifies entrypoint imports, and preserves explicitly untracked local runtime state.
- Rebuild plugin artifacts with their builders when runtime or mapping inputs change. Synchronize an existing delivery package and verify its hashes; live Pixso execution is not part of repository maintenance.
- `pnpm skill:sync` also synchronizes an existing unified plugin delivery directory after rebuilding. It backs up changed files and preserves extra local files. `pnpm skill:check` verifies all source files, critical module imports, and plugin delivery hashes.
- Report checks and any unresolved differences; do not silently suppress failed gates.

## Import reliability maintenance

- Publish exclusively through the running Bridge's `POST /publish` endpoint via
  `pixso-import-orchestrator.mjs publish`. The CLI must never write a private queue.
  If an older Bridge lacks the endpoint, update the managed service; do not fall
  back to directory-based publication.
- Diagnose a stall using current operation start, last completed operation, and
  module identity. A last-completed icon is not evidence that icon creation hung.
- Heartbeats may carry newer sampled completion counters; count that advancement,
  but an unchanged heartbeat must never reset the no-progress deadline.
- Report cleanup as confirmed only when the executor reports `removed` or
  `not-created`. A cancel request alone means cleanup is pending confirmation.
- Use generic fixtures for queue splitting, timeouts, cancellation and fallback.
  Coremail is an integration fixture only: never edit its HTML to hide a converter
  or plugin failure. State separately which repository tests passed and which
  installed-plugin/live-browser checks remain unverified.
