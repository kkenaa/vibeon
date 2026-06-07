import type { VerificationDocumentType } from "../../domain/enum/VerificationDocumentType";
import type { VerificationStatus } from "../../domain/enum/VerificationStatus";

export interface SubmitVerificationDocumentReviewInput {
  documentId: string;
  contextId: string;
  contextType: string;
  nextStatus: VerificationStatus;
  reviewerComment?: string;
  documentType?: VerificationDocumentType;
}
