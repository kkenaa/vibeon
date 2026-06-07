<script setup lang="ts">
export interface ButtonConfig {
  name: string;
  onClick: () => void;
  variant?: "primary" | "view" | "secondary" | "ban" | "unban";
}

interface Props {
  buttons: ButtonConfig[];
}

defineProps<Props>();
</script>

<template>
  <div class="action-buttons">
    <button
      v-for="(btn, index) in buttons"
      :key="index"
      :class="['btn', `btn-${btn.variant || 'primary'}`]"
      @click="btn.onClick"
    >
      {{ btn.name }}
    </button>
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-view {
  background-color: rgb(230, 182, 93);
  color: white;
  border-color: rgb(215, 113, 75);
}

.btn-view:hover {
  background-color: #c82333;
  border-color: #c82333;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

.btn-ban {
  background: #fee2e2;
  color: #991b1b;
}

.btn-ban:hover {
  background: #fecaca;
}

.btn-unban {
  background: #d1fae5;
  color: #065f46;
}

.btn-unban:hover {
  background: #a7f3d0;
}
.btn-ban,
.btn-unban {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
