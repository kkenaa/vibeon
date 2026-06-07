import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { EditUserInput } from "../../dto/EditUserInput";

export interface IUpdateUserUseCase {
  execute(input: EditUserInput): Promise<ResponseMessage>;
}
