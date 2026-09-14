<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "Number Selector" }, description: { type: String, default: "HarmonyOS PC 组件示例" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <section class="tui-generated tui-generated--card" data-component="number-selector" data-logical-component="Number Selector/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">Number Selector</span></span></section>
</template>
