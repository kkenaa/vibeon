import type { IFetchMemberByIdUseCase } from "../port/in/IFetchMemberByIdUseCase";
import type { IMemberRepository } from "../port/out/IMemberRepository";

export const createFetchMemberByIdUseCase = (
  memberRepo: IMemberRepository,
): IFetchMemberByIdUseCase => {
  return {
    async execute(id: number) {
      const { memberById } = await memberRepo.fetchMemberById(id);
      return memberById;
    },
  };
};
