# 設計書

## 概要

Biomeリンターの`lint/suspicious/noThenProperty`エラーを解決するため、Supabaseモックファイルの実装を改善します。現在の実装では`then`プロパティを直接オブジェクトに追加していますが、これをPromiseを返すメソッドに変更することで、より適切なモック実装を提供し
## アーキテクチャ

### 現在の問題

1. **Thenable オブジェクトの誤用**: `then`プロパティを直接オブジェクトに追加することで、Promiseライクなオブジェクトを作成している
2. **リンターエラー**: Biomeが`then`プロパティの不適切な使用を検出している
3. **型安全性の欠如**: 実際のPromiseではないオブジェクトがPromiseのように扱われている

### 解決方針

1. **Promise ベースの実装**: `then`プロパティの代わりに、実際のPromiseを返すメソッドを実装
2. **チェーンメソッドの改善**: Supabaseクライアントの実際の動作により近いモック実装
3. **型安全性の向上**: TypeScriptの型システムを活用した適切な型定義

## コンポーネントと インターフェース

### MockQueryBuilder クラス

```typescript
class MockQueryBuilder {
  private table: string;
  private mockData: Record<string, any[]>;
  private filters: Array<(item: any) => boolean> = [];
  private sortConfig?: { column: string; ascending: boolean };
  private limitCount?: number;
  private rangeConfig?: { from: number; to: number };

  // フィルタリングメソッド
  eq(column: string, value: any): MockQueryBuilder
  neq(column: string, value: any): MockQueryBuilder
  gt(column: string, value: any): MockQueryBuilder
  // ... その他のフィルタメソッド

  // 結果取得メソッド
  async execute(): Promise<{ data: any[]; error: null }>
  single(): Promise<{ data: any | null; error: null }>
}
```

### MockDatabase クラス

```typescript
class MockDatabase {
  private mockData: Record<string, any[]> = {};

  from(table: string): {
    select(columns?: string): MockQueryBuilder;
    insert(data: any): MockInsertBuilder;
    update(data: any): MockUpdateBuilder;
    delete(): MockDeleteBuilder;
  }

  // テスト用ヘルパーメソッド
  _setMockData(table: string, data: any[]): void
  _getMockData(table: string): any[]
  _clearMockData(): void
}
```

## データモデル

### SupabaseResponse 型

```typescript
interface SupabaseResponse<T> {
  data: T;
  error: null | {
    message: string;
    status?: number;
  };
}
```

### MockAuthState クラス

既存の実装を維持し、認証状態の管理を継続します。

## エラーハンドリング

### リンターエラーの解決

1. **`then`プロパティの削除**: すべての`then`プロパティを削除し、代わりにPromiseを返すメソッドを実装
2. **適切なPromise実装**: `vi.fn().mockResolvedValue()`の代わりに実際のPromiseを返す実装

### テストエラーの防止

1. **型安全性**: TypeScriptの型チェックを活用してランタイムエラーを防止
2. **一貫性のあるAPI**: 実際のSupabaseクライアントと同じインターフェースを提供

## テスト戦略

### 既存テストの互換性

1. **APIの後方互換性**: 既存のテストコードが引き続き動作するようにインターフェースを維持
2. **段階的移行**: 新しい実装に段階的に移行し、テストの安定性を保つ

### 新しいテストケース

1. **Promise動作のテスト**: 新しいPromiseベースの実装が正しく動作することを確認
2. **チェーンメソッドのテスト**: メソッドチェーンが適切に機能することを確認
3. **エラーハンドリングのテスト**: エラーケースが適切に処理されることを確認

## 実装詳細

### Phase 1: Core Infrastructure

1. **MockQueryBuilder クラスの実装**: 基本的なクエリビルダー機能
2. **Promise ベースのメソッド**: `then`プロパティの代わりにPromiseを返すメソッド
3. **基本的なフィルタリング**: eq, neq, gt, gte, lt, lte の実装

### Phase 2: Advanced Features

1. **複雑なクエリ操作**: like, in, order, limit, range の実装
2. **データ操作**: insert, update, delete の実装
3. **チェーンメソッド**: 複数の操作を組み合わせる機能

### Phase 3: Integration & Testing

1. **既存テストとの統合**: 既存のテストケースが正常に動作することを確認
2. **新しいテストケースの追加**: 新機能のテストケース
3. **リンターエラーの解決確認**: Biomeリンターがエラーを報告しないことを確認

## パフォーマンス考慮事項

### メモリ使用量

1. **効率的なデータ構造**: 大量のテストデータを効率的に管理
2. **ガベージコレクション**: 不要なオブジェクトの適切な解放

### 実行速度

1. **非同期処理の最適化**: 不要な遅延を避けた高速なモック実装
2. **キャッシュ機能**: 頻繁にアクセスされるデータのキャッシュ

## セキュリティ考慮事項

### テストデータの分離

1. **データの独立性**: 各テストケース間でのデータの完全な分離
2. **状態のリセット**: テスト実行前後での状態の適切なリセット

### 型安全性

1. **TypeScript活用**: 型システムを活用した安全なモック実装
2. **ランタイム検証**: 必要に応じたランタイムでの型チェック
