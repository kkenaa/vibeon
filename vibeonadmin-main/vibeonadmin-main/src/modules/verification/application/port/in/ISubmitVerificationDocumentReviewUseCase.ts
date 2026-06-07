import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { SubmitVerificationDocumentReviewInput } from "../../dto/SubmitVerificationDocumentReviewInput";

export interface ISubmitVerificationDocumentReviewUseCase {
  execute(
    input: SubmitVerificationDocumentReviewInput,
    contextType: string,
  ): Promise<ResponseMessage>;
}
