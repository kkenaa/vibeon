import type { IApiClient } from "@/interfaces/IApiClient";
import type { EditVerificationInput } from "@/modules/verification/application/dto/EditVerificationInput";
import type { SubmitVerificationDocumentReviewInput } from "@/modules/verification/application/dto/SubmitVerificationDocumentReviewInput";
import type { IVerificationRepository } from "@/modules/verification/application/port/out/IVerificationRepository";

export function verificationRepository(
  client: IApiClient,
): IVerificationRepository {
  return {
    fetchVerificationByAdminProfileId(adminProfileId) {
      return client.get(
        `/api/verification/profiles/${encodeURIComponent(adminProfileId)}`,
      );
    },

    fetchVerificationEventsByAdminProfileId(
      page: number,
      pageSize: number,
      adminProfileId: string,
    ) {
      const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      return client.get(
        `/api/verification/profiles/${encodeURIComponent(adminProfileId)}/events?${q}`,
      );
    },

    editVerification(input: EditVerificationInput) {
      return client.put(
        `/api/verification/profiles/${encodeURIComponent(input.adminProfileId)}`,
        input,
      );
    },

    submitVerificationDocumentReview(
      input: SubmitVerificationDocumentReviewInput,
      contextType: string,
    ) {
      const q = new URLSearchParams({ contextType });
      return client.post(`/api/verification/documents/review?${q}`, input);
    },
  };
}
