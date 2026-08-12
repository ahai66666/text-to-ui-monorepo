// Generated from components.json. Do not edit by hand.
export default {
  "schemaVersion": 2,
  "contractVersion": 2,
  "components": [
    {
      "id": "accordion",
      "logicalName": "Accordion/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "unfocus",
        "disabled"
      ],
      "props": [
        "label",
        "size",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#accordion",
        "react": "packages/components-react/src/index.jsx#Accordion",
        "vue": "packages/components-vue/src/Accordion.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#accordion"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Accordion"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Accordion.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "disclosure",
      "categoryLabel": "披露与导航",
      "order": 70,
      "canonicalSection": "section#disclosure",
      "canonicalSelector": "section#disclosure [data-component=\"Accordion/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-accordion",
      "surface": "white",
      "sizing": "fill",
      "behaviors": [
        "toggle",
        "keyboard-activation",
        "focus"
      ],
      "iconSemantic": "navigation/chevron-right",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "disclosure",
      "canonicalSpecimen": "legacy:disclosure:accordion",
      "allowedStates": [
        "default",
        "unfocus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/chevron-right",
          "displaySizes": [
            20
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/chevron-right"
      ]
    },
    {
      "id": "alert",
      "logicalName": "Alert/Default",
      "variants": [
        "info",
        "success",
        "warning",
        "danger",
        "neutral"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.subtitle-s",
        "typography.body-m",
        "spacing.component-gap",
        "spacing.padding-alert-left",
        "spacing.padding-alert-right",
        "spacing.padding-button-sm-x",
        "size.button-sm-height",
        "size.icon-md",
        "size.icon-sm",
        "color.icon",
        "color.primary"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#alert",
        "react": "packages/components-react/src/index.jsx#Alert",
        "vue": "packages/components-vue/src/Alert.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#alert"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Alert"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Alert.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "Alert 关闭按钮使用 32×32px 热区，内部 action/close 图标使用 20×20px，并保持键盘可达与可访问名称。",
      "category": "feedback",
      "categoryLabel": "提示与反馈",
      "order": 120,
      "canonicalSection": "section#feedback",
      "canonicalSelector": "section#feedback [data-component=\"Alert/Default\"]",
      "specimens": [
        {
          "id": "info",
          "variant": "info",
          "state": "default",
          "label": "Info / 信息",
          "message": "系统将在今晚自动完成更新。",
          "action": "查看详情"
        },
        {
          "id": "success",
          "variant": "success",
          "state": "default",
          "label": "Success / 成功",
          "message": "所有修改已经同步到云端。",
          "action": "查看详情"
        },
        {
          "id": "warning",
          "variant": "warning",
          "state": "default",
          "label": "Warning / 警告",
          "message": "连接不稳定，部分内容可能暂时无法加载。",
          "action": "重新连接"
        },
        {
          "id": "danger",
          "variant": "danger",
          "state": "default",
          "label": "Danger / 危险",
          "message": "存储空间不足，请清理空间后重试。",
          "action": "清理空间"
        },
        {
          "id": "neutral",
          "variant": "neutral",
          "state": "default",
          "label": "Neutral / 中性",
          "message": "当前为只读模式，部分编辑操作暂不可用。",
          "action": "知道了"
        }
      ],
      "fixtureId": "fixture-alert",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "status/info",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "feedback",
      "canonicalSpecimen": "legacy:feedback:alert",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "content:subtitle-s",
        "action:body-m"
      ],
      "iconSlots": [
        {
          "alias": "status/info",
          "displaySizes": [
            20
          ],
          "kind": "auto"
        },
        {
          "alias": "status/success",
          "displaySizes": [
            20
          ],
          "kind": "auto"
        },
        {
          "alias": "status/warning",
          "displaySizes": [
            20
          ],
          "kind": "auto"
        },
        {
          "alias": "status/danger",
          "displaySizes": [
            20
          ],
          "kind": "auto"
        },
        {
          "alias": "status/neutral",
          "displaySizes": [
            20
          ],
          "kind": "auto"
        },
        {
          "alias": "action/close",
          "displaySizes": [
            16
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "status/info",
        "status/success",
        "status/warning",
        "status/danger",
        "status/neutral",
        "action/close"
      ]
    },
    {
      "id": "alert-dialog",
      "logicalName": "Alert Dialog/Default",
      "variants": [
        "danger"
      ],
      "states": [
        "closed",
        "open"
      ],
      "props": [
        "open",
        "title",
        "description",
        "confirmLabel",
        "cancelLabel",
        "statusIcon",
        "onConfirm",
        "onCancel",
        "onOpenChange"
      ],
      "slots": [
        "title",
        "description",
        "content",
        "actions"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "shadow.overlay",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#alert-dialog",
        "react": "packages/components-react/src/advanced.jsx#AlertDialog",
        "vue": "packages/components-vue/src/advanced.js#AlertDialog"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#alert-dialog"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#AlertDialog"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#AlertDialog"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "overlays",
      "categoryLabel": "浮层与命令",
      "order": 81,
      "canonicalSection": "section#overlays",
      "canonicalSelector": "section#overlays [data-component=\"Alert Dialog/Default\"]",
      "specimens": [
        {
          "id": "danger-confirm",
          "variant": "danger",
          "state": "closed",
          "actionLayout": "double",
          "intent": "danger"
        }
      ],
      "fixtureId": "fixture-alert-dialog",
      "surface": "white",
      "sizing": "overlay",
      "behaviors": [
        "open",
        "confirm",
        "cancel",
        "escape",
        "focus-return",
        "no-outside-dismiss"
      ],
      "iconSemantic": "status/warning",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "overlays",
      "canonicalSpecimen": "legacy:overlays:alert-dialog",
      "allowedStates": [
        "closed",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "status/warning",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "status/warning"
      ],
      "structuralAxes": {
        "actionLayout": [
          "double"
        ],
        "intent": [
          "danger"
        ],
        "mode": [
          "modal"
        ]
      },
      "interactionStates": [
        "closed",
        "open"
      ]
    },
    {
      "id": "attachment",
      "logicalName": "Attachment/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.subtitle-s",
        "typography.body-s",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#attachment",
        "react": "packages/components-react/src/advanced.jsx#Attachment",
        "vue": "packages/components-vue/src/advanced.js#Attachment"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#attachment"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Attachment"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Attachment"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "Attachment 下载按钮内部使用 20×20px 的 action/download 图标，并保持按钮热区与键盘焦点行为不变。",
      "category": "specialized",
      "categoryLabel": "专用内容",
      "order": 110,
      "canonicalSection": "section#specialized",
      "canonicalSelector": "section#specialized [data-component=\"Attachment/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-attachment",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/download",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "specialized",
      "canonicalSpecimen": "legacy:specialized:attachment",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:subtitle-s",
        "content:body-m",
        "description:body-s",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/download",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/download"
      ]
    },
    {
      "id": "avatar",
      "logicalName": "Avatar/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#avatar",
        "react": "packages/components-react/src/index.jsx#Avatar",
        "vue": "packages/components-vue/src/Avatar.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#avatar"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Avatar"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Avatar.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 60,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Avatar/Default\"]",
      "specimens": [
        {
          "id": "fallback-32",
          "variant": "size-32",
          "state": "default",
          "size": 32,
          "content": "initials"
        },
        {
          "id": "fallback-40",
          "variant": "size-40",
          "state": "default",
          "size": 40,
          "content": "initials"
        }
      ],
      "fixtureId": "fixture-avatar",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:avatar",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "badge",
      "logicalName": "Badge/Default",
      "variants": [
        "default",
        "success",
        "warning",
        "danger",
        "info"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "color.primary"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#badge",
        "react": "packages/components-react/src/index.jsx#Badge",
        "vue": "packages/components-vue/src/Badge.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#badge"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Badge"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Badge.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 61,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Badge/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-badge",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:badge",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "label:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "breadcrumb",
      "logicalName": "Breadcrumb/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#breadcrumb",
        "react": "packages/components-react/src/index.jsx#Breadcrumb",
        "vue": "packages/components-vue/src/Breadcrumb.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#breadcrumb"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Breadcrumb"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Breadcrumb.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "navigation",
      "categoryLabel": "导航",
      "order": 53,
      "canonicalSection": "section#navigation",
      "canonicalSelector": "section#navigation [data-component=\"Breadcrumb/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-breadcrumb",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/chevron-down",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "navigation",
      "canonicalSpecimen": "legacy:navigation:breadcrumb",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "content:body-m"
      ],
      "iconSlots": [
        {
          "alias": "navigation/chevron-down",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/chevron-down"
      ]
    },
    {
      "id": "button",
      "logicalName": "Button/Primary/Default",
      "variants": [
        "primary",
        "secondary",
        "ghost",
        "danger"
      ],
      "sizes": [
        "standard",
        "small"
      ],
      "modes": [
        "text",
        "icon-text",
        "icon",
        "selection-dropdown",
        "split-dropdown"
      ],
      "states": [
        "default",
        "hover",
        "pressed",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "variant",
        "size",
        "mode",
        "disabled",
        "menuItems"
      ],
      "slots": [
        "icon",
        "label",
        "trigger",
        "menu"
      ],
      "tokenRoles": [
        "color.primary",
        "color.primary-text",
        "size.button-height",
        "radius.button",
        "spacing.padding-button-x",
        "typography.body-l"
      ],
      "iconAliases": [
        "action/add",
        "action/download",
        "action/settings",
        "action/close",
        "navigation/chevron-down",
        "action/refresh",
        "action/more"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/button.html",
        "react": "packages/components-react/src/index.jsx#Button",
        "vue": "packages/components-vue/src/Button.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/button.html"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Button"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Button.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "buttons",
      "categoryLabel": "按钮",
      "order": 20,
      "canonicalSection": "section#buttons",
      "canonicalSelector": "section#buttons [data-component=\"Button/Primary/Default\"]",
      "specimens": [
        {
          "id": "primary",
          "variant": "primary",
          "state": "default",
          "mode": "text"
        },
        {
          "id": "secondary",
          "variant": "secondary",
          "state": "default",
          "mode": "text"
        },
        {
          "id": "ghost",
          "variant": "ghost",
          "state": "default",
          "mode": "text"
        },
        {
          "id": "danger",
          "variant": "danger",
          "state": "default",
          "mode": "text"
        },
        {
          "id": "small-primary",
          "variant": "primary",
          "state": "default",
          "mode": "text",
          "size": "small"
        },
        {
          "id": "small-secondary",
          "variant": "secondary",
          "state": "default",
          "mode": "text",
          "size": "small"
        },
        {
          "id": "small-ghost",
          "variant": "ghost",
          "state": "default",
          "mode": "text",
          "size": "small"
        },
        {
          "id": "small-danger",
          "variant": "danger",
          "state": "default",
          "mode": "text",
          "size": "small"
        },
        {
          "id": "icon",
          "variant": "ghost",
          "state": "default",
          "mode": "icon"
        },
        {
          "id": "icon-text-primary",
          "variant": "primary",
          "state": "default",
          "mode": "icon-text"
        },
        {
          "id": "icon-text-secondary",
          "variant": "secondary",
          "state": "default",
          "mode": "icon-text"
        },
        {
          "id": "icon-text-ghost",
          "variant": "ghost",
          "state": "default",
          "mode": "icon-text"
        },
        {
          "id": "selection-dropdown",
          "variant": "secondary",
          "state": "default",
          "mode": "selection-dropdown"
        },
        {
          "id": "split-dropdown",
          "variant": "ghost",
          "state": "default",
          "mode": "split-dropdown"
        }
      ],
      "fixtureId": "fixture-button",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "click",
        "keyboard-activation",
        "disabled"
      ],
      "iconSemantic": "action/add",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "buttons",
      "canonicalSpecimen": "legacy:buttons:button",
      "allowedStates": [
        "default",
        "hover",
        "pressed",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "label:body-l",
        "small-label:body-m"
      ],
      "iconSlots": [
        {
          "alias": "action/add",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/download",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/settings",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/close",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "navigation/chevron-down",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/refresh",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/more",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ]
    },
    {
      "id": "calendar",
      "logicalName": "Calendar/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "spacing.content-inset"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#calendar",
        "react": "packages/components-react/src/advanced.jsx#Calendar",
        "vue": "packages/components-vue/src/advanced.js#Calendar"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#calendar"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Calendar"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Calendar"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "loading-data",
      "categoryLabel": "加载与日期",
      "order": 103,
      "canonicalSection": "section#loading-data",
      "canonicalSelector": "section#loading-data [data-component=\"Calendar/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-calendar",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "select",
        "arrow-keys"
      ],
      "iconSemantic": "field/calendar",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "loading-data",
      "canonicalSpecimen": "legacy:loading-data:calendar",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "field/calendar",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "field/calendar"
      ]
    },
    {
      "id": "card",
      "logicalName": "Card/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "leading",
        "title",
        "description",
        "content",
        "trailing"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#card",
        "react": "packages/components-react/src/index.jsx#Card",
        "vue": "packages/components-vue/src/Card.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#card"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Card"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Card.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 62,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Card/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-card",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:card",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "carousel",
      "logicalName": "Carousel/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#carousel",
        "react": "packages/components-react/src/advanced.jsx#Carousel",
        "vue": "packages/components-vue/src/advanced.js#Carousel"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#carousel"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Carousel"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Carousel"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "specialized",
      "categoryLabel": "专用内容",
      "order": 111,
      "canonicalSection": "section#specialized",
      "canonicalSelector": "section#specialized [data-component=\"Carousel/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-carousel",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/chevron-down",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "specialized",
      "canonicalSpecimen": "legacy:specialized:carousel",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/chevron-down",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/chevron-down"
      ]
    },
    {
      "id": "chart",
      "logicalName": "Chart/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "loading"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#chart",
        "react": "packages/components-react/src/advanced.jsx#Chart",
        "vue": "packages/components-vue/src/advanced.js#Chart"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#chart"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Chart"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Chart"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "loading-data",
      "categoryLabel": "加载与日期",
      "order": 102,
      "canonicalSection": "section#loading-data",
      "canonicalSelector": "section#loading-data [data-component=\"Chart/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-chart",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/grid",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "loading-data",
      "canonicalSpecimen": "legacy:loading-data:chart",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "loading"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/grid",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/grid"
      ]
    },
    {
      "id": "checkbox",
      "logicalName": "Checkbox/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#checkbox",
        "react": "packages/components-react/src/index.jsx#Checkbox",
        "vue": "packages/components-vue/src/Checkbox.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#checkbox"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Checkbox"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Checkbox.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "choices",
      "categoryLabel": "选择控件",
      "order": 40,
      "canonicalSection": "section#choices",
      "canonicalSelector": "section#choices [data-component=\"Checkbox/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-checkbox",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "choice/check",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "choices",
      "canonicalSpecimen": "legacy:choices:checkbox",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "choice/check",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "choice/check"
      ]
    },
    {
      "id": "collapsible",
      "logicalName": "Collapsible/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#collapsible",
        "react": "packages/components-react/src/index.jsx#Collapsible",
        "vue": "packages/components-vue/src/Collapsible.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#collapsible"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Collapsible"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Collapsible.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "disclosure",
      "categoryLabel": "披露与导航",
      "order": 71,
      "canonicalSection": "section#disclosure",
      "canonicalSelector": "section#disclosure [data-component=\"Collapsible/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-collapsible",
      "surface": "white",
      "sizing": "fill",
      "behaviors": [
        "toggle",
        "keyboard-activation",
        "focus"
      ],
      "iconSemantic": "navigation/chevron-down",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "disclosure",
      "canonicalSpecimen": "legacy:disclosure:collapsible",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/chevron-down",
          "displaySizes": [
            20
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/chevron-down"
      ]
    },
    {
      "id": "combobox",
      "logicalName": "Combobox/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#combobox",
        "react": "packages/components-react/src/index.jsx#Combobox",
        "vue": "packages/components-vue/src/Combobox.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#combobox"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Combobox"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Combobox.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "form-plus",
      "categoryLabel": "复合表单",
      "order": 91,
      "canonicalSection": "section#form-plus",
      "canonicalSelector": "section#form-plus [data-component=\"Combobox/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-combobox",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "open",
        "select",
        "escape",
        "arrow-keys"
      ],
      "iconSemantic": "navigation/chevron-down",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "form-plus",
      "canonicalSpecimen": "legacy:form-plus:combobox",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/chevron-down",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/chevron-down"
      ]
    },
    {
      "id": "context-menu",
      "logicalName": "Context Menu/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "shadow.overlay",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#context-menu",
        "react": "packages/components-react/src/advanced.jsx#ContextMenu",
        "vue": "packages/components-vue/src/advanced.js#ContextMenu"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#context-menu"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#ContextMenu"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#ContextMenu"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "Context Menu 的每个菜单项使用语义图标加文本的水平结构，图标固定为 24×24px，图标与文本引用菜单项内容间距 Token。",
      "category": "overlays",
      "categoryLabel": "浮层与命令",
      "order": 85,
      "canonicalSection": "section#overlays",
      "canonicalSelector": "section#overlays [data-component=\"Context Menu/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-context-menu",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "overlay",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/more",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "overlays",
      "canonicalSpecimen": "legacy:overlays:context-menu",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/copy",
          "displaySizes": [
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/rename",
          "displaySizes": [
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/delete",
          "displaySizes": [
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/copy",
        "action/rename",
        "action/delete"
      ]
    },
    {
      "id": "data-table",
      "logicalName": "Data Table/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "leading",
        "title",
        "description",
        "content",
        "trailing"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "spacing.content-inset"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#dataTable",
        "react": "packages/components-react/src/index.jsx#DataTable",
        "vue": "packages/components-vue/src/DataTable.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#dataTable"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#DataTable"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/DataTable.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 65,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Data Table/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-data-table",
      "surface": "white",
      "sizing": "fill",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:data-table",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "textRoles": [
        "header:body-m",
        "cell:body-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "date-picker",
      "logicalName": "Date Picker/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "spacing.content-inset"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#date-picker",
        "react": "packages/components-react/src/advanced.jsx#DatePicker",
        "vue": "packages/components-vue/src/advanced.js#DatePicker"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#date-picker"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#DatePicker"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#DatePicker"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "loading-data",
      "categoryLabel": "加载与日期",
      "order": 104,
      "canonicalSection": "section#loading-data",
      "canonicalSelector": "section#loading-data [data-component=\"Date Picker/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-date-picker",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "open",
        "select",
        "escape"
      ],
      "iconSemantic": "field/calendar",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "loading-data",
      "canonicalSpecimen": "legacy:loading-data:date-picker",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "field/calendar",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "field/calendar"
      ]
    },
    {
      "id": "time-picker",
      "logicalName": "Time Picker/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "spacing.content-inset"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#time-picker",
        "react": "packages/components-react/src/advanced.jsx#TimePicker",
        "vue": "packages/components-vue/src/advanced.js#TimePicker"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#time-picker"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#TimePicker"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#TimePicker"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "loading-data",
      "categoryLabel": "加载与日期",
      "order": 105,
      "canonicalSection": "section#loading-data",
      "canonicalSelector": "section#loading-data [data-component=\"Time Picker/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-time-picker",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "open",
        "select",
        "escape"
      ],
      "iconSemantic": "field/clock",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "loading-data",
      "canonicalSpecimen": "legacy:loading-data:time-picker",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "field/clock",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "field/clock"
      ]
    },
    {
      "id": "dialog",
      "logicalName": "Dialog/Default",
      "variants": [
        "single",
        "double"
      ],
      "states": [
        "closed",
        "open"
      ],
      "props": [
        "open",
        "title",
        "description",
        "intent",
        "actionLayout",
        "confirmLabel",
        "cancelLabel",
        "onConfirm",
        "onCancel",
        "onOpenChange"
      ],
      "slots": [
        "title",
        "description",
        "content",
        "actions"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "shadow.overlay",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#dialog",
        "react": "packages/components-react/src/advanced.jsx#Dialog",
        "vue": "packages/components-vue/src/advanced.js#Dialog"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#dialog"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Dialog"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Dialog"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "overlays",
      "categoryLabel": "浮层与命令",
      "order": 80,
      "canonicalSection": "section#overlays",
      "canonicalSelector": "section#overlays [data-component=\"Dialog/Default\"]",
      "specimens": [
        {
          "id": "single-default",
          "variant": "single",
          "state": "closed",
          "actionLayout": "single",
          "intent": "default"
        },
        {
          "id": "double-default",
          "variant": "double",
          "state": "closed",
          "actionLayout": "double",
          "intent": "default"
        }
      ],
      "fixtureId": "fixture-dialog",
      "surface": "white",
      "sizing": "overlay",
      "behaviors": [
        "open",
        "confirm",
        "cancel",
        "escape",
        "focus-return",
        "no-outside-dismiss"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "overlays",
      "canonicalSpecimen": "legacy:overlays:dialog",
      "allowedStates": [
        "closed",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": [],
      "structuralAxes": {
        "actionLayout": [
          "single",
          "double"
        ],
        "intent": [
          "default",
          "danger"
        ]
      },
      "interactionStates": [
        "closed",
        "open"
      ]
    },
    {
      "id": "dropdown-menu",
      "logicalName": "Dropdown Menu/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "shadow.overlay",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#dropdown-menu",
        "react": "packages/components-react/src/advanced.jsx#DropdownMenu",
        "vue": "packages/components-vue/src/advanced.js#DropdownMenu"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#dropdown-menu"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#DropdownMenu"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#DropdownMenu"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "overlays",
      "categoryLabel": "浮层与命令",
      "order": 86,
      "canonicalSection": "section#overlays",
      "canonicalSelector": "section#overlays [data-component=\"Dropdown Menu/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-dropdown-menu",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "overlay",
      "behaviors": [
        "open",
        "select",
        "escape",
        "arrow-keys"
      ],
      "iconSemantic": "action/more",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "overlays",
      "canonicalSpecimen": "legacy:overlays:dropdown-menu",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/more",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/more"
      ]
    },
    {
      "id": "empty",
      "logicalName": "Empty/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#empty",
        "react": "packages/components-react/src/index.jsx#Empty",
        "vue": "packages/components-vue/src/Empty.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#empty"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Empty"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Empty.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 67,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Empty/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-empty",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/add",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:empty",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/add",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/add"
      ]
    },
    {
      "id": "field",
      "logicalName": "Field/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "error"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#field",
        "react": "packages/components-react/src/index.jsx#Field",
        "vue": "packages/components-vue/src/Field.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#field"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Field"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Field.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "fields",
      "categoryLabel": "输入与字段",
      "order": 34,
      "canonicalSection": "section#fields",
      "canonicalSelector": "section#fields [data-component=\"Field/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-field",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "fields",
      "canonicalSpecimen": "legacy:fields:field",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "error"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "hover-card",
      "logicalName": "Hover Card/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "title",
        "description",
        "content",
        "actions"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "shadow.overlay",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#hover-card",
        "react": "packages/components-react/src/advanced.jsx#HoverCard",
        "vue": "packages/components-vue/src/advanced.js#HoverCard"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#hover-card"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#HoverCard"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#HoverCard"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "overlays",
      "categoryLabel": "浮层与命令",
      "order": 84,
      "canonicalSection": "section#overlays",
      "canonicalSelector": "section#overlays [data-component=\"Hover Card/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-hover-card",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "overlay",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/more",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "overlays",
      "canonicalSpecimen": "legacy:overlays:hover-card",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/more",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/more"
      ]
    },
    {
      "id": "input",
      "logicalName": "Input/White Surface/Default",
      "variants": [
        "default",
        "error",
        "disabled"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "error"
      ],
      "props": [
        "value",
        "placeholder",
        "disabled",
        "error"
      ],
      "slots": [
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.input-bg",
        "color.text",
        "color.border",
        "size.input-height",
        "radius.input",
        "typography.body-l"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/input.html",
        "react": "packages/components-react/src/index.jsx#Input",
        "vue": "packages/components-vue/src/Input.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/input.html"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Input"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Input.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "fields",
      "categoryLabel": "输入与字段",
      "order": 30,
      "canonicalSection": "section#fields",
      "canonicalSelector": "section#fields [data-component=\"Input/White Surface/Default\"]",
      "specimens": [
        {
          "id": "white-surface",
          "variant": "default",
          "state": "default",
          "surface": "white"
        },
        {
          "id": "gray-surface",
          "variant": "default",
          "state": "default",
          "surface": "gray"
        }
      ],
      "fixtureId": "fixture-input",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "fill",
      "behaviors": [
        "input",
        "focus",
        "disabled",
        "error"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "fields",
      "canonicalSpecimen": "legacy:fields:input",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "filled",
        "error",
        "disabled"
      ],
      "textRoles": [
        "value:body-l",
        "placeholder:body-l",
        "label:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "input-otp",
      "logicalName": "Input OTP/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#input-otp",
        "react": "packages/components-react/src/advanced.jsx#InputOtp",
        "vue": "packages/components-vue/src/advanced.js#InputOtp"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#input-otp"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#InputOtp"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#InputOtp"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "form-plus",
      "categoryLabel": "复合表单",
      "order": 94,
      "canonicalSection": "section#form-plus",
      "canonicalSelector": "section#form-plus [data-component=\"Input OTP/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-input-otp",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/check",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "form-plus",
      "canonicalSpecimen": "legacy:form-plus:input-otp",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/check",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/check"
      ]
    },
    {
      "id": "item",
      "logicalName": "Item/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "leading",
        "title",
        "description",
        "content",
        "trailing"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "color.divider",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#item",
        "react": "packages/components-react/src/index.jsx#Item",
        "vue": "packages/components-vue/src/Item.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#item"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Item"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Item.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 63,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Item/Default\"]",
      "specimens": [
        {
          "id": "single-text-arrow",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "text-arrow"
        },
        {
          "id": "double-icon",
          "variant": "double-line",
          "state": "default",
          "lines": 2,
          "trailing": "icon"
        },
        {
          "id": "triple-radio",
          "variant": "triple-line",
          "state": "default",
          "lines": 3,
          "trailing": "radio"
        },
        {
          "id": "single-checkbox",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "checkbox"
        },
        {
          "id": "single-switch",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "switch"
        },
        {
          "id": "single-notification-arrow",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "notification-arrow"
        }
      ],
      "fixtureId": "fixture-item",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:item",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "kbd",
      "logicalName": "Kbd/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#kbd",
        "react": "packages/components-react/src/advanced.jsx#Kbd",
        "vue": "packages/components-vue/src/advanced.js#Kbd"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#kbd"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Kbd"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Kbd"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "form-plus",
      "categoryLabel": "复合表单",
      "order": 95,
      "canonicalSection": "section#form-plus",
      "canonicalSelector": "section#form-plus [data-component=\"Kbd/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-kbd",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/more",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "form-plus",
      "canonicalSpecimen": "legacy:form-plus:kbd",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/more",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/more"
      ]
    },
    {
      "id": "label",
      "logicalName": "Label/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-m",
        "spacing.component-gap",
        "spacing.padding-tag-x",
        "size.tag-height"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#label",
        "react": "packages/components-react/src/index.jsx#Label",
        "vue": "packages/components-vue/src/Label.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#label"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Label"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Label.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "Label 背景引用 neutral-dark.5（--color-neutral-dark-05），使用 8px 圆角、28px 高度、左右各 12px 内边距，文本在组件内垂直居中。",
      "category": "form-plus",
      "categoryLabel": "复合表单",
      "order": 90,
      "canonicalSection": "section#form-plus",
      "canonicalSelector": "section#form-plus [data-component=\"Label/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-label",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "field/search",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "form-plus",
      "canonicalSpecimen": "legacy:form-plus:label",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "label:body-m"
      ],
      "iconSlots": [
        {
          "alias": "field/search",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "field/search"
      ]
    },
    {
      "id": "menubar",
      "logicalName": "Menubar/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#menubar",
        "react": "packages/components-react/src/advanced.jsx#Menubar",
        "vue": "packages/components-vue/src/advanced.js#Menubar"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#menubar"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Menubar"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Menubar"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "disclosure",
      "categoryLabel": "披露与导航",
      "order": 73,
      "canonicalSection": "section#disclosure",
      "canonicalSelector": "section#disclosure [data-component=\"Menubar/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-menubar",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/grid",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "disclosure",
      "canonicalSpecimen": "legacy:disclosure:menubar",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/grid",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/grid"
      ]
    },
    {
      "id": "native-select",
      "logicalName": "Native Select/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#nativeSelect",
        "react": "packages/components-react/src/index.jsx#NativeSelect",
        "vue": "packages/components-vue/src/NativeSelect.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#nativeSelect"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#NativeSelect"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/NativeSelect.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "Native Select 必须使用真实 HTML select，select 热区完整覆盖整个可见下拉控件，点击文字、留白或箭头区域都由系统级原生下拉菜单处理；箭头仅作视觉层且不拦截指针事件。",
      "category": "form-plus",
      "categoryLabel": "复合表单",
      "order": 92,
      "canonicalSection": "section#form-plus",
      "canonicalSelector": "section#form-plus [data-component=\"Native Select/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-native-select",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/chevron-down",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "form-plus",
      "canonicalSpecimen": "legacy:form-plus:native-select",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/chevron-down",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/chevron-down"
      ]
    },
    {
      "id": "navigation-menu",
      "logicalName": "Navigation Menu/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#navigation-menu",
        "react": "packages/components-react/src/advanced.jsx#NavigationMenu",
        "vue": "packages/components-vue/src/advanced.js#NavigationMenu"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#navigation-menu"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#NavigationMenu"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#NavigationMenu"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "disclosure",
      "categoryLabel": "披露与导航",
      "order": 72,
      "canonicalSection": "section#disclosure",
      "canonicalSelector": "section#disclosure [data-component=\"Navigation Menu/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-navigation-menu",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/grid",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "disclosure",
      "canonicalSpecimen": "legacy:disclosure:navigation-menu",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/grid",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/grid"
      ]
    },
    {
      "id": "pagination",
      "logicalName": "Pagination/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "spacing.content-inset"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#pagination",
        "react": "packages/components-react/src/index.jsx#Pagination",
        "vue": "packages/components-vue/src/Pagination.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#pagination"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Pagination"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Pagination.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "navigation",
      "categoryLabel": "导航",
      "order": 54,
      "canonicalSection": "section#navigation",
      "canonicalSelector": "section#navigation [data-component=\"Pagination/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-pagination",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/back",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "navigation",
      "canonicalSpecimen": "legacy:navigation:pagination",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "slot": "previous",
          "alias": "navigation/back",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "outline"
        },
        {
          "slot": "next",
          "alias": "navigation/forward",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "outline"
        }
      ],
      "iconAliases": [
        "navigation/back",
        "navigation/forward"
      ]
    },
    {
      "id": "popover",
      "logicalName": "Popover/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "title",
        "description",
        "content",
        "actions"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "shadow.overlay",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#popover",
        "react": "packages/components-react/src/advanced.jsx#Popover",
        "vue": "packages/components-vue/src/advanced.js#Popover"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#popover"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Popover"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Popover"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "overlays",
      "categoryLabel": "浮层与命令",
      "order": 83,
      "canonicalSection": "section#overlays",
      "canonicalSelector": "section#overlays [data-component=\"Popover/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-popover",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "overlay",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/more",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "overlays",
      "canonicalSpecimen": "legacy:overlays:popover",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/more",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/more"
      ]
    },
    {
      "id": "progress",
      "logicalName": "Progress/Default",
      "variants": [
        "default",
        "success",
        "warning",
        "danger",
        "info"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "loading"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "color.primary"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#progress",
        "react": "packages/components-react/src/index.jsx#Progress",
        "vue": "packages/components-vue/src/Progress.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#progress"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Progress"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Progress.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 66,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Progress/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-progress",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "status/success",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:progress",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "loading"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "status/success",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "status/success"
      ]
    },
    {
      "id": "radio-group",
      "logicalName": "Radio Group/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#radioGroup",
        "react": "packages/components-react/src/index.jsx#RadioGroup",
        "vue": "packages/components-vue/src/RadioGroup.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#radioGroup"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#RadioGroup"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/RadioGroup.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "choices",
      "categoryLabel": "选择控件",
      "order": 41,
      "canonicalSection": "section#choices",
      "canonicalSelector": "section#choices [data-component=\"Radio Group/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-radio-group",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/check",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "choices",
      "canonicalSpecimen": "legacy:choices:radio-group",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/check",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/check"
      ]
    },
    {
      "id": "search",
      "logicalName": "Search/White Surface/Default",
      "variants": [
        "default",
        "focused",
        "with-value"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "value",
        "placeholder",
        "disabled"
      ],
      "slots": [
        "leading",
        "value",
        "clear"
      ],
      "tokenRoles": [
        "color.input-bg",
        "color.text",
        "color.icon",
        "size.search-height",
        "radius.search",
        "spacing.padding-search-x",
        "typography.body-l"
      ],
      "iconAliases": [
        "field/search",
        "action/close"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/search.html",
        "react": "packages/components-react/src/index.jsx#Search",
        "vue": "packages/components-vue/src/Search.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/search.html"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Search"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Search.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "fields",
      "categoryLabel": "输入与字段",
      "order": 31,
      "canonicalSection": "section#fields",
      "canonicalSelector": "section#fields [data-component=\"Search/White Surface/Default\"]",
      "specimens": [
        {
          "id": "white-surface",
          "variant": "default",
          "state": "default",
          "surface": "white"
        },
        {
          "id": "gray-surface",
          "variant": "default",
          "state": "default",
          "surface": "gray"
        }
      ],
      "fixtureId": "fixture-search",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "fill",
      "behaviors": [
        "input",
        "clear",
        "focus",
        "disabled"
      ],
      "iconSemantic": "field/search",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "fields",
      "canonicalSpecimen": "legacy:fields:search",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "filled",
        "error",
        "disabled"
      ],
      "textRoles": [
        "value:body-l",
        "placeholder:body-l"
      ],
      "iconSlots": [
        {
          "alias": "field/search",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/close",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ]
    },
    {
      "id": "select",
      "logicalName": "Select/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#select",
        "react": "packages/components-react/src/index.jsx#Select",
        "vue": "packages/components-vue/src/Select.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#select"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Select"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Select.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "fields",
      "categoryLabel": "输入与字段",
      "order": 33,
      "canonicalSection": "section#fields",
      "canonicalSelector": "section#fields [data-component=\"Select/Default\"]",
      "specimens": [
        {
          "id": "white-surface",
          "variant": "default",
          "state": "default",
          "surface": "white"
        },
        {
          "id": "gray-surface",
          "variant": "default",
          "state": "default",
          "surface": "gray"
        }
      ],
      "fixtureId": "fixture-select",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "navigation/chevron-down",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "fields",
      "canonicalSpecimen": "legacy:fields:select",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "open",
        "error"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "navigation/chevron-down",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/chevron-down"
      ]
    },
    {
      "id": "separator",
      "logicalName": "Separator/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#separator",
        "react": "packages/components-react/src/index.jsx#Separator",
        "vue": "packages/components-vue/src/Separator.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#separator"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Separator"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Separator.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "disclosure",
      "categoryLabel": "披露与导航",
      "order": 74,
      "canonicalSection": "section#disclosure",
      "canonicalSelector": "section#disclosure [data-component=\"Separator/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-separator",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "disclosure",
      "canonicalSpecimen": "legacy:disclosure:separator",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "sidebar",
      "logicalName": "Sidebar Item/Default",
      "variants": [
        "default",
        "selected",
        "collapsed"
      ],
      "states": [
        "default",
        "hover",
        "pressed",
        "focus",
        "selected",
        "disabled"
      ],
      "props": [
        "label",
        "icon",
        "selected",
        "collapsed",
        "count"
      ],
      "slots": [
        "leading",
        "label",
        "trailing"
      ],
      "tokenRoles": [
        "color.sidebar-bg",
        "color.sidebar-selected",
        "color.text",
        "color.primary",
        "size.list-item-height",
        "radius.list-item",
        "typography.body-l"
      ],
      "iconAliases": [
        "navigation/grid",
        "navigation/recent",
        "action/more"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/sidebar.html",
        "react": "packages/components-react/src/index.jsx#Sidebar",
        "vue": "packages/components-vue/src/Sidebar.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/sidebar.html"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Sidebar"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Sidebar.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "navigation",
      "categoryLabel": "导航",
      "order": 50,
      "canonicalSection": "section#navigation",
      "canonicalSelector": "section#navigation [data-component=\"Sidebar Item/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default",
          "surface": "white"
        }
      ],
      "fixtureId": "fixture-sidebar",
      "surface": "white",
      "sizing": "fill",
      "behaviors": [
        "select",
        "keyboard-activation",
        "disabled"
      ],
      "iconSemantic": "navigation/grid",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "navigation",
      "canonicalSpecimen": "legacy:navigation:sidebar",
      "allowedStates": [
        "default",
        "hover",
        "pressed",
        "focus",
        "selected",
        "disabled"
      ],
      "textRoles": [
        "label:body-l",
        "count:body-m"
      ],
      "iconSlots": [
        {
          "alias": "navigation/grid",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "navigation/recent",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/more",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ]
    },
    {
      "id": "slider",
      "logicalName": "Slider/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#slider",
        "react": "packages/components-react/src/advanced.jsx#Slider",
        "vue": "packages/components-vue/src/advanced.js#Slider"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#slider"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#Slider"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#Slider"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "form-plus",
      "categoryLabel": "复合表单",
      "order": 93,
      "canonicalSection": "section#form-plus",
      "canonicalSelector": "section#form-plus [data-component=\"Slider/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-slider",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/more",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "form-plus",
      "canonicalSpecimen": "legacy:form-plus:slider",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/more",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/more"
      ]
    },
    {
      "id": "switch",
      "logicalName": "Switch/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "color.primary"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#switch",
        "react": "packages/components-react/src/index.jsx#Switch",
        "vue": "packages/components-vue/src/Switch.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#switch"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Switch"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Switch.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "choices",
      "categoryLabel": "选择控件",
      "order": 42,
      "canonicalSection": "section#choices",
      "canonicalSelector": "section#choices [data-component=\"Switch/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-switch",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/check",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "choices",
      "canonicalSpecimen": "legacy:choices:switch",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/check",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/check"
      ]
    },
    {
      "id": "table",
      "logicalName": "Table/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "leading",
        "title",
        "description",
        "content",
        "trailing"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "spacing.content-inset"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#table",
        "react": "packages/components-react/src/index.jsx#Table",
        "vue": "packages/components-vue/src/Table.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#table"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Table"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Table.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "data-display",
      "categoryLabel": "卡片与数据",
      "order": 64,
      "canonicalSection": "section#data-display",
      "canonicalSelector": "section#data-display [data-component=\"Table/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-table",
      "surface": "white",
      "sizing": "fill",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "data-display",
      "canonicalSpecimen": "legacy:data-display:table",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "textRoles": [
        "header:body-m",
        "cell:body-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "tabs",
      "logicalName": "Tabs/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "color.primary"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#tabs",
        "react": "packages/components-react/src/index.jsx#Tabs",
        "vue": "packages/components-vue/src/Tabs.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#tabs"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Tabs"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Tabs.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "navigation",
      "categoryLabel": "导航",
      "order": 52,
      "canonicalSection": "section#navigation",
      "canonicalSelector": "section#navigation [data-component=\"Tabs/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-tabs",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "select",
        "arrow-keys",
        "focus"
      ],
      "iconSemantic": "navigation/list",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "navigation",
      "canonicalSpecimen": "legacy:navigation:tabs",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "selected"
      ],
      "textRoles": [
        "label:body-m"
      ],
      "iconSlots": [
        {
          "alias": "navigation/list",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "navigation/list"
      ]
    },
    {
      "id": "textarea",
      "logicalName": "Textarea/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "error"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "leading",
        "value",
        "trailing",
        "help"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#textarea",
        "react": "packages/components-react/src/index.jsx#Textarea",
        "vue": "packages/components-vue/src/Textarea.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#textarea"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Textarea"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Textarea.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "fields",
      "categoryLabel": "输入与字段",
      "order": 32,
      "canonicalSection": "section#fields",
      "canonicalSelector": "section#fields [data-component=\"Textarea/Default\"]",
      "specimens": [
        {
          "id": "white-surface",
          "variant": "default",
          "state": "default",
          "surface": "white"
        },
        {
          "id": "gray-surface",
          "variant": "default",
          "state": "default",
          "surface": "gray"
        }
      ],
      "fixtureId": "fixture-textarea",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "fill",
      "behaviors": [
        "input",
        "focus",
        "disabled",
        "error"
      ],
      "iconSemantic": null,
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "fields",
      "canonicalSpecimen": "legacy:fields:textarea",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "filled",
        "error",
        "disabled"
      ],
      "textRoles": [
        "value:body-l",
        "placeholder:body-l",
        "label:body-m",
        "help:caption-l"
      ],
      "iconSlots": [],
      "iconAliases": []
    },
    {
      "id": "toast",
      "logicalName": "Toast/Default",
      "variants": [
        "default",
        "success",
        "warning",
        "danger",
        "info"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "loading"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-m",
        "spacing.component-gap",
        "color.primary",
        "shadow.1",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#toast",
        "react": "packages/components-react/src/index.jsx#Toast",
        "vue": "packages/components-vue/src/Toast.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#toast"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Toast"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Toast.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "feedback",
      "categoryLabel": "提示与反馈",
      "order": 122,
      "canonicalSection": "section#feedback",
      "canonicalSelector": "section#feedback [data-component=\"Toast/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-toast",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "status/success",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "feedback",
      "canonicalSpecimen": "legacy:feedback:toast",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled",
        "loading"
      ],
      "textRoles": [
        "content:body-m"
      ],
      "iconSlots": [
        {
          "alias": "status/success",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/close",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "status/success",
        "action/close"
      ]
    },
    {
      "id": "tooltip",
      "logicalName": "Tooltip/Default",
      "variants": [
        "default"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "props": [
        "label",
        "value",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "label",
        "content",
        "description"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.padding-tooltip",
        "shadow.1",
        "radius.tooltip"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#tooltip",
        "react": "packages/components-react/src/index.jsx#Tooltip",
        "vue": "packages/components-vue/src/Tooltip.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#tooltip"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Tooltip"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Tooltip.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约；Tooltip 面板使用完整的圆角矩形浮层，不使用方向尖角；运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "feedback",
      "categoryLabel": "提示与反馈",
      "order": 121,
      "canonicalSection": "section#feedback",
      "canonicalSelector": "section#feedback [data-component=\"Tooltip/Default\"]",
      "specimens": [
        {
          "id": "default",
          "variant": "default",
          "state": "default"
        }
      ],
      "fixtureId": "fixture-tooltip",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "status/info",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "feedback",
      "canonicalSpecimen": "legacy:feedback:tooltip",
      "allowedStates": [
        "default",
        "hover",
        "focus",
        "disabled"
      ],
      "textRoles": [
        "content:body-l"
      ],
      "iconSlots": [
        {
          "alias": "status/info",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "status/info"
      ]
    },
    {
      "id": "list-card",
      "logicalName": "List Item/White Surface/Default",
      "variants": [
        "default",
        "selected",
        "unread"
      ],
      "states": [
        "default",
        "hover",
        "pressed",
        "focus",
        "selected",
        "disabled"
      ],
      "props": [
        "title",
        "description",
        "meta",
        "selected",
        "unread"
      ],
      "slots": [
        "leading",
        "title",
        "description",
        "trailing"
      ],
      "tokenRoles": [
        "color.surface",
        "color.sidebar-selected",
        "color.text",
        "color.text-muted",
        "color.divider",
        "size.list-item-height",
        "radius.list-item",
        "typography.body-l",
        "typography.body-m"
      ],
      "iconAliases": [
        "navigation/list"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/list-card.html",
        "react": "packages/components-react/src/index.jsx#ListCard",
        "vue": "packages/components-vue/src/ListCard.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/list-card.html"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#ListCard"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/ListCard.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "navigation",
      "categoryLabel": "导航",
      "order": 51,
      "canonicalSection": "section#navigation",
      "canonicalSelector": "section#navigation [data-component=\"List Item/White Surface/Default\"]",
      "specimens": [
        {
          "id": "single-text-arrow",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "text-arrow"
        },
        {
          "id": "double-icon",
          "variant": "double-line",
          "state": "default",
          "lines": 2,
          "trailing": "icon"
        },
        {
          "id": "triple-radio",
          "variant": "triple-line",
          "state": "default",
          "lines": 3,
          "trailing": "radio"
        },
        {
          "id": "single-checkbox",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "checkbox"
        },
        {
          "id": "single-switch",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "switch"
        },
        {
          "id": "single-notification-arrow",
          "variant": "single-line",
          "state": "default",
          "lines": 1,
          "trailing": "notification-arrow"
        }
      ],
      "fixtureId": "fixture-list-card",
      "surface": "white",
      "sizing": "fill",
      "behaviors": [
        "select",
        "keyboard-activation",
        "disabled"
      ],
      "iconSemantic": "navigation/list",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "navigation",
      "canonicalSpecimen": "legacy:navigation:list-card",
      "allowedStates": [
        "default",
        "hover",
        "pressed",
        "focus",
        "selected",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "description:body-m",
        "meta:body-m"
      ],
      "iconSlots": [
        {
          "alias": "navigation/list",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ]
    },
    {
      "id": "semi-modal",
      "logicalName": "Semi-modal/Default",
      "variants": [
        "s",
        "m",
        "l",
        "white",
        "gray",
        "non-modal",
        "modal"
      ],
      "states": [
        "closed",
        "open"
      ],
      "props": [
        "open",
        "size",
        "surface",
        "mode",
        "title",
        "onConfirm",
        "onCancel",
        "onClose",
        "onOpenChange"
      ],
      "slots": [
        "title",
        "description",
        "content",
        "actions"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap",
        "shadow.overlay",
        "radius.card"
      ],
      "source": "canonical-custom",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/advanced.js#semi-modal",
        "react": "packages/components-react/src/advanced.jsx#SemiModal",
        "vue": "packages/components-vue/src/advanced.js#SemiModal"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-custom",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/advanced.js#semi-modal"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/advanced.jsx#SemiModal"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/advanced.js#SemiModal"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "overlays",
      "categoryLabel": "浮层与命令",
      "order": 82,
      "canonicalSection": "section#overlays",
      "canonicalSelector": "section#overlays [data-component=\"Semi-modal/Default\"]",
      "specimens": [
        {
          "id": "s-white-non-modal",
          "variant": "s-white-non-modal",
          "state": "closed",
          "size": "s",
          "surface": "white",
          "mode": "non-modal"
        },
        {
          "id": "m-white-non-modal",
          "variant": "m-white-non-modal",
          "state": "closed",
          "size": "m",
          "surface": "white",
          "mode": "non-modal"
        },
        {
          "id": "l-white-non-modal",
          "variant": "l-white-non-modal",
          "state": "closed",
          "size": "l",
          "surface": "white",
          "mode": "non-modal"
        },
        {
          "id": "s-gray-non-modal",
          "variant": "s-gray-non-modal",
          "state": "closed",
          "size": "s",
          "surface": "gray",
          "mode": "non-modal"
        },
        {
          "id": "m-gray-non-modal",
          "variant": "m-gray-non-modal",
          "state": "closed",
          "size": "m",
          "surface": "gray",
          "mode": "non-modal"
        },
        {
          "id": "l-gray-non-modal",
          "variant": "l-gray-non-modal",
          "state": "closed",
          "size": "l",
          "surface": "gray",
          "mode": "non-modal"
        },
        {
          "id": "m-white-modal",
          "variant": "m-white-modal",
          "state": "closed",
          "size": "m",
          "surface": "white",
          "mode": "modal"
        }
      ],
      "fixtureId": "fixture-semi-modal",
      "surface": [
        "white",
        "gray"
      ],
      "sizing": "overlay",
      "behaviors": [
        "open",
        "confirm",
        "cancel",
        "close",
        "escape",
        "focus-return",
        "no-outside-dismiss",
        "modal-focus-trap"
      ],
      "iconSemantic": "action/close",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "overlays",
      "canonicalSpecimen": "legacy:overlays:semi-modal",
      "allowedStates": [
        "closed",
        "open"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/close",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/close"
      ],
      "structuralAxes": {
        "size": [
          "s",
          "m",
          "l"
        ],
        "surface": [
          "white",
          "gray"
        ],
        "mode": [
          "non-modal",
          "modal"
        ]
      },
      "interactionStates": [
        "closed",
        "open"
      ]
    },
    {
      "id": "titlebar",
      "logicalName": "Titlebar/Default",
      "variants": [
        "small",
        "medium",
        "large",
        "xlarge"
      ],
      "states": [
        "default",
        "unfocus",
        "disabled"
      ],
      "props": [
        "label",
        "size",
        "disabled",
        "state",
        "className"
      ],
      "slots": [
        "leading",
        "label",
        "trailing",
        "actions"
      ],
      "tokenRoles": [
        "color.text",
        "color.surface",
        "color.border",
        "typography.body-l",
        "spacing.component-gap"
      ],
      "source": "canonical-static",
      "status": "partial",
      "implementations": {
        "html": "packages/components-html/src/index.js#titlebar",
        "react": "packages/components-react/src/index.jsx#Titlebar",
        "vue": "packages/components-vue/src/Titlebar.vue"
      },
      "visualAuthority": "skill-canonical",
      "sourceStrategy": "canonical-static",
      "frameworks": {
        "html": {
          "status": "partial",
          "source": "packages/components-html/src/index.js#titlebar"
        },
        "react": {
          "status": "partial",
          "source": "packages/components-react/src/index.jsx#Titlebar"
        },
        "vue": {
          "status": "partial",
          "source": "packages/components-vue/src/Titlebar.vue"
        }
      },
      "pixso": {
        "status": "logical-mapping",
        "libraryPage": "NewComponents",
        "resolveGuidsAtRuntime": true,
        "linkedInstanceRequired": true,
        "variableReadbackRequired": true
      },
      "contractNotes": "已保留旧 Skill 视觉基线和逻辑契约，但运行时适配器仍需按本组件真实结构、行为和可访问性逐批验收。",
      "category": "titlebars",
      "categoryLabel": "标题栏",
      "order": 10,
      "canonicalSection": "section#titlebars",
      "canonicalSelector": "section#titlebars [data-component=\"Titlebar/Default\"]",
      "specimens": [
        {
          "id": "small-normal",
          "variant": "small",
          "state": "default"
        },
        {
          "id": "small-unfocus",
          "variant": "small",
          "state": "unfocus"
        },
        {
          "id": "medium-normal",
          "variant": "medium",
          "state": "default"
        },
        {
          "id": "medium-unfocus",
          "variant": "medium",
          "state": "unfocus"
        },
        {
          "id": "large-normal",
          "variant": "large",
          "state": "default"
        },
        {
          "id": "large-unfocus",
          "variant": "large",
          "state": "unfocus"
        },
        {
          "id": "xlarge-normal",
          "variant": "xlarge",
          "state": "default"
        },
        {
          "id": "xlarge-unfocus",
          "variant": "xlarge",
          "state": "unfocus"
        }
      ],
      "fixtureId": "fixture-titlebar",
      "surface": "white",
      "sizing": "intrinsic",
      "behaviors": [
        "focus",
        "disabled"
      ],
      "iconSemantic": "action/minimize",
      "readiness": {
        "sourceReady": true,
        "contractReady": true,
        "visualParity": false,
        "behaviorParity": false,
        "accessibilityParity": false,
        "tokenParity": true
      },
      "legacyVisualGroup": "titlebars",
      "canonicalSpecimen": "legacy:titlebars:titlebar",
      "allowedStates": [
        "default",
        "unfocus",
        "disabled"
      ],
      "textRoles": [
        "title:title-s",
        "content:body-l",
        "description:body-m",
        "help:caption-l"
      ],
      "iconSlots": [
        {
          "alias": "action/minimize",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/maximize",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        },
        {
          "alias": "action/close",
          "displaySizes": [
            16,
            20,
            24
          ],
          "kind": "auto"
        }
      ],
      "iconAliases": [
        "action/minimize",
        "action/maximize",
        "action/close"
      ]
    }
  ],
  "registryPolicy": {
    "visualAuthority": "skill-canonical",
    "readyRequires": [
      "sourceReady",
      "contractReady",
      "visualParity",
      "behaviorParity",
      "accessibilityParity",
      "tokenParity"
    ],
    "partialMayBeUsedFor": [],
    "partialMustNotBeUsedFor": [
      "strict-pixso-component-parity",
      "cross-framework-component-claim"
    ],
    "deletedComponents": [
      "drawer",
      "sonner",
      "marker",
      "message-scroller",
      "toggle",
      "spinner",
      "skeleton"
    ],
    "readinessDimensions": [
      "sourceReady",
      "contractReady",
      "visualParity",
      "behaviorParity",
      "accessibilityParity",
      "tokenParity"
    ],
    "readyWhen": "all readinessDimensions are true",
    "runtimeRule": "只显示结构性 specimens；hover/pressed/focus/open/close 由真实组件交互触发",
    "comparisonRule": "原生组件预览必须严格跟随旧 Skill 契约页的章节和组件顺序；业务 category 仅用于代码组织，不得决定视觉对比顺序",
    "comparisonGroups": [
      {
        "id": "titlebars",
        "label": "Titlebar · 标题栏",
        "componentIds": [
          "titlebar"
        ]
      },
      {
        "id": "buttons",
        "label": "Button · 按钮",
        "componentIds": [
          "button"
        ]
      },
      {
        "id": "fields",
        "label": "输入与选择",
        "componentIds": [
          "input",
          "search",
          "textarea",
          "select"
        ]
      },
      {
        "id": "choices",
        "label": "选择控件",
        "componentIds": [
          "checkbox",
          "radio-group",
          "switch"
        ]
      },
      {
        "id": "navigation",
        "label": "Tabs · 标签页与导航列表",
        "componentIds": [
          "tabs",
          "list-card"
        ]
      },
      {
        "id": "data-display",
        "label": "卡片与数据展示",
        "componentIds": [
          "card",
          "avatar",
          "badge",
          "table",
          "data-table",
          "progress",
          "pagination",
          "empty"
        ]
      },
      {
        "id": "disclosure",
        "label": "披露与导航",
        "componentIds": [
          "breadcrumb",
          "accordion",
          "collapsible",
          "navigation-menu",
          "menubar",
          "separator",
          "sidebar",
          "item"
        ]
      },
      {
        "id": "overlays",
        "label": "浮层与命令",
        "componentIds": [
          "dialog",
          "alert-dialog",
          "semi-modal",
          "popover",
          "hover-card",
          "context-menu",
          "dropdown-menu"
        ]
      },
      {
        "id": "form-plus",
        "label": "复合表单",
        "componentIds": [
          "field",
          "label",
          "combobox",
          "native-select",
          "slider",
          "input-otp",
          "kbd"
        ]
      },
      {
        "id": "loading-data",
        "label": "加载、图表与日期时间",
        "componentIds": [
          "chart",
          "calendar",
          "date-picker",
          "time-picker"
        ]
      },
      {
        "id": "specialized",
        "label": "专用内容与布局",
        "componentIds": [
          "attachment",
          "carousel"
        ]
      },
      {
        "id": "feedback",
        "label": "Tooltip · 工具提示与反馈浮层",
        "componentIds": [
          "alert",
          "tooltip",
          "toast"
        ]
      }
    ],
    "categoryOrder": [
      "titlebars",
      "buttons",
      "fields",
      "choices",
      "navigation",
      "data-display",
      "disclosure",
      "overlays",
      "form-plus",
      "loading-data",
      "specialized",
      "feedback"
    ]
  }
};
