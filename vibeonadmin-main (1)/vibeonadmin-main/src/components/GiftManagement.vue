<script setup lang="ts">
import { ref, computed } from "vue";
import LabelValue from "./LabelValue.vue";
import IconText from "./IconText.vue";

interface Gift {
  id: string;
  giftId: string;
  giftName: string;
  quantity: number;
  totalCost?: number;
  totalValue?: number;
  dateSent?: string;
  dateReceived?: string;
  recipientName?: string;
  recipientId?: number;
  senderName?: string;
  senderId?: number;
}

interface Props {
  giftHistory: Gift[];
  receivedGifts: Gift[];
  giftBalance: number;
}

const props = defineProps<Props>();

const activeTab = ref<"sent" | "received">("sent");

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const calculateTotal = (
  gifts: Gift[],
  field: "quantity" | "totalCost" | "totalValue",
) => gifts.reduce((sum, gift) => sum + Number(gift[field] || 0), 0);

const giftEmojis: Record<string, string> = {
  rose: "🌹",
  heart: "❤️",
  diamond: "💎",
  crown: "👑",
  star: "⭐",
  fire: "🔥",
  rocket: "🚀",
  gift: "🎁",
};

const getGiftEmoji = (giftId: string): string => giftEmojis[giftId] || "🎁";

const tabs = [
  {
    label: "Gifts Sent",
    value: "sent",
    gifts: props.giftHistory,
    emptyText: "No gifts sent yet",
    personLabel: "Sent to",
    personKey: "recipientName",
    amountLabel: "Cost",
    amountKey: "totalCost",
    dateKey: "dateSent",
    cardClass: "",
  },
  {
    label: "Gifts Received",
    value: "received",
    gifts: props.receivedGifts,
    emptyText: "No gifts received yet",
    personLabel: "From",
    personKey: "senderName",
    amountLabel: "Value",
    amountKey: "totalValue",
    dateKey: "dateReceived",
    cardClass: "received",
  },
] as const;

const currentTab = computed(() =>
  tabs.find((tab) => tab.value === activeTab.value),
);

const stats = computed(() => [
  {
    label: "Gift Balance",
    value: props.giftBalance,
  },
  {
    label: "Total Sent",
    value: calculateTotal(props.giftHistory, "quantity"),
  },
  {
    label: "Total Received",
    value: calculateTotal(props.receivedGifts, "quantity"),
  },
  {
    label: "Spent on Gifts",
    value: `$${calculateTotal(props.giftHistory, "totalCost")}`,
  },
  {
    label: "Earned from Gifts",
    value: `$${calculateTotal(props.receivedGifts, "totalValue")}`,
    highlight: calculateTotal(props.receivedGifts, "totalValue") > 0,
  },
]);
</script>

<template>
  <div class="gift-management">
    <h3>Gift Management</h3>

    <div class="gift-stats">
      <LabelValue
        v-for="(stat, index) in stats"
        :key="index"
        :label="stat.label"
        :value="stat.value"
        :class="['stat', { highlight: stat.highlight }]"
      />
    </div>

    <div class="tabs">
      <IconText
        v-for="tab in tabs"
        :key="tab.value"
        :label="tab.label"
        classname="tab"
        :active="activeTab === tab.value"
        @click="activeTab = tab.value"
      />
    </div>

    <div v-if="currentTab" class="gifts-list">
      <div v-if="currentTab.gifts.length === 0" class="empty-state">
        <p>{{ currentTab.emptyText }}</p>
      </div>

      <div v-else class="gifts-grid">
        <div
          v-for="gift in currentTab.gifts"
          :key="gift.id"
          :class="['gift-card', currentTab.cardClass]"
        >
          <div class="gift-emoji">
            {{ getGiftEmoji(gift.giftId) }}
          </div>

          <div class="gift-details">
            <h4>{{ gift.giftName }}</h4>

            <p class="person">
              {{ currentTab.personLabel }}
              {{ gift[currentTab.personKey] }}
            </p>

            <p class="quantity">
              Quantity: <strong>{{ gift.quantity }}</strong>
            </p>

            <p class="amount">
              {{ currentTab.amountLabel }}:
              <strong>${{ gift[currentTab.amountKey] }}</strong>
            </p>

            <p class="date">
              {{ formatDate(gift[currentTab.dateKey] || "") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.gift-management {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.gift-management h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #000;
}

.gift-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat {
  display: block;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.stat.highlight {
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.stat :deep(.info-label) {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  font-weight: 600;
}

.stat :deep(.info-value) {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #000;
}

.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s;
  margin-bottom: -2px;
  border-bottom: 2px solid #e5e7eb;
}

.tab:hover {
  color: #374151;
}

.tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.gifts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.gift-card {
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
}

.gift-card:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.gift-card.received {
  background: #f0fdf4;
  border-color: #86efac;
}

.gift-emoji {
  font-size: 40px;
  margin-bottom: 12px;
}

.gift-details h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #000;
}

.person {
  margin: 4px 0;
  font-size: 12px;
  color: #6b7280;
}

.quantity,
.amount,
.value {
  margin: 8px 0;
  font-size: 13px;
  color: #374151;
}

.date {
  margin: 8px 0 0 0;
  font-size: 11px;
  color: #9ca3af;
}
</style>
