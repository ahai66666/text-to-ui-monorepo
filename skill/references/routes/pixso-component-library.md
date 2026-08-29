# Pixso component-library route

Read only the references needed for the requested operation:

- cross-source relationship selection and maintenance: `references/mapping-registry.md`
- component creation/synchronization: `references/pixso-component-maintenance.md`
- page instance usage and slots: `references/pixso-component-usage.md`
- native renderer structure: `references/pixso-native-scene.md`

Use the HTML component contract as identity, props, slots, and source evidence.
Resolve current Pixso Variables, Styles, Components, and Variant GUIDs at
runtime. Production components target `NewComponents`; `Components` is
review-only when explicitly requested. A missing slot or mapped component blocks
only that component path—never create a lookalike and call it an Instance.

Build and test the plugin package only when renderer/API behavior changes.
