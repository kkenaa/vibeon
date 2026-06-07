import type { PageResult } from "@/entities/common/PageResult";
import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { Verification } from "@/modules/verification/domain/entity/Verification";
import type { VerificationEvent } from "@/modules/verification/domain/entity/VerificationEvent";
import type { EditVerificationInput } from "../../dto/EditVerificationInput";
import type { SubmitVerificationDocumentReviewInput } from "../../dto/SubmitVerificationDocumentReviewInput";

export interface IVerificationRepository {
  fetchVerificationByAdminProfileId: (
    trainerProfileId: string,
  ) => Promise<{ verificationByAdminProfileId: Verification }>;
  fetchVerificationEventsByAdminProfileId: (
    page: number,
    pageSize: number,
    adminProfileId: string,
  ) => Promise<{
    verificationEventsByAdminProfileId: PageResult<VerificationEvent>;
  }>;
  editVerification: (
    input: EditVerificationInput,
  ) => Promise<{ editVerification: ResponseMessage }>;
  submitVerificationDocumentReview: (
    input: SubmitVerificationDocumentReviewInput,
    contextType: string,
  ) => Promise<{ submitVerificationDocumentReview: ResponseMessage }>;
}
