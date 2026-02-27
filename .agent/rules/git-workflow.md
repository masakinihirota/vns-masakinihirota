---
trigger: always_on
---

## 1. ブランチ命名規則

### フォーマット
<type>/<issue番号>-<kebab-case-の説明>

### typeの一覧

| type | 用途 |
|------|------|
| `feature` | 新機能追加 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング（振る舞い変更なし） |
| `docs` | ドキュメントのみの変更 |
| `test` | テストの追加・修正 |
| `chore` | ビルド・CI・依存関係などの変更 |
| `hotfix` | 本番緊急対応 |

### 命名例
feature/123-add-login-validation
fix/456-session-error-after-password-reset
refactor/789-extract-auth-service
docs/101-update-readme-setup
chore/update-eslint-config
hotfix/critical-payment-null-error

### ブランチ作成ルール
- ブランチ名は小文字・ハイフン区切り（スペース・アンダースコア禁止）
- Issue番号がある場合は必ず含める

## 2. コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠します。

### フォーマット
<type>(<scope>): <subject>

[任意: body - なぜこの変更が必要か]

[任意: footer - Breaking Change / Issue参照]

### typeの一覧

| type | 用途 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみ |
| `style` | フォーマット・空白など（ロジック変更なし） |
| `refactor` | リファクタリング |
| `test` | テストの追加・修正 |
| `chore` | ビルド・CI・依存関係 |
| `perf` | パフォーマンス改善 |
| `revert` | コミットの取り消し |

### コミットメッセージの書き方

**subject（1行目）のルール：**
- 50文字以内を目安
- 現在形・命令形で書く（`修正する` / `add` / `fix`）
- 文末にピリオド不要
- 「何をしたか」より「**なぜしたか・何が変わるか**」を意識する

**body（任意）のルール：**
- 1行目と空行を1行挟む
- 「なぜこの変更が必要か」「何を考慮したか」を書く
- 72文字で折り返す

**良い例 / 悪い例：**

```bash
# 悪い例（何をしたか羅列するだけ）
git commit -m "ボタンの色を変更した"
git commit -m "fix bug"
git commit -m "修正"

# 良い例（why + what が明確）
git commit -m "feat(auth): パスワードリセット後の自動ログイン機能を追加

セキュリティポリシー変更により、リセット後は再認証を必須とする。
セッション継続を廃止し、ログイン画面へリダイレクトする。

Closes #456"

git commit -m "fix(ui): CTAボタンのコントラスト比をWCAG AA基準に修正

blue-400では基準値4.5:1を下回っていたためblue-600に変更。
Closes #789"

### 1コミット = 1つの論理的変更
- 複数の変更を1コミットに詰め込まない
- WIP（作業中）コミットはPR作成前に `git rebase -i` でsquashする
- `git add -p` でハンクごとに追加し、意図しない変更を混入させない

### Breaking Changeの書き方
git commit -m "feat(api)!: レスポンス形式をJSONに統一
BREAKING CHANGE: XMLレスポンスは廃止。
既存クライアントは移行ガイド(docs/migration.md)を参照。"

## 3. Pull Request規約

### PR タイトル
コミットメッセージと同じConventional Commits形式 + Issue番号

feat(auth): パスワードリセット後の自動ログイン機能を追加 #456
fix(ui): CTAボタンのコントラスト比をWCAG AA基準に修正 #789

### PR 本文テンプレート

```markdown
## 概要
<!-- このPRで何をしたかを2〜3文で説明 -->

## 背景・目的
<!-- なぜこの変更が必要か。関連Issueへのリンク -->
Closes #<issue番号>

## 変更内容
<!-- 主な変更点をリストアップ -->
-
-
-

## スコープ外（やっていないこと）
<!-- 今回あえて含めなかったことを明示 -->
-

## 動作確認方法
<!-- レビュアーがローカルで確認する手順 -->
1.
2.
3.

## スクリーンショット / 動画
<!-- UI変更がある場合は必須。Before / After形式で -->

| Before | After |
|--------|-------|
| <!-- 画像 --> | <!-- 画像 --> |

## チェックリスト
- [ ] セルフレビュー済み
- [ ] テストを追加・更新した
- [ ] 既存テストがすべて通る
- [ ] ドキュメントを更新した（必要な場合）
- [ ] Breaking Changeがある場合は明記した

## レビュアーへのメモ
<!-- 特に見てほしい箇所、迷った判断、懸念点などを事前に共有 -->

### PRの品質基準

**差分のサイズ：**
- 理想は **400行以内**
- 400行超の場合は分割を検討する
- 機械的な変更（リネーム・フォーマット）は別PRに切り出す

**Draft PRの活用：**
- 実装開始直後にDraft PRを立てて方向性を共有する
- レビュー依頼前に `Ready for review` に変更する

**セルフレビューの徹底：**
- アサイン前に自分でdiffを全行確認する
- デバッグ用コード（`console.log`、`binding.pry`など）が残っていないか確認する
- コメントアウトされたコードが残っていないか確認する
