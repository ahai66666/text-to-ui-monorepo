<script setup>
import { ref } from "vue";
const props = defineProps({ label: { type: String, default: "时间" }, description: { type: String, default: "09:30" }, state: { type: String, default: "default" } });
const open = ref(false);
</script>

<template>
  <div class="tui-generated tui-generated--picker" data-component="time-picker" data-logical-component="Time Picker/Default" data-variant="default" data-state="default" data-framework="vue"><span data-slot="label" data-typography-role="body-m"><span data-typography-role="body-m">时间</span></span><button class="tui-generated__control" type="button" aria-haspopup="dialog" :aria-expanded="open" @click="open = !open"><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="field/clock" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6v6h4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-slot="value" data-typography-role="body-m">09:30</span><svg class="tui-icon tui-icon--regular" viewBox="0 0 24 24" width="20" height="20" data-icon-alias="navigation/chevron-down" data-icon-size="20" data-icon-kind="regular" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="tui-generated__panel" data-slot="content" :hidden="!open"><span data-typography-role="caption-l">选择时间</span><div class="tui-generated__placeholder">01 · 02 · 03 · 04 · 05</div></div></div>
</template>
