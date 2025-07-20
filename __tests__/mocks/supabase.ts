import { vi } from "vitest";

// 型定義
interface SupabaseResponse<T> {
  data: T;
  error: null | {
    message: string;
    status?: number;
  };
}

interface MockUser {
  id: string;
  email: string;
  aud: string;
  role: string;
  email_confirmed_at: string;
  created_at: string;
  updated_at: string;
}

interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: MockUser;
}

// MockQueryBuilder クラス
class MockQueryBuilder {
  private table: string;
  private mockData: Record<string, any[]>;
  private filters: Array<(item: any) => boolean> = [];
  private sortConfig?: { column: string; ascending: boolean };
  private limitCount?: number;
  private rangeConfig?: { from: number; to: number };

  constructor(table: string, mockData: Record<string, any[]>) {
    this.table = table;
    this.mockData = mockData;
  }

  // 基本的なフィルタメソッド
  eq(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  gt(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] > value);
    return this;
  }

  gte(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] >= value);
    return this;
  }

  lt(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] < value);
    return this;
  }

  lte(column: string, value: any): MockQueryBuilder {
    this.filters.push((item) => item[column] <= value);
    return this;
  }

  // 高度なクエリ操作メソッド
  like(column: string, pattern: string): MockQueryBuilder {
    this.filters.push((item) => {
      const value = String(item[column]).toLowerCase();
      const searchPattern = pattern.toLowerCase();

      if (searchPattern.startsWith("%") && searchPattern.endsWith("%")) {
        // 部分一致 (%pattern%)
        const searchTerm = searchPattern.slice(1, -1);
        return value.includes(searchTerm);
      } else if (searchPattern.startsWith("%")) {
        // 後方一致 (%pattern)
        const searchTerm = searchPattern.slice(1);
        return value.endsWith(searchTerm);
      } else if (searchPattern.endsWith("%")) {
        // 前方一致 (pattern%)
        const searchTerm = searchPattern.slice(0, -1);
        return value.startsWith(searchTerm);
      } else {
        // 完全一致
        return value === searchPattern;
      }
    });
    return this;
  }

  in(column: string, values: any[]): MockQueryBuilder {
    this.filters.push((item) => values.includes(item[column]));
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder {
    this.sortConfig = {
      column,
      ascending: options?.ascending ?? true,
    };
    return this;
  }

  limit(count: number): MockQueryBuilder {
    this.limitCount = count;
    return this;
  }

  range(from: number, to: number): MockQueryBuilder {
    this.rangeConfig = { from, to };
    return this;
  }

  // 結果取得メソッド
  async execute(): Promise<SupabaseResponse<any[]>> {
    let data = this.mockData[this.table] || [];

    // フィルタを適用
    for (const filter of this.filters) {
      data = data.filter(filter);
    }

    // ソートを適用
    if (this.sortConfig) {
      data = [...data].sort((a, b) => {
        const aVal = a[this.sortConfig!.column];
        const bVal = b[this.sortConfig!.column];

        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        else if (aVal > bVal) comparison = 1;

        return this.sortConfig!.ascending ? comparison : -comparison;
      });
    }

    // range または limit を適用
    if (this.rangeConfig) {
      data = data.slice(this.rangeConfig.from, this.rangeConfig.to + 1);
    } else if (this.limitCount !== undefined) {
      data = data.slice(0, this.limitCount);
    }

    return {
      data,
      error: null,
    };
  }

  async single(): Promise<SupabaseResponse<any | null>> {
    const result = await this.execute();
    return {
      data: result.data.length > 0 ? result.data[0] : null,
      error: null,
    };
  }
}

// MockInsertBuilder クラス
class MockInsertBuilder {
  private table: string;
  private mockData: Record<string, any[]>;
  private dataToInsert: any;

  constructor(table: string, mockData: Record<string, any[]>, data: any) {
    this.table = table;
    this.mockData = mockData;
    this.dataToInsert = data;
  }

  async execute(): Promise<SupabaseResponse<any[]>> {
    if (!this.mockData[this.table]) {
      this.mockData[this.table] = [];
    }

    const dataArray = Array.isArray(this.dataToInsert)
      ? this.dataToInsert
      : [this.dataToInsert];

    // 実際のデータベースに挿入する代わりに、モックデータに追加
    for (const item of dataArray) {
      this.mockData[this.table].push({ ...item });
    }

    return {
      data: dataArray,
      error: null,
    };
  }
}

// MockUpdateBuilder クラス
class MockUpdateBuilder {
  private table: string;
  private mockData: Record<string, any[]>;
  private dataToUpdate: any;
  private filters: Array<(item: any) => boolean> = [];

  constructor(table: string, mockData: Record<string, any[]>, data: any) {
    this.table = table;
    this.mockData = mockData;
    this.dataToUpdate = data;
  }

  eq(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any): MockUpdateBuilder {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  async execute(): Promise<SupabaseResponse<any[]>> {
    if (!this.mockData[this.table]) {
      return {
        data: [],
        error: null,
      };
    }

    const tableData = this.mockData[this.table];
    const updatedItems: any[] = [];

    // フィルタに一致するアイテムを更新
    for (let i = 0; i < tableData.length; i++) {
      let matchesAllFilters = true;

      for (const filter of this.filters) {
        if (!filter(tableData[i])) {
          matchesAllFilters = false;
          break;
        }
      }

      if (matchesAllFilters) {
        tableData[i] = { ...tableData[i], ...this.dataToUpdate };
        updatedItems.push(tableData[i]);
      }
    }

    return {
      data: updatedItems,
      error: null,
    };
  }
}

// MockDeleteBuilder クラス
class MockDeleteBuilder {
  private table: string;
  private mockData: Record<string, any[]>;
  private filters: Array<(item: any) => boolean> = [];

  constructor(table: string, mockData: Record<string, any[]>) {
    this.table = table;
    this.mockData = mockData;
  }

  eq(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] === value);
    return this;
  }

  neq(column: string, value: any): MockDeleteBuilder {
    this.filters.push((item) => item[column] !== value);
    return this;
  }

  async execute(): Promise<SupabaseResponse<any[]>> {
    if (!this.mockData[this.table]) {
      return {
        data: [],
        error: null,
      };
    }

    const tableData = this.mockData[this.table];
    const deletedItems: any[] = [];
    const newTableData: any[] = [];

    // フィルタに一致するアイテムを削除
    for (const item of tableData) {
      let matchesAllFilters = true;

      for (const filter of this.filters) {
        if (!filter(item)) {
          matchesAllFilters = false;
          break;
        }
      }

      if (matchesAllFilters) {
        deletedItems.push({ ...item });
      } else {
        newTableData.push(item);
      }
    }

    // 更新されたテーブルデータを設定
    this.mockData[this.table] = newTableData;

    return {
      data: deletedItems,
      error: null,
    };
  }
}

// MockDatabase クラス
class MockDatabase {
  private mockData: Record<string, any[]> = {};

  /**
   * テーブル名を指定してクエリビルダーを取得
   * @param table テーブル名
   * @returns クエリビルダーオブジェクト
   */
  from(table: string): {
    select: (columns?: string) => MockQueryBuilder;
    insert: (data: any) => MockInsertBuilder;
    update: (data: any) => MockUpdateBuilder;
    delete: () => MockDeleteBuilder;
  } {
    return {
      select: (columns?: string) => new MockQueryBuilder(table, this.mockData),
      insert: (data: any) => new MockInsertBuilder(table, this.mockData, data),
      update: (data: any) => new MockUpdateBuilder(table, this.mockData, data),
      delete: () => new MockDeleteBuilder(table, this.mockData),
    };
  }

  /**
   * テスト用にモックデータを設定
   * @param table テーブル名
   * @param data 設定するデータ
   */
  _setMockData(table: string, data: any[]): void {
    this.mockData[table] = [...data]; // 配列のコピーを作成して参照を切る
  }

  /**
   * テスト用にモックデータを取得
   * @param table テーブル名
   * @returns テーブルのデータ配列
   */
  _getMockData(table: string): any[] {
    return [...(this.mockData[table] || [])]; // 配列のコピーを返す
  }

  /**
   * テスト用にモックデータをクリア
   */
  _clearMockData(): void {
    this.mockData = {};
  }
}

// 認証モック
export const mockUser: MockUser = {
  id: "test-user-id",
  email: "test@example.com",
  aud: "authenticated",
  role: "authenticated",
  email_confirmed_at: "2024-01-01T00:00:00.000Z",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

export const mockSession: MockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  token_type: "bearer",
  user: mockUser,
};

export const mockAuthState = {
  user: null as MockUser | null,
  session: null as MockSession | null,
  signIn: (email: string, password: string) => {
    if (email === "test@example.com" && password === "password123") {
      mockAuthState.user = mockUser;
      mockAuthState.session = mockSession;
      return { user: mockUser, session: mockSession, error: null };
    }
    return {
      user: null,
      session: null,
      error: { message: "Invalid login credentials" },
    };
  },
  signOut: () => {
    mockAuthState.user = null;
    mockAuthState.session = null;
  },
};

/**
 * Supabaseクライアントのモックを作成
 * @returns モック化されたSupabaseクライアント
 */
export function createMockSupabaseClient() {
  const db = new MockDatabase();

  return {
    from: (table: string) => db.from(table),
    auth: {
      signInWithPassword: async ({
        email,
        password,
      }: { email: string; password: string }) => {
        return mockAuthState.signIn(email, password);
      },
      signOut: async () => {
        mockAuthState.signOut();
        return { error: null };
      },
      getUser: async () => ({
        data: { user: mockAuthState.user },
        error: null,
      }),
      getSession: async () => ({
        data: { session: mockAuthState.session },
        error: null,
      }),
    },
    // テスト用ヘルパーメソッド
    _setMockData: (table: string, data: any[]) => db._setMockData(table, data),
    _getMockData: (table: string) => db._getMockData(table),
    _clearMockData: () => db._clearMockData(),
  };
}

/**
 * モックデータベースインスタンスを作成
 * @returns MockDatabaseインスタンス
 */
export function createMockDatabase() {
  return new MockDatabase();
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
