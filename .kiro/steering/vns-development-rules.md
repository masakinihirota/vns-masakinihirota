---
inclusion: always
---

# VNS masakinihirota 開発ルール

## 基本方針

- 日本語でのコミュニケーションを優先
- プライバシーファーストの設計を常に意識
- オアシス宣言の理念に基づく安全な環境作り

## アーキテクチャ思想

### ページ単位の小さなアプリ設計

- **1 ページ = 1 つの小さなアプリ**: 各ページを独立したアプリケーションとして設計
- **Next.js App Router**: 小さなアプリをまとめるオーケストレーター
- **共通データベース**: 全ページで共有するデータ書庫として機能

### 設計の利点

- 機能の独立性により保守性が向上
- チーム開発での並行作業が容易
- 障害の局所化（1 ページの問題が他に影響しない）
- スケーラビリティの向上

### 注意点と対策

- **コード重複対策**: 共通ロジックを hooks/utils に抽出
- **状態管理**: ページ間共有が必要な場合は Context API を活用
- **パフォーマンス**: Next.js の自動最適化を信頼し、必要に応じて動的インポート

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS, shadcn/ui コンポーネント
- **バックエンド**: Supabase (認証・データベース), Hono (API)
- **テスト**: Vitest, React Testing Library, Playwright
- **開発ツール**: Biome (リンター・フォーマッター), Husky (Git hooks)

## コーディング規約

- TypeScript の型安全性を最優先
- エラーハンドリングは必須（try-catch、Error boundaries）
- 日本語のコメントとドキュメント
- Supabase のベストプラクティスに従う
- shadcn/ui コンポーネントの使用を優先
- Tailwind CSS のユーティリティクラスを活用

## アーキテクチャパターン

- **ディレクトリ構造**: Next.js App Router の規約に従う
- **コンポーネント設計**: 単一責任の原則、再利用可能性を重視
- **状態管理**: React の組み込み状態管理を基本とし、必要に応じて Context API
- **API 設計**: RESTful API、適切な HTTP ステータスコード
- **データベース**: Supabase の Row Level Security (RLS) を活用

## セキュリティ要件

- **個人情報の最小化**: 必要最小限のデータのみ収集・保存
- **プロフィール間の完全な分離**: ユーザー間のデータ漏洩防止
- **認証・認可の厳格な実装**: Supabase 認証の適切な活用
- **Row Level Security (RLS)**: Supabase ポリシーの適切な設定
- **入力値の検証**: 全ての外部入力に対するバリデーション
- **XSS 対策**: dangerouslySetInnerHTML の使用を避ける
- **CSRF 対策**: API エンドポイントでのトークン検証
- **環境変数管理**: 機密情報は環境変数で管理

## UI/UX 指針

- レスポンシブデザインの実装
- アクセシビリティ（WCAG 2.1 AA 準拠）
- ダークモード・ライトモードの対応
- 国際化（i18n）対応
- ユーザビリティを重視したインターフェース設計

## テスト戦略

- テスト駆動開発（TDD）の実践 t-wada が提唱している
- ユニットテスト、統合テスト、E2E テストの実装
- コードカバレッジ 90% 以上を目標
- テストデータとモックの適切な管理

## 実装時の注意点

- 一度に一つのタスクのみ実装
- 要件定義書と設計書を常に参照
- コードレビューとペアプログラミングの活用
- パフォーマンスと SEO の最適化
- 継続的インテグレーション（CI/CD）の活用

## コロケーションパターン

### 基本概念

コロケーションとは、関連するファイル（コンポーネント、ロジック、テスト、スタイル）を同じディレクトリに配置する設計パターンです。

参考: https://qiita.com/masakinihirota/items/27f961dfa6871aad0550

### 適用方針

- ページのコンポーネントの塊を、ビュー・ロジック・フェッチ・テストを一つのフォルダ以下に配置
- 機能単位でのファイル管理により、保守性と可読性を向上
- 関連するコードの発見と変更を容易にする

## Next.js App Router でのルーティングとコンポーネント管理

### ディレクトリ構造の分離

Next.js App Router では、ルーティング構造とコンポーネント構造を分離して管理します。

参考: https://qiita.com/masakinihirota/items/2695cba68816794e33d3

### App Router の基本ルール

- `app/` ディレクトリ: ルーティング専用（page.tsx、layout.tsx、loading.tsx など）
- `components/` ディレクトリ: 再利用可能なコンポーネント
- 各フォルダがルートセグメントを表す
- `page.tsx` がそのルートの実際のページコンポーネント
- `layout.tsx` でレイアウトを定義

### ルーティング構造の例

```
src/app/
├── page.tsx              # / (ルートページ)
├── profile/
│   ├── page.tsx          # /profile
│   └── layout.tsx        # プロフィール用レイアウト（オプション）
├── settings/
│   └── page.tsx          # /settings
└── layout.tsx            # 全体レイアウト
```

### ページコンポーネントの実装例

```typescript
// src/app/profile/page.tsx
import * as profile from "@/components/profile";

export default function ProfilePage() {
  return (
    <div>
      <profile.ProfileDisplay />
      <profile.ProfileForm />
    </div>
  );
}
```

### ディレクトリ構造の詳細

Next.js は 1 ページに複数のコンポーネントで構成されます。共通コンポーネントとページ固有のコアコンポーネントを明確に分離します。

```
src/
├── app/
│   ├── page.tsx             # ルートページ
│   ├── profile/
│   │   ├── page.tsx         # プロフィールページ
│   └── settings/
│       └── page.tsx         # 設定ページ
├── components/
│   ├── common/              # 共通コンポーネント
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   └── Input/
│   │       ├── Input.tsx
│   │       └── Input.test.tsx
│   ├── profile/             # profileページ用のコンポーネント群
│   │   ├── ProfileDisplay/  # プロフィール表示コンポーネント
│   │   │   ├── ProfileDisplay.tsx
│   │   │   ├── ProfileDisplay.logic.ts
│   │   │   ├── ProfileDisplay.fetch.ts
│   │   │   └── ProfileDisplay.test.ts
│   │   ├── ProfileForm/     # プロフィール編集コンポーネント
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── ProfileForm.logic.ts
│   │   │   ├── ProfileForm.fetch.ts
│   │   │   └── ProfileForm.test.ts
│   │   └── index.ts         # エクスポート管理
│   └── settings/            # settingsページ用のコンポーネント群
│       └── ...
```

### ファイル命名規則

- `ComponentName.tsx`: メインコンポーネント
- `ComponentName.logic.ts`: ビジネスロジック
- `ComponentName.fetch.ts`: データフェッチ処理（Next.js の fetch 機能活用）
- `ComponentName.test.ts`: 基本テストファイル
- `ComponentName.integration.test.ts`: 統合テスト（必要に応じて）
- `ComponentName.e2e.test.ts`: E2E テスト（必要に応じて）
- `index.ts`: コンポーネントのエクスポート管理

### テストファイルの分割ルール

テストは必要に応じて機能単位で複数ファイルに分割可能：

```
ProfileForm/
├── ProfileForm.tsx
├── ProfileForm.logic.ts
├── ProfileForm.fetch.ts
├── ProfileForm.test.ts           # 基本的なレンダリングテスト
├── ProfileForm.validation.test.ts # バリデーションテスト
├── ProfileForm.submit.test.ts     # 送信処理テスト
└── ProfileForm.integration.test.ts # 統合テスト
```

### コンポーネントのエクスポート管理

各ページ用のコンポーネントは`index.ts`でまとめてエクスポートします。

**例: src/components/profile/index.ts**

```typescript
import ProfileDisplay from "./ProfileDisplay/ProfileDisplay";
import ProfileForm from "./ProfileForm/ProfileForm";

export { ProfileDisplay, ProfileForm };
```

**例: src/app/profile/page.tsx**

```typescript
import * as profile from "@/components/profile"; // パスエイリアスを使用

export default function ProfilePage() {
  return (
    <div>
      <profile.ProfileDisplay />
      <profile.ProfileForm />
    </div>
  );
}
```

### エクスポート規則

- 名前付きエクスポート（named export）を使用
- デフォルトエクスポートは各コンポーネントファイル内でのみ使用
- パスエイリアス（@/）を活用してインポートパスを簡潔に

## 追加のベストプラクティス

### コード品質

- **型安全性の徹底**: `any`型の使用を避け、厳密な型定義を行う
- **関数の単一責任**: 一つの関数は一つの責務のみを持つ
- **純粋関数の優先**: 副作用のない関数を可能な限り作成
- **早期リターン**: ネストを減らすため早期リターンパターンを使用

### パフォーマンス最適化

- **React.memo**: 不要な再レンダリングを防ぐ
- **useMemo/useCallback**: 重い計算やコールバック関数の最適化
- **動的インポート**: 必要に応じてコンポーネントの遅延読み込み
- **画像最適化**: Next.js Image コンポーネントの活用

### セキュリティ

- **入力値の検証**: 全ての外部入力に対するバリデーション
- **XSS 対策**: dangerouslySetInnerHTML の使用を避ける
- **CSRF 対策**: API エンドポイントでのトークン検証
- **環境変数**: 機密情報は環境変数で管理

### アクセシビリティ

- **セマンティック HTML**: 適切な HTML 要素の使用
- **ARIA 属性**: スクリーンリーダー対応
- **キーボードナビゲーション**: タブ操作での完全な操作性
- **カラーコントラスト**: WCAG 2.1 AA 準拠

### エラーハンドリング

- **Error Boundary**: React Error Boundary の実装
- **try-catch**: 非同期処理での適切なエラーハンドリング
- **ユーザーフレンドリーなエラーメッセージ**: 技術的でない分かりやすいメッセージ
- **ログ出力**: 開発・本番環境での適切なログレベル

### 国際化（i18n）

- **next-intl**: Next.js 公式推奨の国際化ライブラリ使用
- **翻訳キーの命名**: 階層的で分かりやすいキー命名
- **日付・数値フォーマット**: ロケールに応じた適切なフォーマット
- **RTL 対応**: 右から左に読む言語への対応考慮

### Git 運用

- **コミットメッセージ**: Conventional Commits に従った明確なメッセージ
- **ブランチ戦略**: feature/fix/hotfix ブランチの適切な使い分け
- **プルリクエスト**: 小さく頻繁な PR でレビューしやすく
- **コードレビュー**: セキュリティ・パフォーマンス・可読性の観点でレビュー
