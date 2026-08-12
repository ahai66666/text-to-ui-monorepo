<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "项目名称" }, description: { type: String, default: "必填" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <section class="tui-generated tui-generated--card" data-component="label" data-logical-component="Label/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="title-s">项目名称</span></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">必填</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="caption-l">辅助说明</small></span></section>
</template>
