<script setup>
import "./styles.css";
import Icon from "./Icon.js";
const props = defineProps({ label: { type: String, default: "项目空间" }, paneTitle: { type: String, default: "项目内容" }, size: { type: String, default: "large" }, state: { type: String, default: "default" }, layout: { type: String, default: "standalone" }, paneRole: { type: String, default: "global" }, disabled: Boolean, mainDetailActions: { type: Array, default: () => [] } });
const emit = defineEmits(["action", "main-detail-action"]);
const actions = [["minimize", "最小化"], ["maximize", "最大化"], ["close", "关闭"]];
</script>
<template>
  <header class="tui-component tui-titlebar" data-component="titlebar" data-logical-component="Titlebar/Default" :data-variant="size" :data-size="size" :data-state="disabled ? 'disabled' : state" :data-layout="layout" :data-pane-role="paneRole" data-framework="vue">
    <span v-if="paneRole === 'global' || paneRole === 'primary-navigation'" class="tui-titlebar__brand" data-slot="leading"><Icon name="navigation/grid" :size="24" /><span data-slot="label" data-typography-role="subtitle-m">{{ props.label }}</span></span>
    <strong v-if="layout === 'two-column' && paneRole === 'final-pane'" class="tui-titlebar__pane-title" data-slot="main-content-title" data-action-scope="main-content-pane-global" data-typography-role="title-s">{{ props.paneTitle }}</strong>
    <div v-if="layout === 'three-column' && paneRole === 'final-pane' && props.mainDetailActions.length" class="tui-titlebar__pane-actions" data-slot="main-detail-actions" data-action-scope="main-detail-pane-global" aria-label="Main Detail 栏级操作"><button v-for="action in props.mainDetailActions" :key="action.id" class="tui-icon-button tui-titlebar__pane-action" :class="{ 'tui-titlebar__pane-action--text': action.showLabel }" type="button" data-slot="main-detail-action" :data-action="action.id" :aria-label="action.label" :disabled="disabled || action.disabled" @click="emit('main-detail-action', action.id)"><Icon :name="action.icon || 'action/more'" :size="20" /><span v-if="action.showLabel" data-slot="label" data-typography-role="body-m">{{ action.label }}</span></button></div>
    <div v-if="paneRole === 'global' || paneRole === 'final-pane'" class="tui-titlebar__actions" data-slot="actions"><button v-for="[action, text] in actions" :key="action" class="tui-icon-button tui-titlebar__action" type="button" data-slot="titlebar-action" :data-action="action" :aria-label="text" :disabled="disabled" @click="emit('action', action)"><Icon :name="`window/${action}`" :size="size === 'small' ? 16 : 24" /></button></div>
  </header>
</template>
