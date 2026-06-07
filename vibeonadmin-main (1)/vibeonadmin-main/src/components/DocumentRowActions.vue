<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from "vue";

interface Props {
  onLeaveReview: () => void;
}

const props = defineProps<Props>();

const MENU_MIN_WIDTH = 160;

const menuOpen = ref(false);
const rootRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);
const dropdownPanelRef = ref<HTMLElement | null>(null);

const dropdownStyle = ref({
  top: "0px",
  left: "0px",
  minWidth: `${MENU_MIN_WIDTH}px`,
});

function positionDropdown() {
  const btn = buttonRef.value;
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const left = Math.max(8, r.right - MENU_MIN_WIDTH);
  dropdownStyle.value = {
    top: `${r.bottom + 2}px`,
    left: `${left}px`,
    minWidth: `${MENU_MIN_WIDTH}px`,
  };
}

const toggleMenu = (e: MouseEvent) => {
  e.stopPropagation();
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value) {
    nextTick(() => positionDropdown());
  }
};

const closeMenu = () => {
  menuOpen.value = false;
};

const onLeaveReview = (e: MouseEvent) => {
  e.stopPropagation();
  closeMenu();
  props.onLeaveReview();
};

const onDocPointerDown = (ev: PointerEvent) => {
  const t = ev.target as Node;
  if (rootRef.value?.contains(t)) return;
  if (dropdownPanelRef.value?.contains(t)) return;
  closeMenu();
};

watch(menuOpen, (open) => {
  if (open) {
    nextTick(() => positionDropdown());
    window.addEventListener("scroll", positionDropdown, true);
    window.addEventListener("resize", positionDropdown);
  } else {
    window.removeEventListener("scroll", positionDropdown, true);
    window.removeEventListener("resize", positionDropdown);
  }
});

onMounted(() => {
  document.addEventListener("pointerdown", onDocPointerDown);
});

onUnmounted(() => {
  document.removeEventListener("pointerdown", onDocPointerDown);
  window.removeEventListener("scroll", positionDropdown, true);
  window.removeEventListener("resize", positionDropdown);
});
</script>

<template>
  <div ref="rootRef" class="document-row-actions" @click.stop>
    <button
      ref="buttonRef"
      type="button"
      class="dots-btn"
      aria-haspopup="menu"
      :aria-expanded="menuOpen"
      aria-label="Row actions"
      @click="toggleMenu"
    >
      ⋮
    </button>

    <Teleport to="body">
      <div
        v-if="menuOpen"
        ref="dropdownPanelRef"
        class="dropdown-portal"
        role="menu"
        :style="dropdownStyle"
      >
        <button
          type="button"
          class="dropdown-item"
          role="menuitem"
          @click="onLeaveReview"
        >
          Edit
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.document-row-actions {
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
}

.dots-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 18px;
  line-height: 1;
  color: #6b7280;
  border-radius: 6px;
}

.dots-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border: none;
  background: none;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f9fafb;
}
</style>

<style>
.dropdown-portal {
  position: fixed;
  z-index: 9999;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}
</style>
