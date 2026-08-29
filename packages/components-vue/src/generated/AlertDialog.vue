<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "删除项目？" }, description: { type: String, default: "删除后无法恢复，请确认操作。" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <section class="tui-generated tui-generated--dialog" data-component="alert-dialog" data-logical-component="Alert Dialog/Default" data-variant="white" data-state="default" data-framework="vue" role="dialog" aria-modal="true"><header data-slot="title"><h4 data-typography-role="title-s">删除项目？</h4><button class="tui-icon-button" type="button" aria-label="关闭"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="action/close" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="M18 6 6 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="m6 6 12 12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></button></header><span data-slot="description" data-typography-role="body-m"><p data-typography-role="body-m">删除后无法恢复，请确认操作。</p></span><span data-slot="content" data-typography-role="body-l"><div class="tui-generated__content" data-typography-role="body-l">请确认后继续。</div></span><span data-slot="actions"><div class="tui-generated__actions"><button class="tui-button" type="button" data-variant="ghost" data-typography-role="body-l">取消</button><button class="tui-button" type="button" data-variant="primary" data-typography-role="body-l">确认</button></div></span></section>
</template>
