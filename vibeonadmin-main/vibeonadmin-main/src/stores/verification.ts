import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import { createVerificationUseCases } from "@/modules/verification";
import type { VerificationEvent } from "@/modules/verification/domain/entity/VerificationEvent";
import type { Verification } from "@/modules/verification/domain/entity/Verification";

const {
  fetchVerificationByAdminProfileIdUseCase,
  fetchVerificationEventsByAdminProfileIdUseCase,
} = createVerificationUseCases();

export const useVerificationStore = defineStore("verification", () => {
  const activeProfileId = ref<string | null>(null);
  const verification = shallowRef<Verification | null>(null);
  const events = shallowRef<VerificationEvent[]>([]);
  const eventsTotal = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadProfile(adminProfileId: string): Promise<void> {
    loading.value = true;
    error.value = null;
    activeProfileId.value = adminProfileId;
    try {
      verification.value =
        await fetchVerificationByAdminProfileIdUseCase.execute(adminProfileId);
      const page = await fetchVerificationEventsByAdminProfileIdUseCase.execute({
        adminProfileId,
        page: 1,
        pageSize: 50,
      });
      events.value = page.items;
      eventsTotal.value = page.totalCount;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      verification.value = null;
      events.value = [];
      eventsTotal.value = 0;
    } finally {
      loading.value = false;
    }
  }

  return {
    activeProfileId,
    verification,
    events,
    eventsTotal,
    loading,
    error,
    loadProfile,
  };
});
