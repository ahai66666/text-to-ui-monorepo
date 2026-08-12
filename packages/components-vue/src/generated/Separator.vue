<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "分割线" }, description: { type: String, default: "内容分组" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--separator" data-component="separator" data-logical-component="Separator/Default" data-variant="default" data-state="default" data-framework="vue" role="separator" aria-label="分割线"></div>
</template>
