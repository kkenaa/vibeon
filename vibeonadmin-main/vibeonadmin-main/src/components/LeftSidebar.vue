<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import IconText from "./IconText.vue";
import IconArrowDown from "./icons/IconArrowDown.vue";
import IconAvatar from "./icons/IconAvatar.vue";
import { menuItems } from "../data/menuData";

const router = useRouter();
const expandedItems = ref<Set<string>>(new Set());
const activeMenuId = ref<string | null>(null);

const toggleExpand = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

const isExpanded = (id: string) => {
  return expandedItems.value.has(id);
};

const navigateToMenu = (id: string) => {
  activeMenuId.value = id;

  const routeMap: { [key: string]: string } = {
    dashboard: "/",
    members: "/members",
    users: "/users",
  };

  if (routeMap[id]) {
    router.push(routeMap[id]);
  }
};

const isActive = (id: string) => {
  return activeMenuId.value === id;
};
</script>

<template>
  <div class="left-sidebar">
    <div class="user-profile">
      <IconAvatar />
      <div class="text-info">
        <div class="light-text">Admin</div>
        <div class="dark-text">John Doe</div>
      </div>
    </div>
    <div class="menu-items">
      <div v-for="item in menuItems" :key="item.id">
        <div class="menu-item-wrapper">
          <IconText
            :label="item.label"
            :leftIcon="item.icon"
            :rightIcon="item.collapsible ? IconArrowDown : undefined"
            classname="menu-item"
            :active="isActive(item.id)"
            @click="
              () => {
                navigateToMenu(item.id);
                item.collapsible && toggleExpand(item.id);
              }
            "
          />

          <div
            v-if="item.collapsible && isExpanded(item.id) && item.children"
            class="submenu"
          >
            <button
              v-for="child in item.children"
              :key="child.id"
              class="submenu-item"
              :class="{ active: isActive(child.id) }"
              @click="navigateToMenu(child.id)"
            >
              <span class="submenu-label">{{ child.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left-sidebar {
  width: 15%;
  height: 100vh;
  background-color: #f3f3f3;
  color: #333;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  flex-shrink: 0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.text-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.light-text {
  color: #757575;
  text-transform: uppercase;
  font-size: 12px;
}

.dark-text {
  color: #000000;
  font-size: 14px;
  font-weight: 600;
}
.menu-items {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.menu-item-wrapper {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  border-radius: 4px;
  transition: background-color 0.2s;
  text-align: left;
  width: 100%;
  font-weight: 500;
}

.menu-item:hover {
  background-color: #ffffff;
  border-radius: 4px;
}

.menu-item.active {
  background-color: #ffffff;
  border-radius: 4px;
}

.menu-item :deep(svg) {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.submenu {
  display: flex;
  flex-direction: column;
  gap: 0;
  background-color: #ffffff;
}

.submenu-item {
  padding: 10px 16px 10px 48px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 13px;
  text-align: left;
  transition: background-color 0.2s;
  width: 100%;
}

.submenu-item:hover {
  background-color: #ffffff;
}

.submenu-item.active {
  background-color: #ffffff;
  font-weight: 500;
}
</style>
