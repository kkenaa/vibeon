import type { IFetchMembersUseCase } from "../port/in/IFetchMembersUseCase";
import type { IMemberRepository } from "../port/out/IMemberRepository";

export const createFetchMembersUseCase = (
  memberRepo: IMemberRepository,
): IFetchMembersUseCase => {
  return {
    async execute(params) {
      const { membersPage } = await memberRepo.fetchMembers(
        params.page,
        params.pageSize,
        params.query,
      );
      return membersPage;
    },
  };
};
