<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "通知方式" }, description: { type: String, default: "邮件 / 站内消息" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <label class="tui-generated tui-generated--choice" data-component="radio-group" data-logical-component="Radio Group/Default" data-variant="default" data-state="default" data-framework="vue"><input type="radio" checked /><span data-slot="label" data-typography-role="body-l">通知方式</span><span data-slot="description" data-typography-role="body-m">邮件 / 站内消息</span></label>
</template>
