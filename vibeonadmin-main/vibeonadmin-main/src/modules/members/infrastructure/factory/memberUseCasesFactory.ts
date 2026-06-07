import type { IApiClient } from "@/interfaces/IApiClient";
import { createApiClient } from "@/factories/Factory";
import type { IFetchMembersUseCase } from "../../application/port/in/IFetchMembersUseCase";
import type { IFetchMemberByIdUseCase } from "../../application/port/in/IFetchMemberByIdUseCase";
import type { IUpdateMemberUseCase } from "../../application/port/in/IUpdateMemberUseCase";
import { createFetchMembersUseCase } from "../../application/usecase/createFetchMembersUseCase";
import { createFetchMemberByIdUseCase } from "../../application/usecase/createFetchMemberByIdUseCase";
import { createUpdateMemberUseCase } from "../../application/usecase/createUpdateMemberUseCase";
import { memberRepository } from "../out/MemberRepository";

export interface MemberUseCases {
  fetchMembersUseCase: IFetchMembersUseCase;
  fetchMemberByIdUseCase: IFetchMemberByIdUseCase;
  updateMemberUseCase: IUpdateMemberUseCase;
}

export const createMemberUseCases = (): MemberUseCases => {
  const apiClient: IApiClient = createApiClient();

  const memberRepo = memberRepository(apiClient);

  const fetchMembersUseCase = createFetchMembersUseCase(memberRepo);
  const fetchMemberByIdUseCase = createFetchMemberByIdUseCase(memberRepo);
  const updateMemberUseCase = createUpdateMemberUseCase(memberRepo);

  return {
    fetchMembersUseCase,
    fetchMemberByIdUseCase,
    updateMemberUseCase,
  };
};
