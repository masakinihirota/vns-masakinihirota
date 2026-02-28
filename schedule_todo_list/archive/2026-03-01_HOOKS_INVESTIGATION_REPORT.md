# GitHub Copilot フック化調査レポート

**日付**: 2026年3月1日  
**対象**: vns-masakinihirota プロジェクト

---

## 1. 現況分析

### 1.1 既存の指示書・プロンプト構造

```
.github/
├── copilot-instructions.md          # プロジェクト全体の指示
├── instructions/
│   ├── .copilot-codeGeneration-instructions.md   # コード生成の指示
│   ├── .copilot-TDD-instructions.md              # TDD の指示
│   └── memory.instruction.md
├── hooks/                           # ⚠️ 現在は空
└── prompts/
    └── beastmode3.1.agent.md

.agent/
├── rules/
│   ├── coding-standards.md          # コーディング標準（Next.js 16対応）
│   ├── security-architecture.md     # セキュリティ・アーキテクチャ
│   ├── tdd-guidelines.md            # TDD ガイドライン
│   └── 他多数
└── skills/
    └── 複数のスキルファイル
```

### 1.2 フック活用の現状

- ✅ **ドキュメント**: `.github/hooks.md` に詳細な設定ガイドあり
- ❌ **実装**: `.github/hooks/` フォルダが空 → **フック設定がまだ実装されていない**
- ❌ **スクリプト**: フック用の実行スクリプトがない

---

## 2. フック化に適したプロンプト・指示

### 候補 1️⃣: 「セッション開始フック」（sessionStart）

**対象**: フックなしで実行

```
.github/instructions/
├── .copilot-codeGeneration-instructions.md
├── .copilot-TDD-instructions.md
└── memory.instruction.md
```

**用途**: エージェント開始時にプロジェクト状態を検証

**実装内容**:
```json
{
  "type": "command",
  "powershell": "./scripts/pre-session-check.ps1",
  "cwd": "scripts",
  "timeoutSec": 30
}
```

**チェック項目**:
- ✅ Next.js 16 対応の確認（`middleware.ts`（禁止） vs `proxy.ts`（必須））
- ✅ Better Auth スキーマの命名規則一貫性（`snake_case` vs `camelCase` 混在検出）
- ✅ 環境変数の必須項目確認
- ✅ プロジェクト構造の整合性

---

### 候補 2️⃣: 「ツール実行前フック」（preToolUse）

**対象**: コード品質・セキュリティポリシー

**実装内容**:
```json
{
  "type": "command",
  "powershell": "./scripts/pre-tool-security-check.ps1",
  "cwd": "scripts",
  "timeoutSec": 15
}
```

**ブロック対象**:
- ❌ 危険なコマンド: `rm -rf /`, `DROP TABLE`, `DELETE FROM` など
- ❌ 本番環境への直接操作（`NODE_ENV=production` かつ db操作）
- ❌ API キー・シークレット露出の危険
- ✅ コード品質チェック（ファイル編集時にESLint・TypeCheckルール確認）

**許可対象**:
- ✅ テスト実行
- ✅ ビルド・デプロイ（ステージングのみ）
- ✅ ドキュメント作成

---

### 候補 3️⃣: 「ツール実行後フック」（postToolUse）

**対象**: 実行結果のロギング・品質検証

**実装内容**:
```json
[
  {
    "type": "command",
    "powershell": "./scripts/post-tool-test-log.ps1",
    "cwd": "scripts"
  },
  {
    "type": "command",
    "powershell": "./scripts/post-tool-build-check.ps1",
    "cwd": "scripts",
    "timeoutSec": 60
  }
]
```

**ログ対象**:
- 📝 テスト実行結果（成功/失敗、カバレッジ）
- 📝 ビルドエラー検出（`pnpm build` 実行結果）
- 📝 Lint エラー（ESLint/Biome）
- 📝 型チェックエラー（TypeScript）
- 📝 ファイル編集内容（変更されたファイルパス）

---

### 候補 4️⃣: 「ユーザープロンプト受信フック」（userPromptSubmitted）

**対象**: プロンプト内容の分析・ロギング

**実装内容**:
```json
{
  "type": "command",
  "powershell": "./scripts/log-user-prompt.ps1",
  "cwd": "scripts"
}
```

**機能**:
- 📋 プロンプトテキストを JSON Lines 形式でログ
- 🏷️ 適用すべきスキル/ルールセットの自動判定
- 🔍 プロンプト内に含まれるキーワード分類（TDD, 認証, セキュリティなど）
- ⚠️ 危険なキーワード検出（本番削除、パスワードリセット、一括削除など）

---

### 候補 5️⃣: 「セッション終了フック」（sessionEnd）

**対象**: セッションレポート生成・改善提案

**実装内容**:
```json
{
  "type": "command",
  "powershell": "./scripts/post-session-report.ps1",
  "cwd": "scripts",
  "timeoutSec": 30
}
```

**出力内容**:
- 📊 セッション統計（ツール使用回数、実行時間）
- ✅ 成功したタスク数
- ⚠️ 失敗・ブロックされたアクション
- 💡 改善提案（エラーパターン、最適化ヒント）
- 🔐 セキュリティイベント（ブロック理由の集約）

---

## 3. フック化の優先度マトリクス

| フック種別 | 優先度 | 実装難度 | 効果の大きさ | 推奨実装 |
|-----------|--------|--------|-----------|--------|
| **sessionStart** | ⭐⭐⭐ | Low | 高 | ✅ **最初に実装** |
| **preToolUse** | ⭐⭐⭐ | Medium | 高 | ✅ **セキュリティ重視** |
| **postToolUse** | ⭐⭐ | High | 中 | 🟡 **段階2** |
| **userPromptSubmitted** | ⭐⭐ | Medium | 中 | 🟡 **監査ログ重視なら実装** |
| **sessionEnd** | ⭐ | Low | 低 | 🟡 **今後の最適化用** |

---

## 4. 実装計画

### フェーズ 1️⃣: 基盤構築（最優先）

```
.github/hooks/
└── vns-copilot-security.json          # セッション + ツール実行前チェック
```

**スクリプト群**:
```
scripts/
├── pre-session-check.ps1              # プロジェクト状態検証
├── pre-tool-security-check.ps1        # セキュリティ・品質チェック
└── utils/
    ├── Log-Message.ps1                 # ロギングユーティリティ
    └── Validate-ProjectState.ps1       # プロジェクト検証ロジック
```

### フェーズ 2️⃣: 監視強化（段階2）

```
.github/hooks/
├── vns-copilot-security.json          # (Phase 1)
└── vns-copilot-audit.json             # ツール実行後ログ + プロンプト监视
```

**スクリプト追加**:
```
scripts/
├── post-tool-test-log.ps1             # テストログ記録
├── post-tool-build-check.ps1          # ビルド状態チェック
├── log-user-prompt.ps1                # プロンプト監査
└── utils/
    ├── Format-AuditLog.ps1            # 監査ログフォーマット
    └── Detect-Keywords.ps1            # キーワード分類ロジック
```

---

## 5. スクリプト実装のポイント

### PowerShell 環境対応（Windows）

```powershell
# 入力の読み取り
$input = [Console]::In.ReadToEnd() | ConvertFrom-Json

# JSON出力（1行）
$output = @{
    permissionDecision = "deny"
    permissionDecisionReason = "理由"
} | ConvertTo-Json -Compress

Write-Host $output
```

### パス処理とログ出力

```powershell
# ログディレクトリ作成
$logDir = Join-Path $PSScriptRoot "../logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

# ログ出力（複数ツール呼び出しに対応）
$logPath = Join-Path $logDir "audit_$(Get-Date -Format 'yyyyMMdd_HHmmss').jsonl"
$logEntry | ConvertTo-Json -Compress | Add-Content -Path $logPath
```

---

## 6. 期待効果

### セキュリティ強化
- ✅ 危険なコマンド・本番操作のリアルタイムブロック
- ✅ 認証情報露出の早期検出
- ✅ 監査ログによるコンプライアンス対応

### 品質維持
- ✅ TDD・コーディング標準の強制
- ✅ ビルド・テストエラー早期発見
- ✅ Next.js 16対応規則の自動チェック

### 開発効率向上
- ✅ 不正な操作の即時フィードバック
- ✅ セッションレポートによる学習サイクル
- ✅ 規則違反パターンの可視化

---

## 7. 注意事項と今後の課題

### 実装時の注意
1. **タイムアウト設定**: 過度に厳しいと開発効率が低下（デフォルト30秒、緊急なら長めに）
2. **ファイル権限**: PowerShell スクリプトに実行権限が必要（`.git/hooks` とは異なる）
3. **GitHub Actions 互換性**: CI/CD環境でのフック動作検証が必要
4. **ローカル開発環境**: 開発者が不便でないようにスキップ機能の提供検討

### 今後の拡張案
- 🚀 メトリクス収集（エージェント実行時間、成功率）
- 🚀 外部システム連携（Slack 通知、GitHub Issue 自動生成）
- 🚀 コスト管理（トークン使用量追跡）
- 🚀 個別プロンプト適用制御（ユーザー/プロジェクト別の異なるルール適用）

---

## 8. 推奨される次のステップ

### ✅ 即座に実装する
1. [`sessionStart`] プロジェクト状態検証スクリプト作成
2. [`preToolUse`] セキュリティチェックスクリプト作成
3. `vns-copilot-security.json` フック設定ファイル作成
4. スクリプトテスト + ドキュメント更新

### 🟡 段階2で検討
1. [`postToolUse`] 監査ログスクリプト実装
2. [`userPromptSubmitted`] プロンプト分析スクリプト実装
3. `vns-copilot-audit.json` フック設定

### 📅 長期計画
1. hooks と CI/CD パイプラインの統合
2. メトリクス分析ダッシュボード構築
3. エージェント性能チューニング

---

## 参考資料

- [GitHub Copilot フック公式ドキュメント](.github/hooks.md)
- [コーディング標準](.agent/rules/coding-standards.md)
- [セキュリティ・アーキテクチャ](.agent/rules/security-architecture.md)
- [TDD ガイドライン](.agent/rules/tdd-guidelines.md)
