<script setup lang="ts">
import { computed, ref } from "vue";
import GiftList from "./gifts/GiftList.vue";
import GiftStats from "./gifts/GiftStats.vue";
import GiftTabs from "./gifts/GiftTabs.vue";
import type { Gift, GiftTab, GiftTabValue } from "./gifts/types";

interface Props {
  giftHistory: Gift[];
  receivedGifts: Gift[];
  giftBalance: number;
}

const props = defineProps<Props>();

const activeTab = ref<GiftTabValue>("sent");

const calculateTotal = (
  gifts: Gift[],
  field: "quantity" | "totalCost" | "totalValue",
) => gifts.reduce((sum, gift) => sum + Number(gift[field] || 0), 0);

const tabs = computed<GiftTab[]>(() => [
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
]);

const currentTab = computed(() =>
  tabs.value.find((tab) => tab.value === activeTab.value),
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

    <GiftStats :stats="stats" />

    <GiftTabs v-model:active-tab="activeTab" :tabs="tabs" />

    <GiftList v-if="currentTab" :tab="currentTab" />
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
</style>
