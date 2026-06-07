import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import { createUserUseCases } from "@/modules/user";
import type { User } from "@/modules/user/domain/entity/User";
import type { EditUserInput } from "@/modules/user/application/dto/EditUserInput";

const { fetchUsersUseCase, fetchUserByIdUseCase, updateUserUseCase } =
  createUserUseCases();

export const useUserStore = defineStore("user", () => {
  const users = shallowRef<User[]>([]);
  const usersTotal = ref(0);
  const usersPage = ref(1);
  const usersPageSize = ref(50);
  const activeUserId = ref<number | null>(null);
  const user = shallowRef<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadUsers(
    page = 1,
    pageSize = 50,
    query?: string,
  ): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const result = await fetchUsersUseCase.execute({
        page,
        pageSize,
        query,
      });
      users.value = result.items;
      usersTotal.value = result.totalCount;
      usersPage.value = result.page;
      usersPageSize.value = result.pageSize;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      users.value = [];
      usersTotal.value = 0;
    } finally {
      loading.value = false;
    }
  }

  async function loadUser(id: number): Promise<void> {
    loading.value = true;
    error.value = null;
    activeUserId.value = id;
    try {
      user.value = await fetchUserByIdUseCase.execute(id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function saveUser(input: EditUserInput): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateUserUseCase.execute(input);
      await loadUser(input.id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    usersTotal,
    usersPage,
    usersPageSize,
    activeUserId,
    user,
    loading,
    error,
    loadUsers,
    loadUser,
    saveUser,
  };
});
