# User Profiles

ユーザープロフィールの管理と作成を行うコンポーネント群です。

## ディレクトリ構成

- `create/`: プロフィール新規作成ウィザード
  - `steps/`: ウィザードの各ステップ（役割選択、目的設定、作品登録、価値観回答など）
  - `user-profile-creation.tsx`: 作成画面のメイン UI
  - `user-profile-creation.logic.ts`: 作成画面のビジネスロジック
  - `user-profile-creation.types.ts`: 作成画面で使用する型定義
- `user-profile-manager.tsx`: プロフィール一覧・管理画面のメイン UI
- `user-profile-manager.logic.ts`: 管理画面のビジネスロジック

## 特徴

- **マルチステップウィザード**: 段階的に情報を入力し、ライブプレビューで内容を確認しながら作成できます。
- **匿名表示名生成**: 星座に基づいた匿名名の候補を生成・選択できます。
- **価値観マッチング**: 活動目的に応じた価値観の質問セットが自動的に提案されます。
- **グラスモーフィズムデザイン**: モダンで透明感のある UI を採用しています。

## 技術スタック

- React (Next.js App Router)
- Lucide React (アイコン)
- Tailwind CSS (スタイリング)
- Vitest (テスト)
