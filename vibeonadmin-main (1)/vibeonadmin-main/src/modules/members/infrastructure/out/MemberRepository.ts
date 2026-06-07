import type { IApiClient } from "@/interfaces/IApiClient";
import type { EditMemberInput } from "@/modules/members/application/dto/EditMemberInput";
import type { IMemberRepository } from "@/modules/members/application/port/out/IMemberRepository";

export function memberRepository(client: IApiClient): IMemberRepository {
  return {
    fetchMembers(page, pageSize, query) {
      const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (query?.trim()) {
        q.set("q", query.trim());
      }
      return client.get(`/api/members?${q}`);
    },

    fetchMemberById(id: number) {
      return client.get(`/api/members/${encodeURIComponent(String(id))}`);
    },

    updateMember(input: EditMemberInput) {
      return client.put(
        `/api/members/${encodeURIComponent(String(input.id))}`,
        input,
      );
    },
  };
}
