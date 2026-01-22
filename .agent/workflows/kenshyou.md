---
description: Vercel React Best Practicesに基づき、コードベース（特にsrc/components）の包括的な検証を行います。
---

1. コンテキストの読み込み
   - 次のスキルファイルを確認し、ベストプラクティスを理解してください: @[u:\2026src\vns-masakinihirota.worktrees\anti\.agent\skills\vercel-react-best-practices\SKILL.md]

2. スコープの定義
   - `src/components` ディレクトリ内のサブディレクトリをリストアップし、検証対象のコンポーネントを把握します。

3. 自動パターンチェック (grep実行)
   - 以下のコマンドまたは類似の検索を行い、現状を把握します。
   - **Client Components**: `"use client"` の使用数をカウントします。
     - `grep -r "use client" src/components | wc -l`
   - **画像の最適化**: `next/image` ではなく `<img>` タグが使用されている箇所をチェックします。
     - `grep -r "<img" src/components`
   - **Barrel Imports**: `..` からのインポートなど、不要なバンドル肥大化や循環参照の可能性がある箇所をチェックします。
     - `grep -r "from '\.\.'" src/components`
   - **Waterfalls (ウォーターフォール)**: 連続した `await` 文を検索し、並列化可能な処理が直列になっていないか確認します。
     - `grep -r -A 1 "await " src/components`

4. 詳細監査 (Deep Dive)
   - 代表的なコンポーネントを3〜5個選定します（例: `profile-list`, `onboarding-pc` など、ロジックが複雑そうなもの）。
   - 各コンポーネントについて以下を分析します:
     - **データ取得**: `*.logic.ts` やコンテナを確認し、リクエストが適切に並列化されているか、Waterfallになっていないか。
     - **レンダリング**: `*.tsx` を確認し、Suspenseの使用、画像の最適化、CWV（Core Web Vitals）への配慮があるか。

5. レポート作成
   - 検証結果をまとめたレポートを作成します。
   - **構成案**:
     - **自動チェック結果**: 各項目の検出数と評価（合格/要改善）。
     - **詳細監査結果**: 選定したコンポーネントごとの具体的な改善点。
     - **アクションアイテム**: 優先的に修正すべき事項のリスト。
