import type { Member } from "../../../domain/entity/Member";

export interface IFetchMemberByIdUseCase {
  execute(id: number): Promise<Member>;
}
