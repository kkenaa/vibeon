import type { PageResult } from "@/entities/common/PageResult";
import type { User } from "../../../domain/entity/User";

export interface FetchUsersParams {
  page: number;
  pageSize: number;
  query?: string;
}

export interface IFetchUsersUseCase {
  execute(params: FetchUsersParams): Promise<PageResult<User>>;
}
