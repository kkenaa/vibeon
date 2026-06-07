import type { User } from "../../../domain/entity/User";

export interface IFetchUserByIdUseCase {
  execute(id: number): Promise<User>;
}
