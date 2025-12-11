---
trigger: always_on
---

# Shadcn/UI プロンプトテンプレート集

**要約**: AIに効果的なUI生成を依頼するためのKERNEL準拠プロンプトテンプレート

## 適用優先順位

1. **最優先**: [ui-dadsi-instruction.md](ui-dadsi-instruction.md) - デザイントークン、アクセシビリティ実装
2. **本書**: プロンプト補助のみ（実装規約ではない）

⚠️ **重要**: 本書のテンプレートを使用する際は、必ずDADS指示書の制約（`aria-disabled`、`ring-yellow-400`、Tailwind標準クラスのみ）に置き換えてください。

---

## テンプレート1: 新規コンポーネント生成

```
Task: [ログインフォーム]を実装
Input: ユーザー名、パスワード、ログインボタン
Constraints:
  - Shadcn/UI Form + Button コンポーネント使用
  - DADS準拠（ui-dadsi-instruction.md参照）
  - aria-disabled必須（disabled属性禁止）
  - フォーカスリング: ring-yellow-400
  - Tailwind標準クラスのみ（カスタムCSS変数禁止）
  - バリデーション: Zod + React Hook Form
Output:
  - TSXファイル（型安全）
  - ユニットテスト（Vitest）
  - アクセシビリティ検証済み
```

**生成例**:

```tsx
// ✅ DADS準拠のログインフォーム
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const {
    register,
    formState: { isValid },
  } = useForm();

  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-semibold text-gray-900">
          ユーザー名
          <span className="ml-1 text-red-600" aria-label="必須">
            *
          </span>
        </label>
        <input
          id="username"
          {...register("username", { required: true })}
          aria-required="true"
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
      </div>

      <Button
        type="submit"
        aria-disabled={!isValid}
        onClick={(e) => !isValid && e.preventDefault()}
        className="bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 focus:ring-4 focus:ring-yellow-400"
      >
        ログイン
      </Button>
    </form>
  );
}
```

---

## テンプレート2: 既存UIの改善

```
Task: [グローバルナビゲーション]をモダンなデザインに改善
Input: 現在のコード [ファイルパス]
Constraints:
  - デスクトップ優先（lg:1024px基準）
  - 余白を大胆に使用（py-16, gap-6）
  - Noto Sans JP（font-sans）
  - コントラスト比4.5:1以上
  - キーボードナビゲーション対応
Scope: ナビゲーションバーのみ（フッターは除外）
Output:
  - 改善後のTSXコード
  - Before/After の比較
  - アクセシビリティチェックリスト
```

---

## テンプレート3: レスポンシブ対応

```
Task: [カードグリッド]にレスポンシブ対応を追加
Input: デスクトップ版コード（lg:基準）
Constraints:
  - ブレイクポイント: sm(640), md(768), lg(1024)
  - デスクトップ→タブレット→モバイルの順で調整
  - grid-cols: lg:3, md:2, sm:1
  - タッチターゲット: 最小44px×44px
Output: レスポンシブ対応済みTSX
```

**生成例**:

```tsx
// ✅ レスポンシブカードグリッド
<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <article key={item.id} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-xl font-bold">{item.title}</h3>
    </article>
  ))}
</div>
```

---

## テンプレート4: エラー状態の実装

```
Task: [フォーム入力]にエラー状態を追加
Input: 基本的な入力フィールド
Constraints:
  - エラー時: aria-invalid="true" + role="alert"
  - エラーメッセージ: id付与 + aria-describedby
  - エラーカラー: bg-red-50 text-red-700 border-red-200
  - コントラスト比4.5:1以上
Output: エラーハンドリング実装済みTSX
```

**生成例**:

```tsx
// ✅ エラー状態対応の入力フィールド
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-semibold text-gray-900">
    メールアドレス
  </label>
  <input
    id="email"
    type="email"
    aria-invalid={hasError}
    aria-describedby="email-error"
    className={cn(
      "rounded-md border px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-400",
      hasError ? "border-red-200 bg-red-50" : "border-gray-300",
    )}
  />
  {hasError && (
    <p id="email-error" className="text-sm text-red-600" role="alert">
      有効なメールアドレスを入力してください
    </p>
  )}
</div>
```

---

## KERNEL準拠の指示方法

### ✅ Good（具体的・検証可能）

```
Task: プロフィールカードを実装
Constraints:
  - Shadcn/UI Card使用
  - WCAG AA準拠（axe DevToolsでエラー0件）
  - React Testing Library（カバレッジ80%以上）
Output: TSX + テスト
```

### ❌ Bad（曖昧・検証不可）

```
モダンで使いやすいプロフィールカードを作って
```

---

## よくある間違いと修正例

| ❌ 間違い                     | ✅ 修正                 | 理由                 |
| ----------------------------- | ----------------------- | -------------------- |
| `disabled`                    | `aria-disabled="true"`  | DADS必須要件         |
| `focus:ring-blue-600`         | `focus:ring-yellow-400` | フォーカスリング統一 |
| `bg-[var(--primary)]`         | `bg-blue-600`           | カスタム変数禁止     |
| `text-gray-400` on `bg-white` | `text-gray-900`         | コントラスト不足     |
| `key={index}`                 | `key={item.id}`         | 一意なキー必須       |

---

## 検証コマンド

```bash
# Shadcn生成コードのDADS適合性チェック
grep -r "disabled=" src/components/ui/  # 0件であること
grep -r "var(--" src/                    # 0件であること
grep -r "ring-blue" src/                 # 0件であること（ring-yellow-400に統一）
```

---

**最終確認**: このテンプレートで生成したコードは、必ず[ui-dadsi-instruction.md](ui-dadsi-instruction.md)の「必須検証項目」でチェックしてください。
