<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import GridComponent from "../components/GridComponent.vue";
import FilterForm from "../components/FilterForm.vue";
import ViewRow from "../components/ViewRow.vue";
import SideBar from "../components/SideBar.vue";
import ActiveFilters from "../components/ActiveFilter.vue";
import users from "../data/users.json";
import { columns } from "../data/grid-data";
import PaginationButton from "../components/PaginationButton.vue";
import IconFilter from "../components/icons/IconFilter.vue";
import { editingRowStore } from "../stores/editingRowStore";

const router = useRouter();
const data = ref(users);

const currentPage = ref(1);
const pageSize = 5;

const sortKey = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

const columnSearches = ref<Record<string, string>>({});
const sidebarContent = ref("");

const showSidebar = ref(false);
const editingRow = ref<any>(null);
const editingIndex = ref<number>(-1);

interface FilterData {
  name?: string;
  email?: string;
  date?: string;
  details: {
    phone?: string;
    address?: string;
  };
}

const activeFilters = ref<FilterData>({
  details: {},
});

const matchesFilters = (row: any): boolean => {
  if (
    activeFilters.value.name &&
    !String(row.name)
      .toLowerCase()
      .includes(activeFilters.value.name.toLowerCase())
  ) {
    return false;
  }

  if (
    activeFilters.value.email &&
    !String(row.email)
      .toLowerCase()
      .includes(activeFilters.value.email.toLowerCase())
  ) {
    return false;
  }

  if (activeFilters.value.date && row.date !== activeFilters.value.date) {
    return false;
  }

  if (row.details && Array.isArray(row.details)) {
    const matchesDetailsFilter = row.details.some((detail: any) => {
      let phoneMatch = true;
      let addressMatch = true;

      if (activeFilters.value.details?.phone) {
        phoneMatch = String(detail.phone)
          .toLowerCase()
          .includes(activeFilters.value.details.phone.toLowerCase());
      }

      if (activeFilters.value.details?.address) {
        addressMatch = String(detail.address)
          .toLowerCase()
          .includes(activeFilters.value.details.address.toLowerCase());
      }

      return phoneMatch && addressMatch;
    });

    if (
      activeFilters.value.details?.phone ||
      activeFilters.value.details?.address
    ) {
      if (!matchesDetailsFilter) {
        return false;
      }
    }
  }

  return true;
};

const filteredData = computed(() => {
  let result = [...data.value];

  for (const [key, search] of Object.entries(columnSearches.value)) {
    if (search) {
      result = result.filter((row) =>
        String((row as any)[key])
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }
  }

  result = result.filter((row) => matchesFilters(row));

  return result;
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

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedData.value.length / pageSize)),
);

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedData.value.slice(start, start + pageSize);
});

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

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value;
  }
});

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const handleEdit = (row: any, index: number) => {
  editingRowStore.setEditingRow(row, index);
  router.push({ name: "edit-form", params: { name: row.name } });
};

const handleView = (row: any, index: number) => {
  editingRow.value = row;
  editingIndex.value = index;
  sidebarContent.value = "openView";
  showSidebar.value = true;
};

const openFilter = () => {
  sidebarContent.value = "openFilter";
  showSidebar.value = true;
};

const applyFilters = (filters: FilterData) => {
  activeFilters.value = filters;
  showSidebar.value = false;
  currentPage.value = 1;
};

const clearAllFilters = () => {
  activeFilters.value = {
    details: {},
  };
  currentPage.value = 1;
};

const removeFilter = (field: string) => {
  if (field === "phone" || field === "address") {
    if (activeFilters.value.details) {
      delete activeFilters.value.details[
        field as keyof typeof activeFilters.value.details
      ];
    }
  } else {
    delete activeFilters.value[field as keyof FilterData];
  }
  currentPage.value = 1;
};

const closeSidebar = () => {
  showSidebar.value = false;
};
</script>

<template>
  <div class="grid-view">
    <div class="header-section">
      <h1>VibeOnAdmin</h1>
    </div>
    <div class="filter-section">
      <button @click="openFilter" class="filter-btn">
        <IconFilter />
        Filter
      </button>
    </div>

    <div class="grid-container">
      <ActiveFilters
        :filters="activeFilters"
        :columns="columns"
        @clear="clearAllFilters"
        @removeFilter="removeFilter"
      />

      <div class="grid-list-container">
        <GridComponent
          :columns="columns"
          :data="pagedData"
          :columnSearches="columnSearches"
          @update:columnSearches="columnSearches = $event"
          @edit="handleEdit"
          @view="handleView"
          @sort="handleSort"
        />
      </div>
    </div>

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

    <SideBar :is-open="showSidebar" @close="closeSidebar">
      <ViewRow
        v-if="sidebarContent === 'openView'"
        :key="'view'"
        :columns="columns"
        :row="editingRow"
      />

      <FilterForm
        v-if="sidebarContent === 'openFilter'"
        :key="'filter'"
        :columns="columns"
        :activeFilters="activeFilters"
        @apply="applyFilters"
        @cancel="closeSidebar"
      />
    </SideBar>
  </div>
</template>

<style scoped>
.grid-view {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #f3f4f6;
}

.header-section {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
.filter-section {
  display: flex;
  justify-content: start;
  padding: 8px;
}
h1 {
  color: #000000;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 8px 16px;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.filter-btn:hover {
  background-color: #bdbdbd;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1.75rem;
  gap: 0.5rem;
}

.grid-list-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.grid-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
</style>
