import type { IFetchUsersUseCase } from "../port/in/IFetchUsersUseCase";
import type { IUserRepository } from "../port/out/IUserRepository";

export const createFetchUsersUseCase = (
  userRepo: IUserRepository,
): IFetchUsersUseCase => {
  return {
    async execute(params) {
      const { usersPage } = await userRepo.fetchUsers(
        params.page,
        params.pageSize,
        params.query,
      );
      return usersPage;
    },
  };
};
