# vns-doc-generator セットアップ完了記録

## 作成日
2025年10月5日

## 作成したファイル

### 1. メインchatmode
**ファイル**: `vns-masakinihirota/.github/chatmodes/vns-doc-generator.chatmode.md`

**目的**: vns-masakinihirotaプロジェクトのドキュメントを機能単位で自動生成

**特徴**:
- VitePress形式での出力
- 利用者向け/開発者向けの分離
- 最小限のインタラクション（必須項目のみ質問）
- Serena MCPによる自動コード分析
- 設計書参照（必要に応じて）

### 2. VitePress設定
**ファイル**: `vns-masakinihirota-doc/.vitepress/config.ts`

**内容**:
- サイドバー構成（ユーザーガイド、開発者ガイド、API）
- 日本語検索設定
- テーマ設定（ライト/ダークモード）
- ナビゲーション設定

### 3. セットアップガイド
**ファイル**: `vns-masakinihirota-doc/docs/developer-guide/vitepress-setup.md`

**内容**:
- VitePressのインストール手順
- ディレクトリ構造
- 開発サーバーの起動方法
- デプロイ方法（GitHub Pages）

### 4. クイックスタートガイド
**ファイル**: `vns-masakinihirota-doc/docs/developer-guide/doc-generator-quickstart.md`

**内容**:
- chatmodeの使い方
- プロンプト例（利用者向け/開発者向け）
- 生成されるドキュメントの構成
- Tips & トラブルシューティング

## 設定内容

### ドキュメント種別
1. **利用者向け** (`docs/user-guide/`)
   - 機能説明
   - 画面操作手順
   - FAQ

2. **開発者向け** (`docs/developer-guide/`)
   - コンポーネントAPI
   - Server Actions
   - データベーススキーマ
   - 環境構築

### 生成単位
**機能単位** - 例: 作品登録、プロフィール管理、マッチング等

### インタラクション
**最小限** - 必須項目（ドキュメント種別、対象機能、出力先）のみ質問

### 設計書参照
**必要に応じて** - vns-masakinihirota-designから参照

## 使用方法

### 基本的な流れ
1. VS Codeで `vns-doc-generator` chatmodeを選択
2. プロンプト入力: 「作品登録機能の利用者向けドキュメントを生成してください」
3. 必須項目の確認（3つの質問に回答）
4. 自動生成（コード分析 → ドキュメント生成）
5. 確認後、「出力してください」で実際にファイル作成

### プロンプト例
```
# 利用者向け
プロフィール管理機能の利用者向けドキュメントを生成してください

# 開発者向け
作品登録機能の開発者向けドキュメントを生成してください
コンポーネントのProps定義とServer Actionsを含めてください

# 既存更新
docs/user-guide/matching.md を最新のコードに基づいて更新してください
```

## 次のステップ

### 1. VitePressのセットアップ
```bash
cd vns-masakinihirota-doc
pnpm add -D vitepress
pnpm docs:dev  # 開発サーバー起動
```

### 2. 初回ドキュメント生成
優先度の高い機能から順に生成:
- 作品登録機能
- プロフィール管理機能
- マッチング機能

### 3. 継続的な更新
コード変更時に該当機能のドキュメントを更新

## 技術的詳細

### 使用ツール
- **Serena MCP**: プロジェクト構造把握、シンボル検索
- **semantic_search**: セマンティック検索
- **context7**: 最新ドキュメント参照

### 自動収集する情報
- コンポーネントのProps型定義
- Server Actionsの型定義とロジック
- データベーススキーマ（Drizzle ORM）
- JSDoc/TSDocコメント

### 出力形式
VitePress Markdown形式:
```markdown
---
title: {機能名}
description: {説明}
---

# {機能名}
...
```

## 注意事項
1. コード優先（設計書よりも実装を優先）
2. セキュリティ情報は含めない
3. 大きな変更はレビュー後にコミット
4. VitePressのビルドエラーに注意

## 参考資料
- VitePress公式: https://vitepress.dev/ja/
- プロジェクトREADME: vns-masakinihirota-doc/README.md
- 技術スタック: tech_stack メモリ
