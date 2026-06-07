<script lang="ts" setup>
import type { StyleValue } from "vue";

defineProps<{
  rightIcon?: object;
  leftIcon?: object;
  label?: string;
  classname?: string;
  disabled?: boolean;
  active?: boolean;
  spanStyle?: StyleValue;
}>();
</script>

<template>
  <button
    :class="[classname, { active: active }]"
    :style="disabled ? { backgroundColor: '#CBCBCB' } : {}"
    :disabled="disabled"
  >
    <div class="item-outer">
      <div class="item-inner">
        <component :is="leftIcon" :style="{ marginRight: !!label ? '' : '' }" />
        <slot name="leftIcon" />
        <span :style="spanStyle">{{ label }}</span>
      </div>
      <component
        :is="rightIcon"
        :style="{ marginLeft: !!label ? '1rem' : '' }"
      />
      <slot name="rightIcon" />
    </div>
  </button>
</template>

<style scoped>
.item-outer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.item-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
