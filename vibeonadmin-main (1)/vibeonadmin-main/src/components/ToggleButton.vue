<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  label: string;
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isActive = ref(props.modelValue ?? false);

watch(
  () => props.modelValue,
  (newValue) => {
    isActive.value = newValue ?? false;
  },
);

const toggle = () => {
  isActive.value = !isActive.value;
  emit('update:modelValue', isActive.value);
};
</script>

<template>
  <div class="toggle-container" @click="toggle">
    <div class="toggle-switch" :class="{ on: isActive }"></div>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid lightgray;
  transition: background 0.3s ease;
  width: 90%;
}

.toggle-switch {
  width: 40px;
  height: 20px;
  background: #ccc;
  border-radius: 999px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch::after {
  content: "";
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.toggle-switch.on {
  background: #2563eb;
}

.toggle-switch.on::after {
  transform: translateX(20px);
}

.label {
  font-size: 14px;
}
</style>
