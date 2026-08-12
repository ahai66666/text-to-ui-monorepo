<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "工作空间 / 项目 / 设置" }, description: { type: String, default: "当前页面" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <nav class="tui-generated tui-generated--breadcrumb" data-component="breadcrumb" data-logical-component="Breadcrumb/Default" data-variant="default" data-state="default" data-framework="vue" aria-label="面包屑"><a href="#" data-typography-role="body-l">工作空间</a><span>/</span><a href="#" data-typography-role="body-l">项目</a><span>/</span><span data-typography-role="body-l">工作空间 / 项目 / 设置</span></nav>
</template>
