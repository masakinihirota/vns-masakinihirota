# 指示書構造変更分析 (2025年8月23日)

## 新しい指示書配置構造

### フォルダ構成
```
.github/
├── all/                      # 全体適用指示書
│   ├── serena-MCP-instructions.md
│   ├── translation-instructions.md
│   ├── commit-message-instructions.md
│   └── review-instructions.md
├── code/                     # コード関連指示書
│   ├── appRouter-instructions.md
│   ├── codeGeneration-instructions.md
│   ├── codeGeneration2-instructions.md
│   ├── conform-instructions.md
│   ├── context7-instructions.md
│   ├── design-system-instructions.md
│   ├── drizzle-orm.md
│   ├── figma-instructions.md
│   ├── namingConventions-instructions.md
│   ├── supabase-instructions.md
│   └── testing-instructions.md
├── markdown/                 # Markdown関連指示書
│   ├── task-instructions.md
│   └── document-instructions.md
├── supabase指示書/           # Supabase専用指示書
├── キャラクター指示書/        # キャラクター関連指示書
├── chatmodes/               # チャットモード設定
├── _prompt/                 # プロンプトファイル
└── __task-list/            # タスクリスト管理
```

## 構造化のメリット

### 1. 責務の明確化
- **all/**: プロジェクト全体に適用される基本ルール
- **code/**: 実装時のコーディング規約・技術指示
- **markdown/**: ドキュメント作成・タスク管理指示
- **専門領域別**: Supabase, キャラクター設定等の特化指示

### 2. 指示書の優先順位構造
1. **タスクファイル**（`_prompt`内）
2. **個別技術指示書**（各フォルダ内）
3. **全体指示書**（`all`フォルダ内）

### 3. Serena MCP 連携最適化
- プロジェクト状況の段階的把握が容易
- 各フェーズでの適用指示書が明確
- メモリ管理と指示書参照の効率化

## 分析結果

### 改善点
✅ **構造化**: 以前の平坦な構造から階層的な整理に改善
✅ **責務分離**: 機能別・適用範囲別の明確な分類
✅ **拡張性**: 新しい技術・機能に対応しやすい構造
✅ **保守性**: 指示書の更新・管理が容易

### 現在の実装状況
- Phase 1機能: 完全実装済み
- データベース設計: 設計書準拠で完成
- 指示書体系: 新構造で整理完了