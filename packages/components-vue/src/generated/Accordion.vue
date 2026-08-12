<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "项目设置" }, description: { type: String, default: "基础信息、成员与通知方式" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--disclosure" data-component="accordion" data-logical-component="Accordion/Default" data-variant="default" data-state="default" data-framework="vue">
    <button class="tui-generated__disclosure" type="button" :aria-expanded="open" aria-controls="accordion-content" @click="open = !open" data-typography-role="body-l">
      <svg class="tui-icon tui-icon--filled" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-icon-alias="navigation/chevron-right" data-icon-size="20" data-icon-kind="filled"><path d="M8.568 5.472a.9.9 0 0 0 0 1.272L13.992 12l-5.424 5.256a.9.9 0 1 0 1.272 1.272l6.096-5.904a.9.9 0 0 0 0-1.272L9.84 5.472a.9.9 0 0 0-1.272 0Z"/></svg>
      <span data-slot="label" data-typography-role="body-l">项目设置</span>
    </button>
    <div class="tui-generated__disclosure-content" id="accordion-content" data-slot="content" :hidden="!open" data-typography-role="body-l">基础信息、成员与通知方式</div>
  </div>
</template>
