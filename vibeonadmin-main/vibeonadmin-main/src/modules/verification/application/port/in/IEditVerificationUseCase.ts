import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { EditVerificationInput } from "../../dto/EditVerificationInput";

export interface IEditVerificationUseCase {
  execute(input: EditVerificationInput): Promise<ResponseMessage>;
}
