<script setup lang="ts">
import { computed } from "vue";
import LabelValue from "./LabelValue.vue";

interface Earnings {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pendingBalance: number;
}

interface PayoutInfo {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  status: string;
  lastUpdated: string;
}

interface PayoutHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
}

interface Props {
  isContentCreator: boolean;
  earnings: Earnings | null;
  payoutInfo: PayoutInfo | null;
  payoutHistory: PayoutHistory[];
}

const props = defineProps<Props>();

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getMethodLabel = (method: string): string => {
  const methods: Record<string, string> = {
    bank_transfer: "Bank Transfer",
    wallet: "Digital Wallet",
    check: "Check",
    paypal: "PayPal",
  };
  return methods[method] || method;
};

const formatAmount = (amount: number): string => {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2 });
};

const earningsStats = computed(() => {
  if (!props.earnings) return [];

  return [
    {
      label: "Total Earnings",
      value: `$${formatAmount(props.earnings.totalEarnings)}`,
    },
    {
      label: "This Month",
      value: `$${formatAmount(props.earnings.thisMonth)}`,
    },
    {
      label: "Last Month",
      value: `$${formatAmount(props.earnings.lastMonth)}`,
    },
    {
      label: "Pending Balance",
      value: `$${formatAmount(props.earnings.pendingBalance)}`,
      highlight: true,
    },
  ];
});

const detailRows = computed(() => {
  if (!props.payoutInfo) return [];

  return [
    {
      label: "Bank Name",
      value: props.payoutInfo.bankName,
    },
    {
      label: "Account Holder",
      value: props.payoutInfo.accountHolder,
    },
    {
      label: "Account Number",
      value: props.payoutInfo.accountNumber,
    },
    {
      label: "Status",
      value: props.payoutInfo.status,
      highlight: props.payoutInfo.status.toLowerCase() === "pending",
    },
    {
      label: "Last Updated",
      value: formatDate(props.payoutInfo.lastUpdated),
    },
  ];
});
</script>
<template>
  <div v-if="!isContentCreator" class="not-creator">
    <p>💡 Become a Content Creator to unlock earning features and payouts</p>
  </div>

  <div v-else class="payout-section">
    <h3>Earnings & Payouts</h3>

    <div v-if="earnings" class="earnings-overview">
      <LabelValue
        v-for="(stat, index) in earningsStats"
        :key="index"
        :label="stat.label"
        :value="stat.value"
        :class="['earnings-stat', { highlight: stat.highlight }]"
      />
    </div>

    <div v-if="payoutInfo" class="payout-info">
      <h4>Payout Information</h4>

      <div class="payout-details">
        <LabelValue
          v-for="(row, index) in detailRows"
          :key="index"
          :label="row.label"
          :value="row.value"
          class="detail-row"
        />
      </div>

      <button class="edit-btn">Edit Payout Information</button>
    </div>

    <div class="payout-history">
      <h4>Payout History</h4>

      <div v-if="payoutHistory.length === 0" class="empty-state">
        <p>No payouts yet</p>
      </div>

      <div v-else class="history-list">
        <div
          v-for="payout in payoutHistory"
          :key="payout.id"
          class="payout-item"
        >
          <div class="payout-main">
            <div class="payout-info-col">
              <span class="amount">${{ formatAmount(payout.amount) }}</span>
              <span class="method">{{ getMethodLabel(payout.method) }}</span>
            </div>

            <div class="payout-date-col">
              <span class="date">{{ formatDate(payout.date) }}</span>
              <span :class="['status', payout.status.toLowerCase()]">
                {{ payout.status }}
              </span>
            </div>

            <div class="transaction-id">
              {{ payout.transactionId }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-creator {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  color: #b45309;
  font-weight: 500;
}

.payout-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.payout-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #000;
}

.earnings-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  border-radius: 8px;
}

.earnings-stat {
  text-align: center;
  flex-direction: column;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.earnings-stat.highlight {
  background: #fef3c7;
  padding: 12px;
  border-radius: 6px;
}

.earnings-stat :deep(.info-label) {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.earnings-stat :deep(.info-value) {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}

.payout-info {
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.payout-info h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #000;
  font-weight: 600;
}

.payout-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #dbeafe;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row :deep(.info-label) {
  font-weight: 600;
  color: #676a70;
  font-size: 13px;
}

.detail-row :deep(.info-value) {
  color: #1f2937;
  font-size: 13px;
}

.status {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.verified {
  background: #d1fae5;
  color: #065f46;
}

.status.pending {
  background: #fef3c7;
  color: #b45309;
}

.status.completed {
  background: #d1fae5;
  color: #065f46;
}

.status.failed {
  background: #fee2e2;
  color: #991b1b;
}

.edit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #2563eb;
}

.payout-history {
  background: white;
  border-radius: 8px;
}

.payout-history h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #000;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: #9ca3af;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payout-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fafbfc;
}

.payout-main {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: center;
}

.payout-info-col {
  display: flex;
  flex-direction: column;
}

.amount {
  font-weight: 700;
  font-size: 16px;
  color: #000;
}

.method {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.payout-date-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.date {
  font-size: 13px;
  color: #6b7280;
}

.transaction-id {
  font-size: 11px;
  color: #9ca3af;
  font-family: monospace;
  text-align: right;
}

@media (max-width: 768px) {
  .payout-main {
    grid-template-columns: 1fr;
  }

  .payout-date-col {
    align-items: flex-start;
  }
}
</style>
