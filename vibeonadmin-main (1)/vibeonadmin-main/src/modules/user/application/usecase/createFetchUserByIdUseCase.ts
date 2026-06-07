import type { IFetchUserByIdUseCase } from "../port/in/IFetchUserByIdUseCase";
import type { IUserRepository } from "../port/out/IUserRepository";

export const createFetchUserByIdUseCase = (
  userRepo: IUserRepository,
): IFetchUserByIdUseCase => {
  return {
    async execute(id: number) {
      const { userById } = await userRepo.fetchUserById(id);
      return userById;
    },
  };
};
