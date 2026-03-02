# RBAC レスポンスコード統一ガイドライン

## 概要

本ドキュメントは、RBAC（Role-Based Access Control）における認可失敗時のHTTPステータスコードの使い分けを定義します。
API（Hono middleware）とServer Actions の両方で一貫したレスポンス方針を採用します。

## ステータスコードの使い分け

### 401 Unauthorized（認証失敗）

**使用場面**: セッションが存在しない、またはセッションが無効な場合

**意味**: 「誰だかわからない」状態。認証が必要なリソースに対して、認証情報がないまたは無効。

**例**:
- セッションが存在しない (`session === null`)
- セッションにuser情報がない (`session.user === null`)
- セッショントークンが無効または期限切れ

**実装例（API）**:
```typescript
// Hono middleware
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authSession = c.get('authSession');
  if (!authSession) {
    throw createApiError('UNAUTHORIZED', 'Authentication required');
  }
  await next();
};
```

**実装例（Server Actions）**:
```typescript
// Server Action
export async function createPost(content: string) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session?.user) {
    throw new Error('Authentication required'); // Client側で401扱い
  }
  // ...
}
```

### 403 Forbidden（認可失敗）

**使用場面**: 認証は成功しているが、権限が不足している場合

**意味**: 「誰だかはわかるが、権限がない」状態。リソースへのアクセスが明示的に拒否される。

**例**:
- platform_admin ロールが必要だが、一般ユーザーがアクセス
- グループのleaderロールが必要だが、memberロールしか持たない
- Ghost モード（観測者）でインタラクション操作を試みた
- 他人のプロフィールを編集しようとした

**実装例（API）**:
```typescript
// Hono middleware
export const requirePlatformAdmin: MiddlewareHandler = async (c, next) => {
  const authSession = c.get('authSession');
  const isAdmin = await checkPlatformAdmin(authSession);
  if (!isAdmin) {
    throw createApiError('FORBIDDEN', 'Platform admin role required');
  }
  await next();
};

export const requireInteraction: MiddlewareHandler = async (c, next) => {
  const authSession = c.get('authSession');
  const canInteract = await checkInteractionAllowed(authSession);
  if (!canInteract) {
    throw createApiError(
      'FORBIDDEN',
      'Interaction not allowed in ghost mode. Please switch to a persona profile.'
    );
  }
  await next();
};
```

**実装例（Server Actions）**:
```typescript
// Server Action
export async function updateGroup(groupId: string, data: UpdateGroupInput) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session?.user) {
    throw new Error('Authentication required');
  }

  const hasRole = await checkGroupRole(session, groupId, 'leader');
  if (!hasRole) {
    throw new Error('Group leader role required'); // Client側で403扱い
  }
  // ...
}
```

### 404 Not Found（リソース不在 or セキュリティ）

**使用場面（2つのケース）**:

#### ケース1: リソースが実際に存在しない
- データベースにレコードが存在しない
- 削除済みリソースへのアクセス

#### ケース2: セキュリティによるID隠蔽（Security by Obscurity）
- リソースは存在するが、アクセス権限がないことを隠したい場合
- 403を返すと「リソースが存在する」ことが推測されてしまう
- 攻撃者に情報（リソースの存在）を与えないための防御策

**例（セキュリティ重視）**:
- 他人の非公開グループへのアクセス（存在を知られたくない）
- 他人のプライベートメッセージへのアクセス
- 削除されたユーザーのプロフィール（権限以前に存在しない）

**実装例（API - セキュリティ重視）**:
```typescript
// 他人の非公開グループへのアクセス
app.get('/groups/:groupId', requireAuth, async (c) => {
  const groupId = c.req.param('groupId');
  const authSession = c.get('authSession');

  const group = await db.select().from(groups).where(eq(groups.id, groupId)).limit(1);

  if (!group[0]) {
    // 実際に存在しない
    throw createApiError('NOT_FOUND', 'Group not found');
  }

  const hasAccess = await checkGroupRole(authSession, groupId, 'member');
  if (!hasAccess && !group[0].isPublic) {
    // 存在するが非公開で権限がない → 403ではなく404を返す（存在を隠蔽）
    throw createApiError('NOT_FOUND', 'Group not found');
  }

  return c.json({ group: group[0] });
});
```

**実装例（API - 権限明示）**:
```typescript
// 管理者専用エンドポイント（存在を隠す必要なし）
app.delete('/admin/users/:userId', requireAuth, async (c) => {
  const userId = c.req.param('userId');
  const authSession = c.get('authSession');

  const isAdmin = await checkPlatformAdmin(authSession);
  if (!isAdmin) {
    // 管理者以外は明示的に拒否（403）
    throw createApiError('FORBIDDEN', 'Platform admin role required');
  }

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]) {
    // ユーザーが存在しない（404）
    throw createApiError('NOT_FOUND', 'User not found');
  }

  // 削除処理
  await db.delete(users).where(eq(users.id, userId));
  return c.json({ success: true });
});
```

## ステータスコード決定フローチャート

```
セッションあり？
├─ NO → 401 Unauthorized
└─ YES
    └─ リソース存在？
        ├─ NO → 404 Not Found
        └─ YES
            └─ 権限あり？
                ├─ NO
                │   └─ セキュリティで隠蔽？
                │       ├─ YES → 404 Not Found (存在を隠す)
                │       └─ NO → 403 Forbidden (権限不足を明示)
                └─ YES → 200 OK / 201 Created / etc.
```

## 判断基準（セキュリティ vs 透明性）

### 404を返すべき（Security by Obscurity）
- **非公開リソース**: 他人の非公開グループ、プライベートメッセージ
- **機密情報**: 診断結果、マッチング履歴、個人設定
- **IDORリスク高**: リソースIDの列挙攻撃で情報が漏れる可能性がある

### 403を返すべき（透明性重視）
- **公開リソース**: 公開グループ、公開プロフィール
- **管理者専用**: 管理画面、システム設定
- **ロール不足**: グループ内での権限不足（メンバーはリーダー操作不可）
- **Ghost モード制限**: インタラクション不可（ユーザーに明示的に伝える）

## API vs Server Actions の統一方針

### API（Hono）
- `createApiError()` でHTTPステータスコードを明示的に指定
- Middlewareで統一的にエラーハンドリング
- `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404) を使い分け

### Server Actions
- `Error` または `RBACError` を throw
- クライアント側で catch してHTTPステータスコードに変換
- エラーメッセージで意図を明示（例: 'Authentication required' → 401）

**Server Actions エラー変換例**:
```typescript
// Client側（React Component）
async function handleAction() {
  try {
    await serverAction();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Authentication required')) {
        // 401: ログイン画面へリダイレクト
        router.push('/login');
      } else if (error.message.includes('role required')) {
        // 403: 権限不足エラー表示
        toast.error('You do not have permission');
      } else if (error.message.includes('not found')) {
        // 404: リソースが見つからない
        toast.error('Resource not found');
      }
    }
  }
}
```

## Ghost モード制限の統一適用

### 適用対象操作（インタラクション）
- **投稿作成**: posts, comments
- **いいね**: likes
- **フォロー**: follows
- **アライアンス**: alliances
- **メッセージ送信**: messages
- **グループ作成・編集**: groups
- **診断結果投稿**:診断・マッチング機能

### 適用除外操作（閲覧のみ）
- **閲覧**: 公開投稿、公開プロフィール、公開グループ
- **検索**: ユーザー検索、グループ検索
- **診断受診**: 診断テストの回答（結果の保存は不可）

### 実装パターン

**API（Hono）**:
```typescript
// インタラクションが必要な操作
app.post('/posts', requireAuth, requireInteraction, async (c) => {
  // Ghost モードでは403エラー
  // Persona モードのみ投稿可能
});

// 閲覧のみ（Ghost モードでもOK）
app.get('/posts', requireAuth, async (c) => {
  // Ghost モードでも閲覧可能
});
```

**Server Actions**:
```typescript
export async function createPost(content: string) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session?.user) {
    throw new Error('Authentication required');
  }

  const canInteract = await checkInteractionAllowed(session);
  if (!canInteract) {
    throw new Error('Interaction not allowed in ghost mode. Please switch to a persona profile.');
  }

  // 投稿作成処理
}
```

## テストケース

### 401 Unauthorized
- [ ] セッションなしでAPI呼び出し → 401
- [ ] セッション期限切れでAPI呼び出し → 401
- [ ] Server Actionでセッションなし → エラー（Client側で401扱い）

### 403 Forbidden
- [ ] 一般ユーザーが管理者専用エンドポイントにアクセス → 403
- [ ] memberロールでleader操作を試行 → 403
- [ ] Ghost モードで投稿作成 → 403
- [ ] 他人のプロフィール編集 → 403

### 404 Not Found
- [ ] 存在しないリソースIDでGET → 404
- [ ] 他人の非公開グループへのアクセス（権限なし） → 404（存在隠蔽）
- [ ] 削除済みユーザーのプロフィール → 404

## チェックリスト

- [x] API middlewareに `requireInteraction` を追加
- [ ] インタラクション操作（投稿、いいね、フォローなど）に `requireInteraction` を適用
- [ ] Server Actionsに `checkInteractionAllowed()` チェックを追加
- [ ] 403 vs 404 の使い分けをコードレビューで確認
- [ ] エラーメッセージの統一（API vs Server Actions）
- [ ] クライアント側のエラーハンドリング統一（401 → login, 403 → toast, 404 → notfound page）

## 参考資料

- [RFC 7231 - HTTP/1.1 Semantics](https://datatracker.ietf.org/doc/html/rfc7231#section-6.5)
- [OWASP - Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
- [Security by Obscurity](https://en.wikipedia.org/wiki/Security_through_obscurity)

---

**作成日**: 2026-03-02
**最終更新**: 2026-03-02
**バージョン**: 1.0.0
