<script setup lang="ts">
import { computed } from "vue";
import LabelValue from "./LabelValue.vue";
import ActionButton from "./ActionButton.vue";
import type { ButtonConfig } from "./ActionButton.vue";

interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  isContentCreator: boolean;
  bio: string;
  followers: number;
  following: number;
  coinBalance: number;
  giftBalance: number;
  totalSpentOnCoins: number;
  releaseDate: string;
  isLive: boolean;
  banStatus: string;
  email: string;
}

interface Props {
  user: User;
}

const props = defineProps<Props>();

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

const statsItems = computed(() => [
  {
    label: "Followers",
    value: formatNumber(props.user.followers),
  },
  {
    label: "Following",
    value: formatNumber(props.user.following),
  },
  {
    label: "Coins",
    value: props.user.coinBalance,
  },
  {
    label: "Gifts",
    value: props.user.giftBalance,
  },
]);

const infoItems = computed(() => [
  {
    label: "Total Spent on Coins:",
    value: `$${props.user.totalSpentOnCoins}`,
    className: [] as string[],
  },
  {
    label: "Member Since:",
    value: formatDate(props.user.releaseDate),
    className: [] as string[],
  },
  {
    label: "Email:",
    value: props.user.email,
    className: [] as string[],
  },
  {
    label: "Status:",
    value: props.user.banStatus,
    className: ["status-badge", props.user.banStatus.toLowerCase()],
  },
]);

const banButtons = computed<ButtonConfig[]>(() => {
  if (props.user.banStatus.toLowerCase() === "active") {
    return [
      {
        name: "Ban User",
        onClick: () => alert(`User ${props.user.name} has been banned.`),
        variant: "ban",
      },
    ];
  } else {
    return [
      {
        name: "Unban User",
        onClick: () => alert(`User ${props.user.name} has been unbanned.`),
        variant: "unban",
      },
    ];
  }
});
</script>

<template>
  <div class="user-profile-card">
    <div class="profile-header">
      <img :src="user.avatar" :alt="user.name" class="avatar" />
      <div class="user-info">
        <div class="name-section">
          <h2>{{ user.name }}</h2>
          <span v-if="user.verified" class="verified-badge" title="Verified"
            >✓</span
          >
        </div>
        <p class="username">{{ user.username }}</p>
        <p class="bio">{{ user.bio }}</p>
        <div class="status-badges">
          <span v-if="user.isContentCreator" class="creator-badge"
            >Content Creator</span
          >
          <span v-if="user.isLive" class="live-badge">🔴 LIVE</span>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <LabelValue
        v-for="(item, index) in statsItems"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </div>

    <div class="info-grid">
      <LabelValue
        v-for="(item, index) in infoItems"
        :key="index"
        :label="item.label"
        :value="item.value"
        :className="item.className.length > 0 ? item.className : undefined"
      />
    </div>

    <div class="admin-actions">
      <ActionButton :buttons="banButtons" />
    </div>
  </div>
</template>

<style scoped>
.user-profile-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.user-info {
  flex: 1;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.name-section h2 {
  margin: 0;
  font-size: 24px;
  color: #000;
}

.verified-badge {
  background: #1765d3;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.username {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.bio {
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 14px;
}

.status-badges {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.creator-badge,
.live-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.creator-badge {
  background: #dbeafe;
  color: #1e40af;
}

.live-badge {
  background: #fee2e2;
  color: #991b1b;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.stats-grid :deep(.info-item) {
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 8px;
}

.stats-grid :deep(.info-label) {
  font-size: 12px;
  color: #6b7280;
  order: 2;
}

.stats-grid :deep(.info-value) {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  order: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
}

.admin-actions {
  display: flex;
  gap: 12px;
}
</style>
