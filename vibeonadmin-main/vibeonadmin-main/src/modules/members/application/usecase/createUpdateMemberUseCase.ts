import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { EditMemberInput } from "../dto/EditMemberInput";
import type { IUpdateMemberUseCase } from "../port/in/IUpdateMemberUseCase";
import type { IMemberRepository } from "../port/out/IMemberRepository";

export const createUpdateMemberUseCase = (
  memberRepo: IMemberRepository,
): IUpdateMemberUseCase => {
  return {
    async execute(input: EditMemberInput): Promise<ResponseMessage> {
      const result = await memberRepo.updateMember(input);
      return result.updateMember;
    },
  };
};
