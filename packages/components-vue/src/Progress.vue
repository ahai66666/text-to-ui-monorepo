<script setup>
import "./styles.css";
const props = defineProps({ value: { type: Number, default: 68 }, label: { type: String, default: "完成度" } });
</script>
<template><div class="tui-component tui-progress" data-component="progress" data-logical-component="Progress/Default" data-variant="default" data-state="default" data-framework="vue" role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.min(100, Math.max(0, props.value))" :style="{ '--progress-value': `${Math.min(100, Math.max(0, props.value))}%` }"><span class="tui-progress__label" data-typography-role="caption-l">{{ props.label }} · {{ Math.min(100, Math.max(0, props.value)) }}%</span><div class="tui-progress__track"><span class="tui-progress__value" /></div></div></template>
