import type { IFetchVerificationByAdminProfileIdUseCase } from "../port/in/IFetchVerificationByAdminProfileIdUseCase";
import type { IVerificationRepository } from "../port/out/IVerificationRepository";

export const createFetchVerificationByAdminProfileIdUseCase = (
  verificationRepo: IVerificationRepository,
): IFetchVerificationByAdminProfileIdUseCase => {
  return {
    async execute(adminProfileId: string) {
      const { verificationByAdminProfileId } =
        await verificationRepo.fetchVerificationByAdminProfileId(
          adminProfileId,
        );
      return verificationByAdminProfileId;
    },
  };
};
