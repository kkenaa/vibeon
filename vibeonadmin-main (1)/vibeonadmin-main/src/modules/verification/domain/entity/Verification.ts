import type { VerificationStatus } from "../enum/VerificationStatus";
import type { VerificationDocument } from "./VerificationDocument";

export interface Verification {
  id: string;
  adminProfileId: string;
  currentStatus: VerificationStatus;
  documents: VerificationDocument[];
}
