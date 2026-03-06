
参考
sickn33/antigravity-awesome-skills: Claude Code/Antigravity/Cursor 向けの 900 種類以上のエージェントスキルを収録した究極のコレクション。Anthropic と Vercel の公式スキルを含む、AI エージェント向けの実戦テスト済みの高性能スキルを収録。
https://github.com/sickn33/antigravity-awesome-skills

https://github.com/sickn33/antigravity-awesome-skills/blob/main/docs/BUNDLES.md

https://github.com/sickn33/antigravity-awesome-skills/blob/main/docs/BUNDLES.md

## GitHub Copilot との統合

本プロジェクトでは、VS Code上のGitHub CopilotとAntigravityエディタが同じルールセットを参照できるよう、`.agent/` フォルダを唯一の Single Source of Truth として運用しています。
旧体制の `.github/instructions/` で管理されていたプロンプトはすべて当フォルダの `rules/` および `skills/` に統合されました。

**エディタ間の一貫性について:**
- **Antigravity**: 自動的に `.agent/rules/` と `.agent/skills/` を読み込みます。
- **VS Code**: User Settings または Workspace Settings で指定することで、GitHub Copilot がこれらのルールを参照します。
  - `chat.instructionsFilesLocations` で `.agent/rules`
  - `chat.hookFilesLocations` で `.agent/hooks`
これにより、どのエディタを使用しても一貫したコード品質、アーキテクチャ規約、およびセキュリティ標準が適用されます。
