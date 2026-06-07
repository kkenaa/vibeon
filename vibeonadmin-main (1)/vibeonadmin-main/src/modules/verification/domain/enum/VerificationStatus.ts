export const VERIFICATION_STATUSES = [
  "New",
  "In Progress",
  "Approved",
  "Rejected",
  "Expired",
  "Account Under Review",
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];
