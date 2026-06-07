<script setup lang="ts">
import { computed } from "vue";
import type { Column } from "../types";
import FilterItem from "./FilterItem.vue";

interface Props {
  filters: FilterData;
  columns: Column[];
}

interface FilterData {
  name?: string;
  email?: string;
  date?: string;
  details?: {
    phone?: string;
    address?: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  clear: [];
  removeFilter: [field: string];
}>();

const formatLabel = (key: string) => {
  const lastKey = key.split(".").pop() || key;

  return lastKey
    .replace(/([A-Z])/g, " $1")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const activeFilterItems = computed(() => {
  const items: { label: string; value: string; field: string }[] = [];

  const flatten = (obj: any, parentKey = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (!value) return;

      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value === "object" && !Array.isArray(value)) {
        flatten(value, fullKey);
      } else {
        items.push({
          field: fullKey,
          label: formatLabel(fullKey),
          value: String(value),
        });
      }
    });
  };

  flatten(props.filters);

  return items;
});

const removeFilter = (field: string) => {
  emit("removeFilter", field);
};
</script>

<template>
  <div v-if="activeFilterItems.length > 0" class="active-filters">
    <div class="filters-container">
      <div class="filter-inner">
        <span class="filters-title">Active Filters:</span>
        <div class="filters-list">
          <div
            v-for="(filter, index) in activeFilterItems"
            :key="index"
            class="filters"
          >
            <FilterItem
              :filter="filter"
              @removeFilter="() => removeFilter(filter.field)"
            />
          </div>
        </div>
      </div>

      <button @click="$emit('clear')" class="clear-all-btn">Clear All</button>
    </div>
  </div>
</template>

<style scoped>
.active-filters {
  margin-bottom: 20px;
  padding: 6px;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-inner {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.filters-title {
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.clear-all-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

.clear-all-btn:hover {
  background-color: #ee5a52;
}

.filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-text {
  font-weight: 500;
}
</style>
