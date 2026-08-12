<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "筛选条件" }, description: { type: String, default: "状态、负责人、更新时间" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--floating" data-component="popover" data-logical-component="Popover/Default" data-variant="default" data-state="default" data-framework="vue"><button class="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">筛选条件</button><div class="tui-generated__floating-panel" data-slot="content"><span data-typography-role="title-s">筛选条件</span><span data-typography-role="body-m">状态、负责人、更新时间</span></div></div>
</template>
