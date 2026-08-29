<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "Bubble" }, description: { type: String, default: "HarmonyOS PC 组件示例" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <section class="tui-generated tui-generated--card" data-component="bubble" data-logical-component="Bubble/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">Bubble</span></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">HarmonyOS PC 组件示例</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-s">辅助说明</small></span></section>
</template>
