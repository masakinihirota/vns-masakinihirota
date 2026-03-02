---
slug: rbac-equivalence-test-implementation-roadmap
title: RBAC同等性テスト実装ロードマップ
description: EQ-01, EQ-02, EQ-03 テストコードのアクティベーション手順
created: 2026-03-02
updated: 2026-03-02
---

# RBAC 同等性テスト（EQ）実装ロードマップ

## 概要

テンプレート仕様（`docs/test-specs/rbac-failure-test-template.md`）で定義した **EQ-01, EQ-02, EQ-03** をテストコード化し、CI パイプラインに統合しました。

このドキュメントは、**API/Server Action の実装進捗に合わせてテストをアクティベートするためのガイド**です。

---

## 現在の状態

### ✅ 完了した作業

| 項目 | 状態 | 詳細 |
|---|---|---|
| テスト仕様のコード化 | ✅ | `src/__tests__/api/rbac-equivalence.test.ts` |
| テスト骨格実装（PLACEHOLDER） | ✅ | 12 個のテストケース構造定義 |
| テスト実行スクリプト | ✅ | `pnpm test:eq` コマンド |
| CI 統合 | ✅ | `.github/workflows/ci.yml` に「Run RBAC Equivalence Tests」ステップを追加 |

### 🔄 現在の位置

- テストコードは完全に構造化されており、**実装を待つ待機状態**
- すべてのテストが PASS している（PLACEHOLDER の expect(true).toBe(true) 状態）
- CI パイプラインは毎回テストを実行するが、実装がなければ PASS のまま

---

## Phase 1: API Endpoints 実装 & テストアクティベート

### 対象エンドポイント

- [ ] **POST** `/api/matchings/conditional` - 条件付きマッチング実行
- [ ] **POST** `/api/relationships/follow` - フォロー関係作成
- [ ] **POST** `/api/matchings/:matchingId/invite` - グループへの招待

### テストアクティベート手順

各エンドポイント実装後、対応するテストコードをアクティベートします：

#### EQ-01: Ghost + Conditional Matching → 422

**実装内容:**
- Ghost プロフィール検出
- 条件が未設定の場合、**422 + `PROFILE_CONDITIONS_REQUIRED`** で拒否

**テストアクティベート:**

```typescript
// src/__tests__/api/rbac-equivalence.test.ts の [API] POST /api/matchings/conditional セクション

it('should return 422 when ghost tries conditional matching without profile conditions', async () => {
  const payload = {
    toProfileId: targetProfile.id,
    conditions: {
      purposes: ['仕事'],
    },
  };

  const response = await fetch('/api/matchings/conditional', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ghostSession.session.id}`,
    },
    body: JSON.stringify(payload),
  });

  expect(response.status).toBe(422);
  const json = await response.json();
  expect(json.error?.code).toBe('PROFILE_CONDITIONS_REQUIRED');
  expect(json.error?.message).toContain('Ghost');
});
```

**テスト実行:**
```bash
pnpm test:eq
```

---

#### EQ-02: Ghost + Follow → 403

**実装内容:**
- Ghost プロフィール検出
- Follow 操作を拒否（Watch は許可）
- **403 + `FORBIDDEN_GHOST_FOLLOW`** で拒否

**テストアクティベート:**

```typescript
// src/__tests__/api/rbac-equivalence.test.ts の [API] POST /api/relationships/follow セクション

it('should return 403 when ghost tries to follow', async () => {
  const payload = {
    toProfileId: targetProfile.id,
  };

  const response = await fetch('/api/relationships/follow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ghostSession.session.id}`,
    },
    body: JSON.stringify(payload),
  });

  expect(response.status).toBe(403);
  const json = await response.json();
  expect(json.error?.code).toBe('FORBIDDEN_GHOST_FOLLOW');
  expect(json.error?.message).toContain('Ghost');
});
```

**テスト実行:**
```bash
pnpm test:eq
```

---

#### EQ-03: Out-of-Actor Matching ID + Invite → 404

**実装内容:**
- リーダーが指定した matching_id をデータベース検索
- 当事者（from_profile_id または to_profile_id）であるかをチェック
- 当事者でない場合、**404 + `NOT_FOUND`** で拒否（秘匿ポリシー）

**テストアクティベート:**

```typescript
// src/__tests__/api/rbac-equivalence.test.ts の [API] POST /api/matchings/:matchingId/invite セクション

it('should return 404 when leader tries to invite using non-actor matching ID', async () => {
  const response = await fetch('/api/matchings/matching-invalid/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${leaderSession.session.id}`,
    },
    body: JSON.stringify({ groupId: leaderGroup.id }),
  });

  expect(response.status).toBe(404);
  const json = await response.json();
  expect(json.error?.code).toBe('NOT_FOUND');
});
```

**テスト実行:**
```bash
pnpm test:eq
```

---

## Phase 2: Server Actions 実装 & テストアクティベート

### 対象 Server Actions

- [ ] **createConditionalMatching()** - 条件付きマッチング作成
- [ ] **createFollowRelationship()** - フォロー関係作成
- [ ] **inviteToGroup()** - グループへの招待

### テスト同等性チェック

各 Server Action 実装後、対応するテストをアクティベートします：

#### EQ-01 Server Action アクティベート

```typescript
// src/__tests__/api/rbac-equivalence.test.ts の [Server Action] createConditionalMatching セクション

it('should return 422 when ghost calls server action without conditions', async () => {
  const result = await createConditionalMatching(
    ghostProfile.id,
    targetProfile.id,
    { purposes: ['仕事'] }
  );

  expect(result.status).toBe(422);
  expect(result.error?.code).toBe('PROFILE_CONDITIONS_REQUIRED');
});
```

#### EQ-02 Server Action アクティベート

```typescript
// src/__tests__/api/rbac-equivalence.test.ts の [Server Action] createFollowRelationship セクション

it('should return 403 when ghost calls server action', async () => {
  const result = await createFollowRelationship(
    ghostProfile.id,
    targetProfile.id
  );

  expect(result.status).toBe(403);
  expect(result.error?.code).toBe('FORBIDDEN_GHOST_FOLLOW');
});
```

#### EQ-03 Server Action アクティベート

```typescript
// src/__tests__/api/rbac-equivalence.test.ts の [Server Action] inviteToGroup セクション

it('should return 404 when server action uses non-actor matching ID', async () => {
  const result = await inviteToGroup(
    leaderProfile.id,
    'matching-invalid', // 無関係なmatching_id
    leaderGroup.id
  );

  expect(result.status).toBe(404);
  expect(result.error?.code).toBe('NOT_FOUND');
});
```

---

## Phase 3: 同等性テスト確認

各 API と Server Action が実装されたら、**同等性テスト** をアクティベートします：

```typescript
// [Equivalence] API ↔ Server Action セクション例

describe('[Equivalence] API ↔ Server Action', () => {
  it('both API and Server Action should return identical 422 error', async () => {
    // API テスト
    const apiResponse = await fetch('/api/matchings/conditional', { ... });

    // Server Action テスト
    const actionResult = await createConditionalMatching(...);

    // 同等性確認
    expect(apiResponse.status).toBe(actionResult.status);
    expect(apiResponse.error?.code).toBe(actionResult.error?.code);
  });
});
```

---

## Phase 4: CI 統合検証

### 現在の状態

✅ CI パイプライン（`.github/workflows/ci.yml`）に以下のステップが追加されています：

```yaml
- name: Run RBAC Equivalence Tests
  run: pnpm test:eq
```

### 動作確認

#### ローカル実行

```bash
# EQ テストのみ実行
pnpm test:eq

# EQ テストをウォッチモードで実行
pnpm test:eq:watch
```

#### CI 実行確認

```bash
# PR をプッシュすると自動的に GitHub Actions が実行
# .github/workflows/ci.yml の "[Run RBAC Equivalence Tests]" ステップで実行
```

---

## テストアクティベートチェックリスト

### API Endpoints

- [ ] POST `/api/matchings/conditional` - 実装完了
  - [ ] EQ-01 API テスト有効化
  - [ ] EQ-01 Server Action テスト有効化
  - [ ] EQ-01 同等性テスト有効化

- [ ] POST `/api/relationships/follow` - 実装完了
  - [ ] EQ-02 API テスト有効化
  - [ ] EQ-02 Server Action テスト有効化
  - [ ] EQ-02 同等性テスト有効化

- [ ] POST `/api/matchings/:matchingId/invite` - 実装完了
  - [ ] EQ-03 API テスト有効化
  - [ ] EQ-03 Server Action テスト有効化
  - [ ] EQ-03 同等性テスト有効化

### 統合テスト

- [ ] すべてのテストが CI パイプラインで実行されることを確認
- [ ] 仕様変更時（例：HTTP コードの不意な変更）を検出することを確認

---

## トラブルシューティング

### テストが PASS しない場合

1. **API 実装の仕様確認**
   - エラーコード（例：`PROFILE_CONDITIONS_REQUIRED`）が仕様で定義されているか確認
   - HTTP ステータスコード（401/403/404/422）が仕様で定義されているか確認

2. **Server Action との同等性確認**
   - API と Server Action の両経路が同じエラーコード・ステータスを返すか確認
   - エラーメッセージの一貫性を確認

3. **テストコード修正**
   ```bash
   # テストファイルの該当セクションで PLACEHOLDER を置き換える
   # 実装に合わせて期待値を調整
   ```

### CI で失敗する場合

```bash
# ローカルで同じコマンドを実行して原因を特定
pnpm test:eq

# 詳細ログを確認
pnpm test:eq -- --reporter=verbose
```

---

## 参考資料

- **テンプレート仕様**: `docs/test-specs/rbac-failure-test-template.md`
- **テストコード**: `src/__tests__/api/rbac-equivalence.test.ts`
- **テスト実行スクリプト**: `package.json` - `test:eq` コマンド
- **CI パイプライン**: `.github/workflows/ci.yml`

---

## まとめ

このロードマップに従うことで：

1. ✅ **テスト仕様**が完全に定義されており、実装前に明確
2. ✅ **テストコード**が骨組みとして用意されており、実装に合わせてアクティベート可能
3. ✅ **CI 統合**がすでに完了しており、すべての PR で RBAC 退行を検出
4. ✅ **段階的実装**が容易で、1 エンドポイント実装 = 1 テストアクティベート

**最初の 3 本だけでも（EQ-01, EQ-02, EQ-03）CI にアクティベートすれば、今後の仕様変更で `422/403/404` の退行を早期検出できます。**
