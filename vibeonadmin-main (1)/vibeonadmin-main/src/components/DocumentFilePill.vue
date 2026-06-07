<script setup lang="ts">
import { computed } from "vue";

interface Props {
  fileName: string;
  readabilityFeedback?: string;
}

const props = withDefaults(defineProps<Props>(), {
  readabilityFeedback: "",
});

const fileExtension = computed(() => {
  const name = props.fileName || "";
  const parts = name.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
});

const isPdf = computed(() => fileExtension.value === "pdf");

function truncateMiddle(full: string, maxLen: number): string {
  const name = full.trim();
  if (!name || name.length <= maxLen) return name;

  const lastDot = name.lastIndexOf(".");
  if (lastDot > 0) {
    const ext = name.slice(lastDot);
    const base = name.slice(0, lastDot);
    const gap = "…";
    const room = maxLen - ext.length - gap.length;
    if (room < 6) {
      return name.slice(0, Math.max(1, maxLen - gap.length)) + gap;
    }
    const head = Math.ceil(room / 2);
    const tail = Math.floor(room / 2);
    return `${base.slice(0, head)}${gap}${base.slice(-tail)}${ext}`;
  }

  const gap = "…";
  const room = maxLen - gap.length;
  const head = Math.ceil(room / 2);
  const tail = Math.floor(room / 2);
  return `${name.slice(0, head)}${gap}${name.slice(-tail)}`;
}

const displayedName = computed(() => truncateMiddle(props.fileName || "", 40));

const tooltipName = computed(() => (props.fileName || "").trim());
</script>

<template>
  <div class="document-file-cell">
    <div class="document-pill" :title="tooltipName">
      <span class="document-icon-wrap" aria-hidden="true">
        <svg
          v-if="isPdf"
          class="icon-pdf"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 4.5C8 3.67157 8.67157 3 9.5 3H17.793L26 11.207V29.5C26 30.3284 25.3284 31 24.5 31H9.5C8.67157 31 8 30.3284 8 29.5V4.5Z"
            fill="#DC2626"
          />
          <path d="M26 11.207V11h-9V3v0L26 11.207z" fill="#B91C1C" />
          <text
            x="17"
            y="25.5"
            text-anchor="middle"
            fill="white"
            font-size="7.5"
            font-weight="700"
            font-family="system-ui, -apple-system, sans-serif"
          >
            PDF
          </text>
        </svg>
        <span v-else class="icon-generic">{{ fileExtension || "FILE" }}</span>
      </span>
      <span class="document-name">{{ displayedName }}</span>
    </div>
  </div>
</template>

<style scoped>
.document-file-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
}

.document-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 12px 6px 8px;
  background: #ffffff;
  max-width: 100%;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.document-icon-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
}

.icon-pdf {
  display: block;
  width: 34px;
  height: 34px;
}

.icon-generic {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
}

.document-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  white-space: nowrap;
  min-width: 0;
  max-width: min(220px, 100%);
  letter-spacing: -0.01em;
}

.readability-feedback-preview {
  margin: 0;
  font-size: 11px;
  line-height: 1.35;
  color: #92400e;
  font-weight: 500;
  max-width: 220px;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
