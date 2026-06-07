import type { PageResult } from "@/entities/common/PageResult";
import type { VerificationEvent } from "../../../domain/entity/VerificationEvent";

export interface FetchVerificationEventsParams {
  page: number;
  pageSize: number;
  adminProfileId: string;
}

export interface IFetchVerificationEventsByAdminProfileIdUseCase {
  execute(
    params: FetchVerificationEventsParams,
  ): Promise<PageResult<VerificationEvent>>;
}
