<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "验证码" }, description: { type: String, default: "••••••" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <section class="tui-generated tui-generated--card" data-component="input-otp" data-logical-component="Input OTP/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">验证码</span></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">••••••</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="caption-l">辅助说明</small></span></section>
</template>
