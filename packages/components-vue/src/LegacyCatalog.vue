<script setup>
import "./styles.css";
import { legacyCatalogMarkup } from "../../component-contracts/src/legacy-catalog.js";
</script>

<template>
  <div class="tui-legacy-catalog" data-component="legacy-catalog" data-logical-component="Catalog/Legacy Skill Baseline" data-variant="canonical" data-state="default" data-framework="vue" v-html="legacyCatalogMarkup"></div>
</template>
