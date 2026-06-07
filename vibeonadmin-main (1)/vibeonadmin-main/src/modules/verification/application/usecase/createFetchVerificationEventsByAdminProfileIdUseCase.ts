import type { FetchVerificationEventsParams } from "../port/in/IFetchVerificationEventsByAdminProfileIdUseCase";
import type { IFetchVerificationEventsByAdminProfileIdUseCase } from "../port/in/IFetchVerificationEventsByAdminProfileIdUseCase";
import type { IVerificationRepository } from "../port/out/IVerificationRepository";

export const createFetchVerificationEventsByAdminProfileIdUseCase = (
  verificationRepo: IVerificationRepository,
): IFetchVerificationEventsByAdminProfileIdUseCase => {
  return {
    async execute(params: FetchVerificationEventsParams) {
      const { verificationEventsByAdminProfileId } =
        await verificationRepo.fetchVerificationEventsByAdminProfileId(
          params.page,
          params.pageSize,
          params.adminProfileId,
        );
      return verificationEventsByAdminProfileId;
    },
  };
};
