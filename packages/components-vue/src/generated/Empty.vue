<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "暂无项目" }, description: { type: String, default: "创建一个项目开始工作" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--empty" data-component="empty" data-logical-component="Empty/Default" data-variant="default" data-state="default" data-framework="vue"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/grid" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="M12 3v18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12h18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-slot="label" data-typography-role="title-s">暂无项目</span><span data-slot="description" data-typography-role="body-m">创建一个项目开始工作</span><button class="tui-button" type="button" data-variant="primary" data-typography-role="body-l">新建项目</button></div>
</template>
