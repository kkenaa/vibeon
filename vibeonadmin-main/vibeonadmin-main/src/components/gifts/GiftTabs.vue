<script setup lang="ts">
import IconText from "../IconText.vue";
import type { GiftTab, GiftTabValue } from "./types";

defineProps<{
  tabs: GiftTab[];
  activeTab: GiftTabValue;
}>();

const emit = defineEmits<{
  "update:activeTab": [value: GiftTabValue];
}>();
</script>

<template>
  <div class="tabs">
    <IconText
      v-for="tab in tabs"
      :key="tab.value"
      :label="tab.label"
      classname="tab"
      :active="activeTab === tab.value"
      @click="emit('update:activeTab', tab.value)"
    />
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.tab:hover {
  color: #374151;
}

.tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}
</style>
