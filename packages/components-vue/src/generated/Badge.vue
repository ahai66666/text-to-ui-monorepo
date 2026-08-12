<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "进行中" }, description: { type: String, default: "状态" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <span class="tui-generated tui-generated--inline" data-component="badge" data-logical-component="Badge/Default" data-variant="default" data-state="default" data-framework="vue" data-slot="label">状态</span>
</template>
