<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "设计进度" }, description: { type: String, default: "84%" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--meter" data-component="progress" data-logical-component="Progress/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="body-m">设计进度</span></span><div class="tui-generated__meter"><span style="--tui-meter-value:84%"></span></div><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">84%</small></span></div>
</template>
