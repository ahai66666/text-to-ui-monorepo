<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "内容 1 / 3" }, description: { type: String, default: "项目概览" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <article class="tui-generated tui-generated--card" data-component="carousel" data-logical-component="Carousel/Default" data-variant="default" data-state="default" data-framework="vue"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/chevron-down" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="tui-generated__card-body"><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">项目概览</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div></article>
</template>
