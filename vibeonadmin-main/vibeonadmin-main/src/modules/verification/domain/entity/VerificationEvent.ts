import type { VerificationStatus } from "../enum/VerificationStatus";

export interface VerificationEvent {
  id: string;
  adminProfileId: string;
  changeDate: string;
  fromStatus: VerificationStatus;
  toStatus: VerificationStatus;
}
