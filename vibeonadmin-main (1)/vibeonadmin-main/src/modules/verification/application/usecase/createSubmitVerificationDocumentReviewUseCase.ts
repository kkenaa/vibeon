import type { ISubmitVerificationDocumentReviewUseCase } from "../port/in/ISubmitVerificationDocumentReviewUseCase";
import type { IVerificationRepository } from "../port/out/IVerificationRepository";

export const createSubmitVerificationDocumentReviewUseCase = (
  verificationRepo: IVerificationRepository,
): ISubmitVerificationDocumentReviewUseCase => {
  return {
    async execute(input, contextType) {
      const { submitVerificationDocumentReview } =
        await verificationRepo.submitVerificationDocumentReview(
          input,
          contextType,
        );
      return submitVerificationDocumentReview;
    },
  };
};
