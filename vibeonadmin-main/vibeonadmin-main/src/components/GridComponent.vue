<script setup lang="ts">
import type { Column } from "../types";

interface Props {
  columns: Column[];
  data: any[];
  columnSearches?: Record<string, string>;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "row-select": [row: any, index: number];
  edit: [row: any, index: number];
  view: [row: any, index: number];
  sort: [key: string];
  "update:columnSearches": [value: Record<string, string>];
}>();

const formatValue = (col: Column, value: any) => {
  return col.formatter ? col.formatter(value) : value;
};

const handleRowClick = (row: any, index: number) => {
  emit("row-select", row, index);
};

const sortBy = (key: string) => {
  emit("sort", key);
};

const getComponentProps = (col: Column, row: any, index: number) => {
  const resolvedProps =
    typeof col.componentProps === "function"
      ? col.componentProps(row, index)
      : col.componentProps || {};

  if (!resolvedProps.buttons) {
    return resolvedProps;
  }

  return {
    ...resolvedProps,
    buttons: resolvedProps.buttons.map((btn: any) => ({
      ...btn,
      onClick: () => {
        if (btn.name === "Edit") emit("edit", row, index);
        else if (btn.name === "View") emit("view", row, index);
      },
    })),
  };
};

const shouldStopRowClick = (col: Column, row: any, index: number) => {
  if (col.stopRowClick) return true;
  if (col.type !== "component") return false;
  const resolvedProps =
    typeof col.componentProps === "function"
      ? col.componentProps(row, index)
      : col.componentProps || {};
  return Array.isArray((resolvedProps as any).buttons);
};

const handleCellClick = (
  event: MouseEvent,
  col: Column,
  row: any,
  index: number,
) => {
  if (shouldStopRowClick(col, row, index)) {
    event.stopPropagation();
  }
};
</script>

<template>
  <div class="grid-container">
    <div v-if="columns.some((col) => col.searchable)" class="grid-search">
      <div
        v-for="col in columns"
        :key="`search-${col.key}`"
        class="grid-search-cell"
      >
        <input
          v-if="col.searchable"
          :value="columnSearches?.[col.key]"
          @input="
            (e: any) => {
              emit('update:columnSearches', {
                ...columnSearches,
                [col.key]: e.target.value,
              });
            }
          "
          :placeholder="`Search by ${col.label}`"
          class="input-search"
        />
      </div>
    </div>
    <div class="grid-header">
      <div
        v-for="col in columns"
        :key="col.key"
        :class="{ sortable: col.sortable }"
        @click="col.sortable && sortBy(col.key)"
        class="grid-header-cell"
      >
        <div class="sortable-content">
          <span>{{ col.label }}</span>
          <span v-if="col.sortable" class="sort-icon">
            {{
              props.sortKey === col.key
                ? props.sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : "⇅"
            }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-for="(row, index) in data"
      :key="index"
      class="grid-row"
      @click="handleRowClick(row, index)"
    >
      <div
        v-for="col in columns"
        :key="col.key"
        class="grid-cell"
        @click="handleCellClick($event, col, row, index)"
      >
        <component
          v-if="col.type === 'component' && col.component"
          :is="col.component"
          v-bind="getComponentProps(col, row, index)"
        />
        <GridComponent
          v-else-if="col.type === 'grid' && col.gridConfig"
          :columns="col.gridConfig.columns"
          :data="row[col.key]"
          class="nested-grid"
        />
        <span v-else>
          {{ formatValue(col, row[col.key]) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  position: relative;
}

.grid-header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.grid-header-cell {
  padding: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}

.grid-header-cell:last-child {
  border-right: none;
}

.grid-header-cell.sortable:hover {
  background-color: #e8e8e8;
}

.grid-search {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.grid-search-cell {
  padding: 4px;
}

.grid-search-cell:last-child {
  border-right: none;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.15s;
}

.grid-row:hover {
  background-color: #f9f9f9;
}

.grid-cell {
  padding: 8px;
  display: flex;
  align-items: center;
  font-size: 13px;
}

.grid-cell:last-child {
  border-right: none;
}

.sortable-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sort-icon {
  margin-left: 5px;
}

.input-search {
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 4px;
  color: #4f4c4c;
  width: 100%;
  box-sizing: border-box;
}

.editable {
  cursor: pointer;
  background: #f9f9f9;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
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
</style>
