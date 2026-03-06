フックについて
エージェントの実行中にキー ポイントでカスタム シェル コマンドを実行して、GitHub Copilot エージェントの動作を拡張およびカスタマイズします。

この機能を使用できるユーザーについて
Copilot コーディングエージェント は、GitHub Copilot Pro、GitHub Copilot Pro+、GitHub Copilot Business、GitHub Copilot Enterprise プランで使用できます。 エージェントは、マネージド ユーザー アカウント によって所有されて明示的に無効になっているリポジトリを除き、GitHub に格納されているすべてのリポジトリで使用できます。

この記事の内容
フックについて
フックを使用すると、エージェント セッションの開始または終了、プロンプトの入力前後やツールの呼び出しなど、エージェントのワークフロー内の戦略的なポイントでカスタム シェル コマンドを実行できます。

フックは JSON 入力を介してエージェント アクションに関する詳細情報を受け取り、コンテキスト対応の自動化を可能にします。 たとえば、フックを使用して次のことができます。

プログラムによってツールの実行を承認または拒否します。
シークレット スキャンなどの組み込みのセキュリティ機能を利用して、資格情報の漏洩を防ぎます。
コンプライアンスのためにカスタム検証規則と監査ログを実装します。
Copilot エージェントは、リポジトリ内の JSON ファイルに格納されているフックをサポートしています .github/hooks/*.json。

フックは以下で使用できます。

Copilot コーディングエージェント は GitHub 上で
ターミナルの GitHub Copilot CLI（コマンドラインインターフェース）
フックの種類
次の種類のフックを使用できます。

        **sessionStart**: 新しいエージェント セッションが開始されたとき、または既存のセッションを再開するときに実行されます。 環境の初期化、監査のためのログ セッションの開始、プロジェクトの状態の検証、一時リソースの設定に使用できます。
        **sessionEnd**: エージェント セッションが完了または終了したときに実行されます。 一時的なリソースのクリーンアップ、セッション レポートとログの生成とアーカイブ、セッション完了に関する通知の送信に使用できます。
        **userPromptSubmitted**: ユーザーがエージェントにプロンプトを送信したときに実行されます。 監査と使用状況分析のユーザー要求をログに記録するために使用できます。
        **preToolUse**: エージェントが任意のツール ( `bash`、 `edit`、 `view`など) を使用する前に実行されます。 これは、 **ツールの実行を承認または拒否**できるため、最も強力なフックです。 このフックを使用して、危険なコマンドをブロックしたり、セキュリティ ポリシーとコーディング標準を適用したり、機密性の高い操作の承認を必要としたり、コンプライアンスのためにログ ツールを使用したりできます。
        **postToolUse**: ツールの実行が完了した後に実行されます (成功したか失敗したか)。 実行結果のログ記録、使用状況の統計の追跡、監査証跡の生成、パフォーマンス メトリックの監視、エラー アラートの送信に使用できます。
        **agentStop**: メイン エージェントがプロンプトへの応答を完了したときに実行されます。
        **subagentStop**: 親エージェントに結果を返す前に、サブエージェントが完了したときに実行されます。
        **errorOccurred**: エージェントの実行中にエラーが発生したときに実行されます。 デバッグのエラーのログ記録、通知の送信、エラー パターンの追跡、レポートの生成に使用できます。
ユース ケース、ベスト プラクティス、高度なパターンの例を含むフックの種類の完全なリファレンスについては、 フックの構成 を参照してください。

フック構成形式
特殊な JSON 形式を使用してフックを構成します。 JSON には、値が version の1 フィールドと、フック定義の配列を含むhooks オブジェクトが含まれている必要があります。

JSON
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": "string (optional)",
        "powershell": "string (optional)",
        "cwd": "string (optional)",
        "env": { "KEY": "value" },
        "timeoutSec": 30
      }
    ],
  }
}
フック オブジェクトには、次のキーを含めることができます。

プロパティ	必須	Description
type	イエス
          `"command"` である必要があります。 |
| bash | はい (Unix システムの場合) | 実行する bash スクリプトへのパス | | powershell | はい (Windows の場合) | 実行する PowerShell スクリプトへのパス | | cwd | いいえ | スクリプトの作業ディレクトリ (リポジトリ ルートに対する相対ディレクトリ) | | env | いいえ | 既存の環境とマージされる追加の環境変数 | | timeoutSec | いいえ | 最大実行時間 (秒単位) (既定値: 30) |

フック構成ファイルの例
これは、リポジトリ内の ~/.github/hooks/project-hooks.json に存在する構成ファイルの例です。

JSON
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": "echo \"Session started: $(date)\" >> logs/session.log",
        "powershell": "Add-Content -Path logs/session.log -Value \"Session started: $(Get-Date)\"",
        "cwd": ".",
        "timeoutSec": 10
      }
    ],
    "userPromptSubmitted": [
      {
        "type": "command",
        "bash": "./scripts/log-prompt.sh",
        "powershell": "./scripts/log-prompt.ps1",
        "cwd": "scripts",
        "env": {
          "LOG_LEVEL": "INFO"
        }
      }
    ],
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/security-check.sh",
        "powershell": "./scripts/security-check.ps1",
        "cwd": "scripts",
        "timeoutSec": 15
      },
      {
        "type": "command",
        "bash": "./scripts/log-tool-use.sh",
        "powershell": "./scripts/log-tool-use.ps1",
        "cwd": "scripts"
      }
    ],
    "postToolUse": [
      {
        "type": "command",
        "bash": "cat >> logs/tool-results.jsonl",
        "powershell": "$input | Add-Content -Path logs/tool-results.jsonl"
      }
    ],
    "sessionEnd": [
      {
        "type": "command",
        "bash": "./scripts/cleanup.sh",
        "powershell": "./scripts/cleanup.ps1",
        "cwd": "scripts",
        "timeoutSec": 60
      }
    ]
  }
}
パフォーマンスに関する考慮事項
フックは同期的に実行され、エージェントの実行をブロックします。 応答性の高いエクスペリエンスを確保するには、次の考慮事項に留意してください。

        **実行時間を最小限に抑える**: 可能な場合は、フックの実行時間を 5 秒以下にしてください。
        **ログ記録の最適化**: 同期 I/O ではなく、ファイルへの追加などの非同期ログを使用します。
        **バックグラウンド処理を使用**する: コストの高い操作の場合は、バックグラウンド処理を検討してください。
        **キャッシュ結果**: コストの高い計算を可能な限りキャッシュします。
セキュリティに関する考慮事項
フックを使用するときにセキュリティが維持されるようにするには、次の点に注意してください。

        **フックによって処理される入力を常に検証してサニタイズします**。 信頼されていない入力によって、予期しない動作が発生する可能性があります。
        **コマンドを作成するときは、適切なシェル エスケープを使用します**。 これにより、コマンド インジェクションの脆弱性が回避されます。
        **トークンやパスワードなどの機密データをログに記録しないでください**。
        **フック スクリプトとログに適切なアクセス許可があることを確認**します。
        **外部ネットワーク呼び出しを行うフックには注意してください**。 これにより、待機時間、障害が発生したり、サード パーティにデータが公開されたりする可能性があります。
        **リソースの枯渇を防ぐために、適切なタイムアウトを設定します**。 実行時間の長いフックは、エージェントの実行をブロックし、パフォーマンスを低下させる可能性があります。














GitHub Copilot エージェントを使ったフックの活用
エージェントの実行中にキー ポイントでカスタム シェル コマンドを実行して、GitHub Copilot エージェントの動作を拡張およびカスタマイズします。

この記事の内容
フックを使用すると、エージェントの実行中にキー ポイントでカスタム シェル コマンドを実行することで、 GitHub Copilot エージェントの動作を拡張およびカスタマイズできます。 使用可能なフック トリガーの詳細など、フックの概念の概要については、 フックについて を参照してください。

GitHub
のリポジトリにフックを作成する

リポジトリの hooks.json フォルダーに、任意の名前の新しい.github/hooks/ ファイルを作成します。 フック構成ファイルは、Copilot コーディングエージェント で使用するには、リポジトリの既定のブランチに 存在する必要があります 。 GitHub Copilot CLI（コマンドラインインターフェース） の場合、フックは現在の作業ディレクトリから読み込まれます。

テキスト エディターで、次のフック テンプレートをコピーして貼り付けます。 使用する予定のないフックを hooks 配列から削除します。

JSON
{
  "version": 1,
  "hooks": {
    "sessionStart": [...],
    "sessionEnd": [...],
    "userPromptSubmitted": [...],
    "preToolUse": [...],
    "postToolUse": [...],
    "errorOccurred": [...]
  }
}
       `bash`キーまたは`powershell`キーでフック構文を構成するか、作成したスクリプト ファイルを直接参照します。
次の例では、 sessionStart フックを使用してセッションの開始日をログ ファイルに出力するスクリプトを実行します。

JSON
"sessionStart": [
  {
    "type": "command",
    "bash": "echo \"Session started: $(date)\" >> logs/session.log",
    "powershell": "Add-Content -Path logs/session.log -Value \"Session started: $(Get-Date)\"",
    "cwd": ".",
    "timeoutSec": 10
  }
],
次の例では、外部 log-prompt スクリプトを呼び出します。

JSON
"userPromptSubmitted": [
  {
    "type": "command",
    "bash": "./scripts/log-prompt.sh",
    "powershell": "./scripts/log-prompt.ps1",
    "cwd": "scripts",
    "env": {
      "LOG_LEVEL": "INFO"
    }
  }
],
エージェント セッションからの入力 JSON とサンプル スクリプトの完全なリファレンスについては、 フックの構成 を参照してください。

ファイルをリポジトリにコミットし、既定のブランチにマージします。 これで、フックはエージェント セッション中に実行されます。

トラブルシューティング
フックを使用して問題が発生した場合は、次の表を使用してトラブルシューティングを行います。

問題点	アクション
フックが実行されていない
JSON ファイルが .github/hooks/ ディレクトリ内にあるかどうかを確認します。
有効な JSON 構文 (たとえば、 jq .  hooks.json) を確認します。
          `version: 1` ファイルに`hooks.json`が指定されていることを確認します。</li><li>フックから呼び出しているスクリプトが実行可能であることを確認します (`chmod +x script.sh`)</li><li>スクリプトに適切な shebang があることを確認します (例: `#!/bin/bash`)</li></ul> |
| フックがタイムアウトする |

既定のタイムアウトは 30 秒です。 必要に応じて、構成の timeoutSec を増やします。
不要な操作を回避してスクリプトのパフォーマンスを最適化します。
| | 無効な JSON 出力 |
出力が 1 行であることを確認します。
Unix では、 jq -c を使用して JSON 出力を圧縮して検証します。
Windows では、PowerShell の ConvertTo-Json -Compress コマンドを使用して同じ操作を行います。
|
デバッグ
次のメソッドを使用してフックをデバッグできます。

スクリプトで詳細ログを有効化して、入力データを検査し、スクリプトの実行を追跡します。

Shell
#!/bin/bash
set -x  # Enable bash debug mode
INPUT=$(cat)
echo "DEBUG: Received input" >&2
echo "$INPUT" >&2
# ... rest of script
        **テストフックをローカルでテストするために、テスト入力をフックにパイプし**、その動作を検証します。
Shell
# Create test input
echo '{"timestamp":1704614400000,"cwd":"/tmp","toolName":"bash","toolArgs":"{\"command\":\"ls\"}"}' | ./my-hook.sh

# Check exit code
echo $?

# Validate output is valid JSON
./my-hook.sh | jq .




フックの構成
GitHub Copilot CLI（コマンドラインインターフェース） および Copilot コーディングエージェント で使用するフックの構成に関する情報を確認します。

この記事の内容
このリファレンス記事では、入力形式と出力形式、スクリプトのベスト プラクティス、ログ記録、セキュリティ適用、外部統合の高度なパターンなど、使用可能なフックの種類と例について説明します。 フックの作成に関する一般的な情報については、 AUTOTITLE を参照してください。 CLI のフックの作成に関するチュートリアルについては、 予測可能なポリシー準拠の実行に Copilot CLI でフックを使用する を参照してください。

フックの種類
セッション開始フック
新しいエージェント セッションの開始時または既存のセッションの再開時に実行されます。

          **入力 JSON:**
JSON
{
  "timestamp": 1704614400000,
  "cwd": "/path/to/project",
  "source": "new",
  "initialPrompt": "Create a new feature"
}
          **フィールド：**
* timestamp: Unix タイムスタンプ (ミリ秒) * cwd: 現在の作業ディレクトリ * source: "new" (新しいセッション)、 "resume" (再開されたセッション)、または "startup" * initialPrompt: ユーザーの最初のプロンプト (指定されている場合)

          **出力：** 無視 (戻り値は処理されません)

          **フックの例:**
JSON
{
  "type": "command",
  "bash": "./scripts/session-start.sh",
  "powershell": "./scripts/session-start.ps1",
  "cwd": "scripts",
  "timeoutSec": 30
}
          **サンプル スクリプト (Bash):**
Shell
#!/bin/bash
INPUT=$(cat)
SOURCE=$(echo "$INPUT" | jq -r '.source')
TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')

echo "Session started from $SOURCE at $TIMESTAMP" >> session.log
セッション終了フック
エージェント セッションが完了または終了したときに実行されます。

          **入力 JSON:**
JSON
{
  "timestamp": 1704618000000,
  "cwd": "/path/to/project",
  "reason": "complete"
}
          **フィールド：**
* timestamp: Unix タイムスタンプ (ミリ秒) * cwd: 現在の作業ディレクトリ * reason: "complete"、 "error"、 "abort"、 "timeout"、または "user_exit"

          **出力：** 無視されました

          **スクリプトの例:**
Shell
#!/bin/bash
INPUT=$(cat)
REASON=$(echo "$INPUT" | jq -r '.reason')

echo "Session ended: $REASON" >> session.log
# Cleanup temporary files
rm -rf /tmp/session-*
ユーザープロンプト送信のフック
ユーザーがエージェントにプロンプトを送信したときに実行されます。

          **入力 JSON:**
JSON
{
  "timestamp": 1704614500000,
  "cwd": "/path/to/project",
  "prompt": "Fix the authentication bug"
}
          **フィールド：**
* timestamp: Unix タイムスタンプ (ミリ秒) * cwd: 現在の作業ディレクトリ * prompt: ユーザーが送信した正確なテキスト

          **出力：** 無視されました (顧客フックでは現在プロンプトの変更はサポートされていません)

          **スクリプトの例:**
Shell
#!/bin/bash
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt')
TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')

# Log to a structured file
echo "$(date -d @$((TIMESTAMP/1000))): $PROMPT" >> prompts.log
ツール使用前のフック
エージェントが任意のツール ( bash、 edit、 viewなど) を使用する前に実行されます。 これは、 ツールの実行を承認または拒否できるため、最も強力なフックです。

          **入力 JSON:**
JSON
{
  "timestamp": 1704614600000,
  "cwd": "/path/to/project",
  "toolName": "bash",
  "toolArgs": "{\"command\":\"rm -rf dist\",\"description\":\"Clean build directory\"}"
}
          **フィールド：**
* timestamp: Unix タイムスタンプ (ミリ秒) * cwd: 現在の作業ディレクトリ * toolName: 呼び出されるツールの名前 ("bash"、"edit"、"view"、"create" など) * toolArgs: ツールの引数を含む JSON 文字列

          **出力 JSON (省略可能):**
JSON
{
  "permissionDecision": "deny",
  "permissionDecisionReason": "Destructive operations require approval"
}
          **出力フィールド:**
* permissionDecision: "allow"、 "deny"、または "ask" (現在処理されている "deny" のみ) * permissionDecisionReason: 決定に関する人間が判読できる説明

          **危険なコマンドをブロックするフックの例:**
Shell
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# Log the tool use
echo "$(date): Tool=$TOOL_NAME Args=$TOOL_ARGS" >> tool-usage.log

# Check for dangerous patterns
if echo "$TOOL_ARGS" | grep -qE "rm -rf /|format|DROP TABLE"; then
  echo '{"permissionDecision":"deny","permissionDecisionReason":"Dangerous command detected"}'
  exit 0
fi

# Allow by default (or omit output to allow)
echo '{"permissionDecision":"allow"}'
          **ファイルのアクセス許可を適用するフックの例:**
Shell
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')

# Only allow editing specific directories
if [ "$TOOL_NAME" = "edit" ]; then
  PATH_ARG=$(echo "$INPUT" | jq -r '.toolArgs' | jq -r '.path')

  if [[ ! "$PATH_ARG" =~ ^(src/|test/) ]]; then
    echo '{"permissionDecision":"deny","permissionDecisionReason":"Can only edit files in src/ or test/ directories"}'
    exit 0
  fi
fi

# Allow all other tools
ツール利用後のフック
ツールの実行が完了した後に実行されます (成功したか失敗したか)。

          **入力 JSON の例:**
JSON
{
  "timestamp": 1704614700000,
  "cwd": "/path/to/project",
  "toolName": "bash",
  "toolArgs": "{\"command\":\"npm test\"}",
  "toolResult": {
    "resultType": "success",
    "textResultForLlm": "All tests passed (15/15)"
  }
}
          **フィールド：**
* timestamp: Unix タイムスタンプ (ミリ秒) * cwd: 現在の作業ディレクトリ * toolName: 実行されたツールの名前 * toolArgs: ツールの引数を含む JSON 文字列 * toolResult: 次を含む Result オブジェクト: * resultType: "success"、 "failure"、または "denied" * textResultForLlm: エージェントに表示される結果テキスト

          **出力：** 無視 (結果の変更は現在サポートされていません)

          **ツールの実行統計を CSV ファイルに記録するスクリプトの例:**
このスクリプトは、ツールの実行統計を CSV ファイルに記録し、ツールが失敗したときに電子メール アラートを送信します。

Shell
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
RESULT_TYPE=$(echo "$INPUT" | jq -r '.toolResult.resultType')

# Track statistics
echo "$(date),${TOOL_NAME},${RESULT_TYPE}" >> tool-stats.csv

# Alert on failures
if [ "$RESULT_TYPE" = "failure" ]; then
  RESULT_TEXT=$(echo "$INPUT" | jq -r '.toolResult.textResultForLlm')
  echo "FAILURE: $TOOL_NAME - $RESULT_TEXT" | mail -s "Agent Tool Failed" admin@example.com
fi
フックのエラーが発生しました
エージェントの実行中にエラーが発生したときに実行されます。

          **入力 JSON の例:**
JSON
{
  "timestamp": 1704614800000,
  "cwd": "/path/to/project",
  "error": {
    "message": "Network timeout",
    "name": "TimeoutError",
    "stack": "TimeoutError: Network timeout\n    at ..."
  }
}
          **フィールド：**
* timestamp: Unix タイムスタンプ (ミリ秒) * cwd: 現在の作業ディレクトリ * error: 次を含む Error オブジェクト: * message: エラー メッセージ * name: エラーの種類/名前 * stack: スタック トレース (使用可能な場合)

          **出力：** 無視 (エラー処理の変更は現在サポートされていません)

          **エラーの詳細をログ ファイルに抽出するスクリプトの例:**
Shell
#!/bin/bash
INPUT=$(cat)
ERROR_MSG=$(echo "$INPUT" | jq -r '.error.message')
ERROR_NAME=$(echo "$INPUT" | jq -r '.error.name')

echo "$(date): [$ERROR_NAME] $ERROR_MSG" >> errors.log
スクリプトのベスト プラクティス
入力の読み取り
このサンプル スクリプトは、stdin から変数に JSON 入力を読み取り、 jq を使用して timestamp フィールドと cwd フィールドを抽出します。

          **Bash：**
Shell
#!/bin/bash
# Read JSON from stdin
INPUT=$(cat)

# Parse with jq
TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')
CWD=$(echo "$INPUT" | jq -r '.cwd')
          **PowerShell:**
PowerShell
# Read JSON from stdin
$input = [Console]::In.ReadToEnd() | ConvertFrom-Json

# Access properties
$timestamp = $input.timestamp
$cwd = $input.cwd
JSON の出力
このサンプル スクリプトは、フック スクリプトから有効な JSON を出力する方法を示しています。 Bash で jq -c を使用して、コンパクトな単一行出力を行うか、PowerShell で ConvertTo-Json -Compress します。

          **Bash：**
Shell
#!/bin/bash
# Use jq to compact the JSON output to a single line
echo '{"permissionDecision":"deny","permissionDecisionReason":"Security policy violation"}' | jq -c

# Or construct with variables
REASON="Too dangerous"
jq -n --arg reason "$REASON" '{permissionDecision: "deny", permissionDecisionReason: $reason}'
          **PowerShell:**
PowerShell
# Use ConvertTo-Json to compact the JSON output to a single line
$output = @{
    permissionDecision = "deny"
    permissionDecisionReason = "Security policy violation"
}
$output | ConvertTo-Json -Compress
エラー処理
このスクリプトの例では、フック スクリプトでエラーを処理する方法を示します。

          **Bash：**
Shell
#!/bin/bash
set -e  # Exit on error

INPUT=$(cat)
# ... process input ...

# Exit with 0 for success
exit 0
          **PowerShell:**
PowerShell
$ErrorActionPreference = "Stop"

try {
    $input = [Console]::In.ReadToEnd() | ConvertFrom-Json
    # ... process input ...
    exit 0
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
タイムアウトを処理する
フックの既定のタイムアウトは 30 秒です。 操作を長くする場合は、 timeoutSecを増やします。

JSON
{
  "type": "command",
  "bash": "./scripts/slow-validation.sh",
  "timeoutSec": 120
}
高度なパターン
同じ型の複数のフック
同じイベントに対して複数のフックを定義できます。 これらは次の順序で実行されます。

JSON
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/security-check.sh",
        "comment": "Security validation - runs first"
      },
      {
        "type": "command",
        "bash": "./scripts/audit-log.sh",
        "comment": "Audit logging - runs second"
      },
      {
        "type": "command",
        "bash": "./scripts/metrics.sh",
        "comment": "Metrics collection - runs third"
      }
    ]
  }
}
スクリプトの条件付きロジック
          **例: 特定のツールのみをブロックする**
Shell
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')

# Only validate bash commands
if [ "$TOOL_NAME" != "bash" ]; then
  exit 0  # Allow all non-bash tools
fi

# Check bash command for dangerous patterns
COMMAND=$(echo "$INPUT" | jq -r '.toolArgs' | jq -r '.command')
if echo "$COMMAND" | grep -qE "rm -rf|sudo|mkfs"; then
  echo '{"permissionDecision":"deny","permissionDecisionReason":"Dangerous system command"}'
fi
構造化ログ
          **例: JSON Lines 形式**
Shell
#!/bin/bash
INPUT=$(cat)
TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
RESULT_TYPE=$(echo "$INPUT" | jq -r '.toolResult.resultType')

# Output structured log entry
jq -n \
  --arg ts "$TIMESTAMP" \
  --arg tool "$TOOL_NAME" \
  --arg result "$RESULT_TYPE" \
  '{timestamp: $ts, tool: $tool, result: $result}' >> logs/audit.jsonl
外部システムとの統合
          **例: Slack にアラートを送信する**
Shell
#!/bin/bash
INPUT=$(cat)
ERROR_MSG=$(echo "$INPUT" | jq -r '.error.message')

WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

curl -X POST "$WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"Agent Error: $ERROR_MSG\"}"
利用事例の例
コンプライアンス監査証跡
ログ スクリプトを使用して、コンプライアンス要件のすべてのエージェント アクションをログに記録します。

JSON
{
  "version": 1,
  "hooks": {
    "sessionStart": [{"type": "command", "bash": "./audit/log-session-start.sh"}],
    "userPromptSubmitted": [{"type": "command", "bash": "./audit/log-prompt.sh"}],
    "preToolUse": [{"type": "command", "bash": "./audit/log-tool-use.sh"}],
    "postToolUse": [{"type": "command", "bash": "./audit/log-tool-result.sh"}],
    "sessionEnd": [{"type": "command", "bash": "./audit/log-session-end.sh"}]
  }
}
コストの追跡
コストの割り当てに関するツールの使用状況を追跡します。

Shell
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')
USER=${USER:-unknown}

echo "$TIMESTAMP,$USER,$TOOL_NAME" >> /var/log/copilot/usage.csv
コード品質の強制実施
コード標準に違反するコミットを防ぐ:

Shell
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')

if [ "$TOOL_NAME" = "edit" ] || [ "$TOOL_NAME" = "create" ]; then
  # Run linter before allowing edits
  npm run lint-staged
  if [ $? -ne 0 ]; then
    echo '{"permissionDecision":"deny","permissionDecisionReason":"Code does not pass linting"}'
  fi
fi
通知システム
重要なイベントに関する通知を送信します。

Shell
#!/bin/bash
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt')

# Notify on production-related prompts
if echo "$PROMPT" | grep -iq "production"; then
  echo "ALERT: Production-related prompt: $PROMPT" | mail -s "Agent Alert" team@example.com
fi





