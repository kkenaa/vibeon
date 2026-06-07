import type { PageResult } from "@/entities/common/PageResult";
import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { Member } from "@/modules/members/domain/entity/Member";
import type { EditMemberInput } from "../../dto/EditMemberInput";

export interface IMemberRepository {
  fetchMembers: (
    page: number,
    pageSize: number,
    query?: string,
  ) => Promise<{ membersPage: PageResult<Member> }>;
  fetchMemberById: (id: number) => Promise<{ memberById: Member }>;
  updateMember: (
    input: EditMemberInput,
  ) => Promise<{ updateMember: ResponseMessage }>;
}
