<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "Form Field" }, description: { type: String, default: "HarmonyOS PC 组件示例" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <section class="tui-generated tui-generated--card" data-component="form-field" data-logical-component="Form Field/Default" data-variant="input" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">Form Field</span></span></section>
</template>
