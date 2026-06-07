import type { IApiClient } from "@/interfaces/IApiClient";
import type { EditUserInput } from "@/modules/user/application/dto/EditUserInput";
import type { IUserRepository } from "@/modules/user/application/port/out/IUserRepository";

export function userRepository(client: IApiClient): IUserRepository {
  return {
    fetchUsers(page, pageSize, query) {
      const q = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (query?.trim()) {
        q.set("q", query.trim());
      }
      return client.get(`/api/users?${q}`);
    },

    fetchUserById(id: number) {
      return client.get(
        `/api/users/${encodeURIComponent(String(id))}`,
      );
    },

    updateUser(input: EditUserInput) {
      return client.put(
        `/api/users/${encodeURIComponent(String(input.id))}`,
        input,
      );
    },
  };
}
