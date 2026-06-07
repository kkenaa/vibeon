<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    inputClass?: string;
    inputType?: string;
  }>(),
  { inputType: "text" },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "enter"): void;
  (e: "escape"): void;
}>();
</script>

<template>
  <div :class="props.inputClass">
    <input
      :value="props.modelValue"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :type="props.inputType"
      :placeholder="props.placeholder"
      class="search-input"
      @keydown.enter.prevent="emit('enter')"
      @keydown.escape="emit('escape')"
    />
  </div>
</template>

<style scoped>
.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
