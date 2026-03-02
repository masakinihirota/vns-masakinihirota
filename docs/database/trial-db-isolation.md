# Trial機能のDB隔離ポリシー

## 目的

お試し（`anonymous`）ユーザーの操作で生成されるデータを、永続DBへ書き込ませない。

## 必須ルール

1. Trialデータは `localStorage` / Cookie のみで保持する。
2. Trialデータを DB へ移行しない（本登録時は初期化して再作成）。
3. API / Server Action の書き込み処理は、認証ユーザーのみ許可する。
4. 書き込み系APIは必ず `try-catch` で認可失敗を捕捉し、`403` を返す。
5. DB側はRLSで匿名アクセスを拒否する（default deny）。

## 実装チェックポイント

- 書き込み系 Server Action は `withAuth` を必須化する。
- `session.user.role === 'anonymous'` の場合は即時拒否する。
- 認可失敗時は監査ログ（`audit_logs`）に拒否理由を記録する。

## 例外方針

- Trial専用画面のUI表示・一時保存は許可する。
- ただし「作成・更新・削除」の永続化処理はすべて拒否する。

## 運用

- リリース前に `pnpm db:check-schema` を実行して RLS とスキーマ整合性を確認する。
- 認可層（Proxy / Server Action / RLS）の3層防御を維持する。
