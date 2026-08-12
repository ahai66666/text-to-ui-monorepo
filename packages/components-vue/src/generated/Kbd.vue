<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "快捷键" }, description: { type: String, default: "⌘ K" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <span class="tui-generated tui-generated--inline" data-component="kbd" data-logical-component="Kbd/Default" data-variant="default" data-state="default" data-framework="vue" data-slot="label">⌘ K</span>
</template>
