<script setup lang="ts">
defineProps<{
  giftId: string;
  giftName: string;
  personLabel: string;
  personName?: string;
  quantity: number;
  amountLabel: string;
  amount?: number;
  date?: string;
  cardClass?: string;
}>();

const giftEmojis: Record<string, string> = {
  rose: "\uD83C\uDF39",
  heart: "\u2764\uFE0F",
  diamond: "\uD83D\uDC8E",
  crown: "\uD83D\uDC51",
  star: "\u2B50",
  fire: "\uD83D\uDD25",
  rocket: "\uD83D\uDE80",
  gift: "\uD83C\uDF81",
};

const getGiftEmoji = (giftId: string): string =>
  giftEmojis[giftId] || giftEmojis.gift;

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";

  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>

<template>
  <div :class="['gift-card', cardClass]">
    <div class="gift-emoji">
      {{ getGiftEmoji(giftId) }}
    </div>

    <div class="gift-details">
      <h4>{{ giftName }}</h4>

      <p class="person">{{ personLabel }} {{ personName }}</p>

      <p class="quantity">
        Quantity: <strong>{{ quantity }}</strong>
      </p>

      <p class="amount">
        {{ amountLabel }}:
        <strong>${{ amount }}</strong>
      </p>

      <p class="date">{{ formatDate(date) }}</p>
    </div>
  </div>
</template>

<style scoped>
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
.amount {
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
