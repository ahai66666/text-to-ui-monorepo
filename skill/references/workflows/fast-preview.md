# Fast Preview

Use this mode to reach the first real, interactive browser page quickly. It is a review gate, not final delivery.

## Required sequence

1. Complete Gate 0: show the requirement analysis, Tool Task Brief, page tree,
   proposed Pattern, states, assumptions, and workflow; then receive explicit
   user confirmation. Never treat the original build request as confirmation.
2. Generate a `fast-preview` Context Packet with `resolve-context.mjs`.
3. Create and validate `layout-contract.json` before component selection.
4. Create `component-usage.json` from the packet and exact selected component contracts.
5. Import real target-framework components. Use contract implementation only for indexed library misses; use Token-based custom work only after both searches miss.
6. Build or open the real page and verify the target desktop viewport, framework geometry, primary path, one critical overlay, and keyboard recovery.
7. Show the page and pause for browser comments. Iterate on the same preview until the user explicitly approves the direction.

Do not run full repository, Pixso parity, packaging, mirror, or exhaustive state validation before direction approval unless a specific failure requires it.

## Minimum evidence

- Valid `layout-contract.json`.
- Valid `component-usage.json` with source level and evidence for every region.
- Browser-openable real artifact.
- Target viewport and shell/pane check.
- Operable primary path.
- Review status: `pending`, `changes-requested`, or `direction-approved`.

Run `verify-fast-preview.mjs` for the deterministic portion. Browser observations remain explicit manual evidence.
