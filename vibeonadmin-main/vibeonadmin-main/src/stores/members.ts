import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import { createMemberUseCases } from "@/modules/members";
import type { Member } from "@/modules/members/domain/entity/Member";
import type { EditMemberInput } from "@/modules/members/application/dto/EditMemberInput";

const { fetchMembersUseCase, fetchMemberByIdUseCase, updateMemberUseCase } =
  createMemberUseCases();

export const useMembersStore = defineStore("members", () => {
  const members = shallowRef<Member[]>([]);
  const membersTotal = ref(0);
  const membersPage = ref(1);
  const membersPageSize = ref(50);
  const activeMemberId = ref<number | null>(null);
  const member = shallowRef<Member | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function replaceMember(updated: Member): void {
    const idx = members.value.findIndex((m) => m.id === updated.id);
    if (idx === -1) return;
    const next = [...members.value];
    next[idx] = updated;
    members.value = next;
  }

  async function loadMembers(
    page = 1,
    pageSize = 50,
    query?: string,
  ): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const result = await fetchMembersUseCase.execute({
        page,
        pageSize,
        query,
      });
      members.value = result.items;
      membersTotal.value = result.totalCount;
      membersPage.value = result.page;
      membersPageSize.value = result.pageSize;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      members.value = [];
      membersTotal.value = 0;
    } finally {
      loading.value = false;
    }
  }

  async function loadMember(id: number): Promise<void> {
    loading.value = true;
    error.value = null;
    activeMemberId.value = id;
    try {
      member.value = await fetchMemberByIdUseCase.execute(id);
      if (member.value) {
        replaceMember(member.value);
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      member.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function saveMember(input: EditMemberInput): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateMemberUseCase.execute(input);
      await loadMember(input.id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  return {
    members,
    membersTotal,
    membersPage,
    membersPageSize,
    activeMemberId,
    member,
    loading,
    error,
    replaceMember,
    loadMembers,
    loadMember,
    saveMember,
  };
});
