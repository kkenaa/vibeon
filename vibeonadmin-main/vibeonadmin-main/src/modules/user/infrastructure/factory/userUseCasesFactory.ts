import type { IApiClient } from "@/interfaces/IApiClient";
import { createApiClient } from "@/factories/Factory";
import type { IFetchUsersUseCase } from "../../application/port/in/IFetchUsersUseCase";
import type { IFetchUserByIdUseCase } from "../../application/port/in/IFetchUserByIdUseCase";
import type { IUpdateUserUseCase } from "../../application/port/in/IUpdateUserUseCase";
import { createFetchUsersUseCase } from "../../application/usecase/createFetchUsersUseCase";
import { createFetchUserByIdUseCase } from "../../application/usecase/createFetchUserByIdUseCase";
import { createUpdateUserUseCase } from "../../application/usecase/createUpdateUserUseCase";
import { userRepository } from "../out/UserRepository";

export interface UserUseCases {
  fetchUsersUseCase: IFetchUsersUseCase;
  fetchUserByIdUseCase: IFetchUserByIdUseCase;
  updateUserUseCase: IUpdateUserUseCase;
}

export const createUserUseCases = (): UserUseCases => {
  const apiClient: IApiClient = createApiClient();

  const userRepo = userRepository(apiClient);

  const fetchUsersUseCase = createFetchUsersUseCase(userRepo);
  const fetchUserByIdUseCase = createFetchUserByIdUseCase(userRepo);
  const updateUserUseCase = createUpdateUserUseCase(userRepo);

  return {
    fetchUsersUseCase,
    fetchUserByIdUseCase,
    updateUserUseCase,
  };
};
