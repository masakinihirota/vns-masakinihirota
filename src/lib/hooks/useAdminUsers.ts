/**
 * Admin Users Management Hook
 *
 * @description
 * Simple custom hook for admin user management
 * - Manages API calls and local state
 * - Can be upgraded to TanStack Query v5 later
 * - URL query parameters ready for nuqs integration
 *
 * @note
 * Phase 6: RPC Client完全統合で全API呼び出しが型安全
 */

'use client';

import { useState, useCallback } from 'react';
import { client } from '@/lib/api/client';
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from '@/lib/api/schemas/admin';

interface ListUsersOptions {
  limit?: number;
  offset?: number;
  sort?: 'name' | 'email' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
}

interface ListUsersResponse {
  items: UserResponse[];
  total: number;
  limit: number;
  offset: number;
}

interface UseAdminUsersState {
  users: UserResponse[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
}

/**
 * Hook for managing admin users with pagination and search
 */
export function useAdminUsers(initialPageSize = 20) {
  const [state, setState] = useState<UseAdminUsersState>({
    users: [],
    total: 0,
    isLoading: false,
    error: null,
    page: 0,
    pageSize: initialPageSize,
  });

  /**
   * Fetch users with options
   */
  const fetchUsers = useCallback(
    async (options: ListUsersOptions = {}) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const {
          limit = state.pageSize,
          offset = state.page * state.pageSize,
          sort = 'createdAt',
          order = 'desc',
          search = '',
        } = options;

        // ✅ Phase 6: RPC Client 完全統合
        // 型安全: client.admin.users.get() の型は型定義スキーマで保証
        const response = await client.admin.users.get({
          query: {
            limit: limit.toString(),
            offset: offset.toString(),
            sort,
            order,
            ...(search && { search }),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const json = await response.json();
        if (!json.success) {
          throw new Error(json.error?.message || 'Unknown error');
        }

        const data = json.data as ListUsersResponse;
        setState((prev) => ({
          ...prev,
          users: data.items,
          total: data.total,
          isLoading: false,
        }));

        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err,
        }));
        throw err;
      }
    },
    [state.pageSize, state.page]
  );

  /**
   * Create new user
   */
  const createUser = useCallback(
    async (data: CreateUserRequest) => {
      try {
        // ✅ Phase 6: RPC Client 完全統合
        // 型安全: client.admin.users.post() の型は型定義スキーマで保証
        const response = await client.admin.users.post(data);

        if (!response.ok) {
          throw new Error(`Failed to create user: ${response.statusText}`);
        }

        const json = await response.json();
        if (!json.success) {
          throw new Error(json.error?.message || 'Unknown error');
        }

        // Refresh users list
        await fetchUsers();
        return json.data as UserResponse;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [fetchUsers]
  );

  /**
   * Update user
   */
  const updateUser = useCallback(
    async (id: string, data: UpdateUserRequest) => {
      try {
        // ✅ Phase 6: RPC Client 完全統合
        // 型安全: client.admin.users[':id'].patch() の型は型定義スキーマで保証
        const response = await client.admin.users[":id"].patch({
          param: { id },
          json: data,
        });

        if (!response.ok) {
          throw new Error(`Failed to update user: ${response.statusText}`);
        }

        const json = await response.json();
        if (!json.success) {
          throw new Error(json.error?.message || 'Unknown error');
        }

        // Refresh users list
        await fetchUsers();
        return json.data as UserResponse;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [fetchUsers]
  );

  /**
   * Delete user
   */
  const deleteUser = useCallback(
    async (id: string) => {
      try {
        // ✅ Phase 6: RPC Client 完全統合
        // 型安全: client.admin.users[':id'].delete() の型は型定義スキーマで保証
        const response = await client.admin.users[":id"].delete({
          param: { id },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.statusText}`);
        }

        const json = await response.json();
        if (!json.success) {
          throw new Error(json.error?.message || 'Unknown error');
        }

        // Refresh users list
        await fetchUsers();
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [fetchUsers]
  );

  /**
   * Pagination helpers
   */
  const goToPage = useCallback(
    (page: number) => {
      setState((prev) => ({ ...prev, page: Math.max(0, page) }));
    },
    []
  );

  const nextPage = useCallback(() => {
    if ((state.page + 1) * state.pageSize < state.total) {
      goToPage(state.page + 1);
    }
  }, [state.page, state.pageSize, state.total, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(Math.max(0, state.page - 1));
  }, [state.page, goToPage]);

  return {
    // State
    users: state.users,
    total: state.total,
    isLoading: state.isLoading,
    error: state.error,
    page: state.page,
    pageSize: state.pageSize,

    // Mutations
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,

    // Pagination
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: (state.page + 1) * state.pageSize < state.total,
    hasPrevPage: state.page > 0,
  };
}
