# TODO: Antigravity/VSCode ルール統合 — `.agent/` への一元化

> **作成日**: 2026-03-07
> **優先度**: 🟡 中（開発効率向上のため推奨）
> **生成元**: `/memories/session/plan.md`
> **特別措置**: 既存TODO（Sidebar, Trial）と並行運用（一時的にルール緩和）

---

## 🎯 目的

AntigravityエディタとVSCodeの間で`.agent/`フォルダのルールを共有し、GitHub Copilotが統一されたルールを読み込むように設定する。`.github/`内の重複ルールを削除してメンテナンス性を向上させる。

---

## 📋 タスクリスト

### Phase 1: 重複分析と統合戦略確定 🟡 ✅

**目的**: 削除前に固有情報を確認し、統合方針を確定する

#### 1.1 重複ファイルの詳細比較 ✅
- [x] 1.1.1: `.github/instructions/.copilot-TDD-instructions.md` と `.agent/rules/tdd-guidelines.md` の差分確認
- [x] 1.1.2: `.github/instructions/.copilot-code-review-loop.md` と `.agent/skills/code-review/` の差分確認
- [x] 1.1.3: `.github/instructions/.copilot-codeGeneration-instructions.md` と `.agent/rules/coding-standards.md` の差分確認
- [x] 1.1.4: `.github/instructions/` にのみ存在する固有情報を抽出（あれば）
- [x] 1.1.5: 削除対象ファイルのリスト作成

**完了条件**:
- ✅ 各ファイルの差分が明確化されている
- ✅ 固有情報の有無が判明している
- ✅ 削除対象リストが作成されている

#### 1.2 `.agent/` 構造の検証 ✅
- [x] 1.2.1: `.agent/rules/` の全ファイル（12ファイル）をレビュー
- [x] 1.2.2: `.agent/skills/` の全スキル（20以上）をレビュー
- [x] 1.2.3: `.github/instructions/` のルールが `.agent/` に全て存在することを確認
- [x] 1.2.4: 不足しているルールがないか最終確認

**完了条件**:
- ✅ `.agent/` に全てのルールが揃っている
- ✅ 不足しているルールがリストアップされている（あれば）

#### 1.3 統合方針の決定 ✅
- [x] 1.3.1: Step 1.1, 1.2の結果を総合評価
- [x] 1.3.2: 統合方針を決定（Option A: 完全削除、Option B: マージ後削除、Option C: 段階的移行）
- [x] 1.3.3: 決定した方針を本TODOに記録 (Option B: マージ後削除を採用)

**完了条件**:
- ✅ 統合方針が明確に決定されている
- ✅ Option A/B/Cのいずれかが選択されている

**進捗**: 14/14 ステップ (100%)

---
### Phase 2: `.github/copilot-instructions.md` の更新 + VS Code 設定確認 🟡 ✅

**目的**: GitHub Copilotが`.agent/`を参照できるようにし、個人利用のUser Settingsで `rules` / `hooks` 共通化を確実にする

#### 2.1 メイン指示書の改訂 ✅
- [x] 2.1.1: `.github/copilot-instructions.md` を開く
- [x] 2.1.2: `.agent/rules/` への参照セクションを追加（セクション名: "## ルール参照（.agent/rules/）"）
- [x] 2.1.3: `.agent/skills/` への参照セクションを追加（セクション名: "## スキル参照（.agent/skills/）"）
- [x] 2.1.4: YAMLフロントマターが `applyTo: "**"` であることを確認
- [x] 2.1.5: ファイルを保存
- [x] 2.1.6: 参照リンクが相対パスで解決できることを確認

**完了条件**:
- ✅ `.agent/rules/` へのリンクが追加されている
- ✅ `.agent/skills/` へのリンクが追加されている
- ✅ YAMLフロントマターが正しい
- ✅ 相対リンクが正しく解決される

#### 2.2 ルールファイルへの参照追加 ✅
- [x] 2.2.1: 以下のルールファイルへのリンクを追加:
  - `coding-standards.md`
  - `tdd-guidelines.md`
  - `ui-ux-guidelines.md`
  - `security-architecture.md`
  - `git-workflow.md`
- [x] 2.2.2: 以下のスキルへのリンクを追加:
  - `code-review/`
  - `test-workflow/`
  - `vercel-react-best-practices/`
- [x] 2.2.3: 各リンクに簡潔な説明を付与

**完了条件**:
- ✅ 主要ルールファイル（5個以上）へのリンクがある
- ✅ 主要スキル（3個以上）へのリンクがある
- ✅ 各リンクに説明がある

#### 2.3 VS Code 設定（個人利用）確認 ✅
- [x] 2.3.1: User Settings で `chat.instructionsFilesLocations` を確認
- [x] 2.3.2: User Settings で `.agent/rules: true` を確認
- [x] 2.3.3: User Settings で `chat.hookFilesLocations` を確認
- [x] 2.3.4: User Settings で `.agent/hooks: true` を確認
- [x] 2.3.5: 個人利用のため `.vscode/settings.json` は作成任意であることを本TODOに明記

**完了条件**:
- ✅ User Settings で `rules` / `hooks` の共通化設定が有効
- ✅ 個人利用の運用方針（User Settings優先）が明記されている

#### 2.4 検証 ✅
- [x] 2.4.1: GitHub Copilot Chat で「プロジェクトのコーディング規約を教えて」と質問
- [x] 2.4.2: `.agent/rules/coding-standards.md` の内容が返答に含まれることを確認
- [x] 2.4.3: 「TDDのルールを教えて」と質問 → `.agent/rules/tdd-guidelines.md` の内容確認
- [x] 2.4.4: 「セキュリティ基準を教えて」と質問 → `.agent/rules/security-architecture.md` の内容確認
- [x] 2.4.5: Chat Diagnostics で instruction files の読み込み状態を確認
- [x] 2.4.6: Chat Diagnostics で hooks 読み込みに `.agent/hooks` が含まれることを確認

**完了条件**:
- ✅ GitHub Copilot が `.agent/` のルールを正しく参照できる
- ✅ 3つ以上のルールファイルが正しく読み込まれている
- ✅ hooks の読み込みに `.agent/hooks` が表示される

**進捗**: 19/19 ステップ (100%)

---

### Phase 3: 重複ファイルの削除とクリーンアップ 🟡 ✅

**目的**: 重複を削除し、`.agent/` を単一の情報源にする

#### 3.1 固有情報の移行（必要な場合のみ） ✅
- [x] 3.1.1: Step 1.1.4で抽出した固有情報を確認
- [x] 3.1.2: 固有情報が存在する場合、該当する `.agent/rules/` ファイルを特定
- [x] 3.1.3: 固有情報を `.agent/rules/` に統合
- [x] 3.1.4: 統合内容をレビュー

**完了条件**:
- ✅ 固有情報が全て `.agent/` に移行されている（固有情報がない場合はスキップ）
- ✅ 統合内容が適切である

#### 3.2 旧指示書ファイルの削除 ✅
- [x] 3.2.1: `.github/instructions/.copilot-TDD-instructions.md` を削除
- [x] 3.2.2: `.github/instructions/.copilot-code-review-loop.md` を削除
- [x] 3.2.3: `.github/instructions/.copilot-codeGeneration-instructions.md` を削除
- [x] 3.2.4: `.github/instructions/memory.instruction.md` は保持（固有ファイル）
- [x] 3.2.5: 削除前に Chat Diagnostics で `.agent/rules` / `.agent/hooks` の読み込み確認

**完了条件**:
- ✅ 重複する3ファイルが削除されている
- ✅ `memory.instruction.md` は保持されている
- ✅ `.agent/rules` / `.agent/hooks` の読み込み確認済み

**進捗**: 16/16 ステップ (100%)
---

### Phase 4: ドキュメント整備と周知 🟢 ✅

**目的**: ルール統合を文書化し、チームに周知する

#### 4.1 README更新 ✅
- [x] 4.1.1: プロジェクトルートの `README.md` を開く
- [x] 4.1.2: 「開発ルール」セクションを追加
- [x] 4.1.3: `.agent/` フォルダの説明を追加
- [x] 4.1.4: Antigravity/VSCodeのエディタ設定を説明
- [x] 4.1.5: ファイルを保存

**完了条件**:
- ✅ README に開発ルールセクションがある
- ✅ `.agent/` の説明が明確である
- ✅ エディタ設定が記載されている

#### 4.2 `.agent/readme.md` の更新 ✅
- [x] 4.2.1: `.agent/readme.md` を開く
- [x] 4.2.2: 「GitHub Copilot との統合」セクションを追加
- [x] 4.2.3: エディタ間の一貫性について説明を追加
- [x] 4.2.4: ファイルを保存

**完了条件**:
- ✅ `.agent/readme.md` に統合説明がある
- ✅ Antigravity/VSCode両対応が明記されている

#### 4.3 チーム周知（オプション） ✅
- [x] 4.3.1: `.github/instructions/` 配下のファイルが削除されたことを通知（手動で行うこと）
- [x] 4.3.2: 今後は `.agent/` フォルダを参照するよう案内
- [x] 4.3.3: GitHub Copilot が `.agent/` のルールを読み込むことを確認

**完了条件**:
- ✅ チーム全員が変更を理解している（チーム作業の場合）

**進捗**: 11/11 ステップ (100%)

---

## 📊 全体進捗

- **Phase 1**: 14/14 ステップ (100%) ✅
- **Phase 2**: 19/19 ステップ (100%) ✅
- **Phase 3**: 16/16 ステップ (100%) ✅
- **Phase 4**: 11/11 ステップ (100%) ✅

**合計**: 60/60 ステップ (100%)

---

## 🔗 関連ドキュメント

- **計画書**: `/memories/session/plan.md`
- **削除対象ファイル**:
  - `.github/instructions/.copilot-TDD-instructions.md`
  - `.github/instructions/.copilot-code-review-loop.md`
  - `.github/instructions/.copilot-codeGeneration-instructions.md`
- **更新対象ファイル**:
  - `.github/copilot-instructions.md`
  - `.agent/readme.md`
  - `README.md`
- **参照元ルール**:
  - `.agent/rules/coding-standards.md`
  - `.agent/rules/tdd-guidelines.md`
  - `.agent/rules/ui-ux-guidelines.md`
  - `.agent/rules/security-architecture.md`
  - `.agent/rules/git-workflow.md`

---

## 📝 備考

### 決定事項
- **統合方針**: Phase 1で決定（Option B: マージ後削除 を採用）
- **削除前の確認**: 固有情報は必ず `.agent/rules/` に移行してから削除

### 継続検討事項
- `.agent/` フォルダの可視性（`.` で始まるため非表示になる可能性）
- GitHub Copilot のリンク記述方法（相対パス vs 絶対パス）

---

**最終更新**: 2026-03-07
**次回更新**: 完了済み
