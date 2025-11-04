# Codex Execution Plans (ExecPlans):

This document describes the requirements for an execution plan ("ExecPlan"), a design document that a coding agent can follow to deliver a working feature or system change. Treat the reader as a complete beginner to this repository: they have only the current working tree and the single ExecPlan file you provide. There is no memory of prior plans and no external context.

## How to use ExecPlans and PLANS.md

When authoring an executable specification (ExecPlan), follow PLANS.md _to the letter_. If it is not in your context, refresh your memory by reading the entire PLANS.md file. Be thorough in reading (and re-reading) source material to produce an accurate specification. When creating a spec, start from the skeleton and flesh it out as you do your research.

When implementing an executable specification (ExecPlan), do not prompt the user for "next steps"; simply proceed to the next milestone. Keep all sections up to date, add or split entries in the list at every stopping point to affirmatively state the progress made and next steps. Resolve ambiguities autonomously, and commit frequently.

When discussing an executable specification (ExecPlan), record decisions in a log in the spec for posterity; it should be unambiguously clear why any change to the specification was made. ExecPlans are living documents, and it should always be possible to restart from _only_ the ExecPlan and no other work.

When researching a design with challenging requirements or significant unknowns, use milestones to implement proof of concepts, "toy implementations", etc., that allow validating whether the user's proposal is feasible. Read the source code of libraries by finding or acquiring them, research deeply, and include prototypes to guide a fuller implementation.

## Requirements

NON-NEGOTIABLE REQUIREMENTS:

* Every ExecPlan must be fully self-contained. Self-contained means that in its current form it contains all knowledge and instructions needed for a novice to succeed.
* Every ExecPlan is a living document. Contributors are required to revise it as progress is made, as discoveries occur, and as design decisions are finalized. Each revision must remain fully self-contained.
* Every ExecPlan must enable a complete novice to implement the feature end-to-end without prior knowledge of this repo.
* Every ExecPlan must produce a demonstrably working behavior, not merely code changes to "meet a definition".
* Every ExecPlan must define every term of art in plain language or do not use it.

Purpose and intent come first. Begin by explaining, in a few sentences, why the work matters from a user's perspective: what someone can do after this change that they could not do before, and how to see it working. Then guide the reader through the exact steps to achieve that outcome, including what to edit, what to run, and what they should observe.

The agent executing your plan can list files, read files, search, run the project, and run tests. It does not know any prior context and cannot infer what you meant from earlier milestones. Repeat any assumption you rely on. Do not point to external blogs or docs; if knowledge is required, embed it in the plan itself in your own words. If an ExecPlan builds upon a prior ExecPlan and that file is checked in, incorporate it by reference. If it is not, you must include all relevant context from that plan.

## Formatting

Format and envelope are simple and strict. Each ExecPlan must be one single fenced code block labeled as `md` that begins and ends with triple backticks. Do not nest additional triple-backtick code fences inside; when you need to show commands, transcripts, diffs, or code, present them as indented blocks within that single fence. Use indentation for clarity rather than code fences inside an ExecPlan to avoid prematurely closing the ExecPlan's code fence. Use two newlines after every heading, use # and ## and so on, and correct syntax for ordered and unordered lists.

When writing an ExecPlan to a Markdown (.md) file where the content of the file *is only* the single ExecPlan, you should omit the triple backticks.

Write in plain prose. Prefer sentences over lists. Avoid checklists, tables, and long enumerations unless brevity would obscure meaning. Checklists are permitted only in the `Progress` section, where they are mandatory. Narrative sections must remain prose-first.

## Guidelines

Self-containment and plain language are paramount. If you introduce a phrase that is not ordinary English ("daemon", "middleware", "RPC gateway", "filter graph"), define it immediately and remind the reader how it manifests in this repository (for example, by naming the files or commands where it appears). Do not say "as defined previously" or "according to the architecture doc." Include the needed explanation here, even if you repeat yourself.

Avoid common failure modes. Do not rely on undefined jargon. Do not describe "the letter of a feature" so narrowly that the resulting code compiles but does nothing meaningful. Do not outsource key decisions to the reader. When ambiguity exists, resolve it in the plan itself and explain why you chose that path. Err on the side of over-explaining user-visible effects and under-specifying incidental implementation details.

Anchor the plan with observable outcomes. State what the user can do after implementation, the commands to run, and the outputs they should see. Acceptance should be phrased as behavior a human can verify ("after starting the server, navigating to [http://localhost:8080/health](http://localhost:8080/health) returns HTTP 200 with body OK") rather than internal attributes ("added a HealthCheck struct"). If a change is internal, explain how its impact can still be demonstrated (for example, by running tests that fail before and pass after, and by showing a scenario that uses the new behavior).

Specify repository context explicitly. Name files with full repository-relative paths, name functions and modules precisely, and describe where new files should be created. If touching multiple areas, include a short orientation paragraph that explains how those parts fit together so a novice can navigate confidently. When running commands, show the working directory and exact command line. When outcomes depend on environment, state the assumptions and provide alternatives when reasonable.

Be idempotent and safe. Write the steps so they can be run multiple times without causing damage or drift. If a step can fail halfway, include how to retry or adapt. If a migration or destructive operation is necessary, spell out backups or safe fallbacks. Prefer additive, testable changes that can be validated as you go.

Validation is not optional. Include instructions to run tests, to start the system if applicable, and to observe it doing something useful. Describe comprehensive testing for any new features or capabilities. Include expected outputs and error messages so a novice can tell success from failure. Where possible, show how to prove that the change is effective beyond compilation (for example, through a small end-to-end scenario, a CLI invocation, or an HTTP request/response transcript). State the exact test commands appropriate to the project’s toolchain and how to interpret their results.

Capture evidence. When your steps produce terminal output, short diffs, or logs, include them inside the single fenced block as indented examples. Keep them concise and focused on what proves success. If you need to include a patch, prefer file-scoped diffs or small excerpts that a reader can recreate by following your instructions rather than pasting large blobs.

## Milestones

Milestones are narrative, not bureaucracy. If you break the work into milestones, introduce each with a brief paragraph that describes the scope, what will exist at the end of the milestone that did not exist before, the commands to run, and the acceptance you expect to observe. Keep it readable as a story: goal, work, result, proof. Progress and milestones are distinct: milestones tell the story, progress tracks granular work. Both must exist. Never abbreviate a milestone merely for the sake of brevity, do not leave out details that could be crucial to a future implementation.

Each milestone must be independently verifiable and incrementally implement the overall goal of the execution plan.

## Living plans and design decisions

* ExecPlans are living documents. As you make key design decisions, update the plan to record both the decision and the thinking behind it. Record all decisions in the `Decision Log` section.
* ExecPlans must contain and maintain a `Progress` section, a `Surprises & Discoveries` section, a `Decision Log`, and an `Outcomes & Retrospective` section. These are not optional.
* When you discover optimizer behavior, performance tradeoffs, unexpected bugs, or inverse/unapply semantics that shaped your approach, capture those observations in the `Surprises & Discoveries` section with short evidence snippets (test output is ideal).
* If you change course mid-implementation, document why in the `Decision Log` and reflect the implications in `Progress`. Plans are guides for the next contributor as much as checklists for you.
* At completion of a major task or the full plan, write an `Outcomes & Retrospective` entry summarizing what was achieved, what remains, and lessons learned.

# Prototyping milestones and parallel implementations

It is acceptable—-and often encouraged—-to include explicit prototyping milestones when they de-risk a larger change. Examples: adding a low-level operator to a dependency to validate feasibility, or exploring two composition orders while measuring optimizer effects. Keep prototypes additive and testable. Clearly label the scope as “prototyping”; describe how to run and observe results; and state the criteria for promoting or discarding the prototype.

Prefer additive code changes followed by subtractions that keep tests passing. Parallel implementations (e.g., keeping an adapter alongside an older path during migration) are fine when they reduce risk or enable tests to continue passing during a large migration. Describe how to validate both paths and how to retire one safely with tests. When working with multiple new libraries or feature areas, consider creating spikes that evaluate the feasibility of these features _independently_ of one another, proving that the external library performs as expected and implements the features we need in isolation.

## Skeleton of a Good ExecPlan

```md
# <Short, action-oriented description>

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

If PLANS.md file is checked into the repo, reference the path to that file here from the repository root and note that this document must be maintained in accordance with PLANS.md.

## Purpose / Big Picture

Explain in a few sentences what someone gains after this change and how they can see it working. State the user-visible behavior you will enable.

## Progress

Use a list with checkboxes to summarize granular steps. Every stopping point must be documented here, even if it requires splitting a partially completed task into two (“done” vs. “remaining”). This section must always reflect the actual current state of the work.

- [x] (2025-10-01 13:00Z) Example completed step.
- [ ] Example incomplete step.
- [ ] Example partially completed step (completed: X; remaining: Y).

Use timestamps to measure rates of progress.

## Surprises & Discoveries

Document unexpected behaviors, bugs, optimizations, or insights discovered during implementation. Provide concise evidence.

- Observation: …
  Evidence: …

## Decision Log

Record every decision made while working on the plan in the format:

- Decision: …
  Rationale: …
  Date/Author: …

## Outcomes & Retrospective

Summarize outcomes, gaps, and lessons learned at major milestones or at completion. Compare the result against the original purpose.

## Context and Orientation

Describe the current state relevant to this task as if the reader knows nothing. Name the key files and modules by full path. Define any non-obvious term you will use. Do not refer to prior plans.

## Plan of Work

Describe, in prose, the sequence of edits and additions. For each edit, name the file and location (function, module) and what to insert or change. Keep it concrete and minimal.

## Concrete Steps

State the exact commands to run and where to run them (working directory). When a command generates output, show a short expected transcript so the reader can compare. This section must be updated as work proceeds.

## Validation and Acceptance

Describe how to start or exercise the system and what to observe. Phrase acceptance as behavior, with specific inputs and outputs. If tests are involved, say "run <project’s test command> and expect <N> passed; the new test <name> fails before the change and passes after>".

## Idempotence and Recovery

If steps can be repeated safely, say so. If a step is risky, provide a safe retry or rollback path. Keep the environment clean after completion.

## Artifacts and Notes

Include the most important transcripts, diffs, or snippets as indented examples. Keep them concise and focused on what proves success.

## Interfaces and Dependencies

Be prescriptive. Name the libraries, modules, and services to use and why. Specify the types, traits/interfaces, and function signatures that must exist at the end of the milestone. Prefer stable names and paths such as `crate::module::function` or `package.submodule.Interface`. E.g.:

In crates/foo/planner.rs, define:

    pub trait Planner {
        fn plan(&self, observed: &Observed) -> Vec<Action>;
    }
```

If you follow the guidance above, a single, stateless agent -- or a human novice -- can read your ExecPlan from top to bottom and produce a working, observable result. That is the bar: SELF-CONTAINED, SELF-SUFFICIENT, NOVICE-GUIDING, OUTCOME-FOCUSED.

When you revise a plan, you must ensure your changes are comprehensively reflected across all sections, including the living document sections, and you must write a note at the bottom of the plan describing the change and the reason why. ExecPlans must describe not just the what but the why for almost everything.

```md
# アクセス制御システム統合実行計画

このExecPlanは `.github/prompts/plans.md` に定義された規約に従って維持する。作業進行に応じて本計画を更新し、全ての設計判断と進捗を記録すること。

## Purpose / Big Picture

アクセス権限管理機能をNext.js(App Router)+Supabase+Drizzleで実装し、ロール・権限行列・例外承認・定期棚卸し・監査ログまで一貫制御できるようにする。root_account単位の管理者はアクセス制御画面からロール作成、権限付与、メンバー割当、例外承認を操作でき、一般ユーザーは権限不足時に明確なガイダンスを受ける。完成後はブラウザで `http://localhost:3000/access-control` (本番では実際のドメイン) にアクセスしてUIが動作し、権限変更がSupabaseのRLSと監査ログに反映されることを確認できる。

## Progress

- [x] (2025-11-01 04:15Z) 設計書 `vns-masakinihirota-design/0020 個別機能 大 -01要件定義書 -02設計書 -03テスト計画書/0012-02-アクセス権限設計書.md` を精読し、本計画の初版を作成した。
- [x] (2025-11-01 07:45Z) マイルストーン1: Drizzleスキーマ/マイグレーション/RLS下準備（テーブル、新カラム、インデックス、監査連携フック、RPC雛形）を追加。残タスク: `pnpm db:generate` の自動生成差分確認、およびSupabase環境への適用検証。
- [x] (2025-11-01 07:48Z) Supabaseローカル環境で `20251101073000_access_control.sql` を適用。`supabase migration repair 20251015225118 --status reverted --local` で履歴を同期後、`supabase db push --local` を実行し、ACLテーブル・ビューの作成と `check_permission` の許可/不可/例外シナリオを手動SQLで検証。
- [ ] (2025-11-01 04:30Z) マイルストーン2: Next.js App Router UI・Server Action・サービス層・Hook導線整備。
- [ ] (2025-11-01 04:40Z) マイルストーン3: Supabase RLSポリシー、例外承認フロー、監査ログ連携、棚卸しバッチの仕組み構築。
- [ ] (2025-11-01 04:50Z) マイルストーン4: Vitest/SQLテスト・Bioma lint・ビルド・ドキュメント反映・最終検証。

## Surprises & Discoveries

- Observation: 現在のコードベースにアクセス権限関連のApp Router階層やDrizzleテーブル、Supabaseマイグレーションが存在しないため、設計書の全要素が新規追加である。Evidence: Serenaメモ `access_control_doc_alignment_check_2025-11-01` と `drizzle/schema/access_control` が空であることを確認 (2025-11-01 GitHub Copilot)。
- Observation: Drizzle側で `acl_roles` が `root_accounts` へ外部キー参照を持つと循環依存が発生するため、TypeScriptスキーマでは参照を外しSQLマイグレーションで整合性を担保した。Evidence: `drizzle/schema/access_control/roles.ts` はUUIDのみを保持し、`supabase/migrations/20251101073000_access_control.sql` で外部キーを定義 (2025-11-01 GitHub Copilot)。
- Observation: Supabase CLI の `create type if not exists ... as enum` が構文エラーとなり、`supabase db push --local` に失敗した。Evidence: CLIエラー `syntax error at or near "not"` を受け、DOブロックで型存在チェックを行うようマイグレーションを修正 (2025-11-01 GitHub Copilot)。
- Observation: ローカルDBがリモート専用のマイグレーション `20251015225118` を保持しており `supabase db push --local --dry-run` が失敗。`supabase migration repair 20251015225118 --status reverted --local` で履歴を揃えると正常に適用できた (2025-11-01 GitHub Copilot)。

## Decision Log

- Decision: ルートグループは既存構成に合わせて `src/app/(protected)/(access-control)` を新設し、デザインドキュメントの `(authorized)` 呼称はコメントで補足する。Rationale: 既存の保護済みルート群が `(protected)` を使用しており整合性を取るため。Date/Author: 2025-11-01 GitHub Copilot。
- Decision: Drizzleスキーマは `drizzle/schema/access_control` 配下に役割・権限・例外などをファイル分割し、`drizzle/schema/index.ts` からエクスポートする。既存テーブルの拡張(`root_accounts.default_role_id`, `auth_users.last_role_refresh_at`)も同マイグレーションで実施する。Rationale: スキーマごとの責務分離と型安全性確保。Date/Author: 2025-11-01 GitHub Copilot。
- Decision: 権限判定は Supabase RPC `check_permission` (SQL関数) と `vw_effective_permissions` ビューを用意し、Server Actionで結果をキャッシュする。Rationale: 設計書のdeny優先ロジックと多層防御要件をDB側で保証するため。Date/Author: 2025-11-01 GitHub Copilot。
- Decision: 監査ログは既存 `audit_events` へのService層(`src/lib/audit`)を拡張し、アクセス制御操作専用イベント型を追加する。Rationale: 監査追跡性要件の達成と再利用性向上。Date/Author: 2025-11-01 GitHub Copilot。
- Decision: `acl_roles.root_account_id` の外部キーはSupabaseマイグレーションで定義し、Drizzleスキーマは循環依存を避けるためUUID型のみ保持する。Rationale: `root_accounts` がデフォルトロールIDを参照する都合でTypeScriptモジュールの循環 import を防ぐ必要があったため。Date/Author: 2025-11-01 GitHub Copilot。
- Decision: マイグレーション適用前に `supabase migration list --local` で差分確認し、欠落バージョンは `supabase migration repair` で解消する手順を採用。Rationale: リポジトリ未管理の履歴が存在すると `supabase db push` が失敗するため。Date/Author: 2025-11-01 GitHub Copilot。
- Decision: ENUM作成は `create type if not exists` ではなく DO ブロックで確認した上で作成する。Rationale: Supabaseローカル環境のPostgreSQLが該当構文を受け付けず、再実行可能なマイグレーションが必要なため。Date/Author: 2025-11-01 GitHub Copilot。

## Outcomes & Retrospective

- 実装前段階。各マイルストーン完了時に成果・残課題・学びを記録する。

## Context and Orientation

本リポジトリは Next.js 16 (App Router) と Supabase を接続し、Drizzle ORM でスキーマを管理している。App Router の保護領域は `src/app/(protected)` 配下にあり、ルートグループ形式を採用している。データモデルは `drizzle/schema` に整理され、Drizzle 設定は `drizzle.config.ts` で Supabase マイグレーション (`supabase/migrations`) へ出力する形となっている。アクセストークンやSupabaseクライアントは `src/lib/supabase` と `src/lib/auth` に存在し、認証後のテナント情報は `root_accounts` と `auth_users` テーブルで管理している。現状、アクセス権限機能に関連するUI・API・データモデル・テストはいずれも未実装であり、本計画で一から追加する。

## Plan of Work

マイルストーン1ではデータ層の土台を整える。`drizzle/schema/access_control` に `roles.ts`, `permissions.ts`, `rolePermissions.ts`, `memberships.ts`, `exceptionGrants.ts`, `views.ts` を追加し、各テーブル定義・インデックス・列チェックを反映する。同時に `root_accounts` と `auth_users` の既存スキーマを拡張し、`drizzle/schema/index.ts` を更新する。Drizzle生成スキーマを基に `pnpm db:generate` でSupabaseマイグレーションを生成し、`supabase/migrations/<timestamp>_access_control.sql` をレビュー・加筆（RLSポリシー、既定インデックス、`vw_effective_permissions` ビュー、`check_permission` RPCファンクション）する。RLSやRBAC連携に必要なJWTクレーム計算は `supabase/migrations` のSQLで `auth.jwt()` 参照を定義し、システムロール操作をサービスキー限定にするためのポリシーも含める。最後に `drizzle/seeds/accessControlSeed.ts` (新規) で初期ロール・権限・メンバー例を挿入できるよう整える。

マイルストーン2ではアプリケーション層を構築する。`src/app/(protected)/(access-control)/layout.tsx` でグループ全体のガードと共通レイアウトを定義し、実際のルートセグメント `access-control` を持つ `src/app/(protected)/(access-control)/access-control/page.tsx` でServer Componentが `getRoleOverview` (Server Action) を呼び出して初期データを取得する。Server Actionやサービスロジックは `src/app/(protected)/(access-control)/actions.ts` と `src/lib/access-control` 配下 (`roleService.ts`, `permissionService.ts`, `exceptionService.ts`) に整理し、Drizzleリポジトリ (`src/lib/db.ts`) を介して操作する。クライアント側コンポーネントは `src/app/(protected)/(access-control)/access-control/components/RoleForm.tsx` などに分割し、Shadcn UIに合わせてフォーム・テーブル・ダイアログを構成する。表示制御のために `src/hooks/useAuthorization.ts` (新規または既存拡張) を実装し、クライアントキャッシュの無効化ロジックを含める。ローディング・エラーハンドリング・楽観的UIロールバックを実装し、例外申請ができるモーダルもここで扱う。

マイルストーン3では Supabase 側の挙動とバックグラウンド処理を固める。`supabase/migrations` で作成したポリシー・関数をローカル環境へ適用 (`supabase db push`) し、`supabase/functions` または `supabase/edge` (適切なフォルダを新設) に棚卸しレポート出力用のEdge Function/SQLジョブを配置する。Node側では `src/lib/access-control/audit.ts` で `AuditService.log` をラップし、Server Actionから呼び出せるようにする。例外承認期限監視は `scripts/cron/accessControlCleanup.ts` (新規) でスケルトントリガーを用意し、Supabaseスケジューラまたは外部タスクランナーに接続できる形にする。JWT更新フローは `src/lib/auth/session.ts` (既存確認) を更新して `lastRoleRefreshAt` を反映し、Supabase Authの `app_metadata.roles` を更新するロジックを追加する。

マイルストーン4では品質保証を行う。Drizzleスキーマに対するVitest (`tests/access-control/accessControl.spec.ts`) を追加し、`pnpm test` でロール・権限判定のユニットテストを実装する。また、Supabase SQLテストとして `sql-test/access_control/role_permission.sql` を追加し、RLSポリシーが期待通りか検証する。UIのE2E的な確認として `pnpm dev` 起動後にブラウザ操作手順をドキュメント化する。最終的に `docs/access-control.md` (新規) に成果と操作手順をまとめ、`README追加機能.md` にリンクを追加する。すべて完了後に `pnpm lint`, `pnpm test`, `pnpm build` の順で確認し、問題なければコミット→`/review` 実行→レビュー結果反映→ドキュメント更新→最終コミットを行う。

## Concrete Steps

  # 既存依存関係の同期
  pnpm install

  # Drizzleスキーマを更新した後にマイグレーションを生成
  pnpm db:generate

  # Supabase CLIでローカルDBへ適用 (初回は--dry-runで確認)
  supabase db push --dry-run
  supabase db push

  # 監査ログEdge Functionや棚卸しジョブの動作確認
  pnpm tsx scripts/cron/accessControlCleanup.ts --dry-run

  # 開発サーバでUI確認
  pnpm dev

  # 静的解析とテスト
  pnpm lint
  pnpm test
  pnpm build

## Validation and Acceptance

- `pnpm lint`, `pnpm test`, `pnpm build` が全て成功すること。
- `pnpm db:generate` で生成されたマイグレーションをSupabaseローカル環境に適用し、`supabase db reset` 後に `acl_roles` などの新テーブルが作成されていることを `supabase db inspect` で確認する。
- 開発サーバー起動後、管理者ロールで `http://localhost:3000/access-control` にアクセスするとロール一覧・権限行列・例外申請UIが表示され、ロール作成→権限付与→ユーザー割当→例外承認→監査ログ記録の流れが成功する。
- 権限を持たないユーザーが同画面へアクセスすると403エラーダイアログが表示され、申請導線に遷移できる。
- Vitestで `tests/access-control/accessControl.spec.ts` が `check_permission` RPCをモックし、許可/拒否/例外/期限切れのケースを網羅している。

## Idempotence and Recovery

マイグレーションはDrizzle生成→手動編集→Supabase適用の手順で進め、破壊的変更が必要な場合は `supabase db dump` でバックアップを取得してから適用する。同じマイグレーションを再適用しても副作用が出ないようにIF EXISTS/IF NOT EXISTSをSQLに含める。Edge Functionやスケジューラの登録は冪等なデプロイスクリプト (`supabase functions deploy access-control-cleanup`) を用意し、失敗時は再実行可能にする。Server Actionは楽観ロック失敗時に最新データを返却するよう設計し、クライアントはロールバックして再送信できる。

## Artifacts and Notes

- 新規マイグレーション: `supabase/migrations/<timestamp>_access_control.sql`
- 新規Drizzle定義: `drizzle/schema/access_control/*.ts` と既存スキーマ修正。
- 新規サービス層: `src/lib/access-control/*.ts`, `src/lib/audit/accessControl.ts`
- 新規UI: `src/app/(protected)/(access-control)/access-control/**`
- 新規テスト: `tests/access-control/*.spec.ts`, `sql-test/access_control/*.sql`
- ドキュメント: `docs/access-control.md`, `README追加機能.md` へのリンク追加
- 監査ログテンプレート: `scripts/cron/accessControlCleanup.ts`, `supabase/functions/access-control-audit/index.ts`

## Interfaces and Dependencies

- `drizzle/schema/access_control/roles.ts` で `export const aclRoles = pgTable(...)` を定義し、`root_account_id` で `rootAccounts` に外部キーを貼る。
- `drizzle/schema/access_control/permissions.ts` で `aclPermissions` を定義し、`resource_type` や `action` をENUM化する（列挙値は設計書のリソース一覧を反映）。
- `drizzle/schema/access_control/rolePermissions.ts` で `aclRolePermissions`、効果(`effect`), 期間(`valid_from`, `valid_until`), スコープ(`scope_filter`)を定義し、複合UNIQUE制約を設定する。
- `drizzle/schema/access_control/memberships.ts` で `aclMemberships` を定義し、`state` ENUM, `delegation_depth` チェック制約を追加する。
- `drizzle/schema/access_control/exceptionGrants.ts` で `aclExceptionGrants` を定義し、承認チェーン(`approval_chain` jsonb)、期限管理カラムを持たせる。
- `drizzle/schema/access_control/views.ts` で `vwEffectivePermissions` の型を宣言し、Drizzleで参照できるよう `pgView` を使う。
- `src/lib/access-control/roleService.ts` は `getRoleOverview(db, rootAccountId)` や `upsertRole(input)` を提供し、検証には Zod スキーマ (`z.object({...})`) を使用する。
- `src/lib/access-control/permissionService.ts` は `assignPermission(roleId, payload)` と `recalculateMatrix(rootAccountId)` を実装する。
- `src/lib/access-control/exceptionService.ts` は `requestException`、`approveException`, `revokeExpiredExceptions` を提供し、監査ログサービスを呼ぶ。
- `src/app/(protected)/(access-control)/actions.ts` はServer Actions (`createRole`, `updatePermissionMatrix`, `approveException`) をエクスポートし、すべて `revalidatePath('/access-control')` を呼んでUIを同期する。
- `supabase/migrations/...` に `create function check_permission(user_id uuid, resource text, action text, resource_id uuid default null) returns boolean` を定義し、deny優先・例外適用ロジックを実装する。
- `tests/access-control/accessControl.spec.ts` は `describe('checkPermission')` でローカルサービス層ロジックをテストし、SQLテストは `sql-test/access_control/check_permission.sql` でRLSの動作を確認する。

更新履歴: 2025-11-01 GitHub Copilot - 初版作成。アクセス権限設計書(0012-02)を反映した統合計画を追加。
更新履歴: 2025-11-01 GitHub Copilot - Next.jsルートグループのURL非表示仕様に合わせ、`access-control` セグメントを明示するパス構成と検証URLを修正。
更新履歴: 2025-11-01 GitHub Copilot - Supabaseローカル環境でのマイグレーション適用および `check_permission` 実行結果を検証し、ENUM作成手順と履歴同期の対応を追記。
```
