---
trigger: always_on
description: Next.js 16におけるmiddleware.tsの廃止とproxy.tsパターンの採用ルール
---

# Next.js 16 Proxy Pattern (`src/proxy.ts`)

## 概要

本プロジェクト（Next.js 16採用）では、従来のリクエスト制御に使用されていた `middleware.ts` を廃止し、代替として `src/proxy.ts` パターンを採用します。

## ルール

1.  **`middleware.ts` の禁止**:
    - プロジェクトルートおよび `src` 配下に `middleware.ts` を作成してはなりません。
    - 既存の `middleware.ts` が発見された場合は、`src/proxy.ts` への移行を提案してください。

2.  **`src/proxy.ts` の利用**:
    - リクエストの介入（ヘッダー操作、リダイレクト、書き換え、簡易的な認証チェックなど）は `src/proxy.ts` に実装します。
    - `src/proxy.ts` は `src` ディレクトリの直下に配置します。

## 実装パターン

```typescript
// src/proxy.ts
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // 1. セッション更新や認証チェック（Supabase等）
  // ...

  // 2. セキュリティヘッダーの付与
  const response = NextResponse.next();
  response.headers.set("x-custom-header", "value");

  return response;
}

export const config = {
    matcher: [
        // 静的ファイルを除外する標準的なマッチャー
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
```

## 背景

Next.js 16 以降の仕様変更およびプロジェクトの方針により、より明確なリクエスト境界として Proxy パターンを採用しています。
