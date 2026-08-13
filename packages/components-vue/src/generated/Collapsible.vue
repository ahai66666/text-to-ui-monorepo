<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "更多信息" }, description: { type: String, default: "点击展开详情" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--disclosure" data-component="collapsible" data-logical-component="Collapsible/Default" data-variant="default" data-state="default" data-framework="vue">
    <button class="tui-generated__disclosure" type="button" :aria-expanded="open" aria-controls="collapsible-content" @click="open = !open" data-typography-role="body-l">
      <span data-slot="label" data-typography-role="body-l">更多信息</span>
      <svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/chevron-down" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="tui-generated__disclosure-content" id="collapsible-content" data-slot="content" :hidden="!open" data-typography-role="body-l">点击展开详情</div>
  </div>
</template>
