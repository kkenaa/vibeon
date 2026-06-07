import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { EditUserInput } from "../dto/EditUserInput";
import type { IUpdateUserUseCase } from "../port/in/IUpdateUserUseCase";
import type { IUserRepository } from "../port/out/IUserRepository";

export const createUpdateUserUseCase = (
  userRepo: IUserRepository,
): IUpdateUserUseCase => {
  return {
    async execute(input: EditUserInput): Promise<ResponseMessage> {
      const result = await userRepo.updateUser(input);
      return result.updateUser;
    },
  };
};
