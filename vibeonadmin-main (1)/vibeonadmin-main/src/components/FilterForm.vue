<script setup lang="ts">
import { ref, watch } from "vue";
import type { Column } from "../types";

interface FilterData {
  name?: string;
  email?: string;
  date?: string;
  details: {
    phone?: string;
    address?: string;
  };
}

interface Props {
  columns: Column[];
  activeFilters?: FilterData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  apply: [filters: FilterData];
  cancel: [];
}>();

const filterData = ref<FilterData>({
  name: "",
  email: "",
  date: "",
  details: {
    phone: "",
    address: "",
  },
});

watch(
  () => props.activeFilters,
  (newFilters) => {
    if (newFilters) {
      filterData.value = {
        name: newFilters.name || "",
        email: newFilters.email || "",
        date: newFilters.date || "",
        details: {
          phone: newFilters.details?.phone || "",
          address: newFilters.details?.address || "",
        },
      };
    }
  },
  { immediate: true },
);

const applyFilters = () => {
  emit("apply", filterData.value);
};

const cancelFilter = () => {
  emit("cancel");
};
</script>

<template>
  <div class="filter-form">
    <h3>Add Filter</h3>

    <form @submit.prevent="applyFilters">
      <div class="filter-field">
        <label>Name:</label>
        <input
          v-model="filterData.name"
          type="text"
          placeholder="Enter name"
          class="filter-input"
        />
      </div>

      <div class="filter-field">
        <label>Email:</label>
        <input
          v-model="filterData.email"
          type="text"
          placeholder="Enter email"
          class="filter-input"
        />
      </div>

      <div class="filter-field">
        <label>Date:</label>
        <input v-model="filterData.date" type="date" class="filter-input" />
      </div>

      <div class="filter-section-title">Details:</div>

      <div class="filter-field">
        <label>Phone:</label>
        <input
          v-model="filterData.details.phone"
          type="text"
          placeholder="Enter phone"
          class="filter-input"
        />
      </div>

      <div class="filter-field">
        <label>Address:</label>
        <input
          v-model="filterData.details.address"
          type="text"
          placeholder="Enter address"
          class="filter-input"
        />
      </div>

      <div class="filter-actions">
        <button type="submit" class="btn-apply">Save Filters</button>
        <button type="button" @click="cancelFilter" class="btn-cancel">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.filter-form {
  padding: 3rem 1rem;
  background: #fff;
  border: none;
}

h3 {
  text-align: left;
}

form {
  display: flex;
  flex-direction: column;
}

.filter-field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.filter-section-title {
  margin-top: 20px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: left;
}

.filter-field label {
  display: block;
  margin-bottom: 6px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.filter-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: #ffffff;
  color: #4f4c4c;
  box-sizing: border-box;
}

.filter-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 3px rgba(0, 102, 204, 0.3);
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.btn-apply,
.btn-cancel {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-apply {
  background-color: #0066cc;
  color: white;
}

.btn-apply:hover {
  background-color: #0052a3;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}
input[type="date"].filter-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
