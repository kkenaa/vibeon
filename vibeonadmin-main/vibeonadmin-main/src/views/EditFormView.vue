<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { columns } from "../data/grid-data";
import { editingRowStore } from "../stores/editingRowStore";
import users from "../data/users.json";

const router = useRouter();
const formData = ref<any>({});

const editableColumns = computed(() => columns.filter((col) => col.editable));

const flatColumns = computed(() =>
  editableColumns.value.filter((col) => col.type !== "grid"),
);

const gridColumns = computed(() =>
  editableColumns.value.filter((col) => col.type === "grid"),
);

const deepCopy = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj));
};

const updateNestedCell = (
  columnKey: string,
  rowIndex: string | number,
  cellKey: string,
  newValue: any,
) => {
  if (!formData.value[columnKey]) {
    formData.value[columnKey] = [];
  }
  if (!formData.value[columnKey][rowIndex]) {
    formData.value[columnKey][rowIndex] = {};
  }
  formData.value[columnKey][rowIndex][cellKey] = newValue;
};

const save = () => {
  const editingIndex = editingRowStore.getEditingIndex();
  if (editingIndex !== -1) {
    (users as any)[editingIndex] = formData.value;
  }
  router.push({ name: "home" });
};

const cancel = () => {
  router.push({ name: "home" });
};

onMounted(() => {
  const row = editingRowStore.getEditingRow();
  if (row) {
    formData.value = deepCopy(row);
  }
});
</script>

<template>
  <div class="edit-form-view">
    <div class="form-container">
      <div class="form-header">
        <h1>Edit Form</h1>
      </div>
      <form @submit.prevent="save" class="edit-form">
        <div v-for="col in flatColumns" :key="col.key" class="form-field">
          <label>{{ col.label }}:</label>
          <input
            v-if="
              col.type === 'text' ||
              col.type === 'number' ||
              col.type === 'date'
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
          />
        </div>

        <div v-for="col in gridColumns" :key="col.key" class="grid-field">
          <label>{{ col.label }}:</label>
          <div class="nested-grid">
            <table class="nested-table">
              <thead>
                <tr>
                  <th
                    v-for="nestedCol in col.gridConfig?.columns"
                    :key="nestedCol.key"
                  >
                    {{ nestedCol.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(nestedRow, rowIndex) in formData[col.key]"
                  :key="rowIndex"
                >
                  <td
                    v-for="nestedCol in col.gridConfig?.columns"
                    :key="nestedCol.key"
                  >
                    <input
                      :value="nestedRow[nestedCol.key] || ''"
                      @input="
                        (e: any) =>
                          updateNestedCell(
                            col.key,
                            rowIndex,
                            nestedCol.key,
                            e.target.value,
                          )
                      "
                      :type="nestedCol.type === 'number' ? 'number' : 'text'"
                      class="nested-input input-search"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-apply">Save</button>
          <button type="button" @click="cancel" class="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.edit-form-view {
  width: 100%;
  padding: 100px 20px;
  min-height: 100vh;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.form-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
}

.form-header h1 {
  color: #333;
  margin: 0;
  font-size: 28px;
}

.edit-form {
  padding: 0;
  background: transparent;
  border: none;
  width: 100%;
}

.form-field {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.grid-field {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.grid-field label {
  display: block;
  margin-bottom: 10px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
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

.nested-grid-edit {
  overflow-x: auto;
}

.nested-table {
  width: 100%;
  border-collapse: collapse;
}

.nested-table thead {
  background-color: #f0f0f0;
}

.nested-table th {
  padding: 8px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
}

.nested-table td {
  padding: 6px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  font-size: 13px;
}

.nested-input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 13px;
  box-sizing: border-box;
}

.nested-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 3px rgba(0, 102, 204, 0.3);
}

.form-actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.form-actions button {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.input-search {
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 4px;
  color: #4f4c4c;
}

.btn-apply {
  flex: 1;
  background-color: #0066cc;
  color: white;
}

.btn-apply:hover {
  background-color: #0052a3;
}

.btn-cancel {
  flex: 1;
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.nested-grid {
  width: stretch;
}
.nested-grid .grid-header,
.nested-grid .grid-row {
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
}

.nested-grid .grid-header {
  background-color: #f5f5f5;
}

.nested-grid .grid-header-cell span,
.nested-grid .grid-cell span {
  font-size: 12px;
}
input[type="date"].input-search::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
