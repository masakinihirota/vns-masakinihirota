---
name: pnpm-safe-execution
description: eslintなどの静的解析やビルドなど、プロジェクト固有の安全なコマンドは、直接ターミナルで実行するのではなく、package.jsonのscripts経由でpnpmコマンドとして実行するためのルール。
---

# 安全なコマンド実行ルール (pnpm scriptsの利用)

AIエージェントがプロジェクト内で `eslint`、`tsc`、`prettier`、その他のビルドや静的解析ツールを実行する際の厳格なルールです。

## 1. npxやグローバルコマンドの直接実行禁止

`npx eslint ...` や `npx tsc ...` のようなコマンドをターミナルで直接実行しないでください。
依存関係の違いや、プロジェクトで設定されているオプション（特定の除外ファイル、フォーマット指定など）が抜け落ちるリスクがあります。

## 2. package.json の scripts を優先する

必ず `package.json` の `scripts` フィールドを確認し、そこで定義されているコマンドを使用してください。
実行時は、このプロジェクトの標準パッケージマネージャーである **`pnpm`** を使用します。

### ✅ 正しい実行例
- `pnpm run lint` (または `pnpm lint`)
- `pnpm run type-check`
- `pnpm run build`

### ❌ 誤った実行例
- `npx eslint src`
- `npx tsc --noEmit`

## 3. 必要な script が存在しない場合追加する

もし実行したいタスク（例: 特定ディレクトリだけの lint、独自フォーマットでの出力など）に合致する `scripts` が `package.json` にない場合は、**ターミナルで直接長いコマンドを打つのではなく、まず `package.json` の `scripts` にコマンドを追加**してください。

**追加例 (package.json):**
```json
"scripts": {
  "lint": "eslint src",
  "lint:fix": "eslint src --fix",
  "lint:report": "eslint src -f json -o eslint_report.json"
}
```
追加後、`pnpm run lint:report` のように実行します。

## 4. なぜこの手順を踏むのか？

1. **再現性の担保**: 他の開発者や継続的インテグレーション(CI)が同じコマンドを実行できるようにするため。
2. **オプションの一元管理**: 無視ファイル、フォーマッタ、型チェックのスコープなどを一箇所で管理するため。
3. **ターミナル実行エラーの回避**: Windows (PowerShell) 環境での引数エスケープやパス解釈のエラーを防ぐため。
