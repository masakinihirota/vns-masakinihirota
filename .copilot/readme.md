GitHub Copilot CLIの設定ファイル
挙動のカスタマイズ用

  `model`: AI model to use for Copilot CLI; defaults to "claude-sonnet-4.5".
    - "claude-sonnet-4" uses Claude Sonnet 4 model
    - "claude-sonnet-4.5" uses Claude Sonnet 4.5 model
    - Can be changed with the /model command (overrides environment variable)
    - Overridden by --model command line option

モデル
/model

デフォルトは Claude Sonnet 4 です。
変更したい場合はcopilot --model gpt-5のように--modelフラグで指定するか、インタラクティブモードの/modelコマンドで指定できます。
利用可能なモデルの値は以下です。

claude-sonnet-4
claude-sonnet-4.5
gpt-5

環境変数の
COPILOT_MODEL="claude-sonnet-4.5"
で指定することもできます。
