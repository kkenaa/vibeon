import type { MemberRights } from "../../domain/entity/MemberRights";

export interface EditMemberInput {
  id: number;
  name?: string;
  email?: string;
  loginEmail?: string;
  role?: string;
  department?: string;
  status?: string;
  rights?: MemberRights;
}
