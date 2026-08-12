<script setup>
import "./styles.css";
const props = defineProps({ label: { type: String, default: "刷新列表" }, content: { type: String, default: "刷新列表" } });
</script>
<template><div class="tui-component tui-tooltip" data-component="tooltip" data-logical-component="Tooltip/Default" data-variant="default" data-state="default" data-framework="vue"><button class="tui-button tui-button--ghost" type="button" data-variant="ghost" data-typography-role="body-l">{{ props.label }}</button><span class="tui-tooltip__panel" role="tooltip" data-slot="content" data-typography-role="body-l">{{ props.content }}</span></div></template>
