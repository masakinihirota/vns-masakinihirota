# vns-masakinihirota プロジェクト概要

## プロジェクトの目的
Next.js 15 + Supabase + Drizzle ORM を基盤とした現代的なWebアプリケーション。
多言語対応（日本語、英語、ドイツ語）の認証機能付きWebサイト。

## 主要機能
- ユーザー認証（Google OAuth、GitHub OAuth、匿名認証）
- 多言語対応（next-intl使用）
- ダークモード対応（next-themes使用）
- レスポンシブデザイン（shadcn/ui + Tailwind CSS）
- API エンドポイント（Hono）

## プロジェクト構成
大規模なWorkspaceの一部として以下のリポジトリと連携：
- **vns-masakinihirota**: メインアプリケーション（このリポジトリ）
- **vns-masakinihirota-custom-instructions**: カスタム指示書
- **vns-masakinihirota-design**: 設計書・UI/UXガイドライン
- **vns-masakinihirota-doc**: ドキュメント・用語集