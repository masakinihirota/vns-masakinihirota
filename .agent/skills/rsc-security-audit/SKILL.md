---
name: rsc-security-audit
description: React Server Components (RSC) の利用方針とセキュリティ基準に基づき、データの安全性と疎結合性を監査します。
---

# RSC Security Audit Skill

このスキルは、`ai_instruction_react_security.md` に基づき、コード内のデータ通信プロトコルとシリアライズのリスクを監査し、安全な設計を提案します。

## 監査チェックリスト

### 1. Server Actions (use server) の制限

- **禁止事項**: `use server` を用いた Server Actions による大規模なデータフロー（RPC的な関数呼び出し）が行われていないか？
- **推奨**: 永続化や複雑なビジネスロジックは、明示的な **Route Handlers (REST API)** を介して実行されているか？

### 2. プロトコルの一貫性 (JSON)

- **ルール**: 通信は標準的な **JSON** 形式で行われているか？
- **リスク**: Reactの "Flight" プロトコルに依存しすぎていないか（信頼できないデータのデシリアライズをサーバーで行っていないか）？

### 3. 入力のバリデーション

- **ルール**: サーバー側のエンドポイント（Actions or API）で、受信したデータは必ず **Zod** 等のスキーマバリデーションを行っているか？
- **セキュリティ**: サーバーはクライアントからの入力を一切信頼せず、期待する型であることを厳格にチェックしているか？

### 4. バックエンドとの疎結合

- **ルール**: Node.js/Reactレイヤーにバックエンドロジック（DB操作以外の重い処理、外部連携など）が密結合していないか？
- **将来性**: JSON/HTTP APIを採用することで、将来的にバックエンドをGoやPython等に切り替えられる柔軟性が保たれているか？

### 5. 具体的なコード監査例

#### ❌ Bad: サーバーアクションでのマジックなデータフロー

```typescript
// 安全に見えるが、非公開フィールドがクライアントに漏れる可能性がある
'use server'
export async function getUser(id: string) {
  const user = await db.user.findUnique({ where: { id } });
  return user; // { id, name, password_hash, ... } が全てシリアライズされて送られる
}
```

#### ✅ Good: DTO (Data Transfer Object) の使用

```typescript
'use server'
export async function getUser(id: string) {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return null;

  // 必要なデータのみを抽出して返す
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatar_url
  };
}
```

#### ✅ Good: `server-only` パッケージの使用

サーバー専用のユーティリティが誤ってクライアントコードに含まれないように保護します。

```typescript
import 'server-only';

export async function getSecretData() {
  // ...
}
```

## フィードバックのガイドライン

- `use server` の過剰な使用が見られた場合、API Route Handler への書き換えを提案します。
- バリデーションが不足している箇所には、具体的な Zod スキーマの追加を指示します。
- UIの都合でセキュリティが犠牲になっている箇所（機密データのクライアントへの露出など）を特定し、修正案を提示します。
