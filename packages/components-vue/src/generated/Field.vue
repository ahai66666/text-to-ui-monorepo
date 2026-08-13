<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "项目名称" }, description: { type: String, default: "客户端设计系统" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <label class="tui-generated tui-generated--field" data-component="field" data-logical-component="Field/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-m"><span class="tui-generated__label" data-typography-role="body-m">项目名称</span></span><span class="tui-generated__control"><span data-slot="leading"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="field/search" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="m21 21-4.34-4.34" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></span><input data-slot="value" data-typography-role="body-l" type="text" value="客户端设计系统" /><span data-slot="trailing" data-typography-role="body-m"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/chevron-down" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span><span data-slot="help" data-typography-role="caption-l"><small data-typography-role="caption-l">客户端设计系统</small></span></label>
</template>
