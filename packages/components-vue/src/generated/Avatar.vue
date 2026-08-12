<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "H" }, description: { type: String, default: "HarmonyOS" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--avatar" data-component="avatar" data-logical-component="Avatar/Default" data-variant="default" data-state="default" data-framework="vue" data-slot="content">H</div>
</template>
