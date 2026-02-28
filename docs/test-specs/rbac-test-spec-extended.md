# RBAC テスト仕様書（拡張版）

## 概要

このドキュメントは、TODO #1、#2、#3 で実装された RBAC 層の完全なテスト仕様を記載しています。

**TDD原則**: テストを先に書き（RED）、実装してテストを通す（GREEN）、リファクタリング（REFACTOR）

---

## テスト戦略

### レイヤー分け
1. **Unit Test**: 権限判定ロジック（Helper関数）
2. **Component Test**: コロケーション（Guardコンポーネント、Adminページ）
3. **Integration Test**: End-to-End（ルート保護、Server Actions）

### テストケース カテゴリ
- **Deny-by-Default**: 全アクセス拒否→明示的に許可する考え方
- **Context Validation**: 対象リソースが正しいコンテキストに属することを検証
- **Permission Boundary**: 組織/国間でのアクセス隔離を検証
- **Server Action Guard**: Server ActionレベルでのRBAC検証

---

## テスト仕様書

### 1. Deny-by-Default テスト（優先度: 高）

**目的**: 明示的に許可されない限り、すべてのアクセスが拒否されることを保証

**テストファイル**: `src/lib/auth/__tests__/rbac-deny-by-default.test.ts`

#### 1-1. プラットフォーム初期管理者チェック

```
テスト: checkPlatformAdmin()

入力: セッション（様々なロール）
出力: boolean (platform_adminかどうか)

ケース:
  ✓ null セッション → false
  ✓ role: null → false
  ✓ role: "user" → false
  ✓ role: "platform_admin" → true
```

#### 1-2. グループリーダーチェック

```
テスト: checkGroupRole(userId, groupId, "leader")

入力: userId, groupId, roleType
出力: boolean

ケース:
  ✓ 未認証ユーザー → false
  ✓ 組織に属していないユーザー → false
  ✓ group_member だが leader でない → false
  ✓ group_leader → true
```

#### 1-3. ラウトアクセス制限

```
テスト: proxy.ts ルート保護

ケース:
  ✓ /admin (未認証) → 302 Redirect
  ✓ /admin (role: user) → 403 Forbidden
  ✓ /admin (role: platform_admin) → 200 OK
  ✓ /(protected) (未認証) → 302 Redirect
  ✓ /(protected) (role: user) → 200 OK
  ✓ /nation/create (未認証) → 302 Redirect  
  ✓ /nation/create (group_member) → 403 Forbidden
  ✓ /nation/create (group_leader) → 200 OK
```

---

### 2. 組織内権限テスト（優先度: 高）

**目的**: 組織内での権限分離とRLS検証

**テストファイル**: `src/lib/db/__tests__/group-rbac.test.ts`

#### 2-1. クロス組織アクセス拒否

```
テスト: 組織AのリーダーがグループBのリソースにアクセス

シナリオ:
  1. UserA が GroupA のリーダーとして作成
  2. UserA が GroupB のリスト取得を試行
  
期待: RLS により GroupB のデータは見えない
```

#### 2-2. メンバー権限検証

```
テスト: group_memberは group_leader 行為を実行不可

シナリオ:
  1. UserB が GroupA のメンバーとして参加
  2. UserB がメンバー追加を試行（leader権限が必要）
  
期待: Server Actionで "Forbidden" エラー
```

#### 2-3. RLS ポリシー検証

```
テスト: group_members テーブルのRLS

シナリオ:
  1. UserA: GroupA に属するメンバー
  2. UserB: GroupB に属するメンバー
  3. UserA が UserB と同じクエリを実行
  
期待:
  - UserA は GroupA メンバーのみ表示
  - UserB は GroupB メンバーのみ表示
  - 相互間でメンバーリストが見えない
```

---

### 3. 国内権限テスト（優先度: 高）

**目的**: 国レベルでの権限分離とアクセス制御

**テストファイル**: `src/lib/db/__tests__/nation-rbac.test.ts`

#### 3-1. 国作成権限

```
テスト: group_leader のみ国作成可能

シナリオ:
  1. UserA: GroupA リーダー
  2. UserB: GroupA メンバー
  3. 両者が国作成を試行
  
期待:
  - UserA: 成功（Nation作成）
  - UserB: Forbidden エラー
```

#### 3-2. クロス国アクセス拒否

```
テスト: 国AのメンバーがNation Bのポリシー更新を拒否

シナリオ:
  1. UserA: Nation A のメンバー
  2. UserA が Nation B のポリシー更新を試行
  
期待: RLS + Server Action チェックで拒否
```

#### 3-3. 参加組織ベースのアクセス制御

```
テスト: nation_members テーブルのRLS

シナリオ:
  1. GroupA は NationX に参加
  2. GroupB は NationY に参加
  3. UserA (GroupA) が NationX の詳細取得
  4. UserA が NationY の詳細取得を試行
  
期待:
  - NationX データ: 表示
  - NationY データ: RLS で拒否
```

---

### 4. 管理画面ガードテスト（優先度: 中）

**目的**: Admin ページへのアクセスと権限検証

**テストファイル**: 
- `src/app/(protected)/admin/page.test.tsx`
- `src/lib/db/__tests__/admin-queries.test.ts`

#### 4-1. 管理ページアクセス制限

```
テスト: /admin ページの表示制限

ケース:
  ✓ 未認証 → /login へリダイレクト
  ✓ role: user → 403 Forbidden ページ表示
  ✓ role: platform_admin → 管理ダッシュボード表示
```

#### 4-2. Admin Query 権限チェック

```
テスト: admin-queries のデータアクセス

ケース:
  ✓ getAdminDashboardStats() (非admin) → RLS で拒否
  ✓ getAdminDashboardStats() (admin) → 統計データ返却
  ✓ getAllUsers() (admin) → ユーザー一覧返却
  ✓ getAllGroups() (admin) → グループ一覧返却
  ✓ getAllNations() (admin) → 国一覧返却
```

---

### 5. Server Action 権限チェックテスト（優先度: 高）

**目的**: Server Actions で権限チェックが正しく機能しているか検証

**テストファイル**: `src/__tests__/integration/server-actions-rbac.integration.test.ts`

#### 5-1. createGroupAction テスト

```
テスト: グループ作成Server Action

ケース:
  ✓ 未認証呼び出し → Unauthorized エラー
  ✓ 有効な入力 → グループ作成成功、リーダー付与
  ✓ グループ名が3文字未満 → バリデーションエラー
  ✓ 説明が500文字超 → バリデーションエラー
```

#### 5-2. createNationAction テスト

```
テスト: 国作成Server Action

ケース:
  ✓ 未認証呼び出し → Unauthorized エラー
  ✓ group_member が呼び出し → Forbidden エラー
  ✓ group_leader が呼び出し → 国作成成功、リーダー付与
  ✓ groupId が空 → バリデーションエラー
  ✓ nationName が3文字未満 → バリデーションエラー
```

---

## テストカバレッジ目標

```
RBAC関連:
  - rbac-helper.ts: 90%以上
  - auth-guard.ts: 85%以上
  - server actions: 80%以上（統合テスト）
  - proxy.ts: 75%以上（ルート保護）
  - RLS ポリシー: 100%（全テーブル適用確認）

全体目標: 85%以上
```

---

## 実装スケジュール

| 日付 | タスク | ステータス |
|------|--------|-----------|
| 2026-03-02 | Deny-by-Default テスト | ⏳ 開始予定 |
| 2026-03-02 | グループ権限テスト | ⏳ 開始予定 |
| 2026-03-03 | 国権限テスト | ⏳ 開始予定 |
| 2026-03-03 | Admin テスト | ⏳ 開始予定 |
| 2026-03-03 | Server Action テスト | ⏳ 開始予定 |

---

## Tips

### TDD のコツ
1. テストケースを先に定義（RED ステップ）
2. 最小限の実装でテストを通す（GREEN ステップ）
3. 重複を排除、汎化する（REFACTOR ステップ）
4. テスト駆動開発で手戻りを最小化

### RBAC テストのポイント
- **Deny-by-default**: 許可リスト方式で実装する
- **コンテキスト検証**: リソースの所有権確認
- **RLS 検証**: DB レイヤーでの多層防御
- **Server Action**: ユーザー入力の厳密なバリデーション
