<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "HarmonyOS 组件规范" }, description: { type: String, default: "刚刚更新 · 12 位成员" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <article class="tui-generated tui-generated--card" data-component="item" data-logical-component="Item/Default" data-variant="default" data-state="default" data-framework="vue"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/list" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="M3 5h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 19h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 5h13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12h13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 19h13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="tui-generated__card-body"><span data-slot="title" data-typography-role="title-s"><h4 data-typography-role="title-s">HarmonyOS 组件规范</h4></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">刚刚更新 · 12 位成员</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div><span data-slot="trailing" data-typography-role="body-m"><span class="tui-generated__badge" data-typography-role="caption-l">查看</span></span></article>
</template>
