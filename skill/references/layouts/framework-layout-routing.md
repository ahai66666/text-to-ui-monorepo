# Framework Layout Routing

Choose the framework contract before components or page code.

- Navigation to content, dashboard, settings, or content hub: Pattern A.
- Repeated list to detail, including mail, contacts, tasks, and records: Pattern B.
- Command-heavy tool or canvas workspace: Pattern C.
- Add an inspector to B or C only when contextual inspection is necessary: Pattern D.

Always preserve the Global Title Layer, pane order, inset owners, scroll owners, resize behavior, minimum window, and declared action slots. In Pattern B, every action scoped to the complete third pane belongs in the `main-detail-actions` Titlebar slot (`0..n` actions). Components fill slots; they never reshape the shell.

Use `query-layouts.mjs` to locate the exact sections in `harmonyos-layout-patterns.md`, `layout-system.md`, and `pc-framework-layout-gate.md`.
