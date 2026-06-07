<script setup lang="ts">
import { computed, useId } from "vue";
export interface SelectFieldOption {
  value: string;
  label: string;
}
const props = withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    options: SelectFieldOption[];
    placeholder?: string;
  }>(),
  { placeholder: "" },
);
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
const baseId = useId();
const labelId = `${baseId}-label`;
const selectId = `${baseId}-select`;
const showPlaceholder = computed(() => props.placeholder.length > 0);
function onChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLSelectElement).value);
}
</script>

<template>
  <div class="review-doc-field">
    <label class="review-status-label" :id="labelId" :for="selectId">{{
      label
    }}</label>
    <select
      :id="selectId"
      class="review-status-select"
      :value="modelValue"
      :aria-labelledby="labelId"
      @change="onChange"
    >
      <option v-if="showPlaceholder" disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
<style scoped>
.review-doc-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.review-status-label {
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
}
.review-status-select {
  padding: 10px 12px;
  font-size: 14px;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
</style>
