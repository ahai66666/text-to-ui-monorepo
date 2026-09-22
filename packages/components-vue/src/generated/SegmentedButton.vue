<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "Segmented Button" }, description: { type: String, default: "HarmonyOS PC 组件示例" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <section class="tui-generated tui-generated--card" data-component="segmented-button" data-logical-component="Segmented Button/Default" data-variant="default" data-state="default" data-framework="vue"></section>
</template>
