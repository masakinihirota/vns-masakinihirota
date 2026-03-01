# Hono 全統一実装計画 - VNS masakinihirota

**作成日:** 2026-03-01
**ステータス:** ⚠️ **レビュー完了 - 修正版を参照してください**
**対象:** 全 API を Hono に統一

---

## ⚠️ 重要：レビュー結果

**このファイルは GitHub Copilot によるレビューで複数の構造的問題が指摘されました。**

### 📁 関連ドキュメント（必読）
- **詳細レビュー**: `2026-03-01_HONO_REVIEW_CRITIQUE.md`
- **修正版実装計画**: `2026-03-01_HONO_IMPLEMENTATION_REVISED.md` ⭐ **推奨**
- **要約**: `2026-03-01_HONO_REVIEW_SUMMARY.md`
- **Better Auth 決定**: `.agent/decisions/better-auth-pattern.md` ✅
- **Runtime 決定**: `.agent/decisions/node-runtime.md` ✅
- **Runtime 選択肢分析**: `2026-03-01_RUNTIME_OPTIONS.md`
- **RPC Client 決定**: `.agent/decisions/rpc-client-pattern.md` ✅
- **RPC Client 選択肢分析**: `2026-03-01_RPC_CLIENT_OPTIONS.md`

### 🔴 致命的な問題（3つ）→ ✅ **全て解決済み**
1. ✅ **Runtime が未決定** → **Node Runtime 採用決定**（`.agent/decisions/node-runtime.md`）
2. ✅ **Better Auth 共存方法が「決定待ち」** → **Option A 採用決定**（`.agent/decisions/better-auth-pattern.md`）
3. ✅ **RPC Client ジェネレーション方法が仮説段階** → **Option A (Hono RPC) 採用決定**（`.agent/decisions/rpc-client-pattern.md`）⏳ PoC 実施待ち

### ✅ 推奨アクション
**修正版計画（`2026-03-01_HONO_IMPLEMENTATION_REVISED.md`）の使用を強く推奨します。**

修正版では：
- ✅ フェーズ 0（事前検証、4h）を追加
- ✅ Runtime を Node に決定
- ✅ Better Auth パターン A を推奨
- ✅ RPC Client PoC を含む
- ✅ テスト戦略を明確化
- ✅ リスクを 70% 軽減

---

## ⚠️ 以下は元の計画（参考用）

---

## 📊 現状インベントリー

| カテゴリ | 件数 | 詳細 |
|----------|------|------|
| **Server Actions** | 2個 | create-group, create-nation |
| **Better Auth API** | 1個 | /api/auth/[...all]（フレームワーク統合） |
| **DB Query 関数** | 30+ | admin-queries（8個）、user-profiles（7個）、group-queries、nation-queries など |
| **Auth Guard/Helper** | 6個 | auth-guard.tsx、auth-rate-limit.ts、rbac-helper.ts など |
| **UI コンポーネント** | 多数 | Admin パネル、Group パネルなど |

---

## 🎯 Hono 統一後の構成

```
src/app/api/[[...route]]/route.ts （統合ハンドラ）
  ├─ /auth/* （Better Auth + Hono統合 or 並行運用）
  ├─ /users/* （Hono）
  ├─ /groups/* （Hono）
  ├─ /nations/* （Hono）
  ├─ /admin/* （Hono）
  └─ /notifications/* （Hono）

src/lib/api/ （新規フォルダ）
  ├─ routes/ （各エンドポイント）
  │  ├─ groups.ts
  │  ├─ nations.ts
  │  ├─ users.ts
  │  ├─ admin.ts
  │  └─ notifications.ts
  ├─ middleware/ （認証・RBAC等）
  │  ├─ auth.ts
  │  ├─ rbac.ts
  │  └─ error-handler.ts
  └─ client.ts （Hono RPC クライアント）

src/lib/db/ （既存）
  └─ *-queries.ts （既存関数はそのまま使用）
```

---

## 📋 フェーズ別 TODO リスト

## フェーズ A: セットアップ & 基盤

**目的:** Hono 環境構築と基本ハンドラ実装

- [ ] A-1: `pnpm add hono @hono/node-utils` でインストール
- [ ] A-2: `src/app/api/[[...route]]/route.ts` 作成
  - Hono アプリ初期化
  - **runtime = 'node' 設定** ✅ 決定済み（Node Runtime 採用）
  - handler 処理（GET, POST, PATCH, DELETE, PUT）
  - basic error handling
- [x] A-3: Better Auth との共存方法決定 ✅ **完了**
  - [x] **オプションA（採用）**: 既存 /api/auth/[...all] 維持、Hono は /api 配下で独立
    - 詳細: `.agent/decisions/better-auth-pattern.md`
  - [ ] ~~オプションB~~: Better Auth も Hono Middleware に統合（却下）
- [ ] A-4: Hono Middleware フレームワーク実装
  - `src/lib/api/middleware/` フォルダ作成
  - auth.ts （セッション検証）
  - rbac.ts （ロール検証）
  - error-handler.ts （エラーハンドリング）
- [ ] A-5: Hono RPC クライアント生成スクリプト作成
  - `src/lib/api/client.ts` 作成
  - hono/client でジェネレーション設定
- [ ] A-6: ビルド & 動作確認
  - `pnpm build` 成功確認
  - `pnpm dev` で localhost:3000/api へアクセス確認
  - エラーハンドリング動作確認

**期待結果:**
- Hono 基本構造が完成
- `/api/*` へのリクエストが処理可能
- RPC クライアント生成パイプライン確立

---

## フェーズ B: Server Actions → Hono 化

**目的:** 既存 Server Actions を Hono API に移行

- [ ] B-1: create-group の Hono 化
  - `src/lib/api/routes/groups.ts` 作成
  - `POST /api/groups` エンドポイント実装
  - Request body: `{ name: string; description?: string }`
  - Zod スキーマで入力検証（既存 createGroupSchema 再利用）
  - Response: `{ success: boolean; data?: Group; error?: string }`
  - 既存の `createGroup()` DB 関数を呼び出し
  - セッション検証 middleware 適用

- [ ] B-2: create-nation の Hono 化
  - `POST /api/nations` エンドポイント実装
  - Zod スキーマで入力検証（既存 createNationSchema 再利用）
  - group_leader ロール検証
  - 既存の `createNation()` DB 関数を呼び出し

- [ ] B-3: UI コンポーネント更新（Hono RPC 使用）
  - create-group.tsx （UI のまま保持、API 呼び出しを Hono RPC に変更）
  - create-nation.tsx （同様）
  - useToast hook との統合確認

- [ ] B-4: 不要な Server Action ファイル削除
  - `src/app/actions/create-group.ts` 削除
  - `src/app/actions/create-nation.ts` 削除

- [ ] B-5: ビルド & ユニットテスト
  - `pnpm build` 成功
  - 既存テスト（create-group.test.ts など）が Hono API に対して動作することを確認

**期待結果:**
- Server Actions が完全に API エンドポイントに移行
- UI → RPC client → Hono エンドポイント のフロー確立

---

## フェーズ C: Admin API Hono 化

**目的:** 管理画面向けエンドポイント実装（CRUD）

### ユーザー管理

- [ ] C-1: `GET /api/admin/users` （ユーザー検索）
  - Query params: `searchTerm`, `status`, `role`, `page`, `limit`
  - 既存の `searchUsers()` DB 関数を呼び出し
  - Response: `{ users: UserProfile[]; total: number; page: number }`
  - RBAC: platform_admin のみ

- [ ] C-2: `GET /api/admin/users/:id` （ユーザー詳細）
  - Path param: `id`
  - 既존의 `getUserDetail()` DB 関数を呼び出し
  - Response: `{ id, name, email, role, isActive, ... }`
  - RBAC: platform_admin のみ

- [ ] C-3: `DELETE /api/admin/users/:id` （ユーザー削除）
  - Path param: `id`
  - 削除確認（復旧不可）
  - DB から削除（CASCADE）
  - Response: `{ success: boolean }`
  - RBAC: platform_admin のみ

- [ ] C-4: `PATCH /api/admin/users/:id` （ロール・ステータス更新）
  - Path param: `id`
  - Request body: `{ role?: string; isActive?: boolean }`
  - 既存の `updateUserRole()` / `updateUserStatus()` DB 関数を呼び出し
  - Response: `{ success: boolean; data?: UserProfile }`
  - RBAC: platform_admin のみ

### グループ管理

- [ ] C-5: `GET /api/admin/groups` （グループ一覧）
  - Query params: `searchTerm?`, `page?`, `limit?`
  - 既존의 DB 함수로 그룹 목록 조회
  - Response: `{ groups: Group[]; total: number }`

- [ ] C-6: `DELETE /api/admin/groups/:id` （グループ削除）
  - Path param: `id`
  - 멤버 존재 여부 확인 (멤버가 없을 경우만 삭제)
  - Response: `{ success: boolean }`
  - RBAC: platform_admin のみ

### ネーション管理

- [ ] C-7: `GET /api/admin/nations` （ネーション一覧）
  - Query params: `searchTerm?`, `page?`, `limit?`
  - Response: `{ nations: Nation[]; total: number }`

- [ ] C-8: `DELETE /api/admin/nations/:id` （ネーション削除）
  - Path param: `id`
  - Response: `{ success: boolean }`
  - RBAC: platform_admin のみ

### テスト & 統合

- [ ] C-9: RPC クライアント自動生成・動作確認
  - Hono ルータから型推論
  - クライアント側で型安全な呼び出し確認

- [ ] C-10: Admin UI コンポーネント更新
  - AdminGroupPanel → RPC クライアント使用
  - UserPanel （新規） → RPC クライアント使用
  - NationPanel （新規） → RPC クライアント使用

- [ ] C-11: 統合テスト（e2e）
  - ユーザー検索 → 詳細表示 → 削除 の流れ
  - ロール更新時の権限検証
  - エラーハンドリング（404, 403, 500）

**期待結果:**
- 管理画面用エンドポイントが完全に Hono で実装
- 型安全な RPC クライアント自動生成

---

## フェーズ D: User/Group/Nation API

**目的:** ユーザーが使用するメインのリソース API

### ユーザー情報 API

- [ ] D-1: `GET /api/users` （自分の情報取得）
  - 認証 middleware で userId を取得
  - Response: `{ id, name, email, role, profile, ... }`
  - RBAC: 認証済みユーザー

- [ ] D-2: `GET /api/users/:id` （他ユーザー詳細）
  - Path param: `id`
  - 公開情報のみ返却（メール非表示など）
  - RBAC: 公開プロフィール：全員アクセス可

- [ ] D-3: `PATCH /api/users/:id` （プロフィール更新）
  - Path param: `id`
  - Request body: `{ name?, bio?, avatar?, ... }`
  - 自分のプロフィールのみ更新可能
  - RBAC: `userId == currentUserId`

### グループ API

- [ ] D-4: `GET /api/groups` （自分が属するグループ一覧）
  - Query params: `page?`, `limit?`
  - 認証 middleware で userId を取得
  - groupMembers テーブルから該当グループを取得
  - Response: `{ groups: GroupDetail[]; total: number }`

- [ ] D-5: `GET /api/groups/:id` （グループ詳細）
  - Path param: `id`
  - グループ情報 + メンバー一覧 + ロール
  - Response: `{ id, name, description, members: Member[], myRole, ... }`

- [ ] D-6: `PATCH /api/groups/:id` （グループ編集）
  - Path param: `id`
  - Request body: `{ name?, description?, policy?, ... }`
  - group_leader / group_sub_leader のみ実行可能
  - RBAC: `checkGroupRole(userId, groupId, ['group_leader', 'group_sub_leader'])`

### ネーション API

- [ ] D-7: `GET /api/nations` （自分が属する国一覧）
  - Query params: `page?`, `limit?`
  - nationMembers ← groupId でこの国に属しているかチェック
  - Response: `{ nations: NationDetail[]; total: number }`

- [ ] D-8: `GET /api/nations/:id` （国詳細）
  - Path param: `id`
  - 国情報 + 参加グループ一覧 + ロール
  - Response: `{ id, name, description, groups: Group[], myRole, ... }`

- [ ] D-9: `PATCH /api/nations/:id` （国編集）
  - Path param: `id`
  - Request body: `{ name?, description?, policy?, ... }`
  - nation_leader / nation_sub_leader のみ実行可能
  - RBAC: `checkNationRole(userId, nationId, ['nation_leader', 'nation_sub_leader'])`

**期待結果:**
- 主要なリソース API が完全に実装
- RPC クライアントで型安全にアクセス可能

---

## フェーズ E: 通知 API

**目的:** 通知システムエンドポイント実装

- [ ] E-1: `GET /api/notifications` （未読通知一覧）
  - Query params: `limit?`, `offset?`
  - 認証 middleware で userId を取得
  - 既存の `getUnreadNotifications()` を呼び出し
  - Response: `{ notifications: Notification[]; unreadCount: number }`

- [ ] E-2: `GET /api/notifications/:id` （通知詳細）
  - Path param: `id`
  - 所有者本人のみアクセス可能
  - Response: `{ id, userId, type, title, message, actionUrl, isRead, createdAt }`

- [ ] E-3: `PATCH /api/notifications/:id` （既読マーク）
  - Path param: `id`
  - Request body: `{ isRead: boolean }`
  - 既存の `markNotificationAsRead()` を呼び出し
  - Response: `{ success: boolean }`

- [ ] E-4: `DELETE /api/notifications/:id` （削除）
  - Path param: `id`
  - Response: `{ success: boolean }`

- [ ] E-5: 実装・テスト

**期待結果:**
- 通知機能が API 化
- Socket.io または Server-Sent Events 準備（次フェーズ）

---

## フェーズ F: Better Auth との統合

**目的:** Hono フレームワーク内で Better Auth を正常に動作させる

- [ ] F-1: Better Auth 共存方法の確定
  - [ ] パターンA: 既存 `/api/auth/[...all]` をそのまま維持、Hono は `/api/*` で独立
  - [ ] パターンB: Better Auth を Hono Middleware として統合

- [ ] F-2: Better Auth ライフサイクル
  - src/lib/auth.ts で Better Auth インスタンス作成（既存）
  - Hono Middleware から既存の `getSession()` を呼び出し

- [ ] F-3: セッション Cookie 管理
  - Hono レスポンスで Cookie を正しく設定
  - CSRF トークン自動生成（Next.js 標準 or 手動実装）

- [ ] F-4: アプリケーション起動時の初期化
  - Rate limiter start
  - RPC client 生成確認

- [ ] F-5: ビルド & 動作確認
  - ログイン → グループ作成 → グループ詳細取得 の流れで疎通確認

**期待結果:**
- Better Auth と Hono エンドポイントが共存
- セッション管理の一貫性確保

---

## フェーズ G: Middleware & Guard Hono 化

**目的:** 横串機能を Hono Middleware として実装

### Auth Middleware

- [ ] G-1: セッション検証 Middleware
  - Cookie から session token を取得
  - Better Auth のセッション検証（既존）
  - userId を context に注入
  - 未認証時: 401 Unauthorized

### RBAC Middleware

- [ ] G-2: ロール検証 Middleware
  - context.userId から user.role を取得
  - 필요한 role에 해당하지 않으면 403 Forbidden
  - 구현: `checkGroupRole()`, `checkNationRole()` 기존 함수 재사용

### Rate Limiting

- [ ] G-3: Rate Limit Middleware
  - 기존 `rate-limiter.ts` 활용
  - POST/PATCH/DELETE에 적용 (write API)
  - Authorization header 또는 IP 기반으로 track
  - 초과시 429 Too Many Requests

### Error Handling

- [ ] G-4: Global Error Handler Middleware
  - 모든 에러를 catch
  - 에러 타입별로 HTTP 상태 코드 매핑
  - 클라이언트에는 안전한 메시지만 반환
  - 내부 디테일은 서버 로그에만 기록

### Logging

- [ ] G-5: Logging Middleware
  - 요청: method, path, authentication, headers
  - 응답: status code, response time
  - traceId 추가 (관련된 로그를 연결하기 위해)
  - 센시티브 정보는 숨김 (passwords, tokens)

**기대 결과:**
- 모든 횡단 문제(Cross-Cutting Concerns)가 Middleware로 표준화
- 에러 처리 일관성 보장
- 보안 정책 중앙화

---

## フェーズ H: Client 統合 & テスト

**目的:** Frontend で Hono RPC クライアントを使用

- [ ] H-1: `src/lib/api/client.ts` 작성
  - Hono RPC client 인스턴스 생성
  - API_BASE_URL 설정
  - 인터셉터 (authentication, error handling)

- [ ] H-2: User Panel에서 RPC 사용
  - `api.admin.users.$get()` for GET /api/admin/users
  - `api.admin.users[':id'].$delete()` for DELETE
  - 에러 시 toast 표시

- [ ] H-3: Group Panel에서 RPC 사용
  - `api.admin.groups.$get()`
  - `api.admin.groups[':id'].$delete()`

- [ ] H-4: useToast와 API 통합
  - API 성공 시: `showToast.success("저장되었습니다")`
  - API 실패 시: `showToast.error(error.message)`

- [ ] H-5: 통합 테스트
  - User 생성 → 조회 → 수정 → 삭제
  - Group 생성 → 조회 → 삭제
  - Nation 생성 → 조회 → 삭제
  - 각 단계별 에러 케이스 테스트

- [ ] H-6: 빌드 검증
  - `pnpm build` 성공
  - 타입 에러 없음

**기대 결과:**
- Frontend가 Hono API를 type-safe하게 사용
- 일관된 에러 처리
- 우수한 개발자 경험

---

## فェーズ I: クリーンアップ & 最適化

**목적:** 코드 정리 및 성능 최적화

- [ ] I-1: 불필요한 Server Actions 파일 삭제
  - `src/app/actions/create-group.ts`
  - `src/app/actions/create-nation.ts`
  - `src/app/actions/` 폴더가 비어있으면 삭제

- [ ] I-2: auth-rate-limit.ts 정리
  - Server Action 버전은 삭제
  - Middleware 버전만 `src/lib/api/middleware/rate-limit.ts`에 유지

- [ ] I-3: 타입 정의 최적화
  - 중복되는 Request/Response 타입 `src/lib/api/types.ts`로 통합
  - Zod 스키마는 기존 `src/lib/validation/schemas.ts`에서 재사용

- [ ] I-4: API 문서 생성
  - OpenAPI/Swagger 스키마 (선택적)
  - README.md에 API 엔드포인트 목록

- [ ] I-5: 성능 모니터링
  - 번들 사이즈 확인 (Hono 추가로 인한 증가 최소화)
  - 시작 시간 측정
  - 필요시 코드 분할 (Lazy Loading)

**기대 결과:**
- 깔끔한 코드베이스
- 불필요한 파일 제거
- 성능 최적화

---

## ✅ 최종 검증 Checklist

모든 フェーズ 완료 후:

- [ ] `pnpm build` 성공 (타입 에러 없음)
- [ ] `pnpm test` 전체 테스트 통과
- [ ] `pnpm dev`에서 앱이 정상 실행
- [ ] 관리자 화면 (Admin Dashboard)에서 모든 CRUD 작동 확인
- [ ] 사용자 화면 (User Dashboard)에서 그룹/국 정보 조회 가능
- [ ] 에러 처리 (error.tsx)가 제대로 동작
- [ ] Toast 알림이 API 응답과 함께 표시됨
- [ ] RPC 클라이언트 타입 자동 완성 동작

---

## 📈 실装 스케줄

| フェーズ | 이름 | 예상 시간 | 난이도 | 상태 |
|----------|------|----------|--------|------|
| **A** | セットアップ & 基盤 | 1～2h | 易 | ⏳ 未開始 |
| **B** | Server Actions → Hono | 1h | 易 | ⏳ 未開始 |
| **C** | Admin API | 2～3h | 中 | ⏳ 未開始 |
| **D** | User/Group/Nation API | 2～3h | 中 | ⏳ 未開始 |
| **E** | 通知 API | 1h | 易 | ⏳ 未開始 |
| **F** | Better Auth 統合 | 1h | 中 | ⏳ 未開始 |
| **G** | Middleware | 2h | 中 | ⏳ 未開始 |
| **H** | Client 統合 & テスト | 1.5h | 易 | ⏳ 未開始 |
| **I** | クリーンアップ | 0.5h | 易 | ⏳ 未開始 |
| **検証** | 最終検証 | 1h | 易 | ⏳ 未開始 |
| **合計** | - | **約15h** | - | - |

---

## 🔐 決定事項（2026-03-01 確定）

### 1. Better Auth との関係 ✅ **決定済み**
- [x] **オプション A（採用）**: 既存 `/api/auth/[...all]` 並行運用＋ Hono は `/api` 配下
  - **理由**: リスク最小、実装容易、セキュリティ確保
  - **詳細**: `.agent/decisions/better-auth-pattern.md`
- [ ] ~~オプション B~~: Better Auth も Hono Middleware に統合（却下）

### 2. Runtime 选択 ✅ **決定済み**
- [x] **Node Runtime（採用）**: Drizzle ORM 完全対応、DB 接続可能
  - **理由**: PostgreSQL との完全互換性、既存実装との一貫性
  - **詳細**: `.agent/decisions/node-runtime.md`
- [ ] ~~Edge Runtime~~: 高速、但し機能制限（DB 接続に制限あり）（却下）
- [ ] ~~ハイブリッド（一部Edge）~~: 複雑性増加のため現時点では却下

### 3. RPC クライアント使用 ✅ **決定済み**
- [x] **Hono RPC Client（採用）**: hono/client で型安全なクライアント自動生成
  - **理由**: 完全な型安全性、ゼロ設定、公式サポート
  - **詳細**: `.agent/decisions/rpc-client-pattern.md`
- [ ] ~~手動 fetch~~: 型安全性が低い（却下）
- [ ] ~~tRPC 移行~~: Hono 廃止となり目的と矛盾（却下）
- [ ] ~~OpenAPI 生成~~: 現時点では過剰（将来検討可）

### 4. 段階的マイグレーション ✅ **決定済み**
- [ ] ~~フルスケール~~: A → B → C → D → E → F → G → H → I すべて実装（却下）
- [x] **Admin 優先（採用）**: フェーズ 0（検証） → フェーズ 1（セットアップ） → フェーズ 2（Admin API）→ テスト → 拡張
  - **理由**: リスク軽減、段階的な検証が可能
- [ ] ~~最小限~~: A → C として管理 API のみ先行（却下）

### 5. 実装ペース ✅ **決定済み**
- [ ] ~~集中~~: 一日で複数フェーズ（却下：品質リスク）
- [x] **段階的（採用）**: 1～2 フェーズ/日、各フェーズ終了時にテスト実施
  - **理由**: 品質確保、リスク管理
- [ ] **バランス**: フェーズ A を本日、以降は様子見

---

## 🚀 次のステップ ✅ **更新済み**

### ✅ 完了した決定
1. ✅ **Better Auth 共存方法**: オプション A（並行運用）を採用
   - 詳細: `.agent/decisions/better-auth-pattern.md`
2. ✅ **Runtime**: Node Runtime を採用
   - 詳細: `.agent/decisions/node-runtime.md`
3. ✅ **RPC Client**: Hono RPC Client（公式）を採用
   - 詳細: `.agent/decisions/rpc-client-pattern.md`
4. ✅ **マイグレーション戦略**: Admin 優先の段階的アプローチ

### ⏳ 次のアクション

**推奨: 修正版実装計画を使用**
- 📄 **修正版計画**: `schedule_todo_list/2026-03-01_HONO_IMPLEMENTATION_REVISED.md`
- 📄 **詳細レビュー**: `schedule_todo_list/2026-03-01_HONO_REVIEW_CRITIQUE.md`

**実装開始前の必須タスク（フェーズ 0）:**
1. ✅ **Runtime 決定**（完了）: Node Runtime 採用
2. ✅ **Better Auth 共存方法決定**（完了）: Option A（並行運用）採用
3. ✅ **RPC Client 決定**（完了）: Hono RPC Client 採用
4. ⏳ **RPC Client PoC**（1h）: 型推論・自動完成の動作確認
   - タスク1: 基本的な型推論確認（20分）
   - タスク2: パラメータ型推論確認（15分）
   - タスク3: エラーハンドリング確認（15分）
   - タスク4: Next.js 統合確認（10分）
   - 詳細: `.agent/decisions/rpc-client-pattern.md`
5. ⏳ **テスト戦略決定**（0.5h）: Hono handler テストの方法確定
6. ⏳ **RBAC Middleware 互換性検証**（0.5h）: 既存 RBAC ロジックの再利用確認

**実装開始（フェーズ 1）:**
1. `pnpm add hono` 実行
2. `src/app/api/[[...route]]/route.ts` 作成
   - `export const runtime = 'node';` 必須
   - `export type AppType = typeof app;` で型エクスポート
3. `src/lib/api/client.ts` 作成
   - `hc<AppType>('/api')` でクライアント生成
4. Middleware 実装（auth, error-handler）
5. ビルド検証（`pnpm build`）

---

## 📝 進捗追跡

各フェーズ完了時に以下を更新：

```markdown
## 実装済フェーズ

- ⏳ フェーズ A: セットアップ & 基盤 (00%)
- ⏳ フェーズ B: Server Actions → Hono (00%)
- ⏳ フェーズ C: Admin API (00%)
- ⏳ フェーズ D: User/Group/Nation API (00%)
- ⏳ フェーズ E: 通知 API (00%)
- ⏳ フェーズ F: Better Auth 統合 (00%)
- ⏳ フェーズ G: Middleware (00%)
- ⏳ フェーズ H: Client 統合 & テスト (00%)
- ⏳ フェーズ I: クリーンアップ (00%)
```

---

**作成者:** GitHub Copilot
**最終更新:** 2026-03-01
