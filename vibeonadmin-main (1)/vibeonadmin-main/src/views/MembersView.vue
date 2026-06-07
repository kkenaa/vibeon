<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import GridComponent from "../components/GridComponent.vue";
import ToggleButton from "../components/ToggleButton.vue";
import TextInput from "../components/TextInput.vue";
import ActionButton from "../components/ActionButton.vue";
import type { ButtonConfig } from "../components/ActionButton.vue";
import AvatarName from "@/components/AvatarName.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import membersData from "../data/members.json";
import LabelValue from "@/components/LabelValue.vue";
import type { Column } from "@/types";
import IconText from "@/components/IconText.vue";
import type { Member } from "@/modules/members/domain/entity/Member";
import type { MemberRights } from "@/modules/members/domain/entity/MemberRights";
import {
  createEmptyMemberRights,
  MEMBER_RIGHT_KEYS,
} from "@/modules/members/domain/entity/MemberRights";
import { useMembersStore } from "@/stores/members";

const membersStore = useMembersStore();
const listFromLocalJson = ref(false);
const localMembers = ref<Member[] | null>(null);

const membersList = computed((): Member[] => {
  if (listFromLocalJson.value && localMembers.value) {
    return localMembers.value;
  }
  return membersStore.members;
});
const selectedMemberId = ref<number | null>(null);

const selectedMember = computed((): Member | null => {
  if (!selectedMemberId.value) return null;
  if (
    !listFromLocalJson.value &&
    membersStore.member &&
    membersStore.member.id === selectedMemberId.value &&
    membersStore.activeMemberId === selectedMemberId.value
  ) {
    return membersStore.member;
  }
  return membersList.value.find((m) => m.id === selectedMemberId.value) ?? null;
});

function selectMember(memberId: number) {
  selectedMemberId.value = memberId;
  if (!listFromLocalJson.value) {
    void membersStore.loadMember(memberId);
  }
}

const sortKey = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const columnSearches = ref<Record<string, string>>({});

const formatMemberDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const memberColumns: Column[] = [
  {
    key: "member",
    label: "Member",
    type: "component",
    component: AvatarName,

    componentProps: (row: any) => ({
      user: {
        name: row.name,
        avatar: row.avatar,
        verified: row.verified,
        isLive: row.isLive,
      },
    }),
  },
  {
    key: "role",
    label: "Role",
    type: "text",
    sortable: true,
  },
  {
    key: "department",
    label: "Department",
    type: "text",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    type: "text",
  },
  {
    key: "joinDate",
    label: "Joined",
    type: "date",
    sortable: true,
    formatter: formatMemberDate,
  },
  {
    key: "status",
    label: "Status",
    type: "component",
    component: StatusBadge,
    componentProps: (row: any) => ({
      user: {
        status: row.status,
      },
    }),
  },
];

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const filteredMembers = computed(() => {
  let result = [...membersList.value];
  for (const [key, search] of Object.entries(columnSearches.value)) {
    if (search) {
      result = result.filter((row) =>
        String((row as Member)[key as keyof Member])
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }
  }
  return result;
});

const sortedMembers = computed(() => {
  const result = [...filteredMembers.value];
  if (!sortKey.value) return result;
  return result.sort((a, b) => {
    const aVal = (a as Member)[sortKey.value as keyof Member];
    const bVal = (b as Member)[sortKey.value as keyof Member];
    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

const handleMemberGridSelect = (row: Member) => {
  selectMember(row.id);
};

const backToMembers = () => {
  selectedMemberId.value = null;
};

const updateMember = (updatedMember: Member) => {
  if (listFromLocalJson.value && localMembers.value) {
    localMembers.value = localMembers.value.map((m) =>
      m.id === updatedMember.id ? updatedMember : m,
    );
    return;
  }
  membersStore.replaceMember(updatedMember);
  void membersStore.saveMember({
    id: updatedMember.id,
    name: updatedMember.name,
    email: updatedMember.email,
    loginEmail: updatedMember.loginEmail,
    role: updatedMember.role,
    department: updatedMember.department,
    status: updatedMember.status,
    rights: updatedMember.rights,
  });
};

const rightsLabels: Record<keyof MemberRights, string> = {
  canEdit: "Can Edit",
  canDelete: "Can Delete",
  canManageUsers: "Can Manage Users",
  canViewAnalytics: "Can View Analytics",
  canManageMembers: "Can Manage Members",
  canApproveTransactions: "Can Approve Transactions",
  canViewReports: "Can View Reports",
  canManagePayments: "Can Manage Payments",
};

const localRights = ref<MemberRights>(createEmptyMemberRights());

const rightsActiveCount = computed(
  () => Object.values(localRights.value).filter(Boolean).length,
);

const rightsTotalCount = computed(() => Object.keys(localRights.value).length);

const updateMemberRight = (right: keyof MemberRights, value: boolean) => {
  const m = selectedMember.value;
  if (!m) return;
  localRights.value = { ...localRights.value, [right]: value };
  updateMember({
    ...m,
    rights: localRights.value,
  });
};

const isEditingLoginEmail = ref(false);
const editedLoginEmail = ref("");
const loginEmailError = ref("");

watch(
  () => selectedMember.value?.id,
  () => {
    const m = selectedMember.value;
    if (!m) return;
    editedLoginEmail.value = m.loginEmail;
    isEditingLoginEmail.value = false;
    loginEmailError.value = "";
    localRights.value = { ...m.rights };
  },
);

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const startEditLoginEmail = () => {
  const m = selectedMember.value;
  if (!m) return;
  isEditingLoginEmail.value = true;
  editedLoginEmail.value = m.loginEmail;
  loginEmailError.value = "";
};

const cancelEditLoginEmail = () => {
  const m = selectedMember.value;
  if (!m) return;
  isEditingLoginEmail.value = false;
  editedLoginEmail.value = m.loginEmail;
  loginEmailError.value = "";
};

const saveLoginEmail = () => {
  const m = selectedMember.value;
  if (!m) return;

  if (!editedLoginEmail.value.trim()) {
    loginEmailError.value = "Login email cannot be empty";
    return;
  }

  if (!isValidEmail(editedLoginEmail.value)) {
    loginEmailError.value = "Please enter a valid email address";
    return;
  }

  updateMember({
    ...m,
    loginEmail: editedLoginEmail.value.trim(),
  });
  isEditingLoginEmail.value = false;
  loginEmailError.value = "";
};

const loginEmailChangeButtons = computed<ButtonConfig[]>(() => [
  { name: "Change Email", variant: "secondary", onClick: startEditLoginEmail },
]);

const loginEmailEditButtons = computed<ButtonConfig[]>(() => [
  { name: "Save Changes", variant: "unban", onClick: saveLoginEmail },
  { name: "Cancel", variant: "secondary", onClick: cancelEditLoginEmail },
]);

onMounted(() => {
  void (async () => {
    await membersStore.loadMembers(1, 500);
    if (membersStore.error) {
      listFromLocalJson.value = true;
      localMembers.value = [...(membersData as Member[])];
    }
  })();
});
</script>

<template>
  <div class="members-container">
    <div class="header-section">
      <h1>👥 Members Management</h1>
      <p class="subtitle">Manage member roles, rights, and login credentials</p>
    </div>

    <div v-if="!selectedMember" class="members-list-section">
      <h3>Select member</h3>
      <div class="members-grid-card">
        <GridComponent
          :columns="memberColumns"
          :data="sortedMembers"
          :column-searches="columnSearches"
          :sort-key="sortKey"
          :sort-order="sortOrder"
          @update:column-searches="columnSearches = $event"
          @sort="handleSort"
          @row-select="handleMemberGridSelect"
        />
      </div>
    </div>

    <div v-else class="member-management">
      <div class="management-header">
        <IconText
          label="Back to Members"
          :leftIcon="IconArrowLeft"
          class="back-button"
          @click="backToMembers"
        />
      </div>
      <div class="management-content">
        <div class="member-rights-card">
          <div class="member-header">
            <img
              :src="selectedMember.avatar"
              :alt="selectedMember.name"
              class="rights-member-avatar"
            />

            <div class="rights-member-info">
              <h3>{{ selectedMember.name }}</h3>
              <p class="rights-role">
                {{ selectedMember.role }} • {{ selectedMember.department }}
              </p>
              <p class="rights-email">{{ selectedMember.email }}</p>
            </div>

            <div class="rights-summary">
              <div class="rights-count">
                {{ rightsActiveCount }} / {{ rightsTotalCount }}
              </div>
              <div class="rights-summary-label">Rights Active</div>
            </div>
          </div>

          <div class="rights-grid">
            <div
              v-for="key in MEMBER_RIGHT_KEYS"
              :key="key"
              class="right-item"
            >
              <ToggleButton
                :label="rightsLabels[key]"
                :model-value="localRights[key]"
                @update:model-value="
                  (newValue) => updateMemberRight(key, newValue)
                "
              />
            </div>
          </div>
        </div>

        <div class="login-email-card">
          <h3>Login Email Configuration</h3>

          <div class="email-section">
            <div v-if="!isEditingLoginEmail" class="email-display">
              <div>
                <span class="login-email-label">Login Email</span>
                <div class="email-box">
                  <span class="email-value">{{
                    selectedMember.loginEmail
                  }}</span>
                </div>
              </div>
              <ActionButton :buttons="loginEmailChangeButtons" />
            </div>

            <div v-else class="email-edit">
              <label class="login-email-label">New Login Email:</label>
              <TextInput
                v-model="editedLoginEmail"
                input-type="email"
                placeholder="Enter new login email"
                @enter="saveLoginEmail"
                @escape="cancelEditLoginEmail"
              />
              <div v-if="loginEmailError" class="login-email-error">
                {{ loginEmailError }}
              </div>
              <ActionButton :buttons="loginEmailEditButtons" />
            </div>
          </div>

          <div class="info-box">
            <span class="info-icon">ℹ️</span>
            <LabelValue
              label="This is the email address the member will use to log in to the system.
              Make sure to provide a valid email address."
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.members-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #f3f4f6;
  min-height: 100vh;
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

.members-list-section {
  margin-bottom: 24px;
}

.members-list-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #000;
}

.members-grid-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.member-management {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.management-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  background: #ffffff;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.management-header .member-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

.management-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.member-rights-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.member-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.rights-member-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dbeafe;
}

.rights-member-info {
  flex: 1;
}

.rights-member-info h3 {
  margin: 0;
  font-size: 18px;
  color: #000;
}

.rights-role {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.rights-email {
  margin: 4px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.rights-summary {
  text-align: center;
  padding: 12px 16px;
  background: #dbeafe;
  border-radius: 8px;
}

.rights-count {
  font-size: 20px;
  font-weight: 700;
  color: #0c4a6e;
}

.rights-summary-label {
  font-size: 11px;
  color: #0284c7;
  margin-top: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.rights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.right-item {
  padding: 12px;
  border-radius: 8px;
}

.no-selection-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  color: #9ca3af;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-icon {
  font-size: 60px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-selection-message p {
  font-size: 16px;
  text-align: center;
  max-width: 500px;
}

@media (max-width: 1024px) {
  .member-management {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .members-container {
    padding: 12px;
  }

  .header-section h1 {
    font-size: 22px;
  }
}

.tab-item.active,
.tab-item:hover {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-item .item-inner span {
  font-weight: 700;
  color: darkgray;
}

.login-email-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.login-email-card h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #000;
}

.login-email-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.email-section {
  margin-bottom: 20px;
  border-radius: 8px;
}

.email-display {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.email-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  padding: 10px 12px;
  background: white;
  border: 1px solid #dbeafe;
  border-radius: 6px;
}

.email-value {
  font-size: 14px;
  color: #0c4a6e;
  font-weight: 600;
  word-break: break-all;
}

.email-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
}

.login-email-error {
  padding: 10px 12px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
  font-size: 13px;
  margin: -6px 0 0 0;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 6px;
}

.info-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.info-text {
  font-size: 13px;
  color: #b45309;
  line-height: 1.5;
}
</style>
