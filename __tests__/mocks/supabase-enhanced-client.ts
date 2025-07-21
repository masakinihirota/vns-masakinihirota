import { vi } from "vitest";
import { MockSupabaseClient } from "./supabase-types";
import { mockAuthState } from "./supabase-auth";
import { MockDatabase } from "./supabase-database";

/**
 * 拡張されたSupabaseクライアントのモックを作成
 * @returns モック化されたSupabaseクライアント
 */
export function createMockSupabaseClient(): MockSupabaseClient {
  const db = new MockDatabase();

  return {
    from: (table: string) => db.from(table),
    rpc: (functionName: string, params: Record<string, any> = {}) =>
      db.rpc(functionName, params),
    storage: (bucket: string) => db.storage(bucket),
    auth: {
      // 認証メソッド
      signInWithPassword: mockAuthState.signInWithPassword,
      signInWithOtp: mockAuthState.signInWithOtp,
      signInWithOAuth: mockAuthState.signInWithOAuth,
      signUp: mockAuthState.signUp,
      signOut: mockAuthState.signOut,
      resetPasswordForEmail: mockAuthState.resetPasswordForEmail,
      updateUser: mockAuthState.updateUser,
      getSession: mockAuthState.getSession,
      getUser: mockAuthState.getUser,
      refreshSession: mockAuthState.refreshSession,

      // セッション変更イベント
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // イベントリスナーの登録（実際には何もしない）
        return {
          data: { subscription: { unsubscribe: () => {} } },
          error: null,
        };
      },
    },

    // テスト用ヘルパーメソッド
    _setMockData: (table: string, data: any[]) => db._setMockData(table, data),
    _getMockData: (table: string) => db._getMockData(table),
    _setMockFunction: (name: string, impl: (params: any) => any) =>
      db._setMockFunction(name, impl),
    _clearMockData: () => db._clearMockData(),
    _setAuthState: (state: { user?: any | null; session?: any | null }) => {
      if (state.user !== undefined) mockAuthState.user = state.user;
      if (state.session !== undefined) mockAuthState.session = state.session;
    },
  };
}

/**
 * クライアント側のSupabaseクライアントモックを作成
 * @returns モック化されたSupabaseクライアント
 */
export function createMockClientFunction() {
  return createMockSupabaseClient();
}

/**
 * サーバー側のSupabaseクライアントモックを作成
 * @returns モック化されたSupabaseクライアント
 */
export function createMockServerClientFunction() {
  return createMockSupabaseClient();
}
