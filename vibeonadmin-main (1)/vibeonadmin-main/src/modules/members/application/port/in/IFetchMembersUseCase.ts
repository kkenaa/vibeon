import type { PageResult } from "@/entities/common/PageResult";
import type { Member } from "../../../domain/entity/Member";

export interface FetchMembersParams {
  page: number;
  pageSize: number;
  query?: string;
}

export interface IFetchMembersUseCase {
  execute(params: FetchMembersParams): Promise<PageResult<Member>>;
}
