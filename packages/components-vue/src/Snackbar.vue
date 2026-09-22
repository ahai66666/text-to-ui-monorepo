<script setup>
import "./styles.css";
import Icon from "./Icon.js";
import { computed, ref } from "vue";

const props = defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  message: { type: String, default: "" },
  actionLabel: { type: String, default: "文本按钮" },
  leftArea: { type: [String, Number], default: "1" },
  closable: { type: Boolean, default: true }
});
const emit = defineEmits(["action", "close"]);
const visible = ref(true);
const close = () => { visible.value = false; emit("close"); };
const titleSubtitle = computed(() => Boolean(props.subtitle));
const variant = computed(() => titleSubtitle.value ? "title-subtitle" : "title-only");
const pixsoLeftArea = computed(() => titleSubtitle.value ? "2" : String(props.leftArea || "1"));
const resolvedTitle = computed(() => props.title || props.message || "Title");
</script>

<template>
  <div v-if="visible" class="tui-component tui-snackbar" data-component="snackbar" data-renderer-key="snackbar" data-logical-component="Snackbar/Default" :data-variant="variant" data-state="default" data-framework="vue" :data-left-area="pixsoLeftArea" role="status">
    <span class="tui-snackbar__main"><span class="tui-snackbar__leading" data-slot="leading"><slot name="leading"><Icon name="status/info" :size="24" /></slot></span><span class="tui-snackbar__content"><span class="tui-snackbar__title" data-slot="title" data-typography-role="subtitle-s"><slot name="title">{{ resolvedTitle }}</slot></span><span v-if="titleSubtitle" class="tui-snackbar__subtitle" data-slot="subtitle" data-typography-role="body-s"><slot name="subtitle">{{ props.subtitle }}</slot></span></span></span>
    <span class="tui-snackbar__actions"><span v-if="$slots.action || props.actionLabel" class="tui-snackbar__action-slot" data-slot="action"><slot name="action"><button class="tui-button tui-button--ghost tui-snackbar__action" type="button" data-variant="ghost" data-size="small" data-typography-role="body-m" @click="emit('action')">{{ props.actionLabel }}</button></slot></span><slot name="close"><button v-if="props.closable" class="tui-icon-button tui-snackbar__close" data-slot="close" type="button" aria-label="关闭" @click="close"><Icon name="action/close" :size="20" /></button></slot></span>
  </div>
</template>
