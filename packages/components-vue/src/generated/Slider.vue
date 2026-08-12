<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "透明度" }, description: { type: String, default: "80" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--meter" data-component="slider" data-logical-component="Slider/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="body-m">透明度</span></span><div class="tui-generated__meter"><span style="--tui-meter-value:84%"></span></div><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">80</small></span></div>
</template>
