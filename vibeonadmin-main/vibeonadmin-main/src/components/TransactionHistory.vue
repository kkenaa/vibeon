<script setup lang="ts">
import { computed } from "vue";
import LabelValue from "./LabelValue.vue";

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  coins?: number;
  giftId?: string;
  giftName?: string;
  recipientId?: number;
  status: string;
  description: string;
}

interface Props {
  transactions: Transaction[];
  totalSpent: number;
}

const props = defineProps<Props>();

const summaryItems = computed(() => [
  {
    label: "Total Spent on Coins:",
    value: `$${props.totalSpent}`,
  },
  {
    label: "Total Transactions:",
    value: props.transactions.length,
  },
]);

const getTypeColor = (type: string): string => {
  switch (type) {
    case "coin_purchase":
      return "#3b82f6";
    case "gift_sent":
      return "#ec4899";
    case "gift_received":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case "coin_purchase":
      return "Coin Purchase";
    case "gift_sent":
      return "Gift Sent";
    case "gift_received":
      return "Gift Received";
    default:
      return type;
  }
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <div class="transaction-history">
    <h3>Transaction History</h3>

    <div class="summary">
      <LabelValue
        v-for="(item, index) in summaryItems"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </div>

    <div v-if="transactions.length === 0" class="empty-state">
      <p>No transactions yet</p>
    </div>

    <div v-else class="transactions-list">
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-header">
          <div class="transaction-info">
            <span
              class="transaction-type"
              :style="{ backgroundColor: getTypeColor(transaction.type) }"
            >
              {{ getTypeLabel(transaction.type) }}
            </span>
            <span class="transaction-desc">{{ transaction.description }}</span>
          </div>
          <div class="transaction-amount">
            <span v-if="transaction.type === 'coin_purchase'" class="coins">
              +{{ transaction.coins }} coins
            </span>
            <span v-else-if="transaction.type === 'gift_sent'" class="spent">
              -${{ transaction.amount }}
            </span>
            <span v-else class="earned"> +${{ transaction.amount }} </span>
          </div>
        </div>
        <div class="transaction-footer">
          <span class="date">{{ formatDate(transaction.date) }}</span>
          <span :class="['status', transaction.status.toLowerCase()]">
            {{ transaction.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-history {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.transaction-history h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #000;
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.summary :deep(.info-item) {
  flex-direction: column;
  align-items: start;
  gap: 4px;
}

.summary :deep(.info-label) {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 0;
}

.summary :deep(.info-value) {
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.transaction-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.transaction-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.transaction-type {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.transaction-desc {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.transaction-amount {
  font-weight: 700;
  font-size: 14px;
}

.coins {
  color: #3b82f6;
}

.spent {
  color: #ef4444;
}

.earned {
  color: #10b981;
}

.transaction-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.date {
  color: #9ca3af;
}

.status {
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.completed {
  background: #d1fae5;
  color: #065f46;
}

.status.pending {
  background: #fef3c7;
  color: #b45309;
}

.status.failed {
  background: #fee2e2;
  color: #991b1b;
}
</style>
