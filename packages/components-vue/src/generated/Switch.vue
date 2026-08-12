<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "自动同步" }, description: { type: String, default: "已开启" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <label class="tui-generated tui-generated--choice" data-component="switch" data-logical-component="Switch/Default" data-variant="default" data-state="default" data-framework="vue"><input type="checkbox" checked /><span data-slot="label" data-typography-role="body-l">自动同步</span><span data-slot="description" data-typography-role="body-m">已开启</span></label>
</template>
