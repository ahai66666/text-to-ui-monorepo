<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "保存成功" }, description: { type: String, default: "所有修改已经同步到云端。" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--feedback" data-component="toast" data-logical-component="Toast/Default" data-variant="default" data-state="default" data-framework="vue" role="status"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="action/check" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-slot="label" data-typography-role="subtitle-s">保存成功</span><span data-slot="content" data-typography-role="body-l"><span>所有修改已经同步到云端。</span></span><button class="tui-icon-button" type="button" aria-label="关闭"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="action/close" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="M18 6 6 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="m6 6 12 12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
</template>
