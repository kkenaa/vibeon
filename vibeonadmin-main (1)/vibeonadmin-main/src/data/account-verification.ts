export type VerificationDocumentStatus =
  | "New"
  | "In Progress"
  | "Approved"
  | "Rejected"
  | "Expired"
  | "Account Under Review";

export interface VerificationDocument {
  id: string;
  documentType: string;
  fileName: string;
  reviewer: string;
  creationDate: string;
  reviewDate: string;
  validUntil: string;
  status: VerificationDocumentStatus;
  readabilityFeedback?: string;
}

export interface VerificationChangeEvent {
  id: string;
  changeDate: string;
  fromStatus: "New" | "In Progress" | "Approved";
  toStatus: "New" | "In Progress" | "Approved";
}

export interface AccountVerificationData {
  currentStatus: "New" | "In Progress" | "Approved";
  documents: VerificationDocument[];
  verificationEvents: VerificationChangeEvent[];
}

export type DocumentSlot =
  | "id-card"
  | "cpr"
  | "proof-of-insurance"
  | "certificate-1"
  | "certificate-2"
  | "certificate-3";

export const DOCUMENT_SLOTS: { slot: DocumentSlot; documentType: string }[] = [
  { slot: "id-card", documentType: "ID CARD" },
  { slot: "cpr", documentType: "CPR" },
  { slot: "proof-of-insurance", documentType: "PROOF OF INSURANCE" },
  { slot: "certificate-1", documentType: "CERTIFICATE" },
  { slot: "certificate-2", documentType: "CERTIFICATE" },
  { slot: "certificate-3", documentType: "CERTIFICATE" },
];

export const ADMIN_DOCUMENT_TYPE_OPTIONS: { value: string; label: string }[] =
  (() => {
    const seen = new Set<string>();
    const out: { value: string; label: string }[] = [];
    for (const { documentType } of DOCUMENT_SLOTS) {
      if (!seen.has(documentType)) {
        seen.add(documentType);
        out.push({ value: documentType, label: documentType });
      }
    }
    return out;
  })();

export interface AccountVerificationOverride {
  currentStatus?: "New" | "In Progress" | "Approved";
  documents?: Partial<Record<DocumentSlot, Partial<VerificationDocument>>>;
  verificationEvents?: VerificationChangeEvent[];
}

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "_");

function defaultDocumentForSlot(
  userId: number,
  userName: string,
  slot: DocumentSlot,
): VerificationDocument {
  const s = slug(userName);
  const creationDate = "01/30/2026, 7:39 PM";

  const files: Record<DocumentSlot, string> = {
    "id-card": `${s}_id_card.pdf`,
    cpr: `${s}_cpr.pdf`,
    "proof-of-insurance": `${s}_insurance.jpg`,
    "certificate-1": `ISSA-Certified-Personal-Trainer-${s}.pdf`,
    "certificate-2": `ISSA-Nutrition-Cert-${s}.pdf`,
    "certificate-3": `ISSA-Strength-Conditioning-${s}.pdf`,
  };

  return {
    id: `u${userId}-${slot}`,
    documentType: "",
    fileName: files[slot],
    reviewer: "-",
    creationDate,
    reviewDate: "-",
    validUntil: "-",
    status: "New",
  };
}

function mergeDocuments(
  userId: number,
  userName: string,
  patch?: Partial<Record<DocumentSlot, Partial<VerificationDocument>>>,
): VerificationDocument[] {
  return DOCUMENT_SLOTS.map(({ slot }) => {
    const base = defaultDocumentForSlot(userId, userName, slot);
    const overrides = patch?.[slot];
    if (!overrides) return base;
    return {
      ...base,
      ...overrides,
      id: overrides.id ?? base.id,
      documentType:
        overrides.documentType !== undefined
          ? overrides.documentType
          : base.documentType,
      readabilityFeedback:
        overrides.readabilityFeedback !== undefined
          ? overrides.readabilityFeedback
          : base.readabilityFeedback,
    };
  });
}

export const accountVerificationOverrides: Record<
  number,
  AccountVerificationOverride
> = {
  1: {
    currentStatus: "Approved",
    documents: {
      "id-card": {
        fileName: "john_doe_id_front.jpg",
        reviewer: "Risk Team",
        creationDate: "01/10/2026, 10:12 AM",
        reviewDate: "01/12/2026, 09:41 AM",
        validUntil: "01/12/2028",
        status: "Approved",
      },
      cpr: {
        fileName: "john_doe_cpr.pdf",
        reviewer: "Risk Team",
        creationDate: "01/10/2026, 10:13 AM",
        reviewDate: "01/12/2026, 09:42 AM",
        validUntil: "-",
        status: "Approved",
      },
      "proof-of-insurance": {
        fileName: "john_doe_insurance.pdf",
        reviewer: "Risk Team",
        creationDate: "01/10/2026, 10:14 AM",
        reviewDate: "01/12/2026, 09:43 AM",
        validUntil: "-",
        status: "Approved",
      },
      "certificate-1": {
        reviewer: "Risk Team",
        reviewDate: "01/12/2026, 09:44 AM",
        status: "Approved",
      },
      "certificate-2": {
        reviewer: "Risk Team",
        reviewDate: "01/12/2026, 09:44 AM",
        status: "Approved",
      },
      "certificate-3": {
        reviewer: "Risk Team",
        reviewDate: "01/12/2026, 09:45 AM",
        status: "Approved",
      },
    },
    verificationEvents: [
      {
        id: "u1-e1",
        changeDate: "01/11/2026, 08:22 AM",
        fromStatus: "New",
        toStatus: "In Progress",
      },
      {
        id: "u1-e2",
        changeDate: "01/12/2026, 09:44 AM",
        fromStatus: "In Progress",
        toStatus: "Approved",
      },
    ],
  },
  2: {
    currentStatus: "In Progress",
    documents: {
      "id-card": {
        fileName: "jane_smith_id.pdf",
        reviewer: "Compliance",
        creationDate: "02/03/2026, 01:30 PM",
        reviewDate: "-",
        validUntil: "03/03/2031",
        status: "In Progress",
        readabilityFeedback:
          "Image is underexposed; ID number and expiry date are not legible.",
      },
      cpr: {
        fileName: "jane_smith_cpr.pdf",
        reviewer: "-",
        creationDate: "02/03/2026, 01:31 PM",
        reviewDate: "-",
        validUntil: "-",
        status: "New",
      },
      "proof-of-insurance": {
        fileName: "jane_insurance.jpg",
        reviewer: "-",
        creationDate: "02/03/2026, 01:34 PM",
        reviewDate: "-",
        validUntil: "-",
        status: "New",
      },
      "certificate-1": {
        status: "In Progress",
        reviewer: "Compliance",
        reviewDate: "-",
      },
      "certificate-2": {
        status: "New",
      },
      "certificate-3": {
        status: "New",
      },
    },
    verificationEvents: [
      {
        id: "u2-e1",
        changeDate: "02/03/2026, 01:31 PM",
        fromStatus: "New",
        toStatus: "In Progress",
      },
    ],
  },
};

export function getAccountVerificationData(
  userId: number,
  userName: string,
): AccountVerificationData {
  const override = accountVerificationOverrides[userId];
  const documents = mergeDocuments(userId, userName, override?.documents);

  return {
    currentStatus: override?.currentStatus ?? "New",
    documents,
    verificationEvents: override?.verificationEvents ?? [],
  };
}
