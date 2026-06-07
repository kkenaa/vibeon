<script setup lang="ts">
import { RouterView } from "vue-router";
import LeftSidebar from "./components/LeftSidebar.vue";
</script>

<template>
  <div class="app-container">
    <LeftSidebar />
    <div class="content-area">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100vh;
}

.content-area {
  flex: 1;
  width: 80%;
  overflow-y: auto;
  background: #f3f4f6;
}
</style>
