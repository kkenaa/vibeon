<script setup lang="ts">
import IconFilterClose from "./icons/IconFilterClose.vue";

interface Props {
  filter: { label: string; value: string };
}

defineProps<Props>();

const emit = defineEmits<{
  removeFilter: [field: string];
}>();
const removeFilter = (field: string) => {
  emit("removeFilter", field);
};
</script>

<template>
  <span class="filter-badge">
    {{ filter.label }}: {{ filter.value }}
    <IconFilterClose @click="removeFilter(filter.label.toLowerCase())" />
  </span>
</template>

<style>
.filter-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #e5e5e5;
  border: none;
  border-radius: 20px;
  padding: 2px 6px;
  font-size: 12px;
  color: #000000;
}
</style>
