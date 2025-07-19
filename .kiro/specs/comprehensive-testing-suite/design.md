# 設計書

## 概要

Next.jsアプリケーションの包括的なテストスイートを実装するための設計書です。このテストスイートは、既存のコードベースの品質を保護し、将来の変更による回帰を防ぐことを目的としています。

現在のアプリケーションは以下の技術スタックを使用しています：
- **フロントエンド**: Next.js 15.3.1, React 19, TypeScript
- **スタイリング**: Tailwind CSS, Radix UIコンポーネント
- **バックエンド**: Hono (Edge Runtime), Supabase
- **データベース**: PostgreSQL (Drizzle ORM)
- **認証**: Supabase Auth
- **国際化**: next-intl
- **開発ツール**: Biome (Linting/Formatting), Husky (Git Hooks)

## アーキテクチャ

### テストフレームワーク選択

**Jest + React Testing Library + Playwright**の組み合わせを採用します：

- **Jest**: ユニットテスト・統合テストのメインフレームワーク
- **React Testing Library**: Reactコンポーネントのテスト
- **Playwright**: E2Eテスト（ブラウザ自動化）
- **MSW (Mock Service Worker)**: APIモックとネットワークリクエストの制御

### テスト階層

```
E2E Tests (Playwright)
├── Integration Tests (Jest)
│   ├── API Route Tests
│   ├── Database Integration Tests
│   └── Supabase Integration Tests
└── Unit Tests (Jest + RTL)
    ├── Component Tests
    ├── Hook Tests
    ├── Utility Function Tests
    └── Page Tests
```

## コンポーネントとインターフェース

### 1. テスト設定とユーティリティ

#### テスト設定ファイル
- `jest.config.js`: Jest設定
- `jest.setup.js`: テスト環境セットアップ
- `playwright.config.ts`: Playwright設定
- `test-utils.tsx`: カスタムレンダリング関数とプロバイダー

#### モックとフィクスチャ
- `__mocks__/`: 外部ライブラリのモック
- `__fixtures__/`: テストデータとフィクスチャ
- `test-helpers/`: テスト用ヘルパー関数

### 2. コンポーネントテスト

#### テスト対象コンポーネント
- `src/components/ui/*`: Radix UIベースのコンポーネント
- `src/components/common/*`: 共通コンポーネント
- `src/components/features/*`: 機能固有のコンポーネント
- `src/components/app-sidebar.tsx`: サイドバーコンポーネント

#### テスト戦略
- レンダリングテスト
- プロパティ受け渡しテスト
- ユーザーインタラクションテスト
- テーマ切り替えテスト

### 3. APIテスト

#### テスト対象API
- `src/app/api/[...route]/route.ts`: Hono APIルート
- Supabase認証エンドポイント
- データベースCRUD操作

#### テスト戦略
- HTTPステータスコードの検証
- レスポンス形式の検証
- エラーハンドリングの検証
- 認証・認可の検証

### 4. ページテスト

#### テスト対象ページ
- `src/app/(auth)/*`: 認証が必要なページ
- `src/app/(unauth)/*`: 認証不要なページ
- `src/app/main-pages/*`: メインページ

#### テスト戦略
- メタデータの検証
- コンポーネントレンダリングの検証
- 認証リダイレクトの検証
- 国際化の検証

### 5. Supabase統合テスト

#### テスト対象
- `src/lib/supabase/client.ts`: ブラウザクライアント
- `src/lib/supabase/server.ts`: サーバークライアント
- `src/lib/supabase/middleware.ts`: ミドルウェア
- `src/middleware.ts`: Next.jsミドルウェア

#### テスト戦略
- クライアント初期化の検証
- 認証フローの検証
- セッション管理の検証
- データベース操作の検証

## データモデル

### テストデータベース

#### テスト環境設定
```typescript
// テスト用Supabaseクライアント設定
interface TestSupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

// テストデータファクトリー
interface TestDataFactory {
  createUser(): UserProfile;
  createWork(): Work;
  createSkill(): Skill;
  // その他のエンティティ
}
```

#### モックデータ構造
- ユーザープロファイル
- 作品データ
- スキルデータ
- グループ・アライアンスデータ
- 通知データ

### テストフィクスチャ

```typescript
// テストフィクスチャの型定義
interface TestFixtures {
  users: UserProfile[];
  works: Work[];
  skills: Skill[];
  groups: Group[];
}
```

## エラーハンドリング

### テストエラー処理

#### エラーカテゴリ
1. **ネットワークエラー**: API通信失敗
2. **認証エラー**: 認証・認可失敗
3. **データベースエラー**: DB操作失敗
4. **バリデーションエラー**: 入力値検証失敗

#### エラーテスト戦略
```typescript
// エラーハンドリングテストパターン
describe('Error Handling', () => {
  it('should handle network errors gracefully', async () => {
    // ネットワークエラーのモック
    // エラー処理の検証
  });

  it('should handle authentication errors', async () => {
    // 認証エラーのモック
    // リダイレクト処理の検証
  });
});
```

## テスト戦略

### 1. ユニットテスト戦略

#### カバレッジ目標
- **関数・メソッド**: 90%以上
- **分岐**: 85%以上
- **行**: 90%以上

#### テスト優先度
1. **高**: ビジネスロジック、認証、データ操作
2. **中**: UIコンポーネント、ユーティリティ関数
3. **低**: 設定ファイル、型定義

### 2. 統合テスト戦略

#### テスト範囲
- API エンドポイント間の連携
- データベースとアプリケーション層の統合
- 認証フローの統合
- 国際化機能の統合

### 3. E2Eテスト戦略

#### 重要なユーザーフロー
1. ユーザー登録・ログイン
2. プロファイル作成・編集
3. 作品の作成・編集・削除
4. スキル管理
5. グループ機能

#### ブラウザサポート
- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)

### 4. パフォーマンステスト

#### 測定項目
- ページロード時間
- API レスポンス時間
- データベースクエリ実行時間
- バンドルサイズ

## 実装計画

### フェーズ1: 基盤構築
- テストフレームワークのセットアップ
- モック・フィクスチャの作成
- CI/CD統合

### フェーズ2: ユニットテスト
- ユーティリティ関数のテスト
- コンポーネントテスト
- フックテスト

### フェーズ3: 統合テスト
- APIテスト
- データベース統合テスト
- Supabase統合テスト

### フェーズ4: E2Eテスト
- 重要なユーザーフローのテスト
- クロスブラウザテスト

### フェーズ5: 最適化
- テスト実行時間の最適化
- カバレッジレポートの改善
- CI/CDパイプラインの最適化
