<script setup lang="ts">
const props = defineProps<{
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    isLive: boolean;
  };
}>();
</script>

<template>
  <div class="user-name-row">
    <img :src="user.avatar" :alt="user.name" class="user-avatar" />
    <span class="user-name">{{ user.name }}</span>
    <span v-if="user.verified" class="verified-icon">✓</span>
    <span v-if="user.isLive" class="live-icon">🔴</span>
  </div>
</template>

<style scoped>
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.verified-icon,
.live-icon {
  font-size: 9px;
  flex-shrink: 0;
}

.verified-icon {
  background: #1765d3;
  color: white;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7px;
  font-weight: bold;
}
</style>
