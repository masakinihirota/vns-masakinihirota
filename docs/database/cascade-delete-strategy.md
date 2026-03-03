# Cascade Delete Impact Analysis & Soft Delete Strategy

## Current Cascade Delete Relationships

### 主キー＿削除時の連鎖削除パス

#### 1. **ユーザー削除時 (users → rootAccounts → userProfiles)**

**直接カスケード依存：**
```
users.id → rootAccounts.authUserId 
         → userProfiles.rootAccountId
         → userPreferences (via users.id)
         → userAuthMethods (via users.id)
```

**間接的な削除（userProfiles経由）：**
```
userProfiles.id →
  ├─ businessCards (CASCADE)
  ├─ groups.leaderId (SET NULL)
  ├─ nations.ownerUserId (SET NULL)
  ├─ market_items.sellerId (SET NULL)
  ├─ market_transactions.buyerId/sellerId (not FK)
  ├─ nation_events.organizerId (SET NULL)
  ├─ nation_posts.authorId
  ├─ alliances (CASCADE - both sides)
  ├─ follows (CASCADE - both sides)
  ├─ relationships (CASCADE - both sides)
  ├─ group_members (CASCADE)
  ├─ nation_citizens (CASCADE)
  ├─ nation_event_participants (CASCADE)
  ├─ notifications (CASCADE)
  └─ penalties (CASCADE)
```

---

## Impact Analysis

### 数値分析
- **単一ユーザー削除時の影響範囲：** 最大 30+ テーブル
- **削除されるレコード数：** ユーザーの活動規模に応じて数十～数百
- **リスク評価：** 🔴 **HIGH** - データ復旧不可

### 削除タイプ別影響

| 削除タイプ | 影響 | リスク |
|---------|-----|------|
| **CASCADE** | 従属レコードも削除 | 🔴 高 - 復旧不可 |
| **SET NULL** | 親参照がNULLに | 🟡 中 - データ喪失 |
| **RESTRICT** | 削除拒否 | 🟢 低 - ユーザー体験▼ |

---

## Soft Delete戦略

### 実装方針

#### **オプション A: 全テーブル対応（完全ソフト削除）**
```typescript
// スキーマ修正例
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  // ... 既存カラム
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});

// RLS ポリシー追加
// SELECT WHERE is_deleted = false
// UPDATE/DELETE WHERE is_deleted = false
```

**メリット：**
- ✅ 完全なデータ監査履歴
- ✅ アカウント復旧機能実装可能
- ✅ 削除データの一時復旧対応

**デメリット：**
- ❌ RLS ポリシー複雑化
- ❌ クエリパフォーマンス低下（WHERE is_deleted = false 追加）
- ❌ 実装工数大

---

#### **オプション B: 重要テーブルのみ（段階的実装）**
優先度高：
- `users` → アカウント復旧
- `userProfiles` → ペルソナ履歴
- `nations` → 組織復旧
- `groups` → グループ復旧

優先度低：
- `marketTransactions` → 売上記録
- `notifications` → 通知履歴

**メリット：**
- ✅ 段階的実装可能
- ✅ ROI 高い（コスト/品質比）
- ✅ 重要データは保護

**デメリット：**
- ⚠️ テーブル間の整合性管理複雑

---

#### **オプション C: ハイブリッド削除戦略**

```typescript
// 3つの削除メカニズム

1. **Soft Delete (ユーザー, 組織)**
   - 復旧需要が高め
   - deletedAt + RLS で物理削除を遅延

2. **Logical Cascade (取引, ポイント)**
   - 監査ログに記録 + 物理削除
   - 削除時にaudit_logsに記録

3. **Immediate Delete (通知, キャッシュ)**
   - TTL自動削除
   - 復旧不要なデータ
```

---

## 推奨実装プラン

### Phase 1：インパクト軽減（今すぐ）
1. **削除前チェック**: ユーザー削除時の dependent records 数를 count
2. **警告メカニズム**: 削除予定レコード数が閾値超過で警告
3. **監査ログ強化**: aud itLogs に全削除операを記録

### Phase 2：ソフト削除導入（短期 - 1-2週間）
1. `users`, `userProfiles`, `nations` に deletedAt + isDeleted 追加
2. RLS ポリシー: SELECT WHERE is_deleted = false を default に
3. 復旧管理APIの実装: `/admin/api/users/{id}/restore`

### Phase 3：段階的拡張（中期 - 1ヶ月）
1. `groups`, `marketTransactions` に soft delete 拡張
2. クエリパフォーマンス最適化（indexed deletedAt）
3. 古い削除データの物理削除ポリシー定義

---

## 実装チェックリスト

- [ ] `audit_logs` に全削除记录を自動記録
- [ ] RLS ポリシーで deleted データをfilter
- [ ] 削除復旧テストケース作成
- [ ] ユーザー削除コマンドに確認ダイアログ追加
- [ ] API エラーハンドリング : `deletedAt IS NOT NULL` の処理

---

## データ復旧ポリシー

**削除後の復旧受付期間：** 30日

```sql
-- 復旧可能なデータを取得
SELECT * FROM audit_logs 
WHERE action = 'DELETE' 
  AND timestamp >= NOW() - INTERVAL '30 days'
  AND targetType = 'user_profile';

-- ソフト削除データを復旧
UPDATE user_profiles 
SET deletedAt = NULL, is_deleted = false 
WHERE id = 'xxx' AND deletedAt IS NOT NULL;
```

---

## セキュリティ考慮事項

⚠️ **GDPRコンプライアンス**
- ユーザー要求での完全削除は法的に必須
- ソフト削除と完全削除の両方のメカニズムが必要
- 削除監査ログの保留期間をコンプライアンス部門と協議

⚠️ **アカウント乗っ取り対策**
- 削除後の即座の復旧は避ける
- 7日間のクーリングオフ期間を検討
- 復旧時に本人確認のメール送信

---

## まとめ

**推奨：オプションC（ハイブリッド削除戦略）**

段階的な実装アプローチで、High-impact user accounts から soft delete を導入し、その他のテーブルは段階的に対応。監査ログとRLS ポリシーの組み合わせで、データセキュリティと復旧可能性のバランスを実現します。
