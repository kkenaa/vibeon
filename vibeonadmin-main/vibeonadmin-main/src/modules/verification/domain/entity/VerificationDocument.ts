import type { MediaResult } from "@/modules/media";
import type { UserResult } from "@/entities/common/UserResult";
import type { VerificationDocumentType } from "../enum/VerificationDocumentType";
import type { VerificationStatus } from "../enum/VerificationStatus";

export interface VerificationDocument {
  id: string;
  status: VerificationStatus;
  type: VerificationDocumentType;
  documentName: string;
  contextId: string;
  contextType: string;
  reviewerComment: string;
  reviewer: UserResult;
  createdAt: string;
  updatedAt: string;
  reviewAt: string;
  validUntil: string;
  media: MediaResult;
}
