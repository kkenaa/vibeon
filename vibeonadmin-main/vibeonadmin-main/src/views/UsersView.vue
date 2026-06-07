<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserProfileCard from "../components/UserProfileCard.vue";
import TransactionHistory from "../components/TransactionHistory.vue";
import GiftManagement from "../components/GiftManagement.vue";
import PayoutInfo from "../components/PayoutInfo.vue";
import LiveStreamHistory from "../components/LiveStreamHistory.vue";
import AccountVerification from "../components/AccountVerification.vue";
import GridComponent from "../components/GridComponent.vue";
import PaginationButton from "../components/PaginationButton.vue";
import usersData from "../data/users.json";
import IconText from "../components/IconText.vue";
import TextInput from "../components/TextInput.vue";
import { columns } from "../data/grid-data";
import type { User } from "@/modules/user/domain/entity/User";
import { useUserStore } from "../stores/user";

interface Tab {
  id: string;
  label: string;
}

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const listFromLocalJson = ref(false);

const usersList = computed((): User[] =>
  listFromLocalJson.value ? (usersData as User[]) : userStore.users,
);

const selectedUserId = ref<number | null>(null);
const searchQuery = ref<string>("");
const activeTab = ref<string>("1");
const currentPage = ref(1);
const pageSize = 5;
const sortKey = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

const columnSearches = ref<Record<string, string>>({});

const tabs: Tab[] = [
  { id: "1", label: "Transaction History" },
  { id: "2", label: "Gift Management" },
  { id: "3", label: "Earnings & Payouts" },
  { id: "4", label: "Live Stream History" },
  { id: "5", label: "Account Verification" },
];

const selectedUser = computed((): User | null => {
  if (!selectedUserId.value) return null;
  if (
    userStore.user &&
    userStore.user.id === selectedUserId.value &&
    userStore.activeUserId === selectedUserId.value
  ) {
    return userStore.user;
  }
  return usersList.value.find((u) => u.id === selectedUserId.value) ?? null;
});

const filteredData = computed(() => {
  let result = [...usersList.value];

  for (const [key, search] of Object.entries(columnSearches.value)) {
    if (search) {
      result = result.filter((row) =>
        String((row as any)[key])
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }
  }

  if (!searchQuery.value) return result;
  const query = searchQuery.value.toLowerCase();
  return result.filter(
    (u) =>
      u.name.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.state.toLowerCase().includes(query) ||
      u.status.toLowerCase().includes(query),
  );
});

const sortedData = computed(() => {
  const result = [...filteredData.value];

  if (!sortKey.value) return result;

  return result.sort((a, b) => {
    const aVal = (a as any)[sortKey.value];
    const bVal = (b as any)[sortKey.value];

    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedData.value.slice(start, start + pageSize);
});

function selectUser(userId: number | string) {
  const normalizedId = Number(userId);
  if (Number.isNaN(normalizedId)) return;
  selectedUserId.value = normalizedId;
  activeTab.value = "1";
  if (!listFromLocalJson.value) {
    void userStore.loadUser(normalizedId);
  }
}

const handleGridSelect = (row: User) => {
  if (!row) return;
  void router.push({ name: "user-detail", params: { userId: row.id } });
};

const isActive = (tabId: string): boolean => {
  return activeTab.value === tabId;
};

const setActive = (tabId: string) => {
  activeTab.value = tabId;
};

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedData.value.length / pageSize)),
);
const visiblePages = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1),
);
const paginationButtons = computed(() => [
  {
    label: "« First",
    page: 1,
    isActive: false,
    disabled: currentPage.value === 1,
  },
  {
    label: "‹ Prev",
    page: Math.max(1, currentPage.value - 1),
    isActive: false,
    disabled: currentPage.value === 1,
  },

  ...visiblePages.value.map((page) => ({
    label: page.toString(),
    page,
    isActive: currentPage.value === page,
    disabled: false,
  })),

  {
    label: "Next ›",
    page: Math.min(totalPages.value, currentPage.value + 1),
    isActive: false,
    disabled: currentPage.value === totalPages.value,
  },
  {
    label: "Last »",
    page: totalPages.value,
    isActive: false,
    disabled: currentPage.value === totalPages.value,
  },
]);

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value;
  }
});

watch(
  () => route.params.userId,
  (routeUserId) => {
    const normalizedRouteUserId = Array.isArray(routeUserId)
      ? routeUserId[0]
      : routeUserId;

    if (!normalizedRouteUserId) {
      selectedUserId.value = null;
      return;
    }

    selectUser(normalizedRouteUserId);
  },
  { immediate: true },
);

onMounted(() => {
  void (async () => {
    await userStore.loadUsers(1, 500);
    if (userStore.error) {
      listFromLocalJson.value = true;
    }
  })();
});
</script>
<template>
  <div class="users-container">
    <div class="header-section">
      <h1>👥 Users Management</h1>
      <p class="subtitle">User Management System</p>
    </div>

    <TextInput
      v-if="!selectedUser"
      v-model="searchQuery"
      :searchQuery="searchQuery"
      placeholder="Search users..."
      inputClass="search-users"
    />
    <div class="main-content">
      <div class="users-list-container" v-if="!selectedUser">
        <div class="users-list">
          <GridComponent
            :columns="columns"
            :data="pagedData"
            :columnSearches="columnSearches"
            @update:columnSearches="columnSearches = $event"
            @sort="handleSort"
            @row-select="handleGridSelect"
          />
          <div class="pagination-container">
            <PaginationButton
              v-for="button in paginationButtons"
              :key="button.label"
              :label="button.label"
              :isActive="button.isActive"
              :page="button.page"
              :disabled="button.disabled"
              @update:page="(page) => (currentPage = page)"
            />
          </div>
        </div>
      </div>

      <div class="user-details" v-else>
        <div class="user-content">
          <UserProfileCard :user="selectedUser" />

          <div class="user-tabs">
            <div class="tabs-content">
              <IconText
                v-for="tab in tabs"
                :key="tab.id"
                :class="['tab-item', { active: isActive(tab.id) }]"
                @click="setActive(tab.id)"
                :label="tab.label"
              />
            </div>
          </div>

          <div class="tab-content">
            <TransactionHistory
              v-if="activeTab === '1'"
              :transactions="selectedUser.transactionHistory"
              :totalSpent="selectedUser.totalSpentOnCoins"
            />

            <GiftManagement
              v-if="activeTab === '2'"
              :giftHistory="selectedUser.giftHistory"
              :receivedGifts="selectedUser.receivedGifts"
              :giftBalance="selectedUser.giftBalance"
            />

            <PayoutInfo
              v-if="activeTab === '3'"
              :isContentCreator="selectedUser.isContentCreator"
              :earnings="selectedUser.earnings"
              :payoutInfo="selectedUser.payoutInfo"
              :payoutHistory="selectedUser.payoutHistory"
            />

            <LiveStreamHistory
              v-if="activeTab === '4'"
              :liveStreamHistory="selectedUser.liveStreamHistory"
              :isLive="selectedUser.isLive"
            />

            <AccountVerification
              v-if="activeTab === '5'"
              :userId="selectedUser.id"
              :userName="selectedUser.name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background: #f3f4f6;
}

.search-users {
  width: 20%;
  padding: 16px 0;
}
.header-section {
  margin-bottom: 24px;
  text-align: center;
}

.header-section h1 {
  margin: 0;
  font-size: 28px;
  color: #000;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.api-hint {
  margin: 0 auto 12px;
  max-width: 42rem;
  padding: 10px 14px;
  font-size: 14px;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
}

.api-hint-warning {
  color: #92400e;
  background: #fffbeb;
  border-color: #fcd34d;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.users-list-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.users-list::-webkit-scrollbar {
  width: 6px;
}

.users-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.users-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.users-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.user-item {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.user-item:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.user-item.active {
  background: #dbeafe;
  border-color: #3b82f6;
}

.user-details {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-y: auto;
  margin-bottom: 40px;
}

.user-details::-webkit-scrollbar {
  width: 6px;
}

.user-details::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.user-details::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.user-details::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #9ca3af;
}

.placeholder-icon {
  font-size: 60px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.user-content {
  display: flex;
  flex-direction: column;
}

.user-tabs {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 24px 0;
}

.tabs-content {
  display: flex;
  gap: 5px;
  padding: 3px;
  background-color: #f0f0f0;
  border-radius: 4px;
  flex-wrap: wrap;
}

.tab-item {
  border: none;
  padding: 10px 20px;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 700;
  color: #6b7280;
  font-size: 13px;
}

.tab-item:hover {
  background-color: #e5e7eb;
}

.tab-item.active {
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-label {
  white-space: nowrap;
}

.tab-content {
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 250px 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .users-list-container {
    max-height: 200px;
  }

  .users-container {
    padding: 12px;
  }

  .header-section h1 {
    font-size: 22px;
  }

  .tabs-content {
    flex-direction: column;
    width: 100%;
  }

  .tab-item {
    padding: 12px 16px;
    width: 100%;
    text-align: left;
  }
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1.75rem;
  gap: 0.5rem;
}
</style>
