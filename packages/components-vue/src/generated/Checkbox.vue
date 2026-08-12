<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "同步到云端" }, description: { type: String, default: "已选中" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <label class="tui-generated tui-generated--choice" data-component="checkbox" data-logical-component="Checkbox/Default" data-variant="default" data-state="default" data-framework="vue"><input type="checkbox" checked /><span data-slot="label" data-typography-role="body-l">同步到云端</span><span data-slot="description" data-typography-role="body-m">已选中</span></label>
</template>
