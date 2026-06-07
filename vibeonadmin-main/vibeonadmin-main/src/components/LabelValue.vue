<script setup lang="ts">
const props = defineProps<{
  label: string;
  value?: string | number;
  className?: string[];
}>();
</script>

<template>
  <div class="info-item">
    <span class="info-label">{{ props.label }}</span>
    <span :class="['info-value', props.className]">{{ props.value }}</span>
  </div>
</template>

<style scoped>
.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 13px;
  color: #000;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.banned {
  background: #fee2e2;
  color: #991b1b;
}
</style>
