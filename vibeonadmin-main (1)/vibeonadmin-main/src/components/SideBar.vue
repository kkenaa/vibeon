<script setup lang="ts">
import IconClose from "./icons/IconClose.vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const closeSidebar = () => {
  emit("close");
};
</script>

<template>
  <div v-if="isOpen" class="overlay-wrapper">
    <div class="overlay-bg" @click="closeSidebar"></div>

    <transition
      enter-active-class="slide-enter-active"
      enter-from-class="slide-enter-from"
      enter-to-class="slide-enter-to"
      leave-active-class="slide-leave-active"
      leave-from-class="slide-leave-from"
      leave-to-class="slide-leave-to"
    >
      <div v-if="isOpen" class="sidebar">
        <div class="close-container">
          <button class="close-btn" @click="closeSidebar">
            <IconClose class="icon-close" :size="16" fill="#BBB" />
          </button>
        </div>

        <div class="content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.overlay-wrapper {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  justify-content: flex-end;
  height: 100%;
}

.overlay-bg {
  position: fixed;
  inset: 0;
  background-color: rgba(75, 85, 99, 0.75);
}

.sidebar {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 28rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  transform: translateX(0);
}

.close-container {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 0.5rem;
}

.close-btn {
  margin-left: 0.5rem;
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  background: transparent;
  border: none;
  cursor: pointer;
}

.icon-close:hover {
  color: #6b7280;
}

.icon-close:active {
  color: #111827;
}

.content {
  width: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
</style>
