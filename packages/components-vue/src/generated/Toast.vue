<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "保存成功" }, description: { type: String, default: "所有修改已经同步到云端。" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--feedback" data-component="toast" data-logical-component="Toast/Default" data-variant="default" data-state="default" data-framework="vue" role="status"><svg class="tui-icon tui-icon--outline" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-icon-alias="action/check" data-icon-size="20" data-icon-kind="outline"><circle cx="12" cy="12" r="9" fill="none"/><path d="m7.5 12.2 3 3 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-slot="label" data-typography-role="subtitle-s">保存成功</span><span data-slot="content" data-typography-role="body-l"><span>所有修改已经同步到云端。</span></span><button class="tui-icon-button" type="button" aria-label="关闭"><svg class="tui-icon tui-icon--filled" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-icon-alias="action/close" data-icon-size="20" data-icon-kind="filled"><path d="M19.776 4.224Q19.56 3.984 19.248 3.984Q18.936 3.984 18.72 4.224L12 10.944L5.28 4.224Q5.064 3.984 4.752 3.984Q4.44 3.984 4.2 4.224Q4.008 4.44 4.008 4.74Q4.008 5.04 4.2 5.28L10.944 12L4.2 18.696Q4.008 18.936 4.008 19.248Q4.008 19.56 4.2 19.776Q4.44 19.968 4.752 19.98Q5.064 19.992 5.28 19.776L12 13.056L18.72 19.776Q18.936 19.992 19.248 19.992Q19.56 19.992 19.776 19.776Q19.992 19.56 19.992 19.248Q19.992 18.936 19.776 18.696L13.056 12L19.776 5.28Q19.992 5.04 19.992 4.74Q19.992 4.44 19.776 4.224Z"/></svg></button></div>
</template>
