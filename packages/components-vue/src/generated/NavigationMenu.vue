<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "导航菜单" }, description: { type: String, default: "项目 / 团队 / 设置" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--menu" data-component="navigation-menu" data-logical-component="Navigation Menu/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-l"><span data-typography-role="body-m">导航菜单</span></span><button class="tui-generated__control" type="button" aria-haspopup="menu" :aria-expanded="open" @click="open = !open"><span data-slot="value" data-typography-role="body-m">项目 / 团队 / 设置</span><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/chevron-down" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="tui-generated__menu" role="menu" data-slot="content" :hidden="!open"><button type="button" role="menuitem" data-typography-role="body-l">项目 / 团队 / 设置</button><button type="button" role="menuitem" data-typography-role="body-l">全部项目</button><button type="button" role="menuitem" data-typography-role="body-l">最近访问</button></div></div>
</template>
