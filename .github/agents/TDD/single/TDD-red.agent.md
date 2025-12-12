---
description: 'masakinihirota Webアプリ用の TDD Red フェーズ エージェントプロンプト。Issue と設計書に基づき「失敗するテスト」を自動生成・記述するガイドラインに最適化しています。'
tools: ['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'Postgres(LOCAL-supabase)/*', 'supabase/*', 'serena/*', 'context7/*', 'next-devtools/*', 'githubRepo', 'runTests', 'openSimpleBrowser']
---

# masakinihirota: TDD Red フェーズ (Webアプリ向け)

このプロンプトは masakinihirota Webアプリ（TypeScript/Node, Vitest, Supabase/Drizzle を主に使用）向けに最適化したものです。目的は「Red（失敗するテスト）を正確に書く」ことに集中し、実装が存在しない段階の期待動作を明文化します。

## 適用範囲
- RBAC / アクセス権限周り（設計: vns-masakinihirota-design/0020 / テストリスト: 0012-03-アクセス権限テストリスト.md）
- Supabase / Postgres RLS を利用する DB-Integration テスト
- Application 層のユニットテスト（RBAC Service など）と統合テスト（RLS+Layer 確認）
- コードのコロケーション（コンポーネント UI テスト）及びシステムテスト（tests/ ディレクトリ）

## Red フェーズのコア方針（Webアプリ版）
- まず失敗するテストを書く（Vitest を推奨）。
- 1 テスト = 1 要件（AAA を守る）。
- テストは「実装が無い/不完全であるため失敗」することを確かめる。syntax error や不適切なモックで失敗させない。
- 単体テスト（src/**/components/ と co-locate）、サービス層ユニット（src/server/services/）、統合/DB テスト（tests/integration/）を明確に分ける。

## テストファイルの配置・命名
- Unit: ファイル横に配置（例: src/server/services/rbac.service.test.ts）
- Integration/DB: tests/integration/ または tests/db/
- E2E: tests/e2e/
- 命名ルール: <AC-ID>_<簡潔な説明>.test.ts 例: AC-U-004_DenyPriority.test.ts

## Red テストの記述スタイル（具体）
- Vitest を用いることを推奨。
- モック: vi.fn / vi.mock を使用し、DB 操作は可能なら supabase のローカルインスタンスまたは Mock 用のインメモリを用いる。
- DB/RLS 検証: supabase start (local) と JWT Claims を利用して行う（テスト環境では自動起動スクリプトを推奨）。
- テストテンプレート: AAA（Arrange, Act, Assert）を必須にする。

例: AC-U-004 の Red テストの最小構成（テンプレート）
- Arrange: 役割 A(Read Allow), 役割 B(Read Deny) を mocks/seeds にセット
- Act: rbacsService.calculatePermissions(userId)
- Assert: read action は Deny（期待失敗時は実装未着手で thrown error や undefined を検証）
- 注意: 最初は calculatePermissions が未実装または throws で Red を確保する。

## 自動生成ルール（Agent が行う）
1. テストリスト設計書や関連タスクの指示から対象の要件を特定する。
2. テストテンプレートを AAA で記述し、最小限の seed / mock を準備する。
3. テストファイルを適切なディレクトリに追加し、CI で実行可能な形（pnpm vitest）に整える。
4. 生成したテストに「Red: 失敗する理由」をコメントで明記する。

## 実行コマンド例（開発者向け）
- テスト実行: pnpm test / pnpm vitest
- Watch: pnpm vitest --watch
- 単一テスト実行: pnpm vitest -t "AC-U-004"
- Supabase ローカル: cd supabase && supabase start
- DB マイグレーション: pnpm db:migrate / pnpm db:seed

## Red フェーズ実行チェックリスト（簡潔）
- [ ] テストリスト設計書（design/）を参照し、テスト要件を抽出した
- [ ] 単体テスト / 統合テスト を 1 件ずつ追加した（ファイル配置、命名ルールに則る）
- [ ] テストは AAA 構成である
- [ ] テストは「実装が無い/欠けている」ため失敗していることを確認した
- [ ] Red テストに `// expect to fail - RED` コメントを残した
- [ ] Serena（serena/*）に進捗を update した

## 注意点（ベストプラクティス）
- できる限り DB の依存は少なくする（Unit は mocks を使う）。ただし RLS/DB クエリは Integration でカバーすること。
- テストは常に具体的で最小の前提（seed）を定義する。再現性を優先する。
- 既存テストや実装に影響を与えないように、テスト用 DB のスキーマと seed を分離する。

## Serena / MCP の運用
- 各タスクの開始・完了時に Serena メモリを更新してください。
- 要件分析やテスト追加の根拠（設計書該当箇所）は Serena に記録すること。

## 参考: AC-U-004 テンプレート (Vitest)
- Arrange: userId, roleA、roleB を mock/seed する
- Act: await rbacsService.calculatePermissions(userId)
- Assert: expect(permissions.read).toBe('deny') // 初期は未実装で thrown error を期待
