import type { IApiClient } from "@/interfaces/IApiClient";
import { createApiClient } from "@/factories/Factory";
import { verificationRepository } from "../out/VerificationRepository";
import type { IEditVerificationUseCase } from "../../application/port/in/IEditVerificationUseCase";
import type { IFetchVerificationByAdminProfileIdUseCase } from "../../application/port/in/IFetchVerificationByAdminProfileIdUseCase";
import type { IFetchVerificationEventsByAdminProfileIdUseCase } from "../../application/port/in/IFetchVerificationEventsByAdminProfileIdUseCase";
import type { ISubmitVerificationDocumentReviewUseCase } from "../../application/port/in/ISubmitVerificationDocumentReviewUseCase";
import { createEditVerificationUseCase } from "../../application/usecase/createEditVerificationUseCase";
import { createFetchVerificationByAdminProfileIdUseCase } from "../../application/usecase/createFetchVerificationByAdminProfileIdUseCase";
import { createFetchVerificationEventsByAdminProfileIdUseCase } from "../../application/usecase/createFetchVerificationEventsByAdminProfileIdUseCase";
import { createSubmitVerificationDocumentReviewUseCase } from "../../application/usecase/createSubmitVerificationDocumentReviewUseCase";

export interface VerificationUseCases {
  editVerificationUseCase: IEditVerificationUseCase;
  fetchVerificationByAdminProfileIdUseCase: IFetchVerificationByAdminProfileIdUseCase;
  fetchVerificationEventsByAdminProfileIdUseCase: IFetchVerificationEventsByAdminProfileIdUseCase;
  submitVerificationDocumentReviewUseCase: ISubmitVerificationDocumentReviewUseCase;
}

export const createVerificationUseCases = (): VerificationUseCases => {
  const apiClient: IApiClient = createApiClient();

  const verificationRepo = verificationRepository(apiClient);

  const editVerificationUseCase =
    createEditVerificationUseCase(verificationRepo);

  const fetchVerificationByAdminProfileIdUseCase =
    createFetchVerificationByAdminProfileIdUseCase(verificationRepo);

  const fetchVerificationEventsByAdminProfileIdUseCase =
    createFetchVerificationEventsByAdminProfileIdUseCase(verificationRepo);

  const submitVerificationDocumentReviewUseCase =
    createSubmitVerificationDocumentReviewUseCase(verificationRepo);

  return {
    editVerificationUseCase,
    fetchVerificationByAdminProfileIdUseCase,
    fetchVerificationEventsByAdminProfileIdUseCase,
    submitVerificationDocumentReviewUseCase,
  };
};
