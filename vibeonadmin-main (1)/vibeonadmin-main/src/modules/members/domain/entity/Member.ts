import type { MemberRights } from "./MemberRights";

export interface Member {
  id: number;
  name: string;
  email: string;
  loginEmail: string;
  role: string;
  department: string;
  joinDate: string;
  status: string;
  rights: MemberRights;
  avatar: string;
}
