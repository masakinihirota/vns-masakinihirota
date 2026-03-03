# 推奨アクション優先度分析＆実装戦略選択肢

## 📊 アクション項目の優先度マトリックス

| 優先度 | アクション項目 | 影響度 | 実装難度 | リスク | 期間 | 推奨スケジュール |
|------|------------|--------|--------|--------|------|-----------------|
| 🔴 **P0** | Staging migration テスト | 極高 | 低 | 高 | 2-3日 | **即座（今週）** |
| 🔴 **P0** | メトリクスベースライン測定 | 極高 | 低 | 低 | 1-2日 | **並行（今週）** |
| 🟠 **P1** | N+1検出APM設定 | 高 | 中 | 中 | 3-5日 | **今週後半** |
| 🟠 **P1** | Audit logging実装 | 高 | 中 | 低 | 5-7日 | **来週** |
| 🟡 **P2** | deletedAtカラム追加 | 中 | 中 | 高 | 5-7日 | **2週目** |
| 🟡 **P2** | RLS policy更新 | 中 | 高 | 高 | 7-10日 | **2-3週目** |
| 🟢 **P3** | Soft delete拡張 | 中 | 高 | 中 | 10-14日 | **4週目** |
| 🟢 **P3** | 監査体制構築 | 低 | 高 | 低 | 継続 | **月1回** |

---

## 🎯 推奨実装戦略（複数選択肢）

### **戦略A：リスク最小化型（推奨度 ⭐⭐⭐⭐⭐）**

#### 特徴
検証と測定を徹底し、本番への移行リスクを最小化する

#### 実装順序
```
Week 1: 
  └─ Migration テスト（本番DB前にStaging完全検証）
  └─ メトリクス測定（migration後の性能baseline確立）
  └─ APM設定（継続監視体制整備）

Week 2:
  └─ Audit logging 実装（非侵襲的に監査追加）
  └─ Performance テスト（baseline vs after）

Week 3-4:
  └─ deletedAt カラム追加（段階的、まずuser tablesのみ）
  └─ RLS policy 実装セット（テーブル単位で段階的）

Week 5+:
  └─ 追加テーブルへのsoft delete拡張
```

#### メリット
✅ **リスク低減**: 各段階で検証ゲート  
✅ **品質保証**: baseline メトリクスで劣化検出  
✅ **ロールバック容易**: 各stepが独立  
✅ **チーム習熟**: 段階的学習で運用skill向上  

#### デメリット
❌ **時間コスト**: 4-5週間必要  
❌ **リソース**: 継続的な検証作業  

#### 推奨対象
- 本番DBが既に顧客データを保有している
- チームのDB操作経験が限定的
- ダウンタイムが許容されない環境

---

### **戦略B：アジャイル加速型（推奨度 ⭐⭐⭐⭐）**

#### 特徴
並行実装で工程を最短化。2週間で全Phase1完了

#### 実装順序
```
Week 1 (並行作業):
  ├─ Day 1-2: Migration テスト（Staging）
  ├─ Day 2-3: Audit logging 実装（並行開発）
  ├─ Day 3-5: Metrics baseline 測定
  └─ Day 5: APM設定

Week 2 (並行作業):
  ├─ Day 1-3: deletedAt カラム追加（users, userProfiles）
  ├─ Day 2-4: RLS policy 実装（並行）
  └─ Day 4-5: 統合テスト + Migration実行

Week 3+:
  └─ 追加テーブルへの拡張
```

#### メリット
✅ **時間効率**: 2週間でPhase完了  
✅ **モメンタム**: プロジェクト推進感  
✅ **リソース集約**: チームが集中できる  

#### デメリット
❌ **リスク増大**: バッファが少ない  
❌ **QA負荷**: 並行テストで漏れリスク  
❌ **運用負担**: 本番適用時の緊張感  

#### 推奨対象
- Staging環境が完全に独立している
- チームのDB経験が豊富
- ビジネス要件で短期delivery必須

---

### **戦略C：最小限ハイブリッド型（推奨度 ⭐⭐⭐）**

#### 特徴
Audit logging に絞って実装。soft delete は後延ばし可能

#### 実装順序
```
Week 1 (今すぐ):
  ├─ Migration テスト（Staging）✓完了
  ├─ Metrics baseline ✓完了
  └─ APM設定（LogQL + Datadog alerts）

Week 2-3:
  └─ Audit logging 実装（audit_logsテーブル活用）
     （soft deleteなし、ログだけで追跡可能）

後延ばし（3ヶ月後）:
  └─ Soft delete は必要性が明確になってからPTM進める
```

#### メリット
✅ **投資最小化**: Audit logging のみで大幅改善  
✅ **柔軟性**: 後から戦略変更可  
✅ **効果測定**: ログで削除パターン分析後に判断  

#### デメリット
❌ **部分的対応**: Soft delete 延期でリスク残存  
❌ **ポリシー不明**: 削除後の復旧仕様が不明確  
❌ **テクニカルデット**: 後で実装コスト増大  

#### 推奨対象
- リソース限定的
- 削除機能の運用パターンがまだ不明確
- MVP段階で完全な削除戦略は不要

---

## 🚀 推奨実装パス（段階別詳細）

### **Phase 1: 検証＆測定（1週間）**

#### 1.1 Staging Migration テスト（優先度 🔴P0）
```bash
# 実施項目
□ drizzle/0009 + 0010 migration を Staging DBに apply
□ 既存データ integrity check
  - FK constraint 違反なし
  - CHECK constraint満たしている
  - Duplicate indexes なし
□ Query performance test
  - JOIN query latency 測定
  - Index利用確認 (EXPLAIN ANALYZE)
□ Rollback テスト
  - Migration rollback 可能性確認
```

**実装目安: 2-3日**  
**推奨チーム**: Backend engineer 1 + QA 1

---

#### 1.2 Metrics ベースライン測定（優先度 🔴P0）
```typescript
// 測定項目

// Query Performance
- SELECT query latency (median, p95, p99)
- JOIN query latency (nation_events with participants等)
- Index utilization rate (pg_stat_user_indexes)

// Application Performance
- API endpoint latency
- Database connection pool utilization
- Query cache hit rate

// Data Volume Metrics
- Total record count per table
- Index size (MB)
- Table bloat ratio

// Measurement tools
□ PostgreSQL pg_stat_statements
□ APM: Datadog or New Relic
□ Custom logger: query count + duration
```

**実装目安: 1-2日**  
**推奨チーム**: DevOps engineer 1 + Backend engineer 1

---

#### 1.3 N+1検出APM設定（優先度 🟠P1）
```yaml
# Datadog APM設定例

APM_ENABLED: true
DD_TRACE_DEBUG: false
DD_PROFILING_ENABLED: true  # Database profile
DD_DBM_ENABLED: true         # Database monitoring

# Alert Rules
- Sequential queries alert:
    condition: query_count > 10 in 1sec to same table
    threshold: P90 > 100ms
    
- N+1 detection:
    condition: same query executed N times
    threshold: N > 5
    action: Log warning + notify team
```

**実装目安: 3-5日**  
**推奨チーム**: DevOps engineer 1

---

### **Phase 2: 安全設置（1-2週間）**

#### 2.1 Audit Logging 構装（優先度 🟠P1）
```typescript
// audit_logs テーブルの活用

export const auditLogs = pgTable(
  "audit_logs",
  {
    // 既存カラムで十分
    id: uuid().primaryKey(),
    adminId: uuid("admin_id"),      // 削除実行者
    action: text("action"),          // 'DELETE' | 'UPDATE'
    targetId: uuid("target_id"),     // user.id or userProfile.id
    targetType: text("target_type"), // 'user' | 'user_profile'
    result: text("result"),          // 'success' | 'failure'
    details: jsonb("details"),       // { record_count: 100, tables_affected: [...] }
    timestamp: timestamp("timestamp"),
  }
);

// 実装項目
□ アプリケーション層で DELETE 前に auditLogs.insert()
□ 削除対象の record_count を記録
□ 7日間のクーリングオフ期間をdetails に記載
□ Admin Dashboard に "System Actions" セクション追加
  - Recent deletions
  - Cascade delete トリガー検出
  - Rollback link（7日以内）
```

**実装目安: 5-7日**  
**推奨チーム**: Backend engineer 1-2

---

#### 2.2 RLS Policy 準備（優先度 🟠P1）
```sql
-- 将来の soft delete 対応に向けた policy コンポーネント化

-- 現在（hard delete前）
CREATE POLICY user_profiles_select_public ON user_profiles
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

-- soft delete対応後
CREATE POLICY user_profiles_select_public_v2 ON user_profiles
  FOR SELECT TO authenticated, anon
  USING (
    is_active = true 
    AND deleted_at IS NULL  -- ← soft delete対応
  );
```

**実装目安: 5-7日**  
**推奨チーム**: Backend engineer 1 + DB architect

---

### **Phase 3: 完全ソフト削除（2-3週間）**

#### 3.1 Core Tables への deletedAt 追加
```typescript
// Step 1: スキーマ追加（non-blocking）
export const users = pgTable("user", {
  // ... existing columns
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  isDeleted: boolean("is_deleted").default(false).notNull(), // for indexing
});

// Step 2: Migration 生成
// drizzle/00XX_add_soft_delete_users.sql

// Step 3: RLS Policy 更新
CREATE POLICY users_select_not_deleted ON "user"
  FOR SELECT USING (is_deleted = false);

CREATE POLICY users_update_self ON "user"
  FOR UPDATE TO authenticated USING (auth.uid() = id);

// Step 4: Application層での delete() 改造
// DELETE → UPDATE deleted_at = NOW(), is_deleted = true
```

**実装アイテム**:
- [ ] users テーブル
- [ ] userProfiles テーブル
- [ ] rootAccounts テーブル

**実装目安: 10-14日**  
**推奨チーム**: Backend engineer 2 + QA 1

---

#### 3.2 Data Recovery API
```typescript
// POST /admin/api/accounts/{userId}/restore
export async function restoreUserAccount(userId: string) {
  // preconditions
  const account = await db.query.users.findFirst({
    where: and(
      eq(users.id, userId),
      eq(users.isDeleted, true),
      sql`extract(epoch from (now() - ${users.deletedAt})) < 30*86400` // 30days
    ),
  });
  
  if (!account) throw new Error('Account not recoverable');
  
  // restore
  await db.update(users)
    .set({
      isDeleted: false,
      deletedAt: null,
    })
    .where(eq(users.id, userId));
  
  // send email notification
  await sendRestoreConfirmationEmail(account.email);
}
```

**実装目安: 5-7日**  
**推奨チーム**: Backend engineer 1

---

## 📋 チェックリスト（段階別）

### **今週（Week 1）**
- [ ] **Staging 検証**
  - [ ] Migration apply成功
  - [ ] Data integrity check PASS
  - [ ] Performance baseline記録

- [ ] **APM設定**
  - [ ] Datadog/NewRelic接続
  - [ ] Query monitoring有効化
  - [ ] Alert rules設定

- [ ] **Documentation**
  - [ ] 本番適用手順書 作成
  - [ ] Rollback手順 記載
  - [ ] チーム共有＆確認

### **来週（Week 2）**
- [ ] **Audit Logging**
  - [ ] DELETE 監査ロジック実装
  - [ ] Admin Dashboard表示追加
  - [ ] テスト＆QA

- [ ] **RLS Policy**
  - [ ] 新policy SQL 作成
  - [ ] Test data で検証
  - [ ] ドキュメント更新

### **2-3週目（Week 3-4）**
- [ ] **Soft Delete実装**
  - [ ] users.deletedAt追加
  - [ ] userProfiles.deletedAt追加
  - [ ] Migration生成＆Staging apply
  - [ ] Query update（WHERE is_deleted=false追加）
  - [ ] 本番apply计画立案

### **継続（Week 5+）**
- [ ] **追加テーブル拡張**
  - [ ] nations/groups soft delete
  - [ ] RLS policy統一
  - [ ] Query最適化（index on deleted_at）

---

## 💡 推奨：**戦略Aの詳細ロードマップ（最も安全）**

```
┌─ Week 1: 検証GATE ──────────────────────┐
│ ├─ Day 1-2: Staging Migration apply     │
│ ├─ Day 2-3: Data integrity check        │
│ ├─ Day 3-4: Performance baseline        │
│ └─ Day 4-5: APM setup + Alerts          │
└─ ✓ Release GATE: 本番migration 承認 ────┘
                    ↓
┌─ Week 2: Audit Layer ───────────────────┐
│ ├─ Day 1-2: Audit logging 実装          │
│ ├─ Day 2-3: Admin Dashboard追加         │
│ └─ Day 3-5: Integration test            │
└─ ✓ Monitoring GATE: 動作確認       ────┘
                    ↓
┌─ Week 3-4: Soft Delete Phase1 ─────────┐
│ ├─ Day 1-2: users.deletedAt 追加       │
│ ├─ Day 2-3: userProfiles.deletedAt     │
│ ├─ Day 3-4: RLS policy更新              │
│ └─ Day 4-5: E2E test                    │
└─ ✓ Compliance GATE: GDPR対応確認  ─────┘
                    ↓
┌─ Week 5+: Expansion ────────────────────┐
│ └─ organizations (nations/groups)      │
└─ ✓ Production Stability ──────────────────┘
```

---

## 📞 推奨度サマリー

| 戦略 | 推奨度 | 対象環境 | リスク | 期間 |
|-----|--------|--------|--------|-----|
| **戦略A（リスク最小化）** | ⭐⭐⭐⭐⭐ | 本番DB運用中 | 低 | 4-5週 |
| **戦略B（アジャイル加速）** | ⭐⭐⭐⭐ | 経験豊富チーム | 中 | 2-3週 |
| **戦略C（最小限対応）** | ⭐⭐⭐ | リソース限定環境 | 中-高 | 1週 |

### **最終推奨**
🏆 **戦略A を基本としつつ、チームのDB経験度に応じて戦略Bへの加速を検討**

- チーム内にSenior DBA/Backend engineer がいれば → **戦略B検討**
- 初めてのDB大規模操作であれば → **戦略A確実に実行**
- リソース不足の場合 → **戦略C＋重要item優先**
