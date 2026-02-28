# スキーマ設計の矛盾 - 緊急対応レポート
**日付**: 2026年3月1日
**優先度**: CRITICAL

## 問題概要

`src/lib/db/schema.postgres.ts` のテーブル設計が以下の矛盾を含んでいます：

### 1. User & Profile テーブルの分離
```
- users テーブル: Better Auth が使用（id, email, etc）
- userProfiles テーブル: アプリケーション独自テーブル（UUID型 id）
- groupMembers: userProfileId を参照
```

**問題**:
- Server Action のセッション（`session.user.id` = users.id）が userProfiles との関連性が不明
- RBAC チェック関数が users.id を基準に動作しようとしているが、groupMembers は userProfileId を参照

### 2. 国テーブル設計
```
nations テーブル:
- ownerUserId: uuid（userProfiles?）
- ownerGroupId: uuid（groups?）

nation_groups テーブル:
- nationId, groupId（groups）
```

**問題**: nation_groups には nation_members のような個人レベルのメンバーシップ管理テーブルがない

## 推奨修復

### オプション A: Users テーブルの拡張（最小変更）
```sql
ALTER TABLE users ADD COLUMN profile_id UUID REFERENCES user_profiles(id);
```

### オプション B: スキーマ統合（推奨）
- `userProfiles` を削除
- `users` テーブルに必要なカラムを統合
- Better Auth の設計とアプリケーション設計を統一

### オプション C: マッピングテーブル
- `user_to_profile` マッピング テーブルを作成
- users.id ↔ userProfiles.id の紐付けを管理

## 現在の回避策

`rbac-helper.ts` を次のとおり修正：
- userId から userProfile を取得するクエリを追加
- sessionのuserIdをアプリケーション側で変換
