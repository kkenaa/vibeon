import type { ResponseMessage } from "@/entities/common/ResponseMessage";
import type { EditMemberInput } from "../../dto/EditMemberInput";

export interface IUpdateMemberUseCase {
  execute(input: EditMemberInput): Promise<ResponseMessage>;
}
