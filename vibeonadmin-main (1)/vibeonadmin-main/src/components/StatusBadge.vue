<script setup lang="ts">
const props = defineProps<{
  user: {
    status: string;
  };
}>();
</script>
<template>
  <div class="status-indicator" :class="user.status">
    <span class="status-dot"></span>
    <span class="status-text">{{ user.status }}</span>
  </div>
</template>

<style scoped>
.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  width: fit-content;
}

.status-indicator.active {
  background: #d1fae5;
  color: #065f46;
}

.status-indicator.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-indicator.active .status-dot {
  background: #10b981;
}

.status-indicator.inactive .status-dot {
  background: #ef4444;
}
</style>
