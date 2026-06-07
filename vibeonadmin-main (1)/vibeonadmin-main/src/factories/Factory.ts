import { ApiClient } from "@/api/Apiclient";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";

export const createApiClient = (): ApiClient => {
  return new ApiClient(baseURL);
};
