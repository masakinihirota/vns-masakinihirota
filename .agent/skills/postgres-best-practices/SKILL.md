---
name: supabase-postgres-best-practices
description: SupabaseによるPostgresパフォーマンス最適化とベストプラクティス。Postgresクエリ、スキーマ設計、データベース設定の作成、レビュー、最適化時に使用します。
license: MIT
metadata:
  author: supabase
  version: "1.0.0"
---

# Supabase Postgres ベストプラクティス

Supabaseが管理する、Postgresの包括的なパフォーマンス最適化ガイドです。8つのカテゴリにわたるルールが含まれており、自動クエリ最適化とスキーマ設計を導くために影響度順に優先順位付けされています。

## 適用タイミング (When to Apply)

以下の場合にこれらのガイドラインを参照してください：

- SQLクエリの作成やスキーマの設計を行う時
- インデックスの実装やクエリの最適化を行う時
- データベースのパフォーマンス問題をレビューする時
- コネクションプーリングやスケーリングの設定を行う時
- Postgres固有の機能を最適化する時
- 行レベルセキュリティ (RLS) を扱う時

## 優先度別ルールカテゴリ (Rule Categories by Priority)

| 優先度 | カテゴリ               | 影響度   | プレフィックス |
| ------ | ---------------------- | -------- | -------------- |
| 1      | クエリパフォーマンス   | **重要** | `query-`       |
| 2      | 接続管理               | **重要** | `conn-`        |
| 3      | セキュリティ & RLS     | **重要** | `security-`    |
| 4      | スキーマ設計           | 高       | `schema-`      |
| 5      | 同時実行性とロック     | 中〜高   | `lock-`        |
| 6      | データアクセスパターン | 中       | `data-`        |
| 7      | 監視と診断             | 低〜中   | `monitor-`     |
| 8      | 高度な機能             | 低       | `advanced-`    |

## 使用方法 (How to Use)

詳細な説明とSQLの例については、個々のルールファイルを参照してください：

```
rules/query-missing-indexes.md
rules/schema-partial-indexes.md
rules/_sections.md
```

各ルールファイルには以下が含まれています：

- なぜそれが重要かという簡潔な説明
- 誤ったSQLの例とその説明
- 正しいSQLの例とその説明
- 任意のEXPLAIN出力またはメトリクス
- 追加のコンテキストと参照
- Supabase固有の注釈（該当する場合）

## 完全なドキュメント (Full Compiled Document)

すべてのルールが展開された完全なガイドについては、`AGENTS.md` を参照してください。
