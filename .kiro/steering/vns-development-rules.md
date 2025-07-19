---
inclusion: always
---

# VNS masakinihirota 開発ルール

## 基本方針

- 日本語でのコミュニケーションを優先
- プライバシーファーストの設計を常に意識
- オアシス宣言の理念に基づく安全な環境作り

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

- 個人情報の最小化
- プロフィール間の完全な分離
- 認証・認可の厳格な実装
- Supabase RLS ポリシーの適切な設定
- XSS、CSRF 対策の実装

## UI/UX 指針

- レスポンシブデザインの実装
- アクセシビリティ（WCAG 2.1 AA 準拠）
- ダークモード・ライトモードの対応
- 国際化（i18n）対応
- ユーザビリティを重視したインターフェース設計

## テスト戦略

- テスト駆動開発（TDD）の実践
- ユニットテスト、統合テスト、E2E テストの実装
- コードカバレッジ 90% 以上を目標
- テストデータとモックの適切な管理

## 実装時の注意点

- 一度に一つのタスクのみ実装
- 要件定義書と設計書を常に参照
- コードレビューとペアプログラミングの活用
- パフォーマンスと SEO の最適化
- 継続的インテグレーション（CI/CD）の活用
