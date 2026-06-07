import type { PageResult } from "@/entities/common/PageResult";
import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { User } from "@/modules/user/domain/entity/User";
import type { EditUserInput } from "../../dto/EditUserInput";

export interface IUserRepository {
  fetchUsers: (
    page: number,
    pageSize: number,
    query?: string,
  ) => Promise<{ usersPage: PageResult<User> }>;
  fetchUserById: (id: number) => Promise<{ userById: User }>;
  updateUser: (
    input: EditUserInput,
  ) => Promise<{ updateUser: ResponseMessage }>;
}
