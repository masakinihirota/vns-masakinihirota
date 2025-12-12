# Git Commit Message Template (日本語版)
Conventional Commits に基づいて記述します。

## 構文
type(scope): 短い概要（命令形・末尾に句点なし）

例:
feat(api): ユーザー認証エンドポイントを追加

## type 一覧
- feat     : 新機能追加
- fix      : バグ修正
- refactor : 仕様変更を伴わないリファクタリング
- perf     : パフォーマンス改善
- style    : コードスタイルやフォーマット修正（機能変更なし）
- docs     : ドキュメントのみの変更
- test     : テストコード追加・修正
- chore    : ビルド、CI、依存関係など雑務
- revert   : 以前のコミットを取り消す

## scope（任意）
対象範囲を簡潔に記載（例: api, ui, db, build）

## 本文（詳細説明）
- なぜこの変更が必要か
- どんな問題を解決したか
- どのように修正したか
（概要行との間は空行を入れる）

## 影響範囲・補足
- 影響範囲（UI / API / データなど）
- 追加で注意が必要な点・制約
- 今後のTODO

## Issue / PR リンク
close #123
ref #456
