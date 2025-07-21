# Supabase モックライブラリ

このディレクトリには、テスト用の Supabase クライアントモックが含まれています。

## 概要

このモックライブラリは、Supabase の以下の機能をモックします：

- 認証（Auth）
- データベース操作（Database）
- ストレージ（Storage）
- RPC関数（Functions）

## 使用方法

### 基本的な使用方法

```typescript
import { createMockSupabaseClient, setupTestData } from './__tests__/mocks';

describe('テストスイート', () => {
  let supabase;

  beforeEach(() => {
    // モッククライアントを作成
    supabase = createMockSupabaseClient();

    // テストデータをセットアップ
    setupTestData(supabase);

    // 必要に応じて認証状態をセット
    supabase._setAuthState({
      user: { id: 'test-user-id', email: 'test@example.com', /* ... */ },
      session: { /* セッション情報 */ }
    });
  });

  afterEach(() => {
    // テストデータをクリア
    supabase._clearMockData();
  });

  it('テストケース', async () => {
    // テストコード
    const { data, error } = await supabase.from('profiles').select().execute();
    // アサーション
  });
});
```

### カスタムデータの設定

```typescript
// カスタムデータを設定
supabase._setMockData('profiles', [
  { id: '1', user_id: 'test-user-id', username: 'testuser' },
  { id: '2', user_id: 'other-user-id', username: 'otheruser' }
]);

// データを取得して確認
const profiles = supabase._getMockData('profiles');
```

### カスタムRPC関数の設定

```typescript
// カスタムRPC関数を設定
supabase._setMockFunction('calculate_stats', (params) => {
  return { total: 42, average: 4.2 };
});

// RPC関数を呼び出し
const { data } = await supabase.rpc('calculate_stats', { user_id: 'test-user-id' }).execute();
```

## 主要なモジュール

- `supabase-types.ts` - 型定義
- `supabase-auth.ts` - 認証モック
- `supabase-database.ts` - データベースモック
- `supabase-query-builder.ts` - クエリビルダーモック
- `supabase-data-operations.ts` - データ操作モック
- `supabase-storage-rpc.ts` - ストレージとRPC関数モック
- `supabase-enhanced-client.ts` - クライアント統合モック
- `index.ts` - エントリーポイントとヘルパー関数

## サポートされている機能

### 認証

- サインイン（メール/パスワード、OTP、OAuth）
- サインアップ
- サインアウト
- セッション管理
- パスワードリセット
- ユーザー情報更新

### データベース

- データ取得（select）
- データ挿入（insert）
- データ更新（update）
- データ削除（delete）
- フィルタリング（eq, neq, gt, gte, lt, lte, like, in, is, not, or）
- ソート（order）
- ページネーション（limit, range）
- カラム選択（select）
- カウント（count）
- 結合（join）

### ストレージ

- ファイルアップロード（upload）
- ファイルダウンロード（download）
- ファイル削除（remove）
- ファイル一覧取得（list）

### RPC関数

- カスタム関数の呼び出し

## テストファイル

- `supabase-client.test.ts` - クライアントモックのテスト
- `supabase-auth.test.ts` - 認証モックのテスト
- `supabase-integration.test.ts` - 統合テスト

## 注意事項

このモックライブラリは、実際の Supabase クライアントの完全な代替ではありません。テスト目的で使用する場合は、必要な機能が正しくモックされていることを確認してください。
