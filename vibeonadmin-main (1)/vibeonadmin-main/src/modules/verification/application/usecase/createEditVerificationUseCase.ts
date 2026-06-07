import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { EditVerificationInput } from "../dto/EditVerificationInput";
import type { IEditVerificationUseCase } from "../port/in/IEditVerificationUseCase";
import type { IVerificationRepository } from "../port/out/IVerificationRepository";

export const createEditVerificationUseCase = (
  verificationRepo: IVerificationRepository,
): IEditVerificationUseCase => {
  return {
    async execute(input: EditVerificationInput): Promise<ResponseMessage> {
      const result = await verificationRepo.editVerification(input);
      return result.editVerification;
    },
  };
};
