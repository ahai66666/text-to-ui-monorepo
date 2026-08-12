<script setup>
import "./styles.css";
import Icon from "./Icon.js";
import { ref } from "vue";
const props = defineProps({ message: { type: String, default: "所有修改已经同步到云端。" }, tone: { type: String, default: "success" } });
const emit = defineEmits(["close"]); const visible = ref(true);
</script>
<template><div v-if="visible" class="tui-component tui-toast" :class="`tui-toast--${props.tone}`" data-component="toast" data-logical-component="Toast/Default" :data-variant="props.tone" data-state="default" data-framework="vue" role="status"><span class="tui-toast__icon"><Icon name="action/check" :size="20" /></span><span class="tui-toast__message" data-slot="content" data-typography-role="body-m">{{ props.message }}</span><button class="tui-icon-button" type="button" aria-label="关闭" @click="visible = false; emit('close')"><Icon name="action/close" :size="20" /></button></div></template>
