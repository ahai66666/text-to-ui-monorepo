<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "项目设置" }, description: { type: String, default: "基础信息、成员与通知方式" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--disclosure" data-component="accordion" data-logical-component="Accordion/Default" data-variant="default" data-state="default" data-framework="vue">
    <button class="tui-generated__disclosure" type="button" :aria-expanded="open" aria-controls="accordion-content" @click="open = !open" data-typography-role="body-l">
      <svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/chevron-right" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span data-slot="label" data-typography-role="body-l">项目设置</span>
    </button>
    <div class="tui-generated__disclosure-content" id="accordion-content" data-slot="content" :hidden="!open" data-typography-role="body-l">基础信息、成员与通知方式</div>
  </div>
</template>
