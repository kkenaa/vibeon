<script setup lang="ts">
import GiftCard from "./GiftCard.vue";
import type { GiftTab } from "./types";

defineProps<{
  tab: GiftTab;
}>();
</script>

<template>
  <div class="gifts-list">
    <div v-if="tab.gifts.length === 0" class="empty-state">
      <p>{{ tab.emptyText }}</p>
    </div>

    <div v-else class="gifts-grid">
      <GiftCard
        v-for="gift in tab.gifts"
        :key="gift.id"
        :gift-id="gift.giftId"
        :gift-name="gift.giftName"
        :person-label="tab.personLabel"
        :person-name="gift[tab.personKey]"
        :quantity="gift.quantity"
        :amount-label="tab.amountLabel"
        :amount="gift[tab.amountKey]"
        :date="gift[tab.dateKey]"
        :card-class="tab.cardClass"
      />
    </div>
  </div>
</template>

<style scoped>
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
</style>
