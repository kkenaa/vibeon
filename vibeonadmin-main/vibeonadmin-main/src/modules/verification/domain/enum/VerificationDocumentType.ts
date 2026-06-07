export const VERIFICATION_DOCUMENT_TYPES = [
  "ID_CARD",
  "CPR",
  "PROOF_OF_INSURANCE",
  "CERTIFICATE",
  "OTHER",
] as const;

export type VerificationDocumentType =
  (typeof VERIFICATION_DOCUMENT_TYPES)[number];
