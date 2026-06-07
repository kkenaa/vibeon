<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from "vue";
import type { Component } from "vue";
import GridComponent from "./GridComponent.vue";
import DocumentFilePill from "./DocumentFilePill.vue";
import DocumentRowActions from "./DocumentRowActions.vue";
import IconText from "./IconText.vue";
import SideBar from "./SideBar.vue";
import SelectField from "./SelectField.vue";
import type { Column } from "../types";
import {
  getAccountVerificationData,
  ADMIN_DOCUMENT_TYPE_OPTIONS,
  type VerificationDocument,
  type VerificationChangeEvent,
} from "../data/account-verification";
import { useVerificationStore } from "../stores/verification";

interface Props {
  userId: number;
  userName: string;
}

const selectedDocumentType = ref("");

const props = defineProps<Props>();

const documentTypeLocalOverrides = ref<Record<string, string>>({});
const documentStatusLocalOverrides = ref<Record<string, string>>({});

const readabilityFeedbackOverrides = ref<Record<string, string>>({});

const verificationStore = useVerificationStore();

const userVerificationData = computed(() =>
  getAccountVerificationData(props.userId, props.userName),
);

const profileId = computed(() => String(props.userId));

watch(
  profileId,
  (id) => {
    void verificationStore.loadProfile(id);
  },
  { immediate: true },
);

const apiStatusUsed = computed(
  () =>
    verificationStore.activeProfileId === profileId.value &&
    verificationStore.verification !== null &&
    verificationStore.error === null,
);

const displayedCurrentStatus = computed(() => {
  if (apiStatusUsed.value && verificationStore.verification) {
    return verificationStore.verification.currentStatus;
  }
  return userVerificationData.value.currentStatus;
});

const displayedVerificationEvents = computed((): VerificationChangeEvent[] => {
  if (
    verificationStore.activeProfileId === profileId.value &&
    verificationStore.verification !== null &&
    verificationStore.error === null
  ) {
    return verificationStore.events.map((e) => ({
      id: e.id,
      changeDate: e.changeDate,
      fromStatus: e.fromStatus as VerificationChangeEvent["fromStatus"],
      toStatus: e.toStatus as VerificationChangeEvent["toStatus"],
    }));
  }
  return userVerificationData.value.verificationEvents;
});

const currentStatusIcon = computed(() => {
  if (displayedCurrentStatus.value === "Approved") return "✓";
  if (displayedCurrentStatus.value === "In Progress") return "◷";
  return "!";
});

const currentStatusClass = computed(() =>
  displayedCurrentStatus.value.toLowerCase().replace(/\s+/g, "-"),
);

const REVIEW_STATUSES = [
  "New",
  "In Progress",
  "Approved",
  "Rejected",
  "Expired",
  "Account Under Review",
] as const;

const reviewSidebarOpen = ref(false);
const selectedDocument = ref<VerificationDocument | null>(null);
const selectedReviewStatus = ref<string>("New");

watch(
  () => props.userId,
  () => {
    documentTypeLocalOverrides.value = {};
    documentStatusLocalOverrides.value = {};
    readabilityFeedbackOverrides.value = {};
    reviewSidebarOpen.value = false;
    selectedDocument.value = null;
  },
);

function resolvedStatus(
  doc: VerificationDocument,
): VerificationDocument["status"] {
  const local = documentStatusLocalOverrides.value[doc.id];
  if (local !== undefined && local !== "") {
    return local as VerificationDocument["status"];
  }
  return doc.status;
}

function resolvedDocumentType(doc: VerificationDocument): string {
  const local = documentTypeLocalOverrides.value[doc.id];
  if (local !== undefined && local.trim() !== "") {
    return local;
  }
  const fromData = doc.documentType?.trim();
  return fromData ?? "";
}

function resolvedReadabilityFeedback(doc: VerificationDocument): string {
  const id = doc.id;
  const overrides = readabilityFeedbackOverrides.value;
  if (Object.prototype.hasOwnProperty.call(overrides, id)) {
    return overrides[id] ?? "";
  }
  return doc.readabilityFeedback?.trim() ?? "";
}

const selectedReadabilityFeedback = ref("");

watch([reviewSidebarOpen, selectedDocument], ([open, doc]) => {
  if (open && doc) {
    selectedReviewStatus.value = resolvedStatus(doc);
    selectedDocumentType.value = resolvedDocumentType(doc) || "";
    selectedReadabilityFeedback.value = resolvedReadabilityFeedback(doc);
  }
});

const reviewStatusOptions = computed(() =>
  REVIEW_STATUSES.map((opt) => ({ value: opt, label: opt })),
);

const documentsForGrid = computed((): VerificationDocument[] =>
  userVerificationData.value.documents.map((d) => ({
    ...d,
    documentType: resolvedDocumentType(d),
    status: resolvedStatus(d),
    readabilityFeedback: resolvedReadabilityFeedback(d),
  })),
);

function closeReviewSidebar() {
  reviewSidebarOpen.value = false;
}

function saveDocumentEdits() {
  const doc = selectedDocument.value;
  if (!doc) return;
  const id = doc.id;
  documentTypeLocalOverrides.value = {
    ...documentTypeLocalOverrides.value,
    [id]: selectedDocumentType.value.trim(),
  };
  documentStatusLocalOverrides.value = {
    ...documentStatusLocalOverrides.value,
    [id]: selectedReviewStatus.value.trim(),
  };
  readabilityFeedbackOverrides.value = {
    ...readabilityFeedbackOverrides.value,
    [id]: selectedReadabilityFeedback.value.trim(),
  };
  closeReviewSidebar();
}

const statusGlyphCache = new Map<string, Component>();

function statusGlyphComponent(normalized: string): Component {
  let cached = statusGlyphCache.get(normalized);
  if (cached) return cached;
  let glyph = "◷";
  if (normalized === "approved") glyph = "✓";
  else if (normalized === "new") glyph = "!";
  cached = defineComponent({
    name: `VerificationStatusGlyph_${normalized}`,
    setup() {
      return () =>
        h(
          "span",
          { class: ["verification-status-glyph", normalized] },
          glyph,
        );
    },
  });
  statusGlyphCache.set(normalized, cached);
  return cached;
}

function verificationStatusIconTextProps(status: string) {
  const normalized = status.toLowerCase().replace(/\s+/g, "-");
  return {
    label: status,
    leftIcon: statusGlyphComponent(normalized),
    classname: `verification-status-icontext ${normalized}`,
  };
}

const openReviewSidebar = (row: VerificationDocument) => {
  selectedDocument.value = row;
  reviewSidebarOpen.value = true;
};

const documentColumns: Column[] = [
  {
    key: "documentType",
    label: "Document Type",
    type: "text",
    formatter: (value: string) =>
      value && String(value).trim() ? String(value) : "-",
  },
  {
    key: "fileName",
    label: "Document",
    type: "component",
    component: DocumentFilePill,
    componentProps: (row: VerificationDocument) => ({
      fileName: row.fileName,
      readabilityFeedback: row.readabilityFeedback ?? "",
    }),
  },
  { key: "reviewer", label: "Reviewer", type: "text" },
  { key: "creationDate", label: "Creation Date", type: "text" },
  { key: "reviewDate", label: "Review Date", type: "text" },
  { key: "validUntil", label: "Valid Until", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "component",
    component: IconText,
    componentProps: (row: VerificationDocument) =>
      verificationStatusIconTextProps(row.status),
  },
  {
    key: "",
    label: "",
    type: "component",
    stopRowClick: true,
    component: DocumentRowActions,
    componentProps: (row: VerificationDocument, rowIndex: number) => ({
      onLeaveReview: () =>
        openReviewSidebar(documentsForGrid.value[rowIndex] ?? row),
    }),
  },
];

const eventColumns: Column[] = [
  { key: "changeDate", label: "Change Date", type: "text" },
  {
    key: "fromStatus",
    label: "From Status",
    type: "component",
    component: IconText,
    componentProps: (row: VerificationChangeEvent) =>
      verificationStatusIconTextProps(row.fromStatus),
  },
  {
    key: "toStatus",
    label: "To Status",
    type: "component",
    component: IconText,
    componentProps: (row: VerificationChangeEvent) =>
      verificationStatusIconTextProps(row.toStatus),
  },
];
</script>

<template>
  <div class="verification-wrap">
    <section class="verification-card">
      <div class="section-label">
        Current Verification
        <span v-if="apiStatusUsed" class="api-badge">API</span>
      </div>
      <div v-if="verificationStore.loading" class="api-hint">Loading…</div>

      <div class="current-status-panel">
        <div :class="['status-mark', currentStatusClass]">
          {{ currentStatusIcon }}
        </div>
        <div class="status-value">{{ displayedCurrentStatus }}</div>
      </div>
    </section>

    <section class="verification-card">
      <div class="grid-wrap documents-grid">
        <GridComponent :columns="documentColumns" :data="documentsForGrid" />
      </div>
    </section>

    <section class="verification-card">
      <div class="section-label">Verification Change Events</div>
      <div class="grid-wrap events-grid">
        <GridComponent
          :columns="eventColumns"
          :data="displayedVerificationEvents"
        />
      </div>
    </section>

    <SideBar :is-open="reviewSidebarOpen" @close="closeReviewSidebar">
      <div class="review-doc-panel">
        <h2 class="review-doc-title">Edit Document</h2>
        <div class="review-doc-fields">
          <SelectField
            v-model="selectedDocumentType"
            label="Document Type"
            placeholder="Select document type"
            :options="ADMIN_DOCUMENT_TYPE_OPTIONS"
          />
          <SelectField
            v-model="selectedReviewStatus"
            label="Status"
            :options="reviewStatusOptions"
          />
          <div class="review-feedback-field">
            <label
              class="review-feedback-label"
              for="readability-feedback-input"
              >Readability feedback (optional)</label
            >
            <textarea
              id="readability-feedback-input"
              v-model="selectedReadabilityFeedback"
              class="review-feedback-textarea"
              rows="4"
              placeholder="Explain why the document is hard to read (blur, glare, cropping, low resolution, etc.)"
            />
          </div>
          <div class="review-sidebar-actions">
            <button
              type="button"
              class="save-doc-type-btn"
              @click="saveDocumentEdits"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </SideBar>
  </div>
</template>

<style scoped>
.verification-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.verification-card {
  background: #ffffff;
  border: 1px solid #eceef1;
  border-radius: 10px;
  overflow: hidden;
}

.section-label {
  padding: 12px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #f87171;
  border-bottom: 1px solid #f2f3f6;
  display: flex;
  align-items: center;
  gap: 8px;
}

.api-badge {
  font-size: 10px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border-radius: 4px;
  padding: 2px 6px;
}

.api-hint {
  padding: 6px 14px 0;
  font-size: 11px;
  color: #6b7280;
}

.api-hint-error {
  color: #b91c1c;
}

.current-status-panel {
  min-height: 86px;
  display: grid;
  place-items: center;
  gap: 4px;
  padding: 10px;
}

.status-mark {
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
}

.status-mark.approved {
  color: #22c55e;
}

.status-mark.in-progress {
  color: #e07a5f;
}

.status-mark.new {
  color: #f59e0b;
}

.status-value {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.grid-wrap {
  overflow-x: auto;
  padding: 6px 10px 10px;
}

.grid-wrap :deep(.grid-header-cell),
.grid-wrap :deep(.grid-cell) {
  font-size: 12px;
  min-width: 0;
  overflow: hidden;
}

.grid-wrap :deep(.grid-cell) {
  white-space: nowrap;
  text-overflow: ellipsis;
}

.grid-wrap :deep(button.verification-status-icontext) {
  background: transparent;
  border: none;
  cursor: default;
  padding: 0;
  margin: 0;
  font: inherit;
  width: 100%;
  text-align: left;
  pointer-events: none;
}

.grid-wrap :deep(.verification-status-icontext .item-inner) {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.grid-wrap :deep(.verification-status-glyph) {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.grid-wrap :deep(.verification-status-glyph.approved) {
  color: #22c55e;
  font-size: 18px;
}

.grid-wrap :deep(.verification-status-glyph.new) {
  background: #f6d08e;
  color: #ffffff;
}

.grid-wrap :deep(.verification-status-glyph.in-progress) {
  color: #e07a5f;
  font-size: 20px;
}

.documents-grid :deep(.grid-header),
.documents-grid :deep(.grid-row) {
  grid-template-columns: 0.9fr 1.6fr 0.9fr 0.9fr 0.95fr 0.95fr 0.65fr 0.8fr;
}

.events-grid :deep(.grid-header),
.events-grid :deep(.grid-row) {
  grid-template-columns: 1.3fr 1fr 1fr;
}

.review-doc-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 1rem;
  margin-top: 3rem;
}

.review-doc-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.review-doc-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-feedback-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-feedback-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.45;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  resize: vertical;
  min-height: 88px;
  font-family: inherit;
}

.review-feedback-textarea::placeholder {
  color: #9ca3af;
}

.review-sidebar-actions {
  margin-top: 4px;
}

.save-doc-type-btn {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-doc-type-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.save-doc-type-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
