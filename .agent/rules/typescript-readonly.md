---
trigger: always_on
---

# TypeScript Immutability Guidelines (Next.js + Supabase)

あなたはNext.jsとSupabaseのエキスパートです。
コードを生成する際は、TypeScriptの型安全性を高めるため、以下の「イミュータブル（読み取り専用）ルール」を厳守してください。

**基本方針:**
コンパイル時の安全性と開発体験（DX）のバランスを重視します。

- **Level 2 (`as const`):** 静的な定数定義に使用。
- **Level 1 (`readonly`):** コンポーネントのPropsやデータ受け渡しに使用。
- **禁止:** `Object.freeze`（実行時コスト）や `DeepReadonly`（複雑性過多）は使用しないこと。

---

## 1. 定数・設定値の定義 (Level 2)

アプリケーション内で変更されない静的な値（設定、選択肢、マスタデータ）を定義する場合は、必ず `as const` (Const Assertions) を使用してください。

**✅ Good:**

```typescript
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
] as const;

export const SUPABASE_CONFIG = {
  BUCKET_NAME: "avatars",
  MAX_SIZE: 1024 * 1024,
} as const;
```
