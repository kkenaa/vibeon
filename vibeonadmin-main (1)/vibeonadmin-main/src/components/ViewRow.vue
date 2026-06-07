<script setup lang="ts">
import { ref, computed } from "vue";
import type { Column } from "../types";
import GridComponent from "./GridComponent.vue";

interface Props {
  columns: Column[];
  row: any;
}

const props = defineProps<Props>();

const formData = ref({ ...props.row });

const editableColumns = computed(() =>
  props.columns.filter((col) => col.editable),
);
</script>

<template>
  <div class="view-form">
    <h3>View Row</h3>
    <div v-for="col in editableColumns" :key="col.key" class="form-field">
      <label>{{ col.label }}:</label>
      <input
        v-if="
          col.type === 'text' || col.type === 'number' || col.type === 'date'
        "
        :type="
          col.type === 'number'
            ? 'number'
            : col.type === 'date'
              ? 'date'
              : 'text'
        "
        v-model="formData[col.key]"
        class="input-search"
        disabled
      />

      <GridComponent
        v-if="col.type === 'grid' && col.gridConfig"
        :columns="col.gridConfig.columns"
        :data="row[col.key]"
        class="nested-grid"
      />
    </div>
  </div>
</template>

<style scoped>
.view-form {
  padding: 3px;
  background: #fff;
  border: none;
  width: 90%;
}
h3 {
  text-align: left;
}

.form-field {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.form-field label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
  font-size: 14px;
}

.form-field input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.form-actions {
  margin-top: 20px;
}

.grid-header-cell span {
  font-size: 12px;
}

.form-actions button {
  margin-right: 10px;
  padding: 8px 16px;
}

.input-search {
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 4px;
  color: #4f4c4c;
}
</style>
