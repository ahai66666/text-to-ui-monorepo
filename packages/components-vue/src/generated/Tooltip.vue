<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "刷新列表" }, description: { type: String, default: "快捷提示" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--floating" data-component="tooltip" data-logical-component="Tooltip/Default" data-variant="default" data-state="default" data-framework="vue"><button class="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">刷新列表</button><div class="tui-generated__floating-panel" data-slot="content"><span data-typography-role="title-s">刷新列表</span><span data-typography-role="body-m">快捷提示</span></div></div>
</template>
