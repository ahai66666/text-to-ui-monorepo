<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "工作空间" }, description: { type: String, default: "最近更新的项目与协作动态" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <article class="tui-generated tui-generated--card" data-component="card" data-logical-component="Card/Default" data-variant="default" data-state="default" data-framework="vue"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/grid" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="M12 3v18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12h18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="tui-generated__card-body"><span data-slot="title" data-typography-role="title-s"><h4 data-typography-role="title-s">工作空间</h4></span><span data-slot="content" data-typography-role="body-l"><p data-typography-role="body-l">最近更新的项目与协作动态</p></span><span data-slot="description" data-typography-role="body-m"><small data-typography-role="body-m">辅助说明</small></span></div><span data-slot="trailing" data-typography-role="body-m"><span class="tui-generated__badge" data-typography-role="caption-l">查看</span></span></article>
</template>
