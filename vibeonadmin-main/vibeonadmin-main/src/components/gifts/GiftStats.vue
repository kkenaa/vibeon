<script setup lang="ts">
import LabelValue from "../LabelValue.vue";
import type { GiftStat } from "./types";

defineProps<{
  stats: GiftStat[];
}>();
</script>

<template>
  <div class="gift-stats">
    <LabelValue
      v-for="(stat, index) in stats"
      :key="index"
      :label="stat.label"
      :value="stat.value"
      :class="['stat', { highlight: stat.highlight }]"
    />
  </div>
</template>

<style scoped>
.gift-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat {
  display: block;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.stat.highlight {
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.stat :deep(.info-label) {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  font-weight: 600;
}

.stat :deep(.info-value) {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #000;
}
</style>
