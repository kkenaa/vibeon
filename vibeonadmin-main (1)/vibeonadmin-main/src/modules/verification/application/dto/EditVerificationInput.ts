import type { VerificationStatus } from "../../domain/enum/VerificationStatus";
import type { VerificationDocumentType } from "../../domain/enum/VerificationDocumentType";

export interface EditVerificationInput {
  adminProfileId: string;
  documentType: VerificationDocumentType;
  nextStatus: VerificationStatus;
  reviewerNote?: string;
}
