import { MockQueryBuilder } from "./supabase-query-builder";
import {
  MockInsertBuilder,
  MockUpdateBuilder,
  MockDeleteBuilder,
} from "./supabase-data-operations";
import { MockRpcBuilder, MockStorageBuilder } from "./supabase-storage-rpc";

// MockDatabase クラス
export class MockDatabase {
  private mockData: Record<string, any[]> = {};
  private mockFunctions: Record<string, (params: any) => any> = {};
  private mockStorage: Record<string, Record<string, Uint8Array>> = {};

  /**
   * テーブル名を指定してクエリビルダーを取得
   * @param table テーブル名
   * @returns クエリビルダーオブジェクト
   */
  from(table: string): {
    select: (columns?: string | string[]) => MockQueryBuilder;
    insert: (data: any) => MockInsertBuilder;
    update: (data: any) => MockUpdateBuilder;
    delete: () => MockDeleteBuilder;
  } {
    return {
      select: (columns?: string | string[]) => {
        const builder = new MockQueryBuilder(table, this.mockData);
        return columns ? builder.select(columns) : builder;
      },
      insert: (data: any) => new MockInsertBuilder(table, this.mockData, data),
      update: (data: any) => new MockUpdateBuilder(table, this.mockData, data),
      delete: () => new MockDeleteBuilder(table, this.mockData),
    };
  }

  /**
   * RPC関数を呼び出す
   * @param functionName 関数名
   * @param params パラメータ
   * @returns RPCビルダー
   */
  rpc(functionName: string, params: Record<string, any> = {}): MockRpcBuilder {
    return new MockRpcBuilder(functionName, params, this.mockFunctions);
  }

  /**
   * ストレージバケットを取得
   * @param bucket バケット名
   * @returns ストレージビルダー
   */
  storage(bucket: string): MockStorageBuilder {
    return new MockStorageBuilder(bucket, this.mockStorage);
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
   * テスト用にモック関数を設定
   * @param functionName 関数名
   * @param implementation 実装関数
   */
  _setMockFunction(
    functionName: string,
    implementation: (params: any) => any,
  ): void {
    this.mockFunctions[functionName] = implementation;
  }

  /**
   * テスト用にモックデータをクリア
   */
  _clearMockData(): void {
    this.mockData = {};
    this.mockFunctions = {};
    this.mockStorage = {};
  }
}
