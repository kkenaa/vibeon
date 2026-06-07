<script setup lang="ts">
const props = defineProps<{
  label: string;
  isActive: boolean;
  page: number;
  disabled?: boolean;
}>();

const emit = defineEmits(["update:page"]);

const handleClick = () => {
  emit("update:page", props.page);
};
</script>

<template>
  <button
    :class="['pagination-btn', { active: isActive }]"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.pagination-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-family: sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  border: 1px solid lightgray;
  background-color: white;
  color: rgb(185, 185, 185);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pagination-btn:hover {
  background-color: lightgray;
}

.pagination-btn:active {
  background-color: rgb(158, 155, 155);
}

.pagination-btn.active {
  background-color: rgb(178, 10, 10);
  color: white;
}
</style>
