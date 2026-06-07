import type { Verification } from "../../../domain/entity/Verification";

export interface IFetchVerificationByAdminProfileIdUseCase {
  execute(adminProfileId: string): Promise<Verification>;
}
