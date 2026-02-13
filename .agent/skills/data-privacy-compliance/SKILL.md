---
description: データプライバシーとGDPR/個人情報保護法への対応
---

# Data Privacy Compliance Skill

## 概要

このスキルは、VNS masakinihirotaプロジェクトにおける**データプライバシー**と**GDPR/個人情報保護法**への対応に関するベストプラクティスを提供します。

価値観データは極めてセンシティブな個人情報であり、適切な保護が必須です。

## 適用タイミング

以下の場合にこのスキルを使用してください:

- 個人情報を扱う機能の実装時
- データベーススキーマの設計時
- ユーザーデータの削除・エクスポート機能の実装時
- プライバシーポリシーの技術的実装時

## 法的要件の理解

### GDPR（EU一般データ保護規則）

**適用対象**:
- EUに拠点がある
- EUの個人にサービスを提供
- EUの個人の行動を監視

**主要原則**:
1. **適法性、公正性、透明性**
2. **目的の限定**
3. **データの最小化**
4. **正確性**
5. **保存期間の制限**
6. **完全性と機密性**
7. **説明責任**

### 日本の個人情報保護法

**個人情報の定義**:
- 生存する個人に関する情報
- 特定の個人を識別できる情報

**要配慮個人情報**:
- 人種、信条、社会的身分
- 病歴、犯罪歴
- **思想、信条** ← 価値観データはこれに該当する可能性

## データ分類とラベリング

### 1. データの分類

```typescript
enum DataSensitivity {
  PUBLIC = "public",           // 公開可能
  INTERNAL = "internal",       // 内部利用のみ
  CONFIDENTIAL = "confidential", // 機密（価値観データ等）
  RESTRICTED = "restricted",   // 制限（要配慮個人情報）
}

interface DataClassification {
  tableName: string;
  columnName: string;
  sensitivity: DataSensitivity;
  piiType?: "name" | "email" | "value" | "location";
  retentionPeriod: number; // 日数
}

const dataClassifications: DataClassification[] = [
  {
    tableName: "user_profiles",
    columnName: "email",
    sensitivity: DataSensitivity.CONFIDENTIAL,
    piiType: "email",
    retentionPeriod: 365 * 5, // 5年
  },
  {
    tableName: "user_values",
    columnName: "value_vector",
    sensitivity: DataSensitivity.RESTRICTED,
    piiType: "value",
    retentionPeriod: 365 * 2, // 2年
  },
];
```

### 2. データベーススキーマでの分類

```sql
-- データ分類をメタデータとして保存
CREATE TABLE data_classifications (
  table_name VARCHAR(255) NOT NULL,
  column_name VARCHAR(255) NOT NULL,
  sensitivity VARCHAR(50) NOT NULL,
  pii_type VARCHAR(50),
  retention_period_days INTEGER NOT NULL,
  PRIMARY KEY (table_name, column_name)
);

-- データ分類を記録
INSERT INTO data_classifications VALUES
  ('user_profiles', 'email', 'confidential', 'email', 1825),
  ('user_values', 'value_vector', 'restricted', 'value', 730);
```

## データの匿名化と仮名化

### 1. 匿名化（Anonymization）

**定義**: 個人を特定できないようにデータを不可逆的に変換

```typescript
/**
 * ユーザーデータを匿名化
 */
async function anonymizeUser(userId: string): Promise<void> {
  await db.transaction(async (tx) => {
    // 1. 個人識別情報を削除
    await tx
      .update(userProfiles)
      .set({
        email: `deleted_${Date.now()}@example.com`,
        display_name: "削除されたユーザー",
        avatar_url: null,
        bio: null,
      })
      .where(eq(userProfiles.id, userId));

    // 2. 価値観データは統計目的で保持（匿名化）
    // ユーザーIDとの紐付けを切る
    await tx
      .update(userValues)
      .set({
        user_profile_id: null, // 紐付け解除
        anonymized_at: new Date(),
      })
      .where(eq(userValues.userProfileId, userId));

    // 3. 削除ログを記録
    await tx.insert(deletionLogs).values({
      userId,
      deletedAt: new Date(),
      reason: "user_request",
    });
  });
}
```

### 2. 仮名化（Pseudonymization）

**定義**: 個人識別情報を仮名に置き換え、可逆的に復元可能

```typescript
import crypto from "crypto";

/**
 * メールアドレスを仮名化
 */
function pseudonymizeEmail(email: string, secret: string): string {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(email)
    .digest("hex");

  return `user_${hash.substring(0, 16)}@pseudonym.local`;
}

/**
 * 仮名化されたデータで分析
 */
async function analyzeUserBehavior(): Promise<AnalyticsResult> {
  const users = await db.select().from(userProfiles);

  const pseudonymizedData = users.map(user => ({
    pseudonymId: pseudonymizeEmail(user.email, process.env.PSEUDONYM_SECRET!),
    valueVector: user.valueVector,
    createdAt: user.createdAt,
  }));

  return performAnalysis(pseudonymizedData);
}
```

## 削除権（Right to be Forgotten）の実装

### 1. 完全削除

```typescript
/**
 * ユーザーデータを完全削除
 */
async function deleteUserCompletely(userId: string): Promise<void> {
  await db.transaction(async (tx) => {
    // 1. 関連データを削除（カスケード）
    await tx.delete(userValues).where(eq(userValues.userProfileId, userId));
    await tx.delete(workRatings).where(eq(workRatings.userProfileId, userId));
    await tx.delete(groupMembers).where(eq(groupMembers.userId, userId));

    // 2. プロフィールを削除
    await tx.delete(userProfiles).where(eq(userProfiles.id, userId));

    // 3. 削除ログを記録（監査目的）
    await tx.insert(deletionLogs).values({
      userId,
      deletedAt: new Date(),
      reason: "user_request",
      dataTypes: ["profile", "values", "ratings", "groups"],
    });
  });
}
```

### 2. 段階的削除（保持期間考慮）

```sql
-- 保持期間を過ぎたデータを自動削除
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- 削除から30日経過したユーザーの完全削除
  DELETE FROM deletion_logs
  WHERE deleted_at < NOW() - INTERVAL '30 days';

  -- 非アクティブユーザーの価値観データを匿名化
  UPDATE user_values
  SET user_profile_id = NULL, anonymized_at = NOW()
  WHERE user_profile_id IN (
    SELECT id FROM user_profiles
    WHERE last_login_at < NOW() - INTERVAL '2 years'
  );
END;
$$ LANGUAGE plpgsql;

-- 定期実行（毎日深夜）
SELECT cron.schedule('cleanup-expired-data', '0 0 * * *', 'SELECT cleanup_expired_data()');
```

## データポータビリティ（Data Portability）

### ユーザーデータのエクスポート

```typescript
/**
 * ユーザーデータをJSON形式でエクスポート
 */
async function exportUserData(userId: string): Promise<UserDataExport> {
  const [profile, values, ratings, groups] = await Promise.all([
    db.select().from(userProfiles).where(eq(userProfiles.id, userId)).limit(1),
    db.select().from(userValues).where(eq(userValues.userProfileId, userId)),
    db.select().from(workRatings).where(eq(workRatings.userProfileId, userId)),
    db.select().from(groupMembers).where(eq(groupMembers.userId, userId)),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    profile: profile[0],
    values: values.map(v => ({
      category: v.category,
      valueId: v.valueId,
      rating: v.rating,
      createdAt: v.createdAt,
    })),
    ratings: ratings.map(r => ({
      workId: r.workId,
      tier: r.tier,
      createdAt: r.createdAt,
    })),
    groups: groups.map(g => ({
      groupId: g.groupId,
      role: g.role,
      joinedAt: g.joinedAt,
    })),
  };
}

/**
 * エクスポートAPIエンドポイント
 */
export async function GET(request: Request) {
  const userId = await getCurrentUserId(request);

  const data = await exportUserData(userId);

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="user_data_${userId}.json"`,
    },
  });
}
```

## 同意管理（Consent Management）

### 1. 同意の記録

```sql
-- 同意管理テーブル
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  consent_type VARCHAR(100) NOT NULL, -- 'data_collection', 'marketing', 'analytics'
  consented BOOLEAN NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  version VARCHAR(50) NOT NULL -- プライバシーポリシーのバージョン
);

CREATE INDEX idx_user_consents_user_type ON user_consents(user_id, consent_type);
```

### 2. 同意の確認

```typescript
/**
 * ユーザーの同意を確認
 */
async function checkConsent(
  userId: string,
  consentType: string
): Promise<boolean> {
  const consent = await db
    .select()
    .from(userConsents)
    .where(
      and(
        eq(userConsents.userId, userId),
        eq(userConsents.consentType, consentType)
      )
    )
    .orderBy(desc(userConsents.consentedAt))
    .limit(1);

  return consent.length > 0 && consent[0].consented;
}

/**
 * 同意を記録
 */
async function recordConsent(
  userId: string,
  consentType: string,
  consented: boolean,
  request: Request
): Promise<void> {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  await db.insert(userConsents).values({
    userId,
    consentType,
    consented,
    ipAddress,
    userAgent,
    version: "1.0", // プライバシーポリシーのバージョン
  });
}
```

## プライバシーバイデザイン（Privacy by Design）

### 7つの原則

1. **事後的ではなく事前的**
   - 設計段階からプライバシーを考慮

2. **デフォルトでプライバシー保護**
   - デフォルトで最も厳格な設定

3. **プライバシーを設計に組み込む**
   - 後付けではなく、設計の一部

4. **全機能的（ゼロサムではない）**
   - プライバシーと機能性の両立

5. **エンドツーエンドのセキュリティ**
   - ライフサイクル全体で保護

6. **可視性と透明性**
   - ユーザーに分かりやすく説明

7. **ユーザー中心**
   - ユーザーの利益を最優先

### 実装例

```typescript
/**
 * デフォルトでプライバシー保護
 */
const defaultPrivacySettings = {
  profileVisibility: "private", // デフォルトは非公開
  showEmail: false,
  showRealName: false,
  allowMatching: false, // 明示的な同意が必要
  allowAnalytics: false,
} as const;

/**
 * プロフィール作成時にデフォルト設定を適用
 */
async function createUserProfile(data: CreateProfileData): Promise<UserProfile> {
  return await db.insert(userProfiles).values({
    ...data,
    privacySettings: defaultPrivacySettings,
  });
}
```

## データ暗号化

### 1. 保存時の暗号化（Encryption at Rest）

```typescript
import crypto from "crypto";

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
const ALGORITHM = "aes-256-gcm";

/**
 * データを暗号化
 */
function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

/**
 * データを復号化
 */
function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(tag, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * 価値観データを暗号化して保存
 */
async function saveEncryptedValues(
  userId: string,
  values: ValueData[]
): Promise<void> {
  const encrypted = encrypt(JSON.stringify(values));

  await db.insert(userValues).values({
    userId,
    encryptedData: encrypted.encrypted,
    iv: encrypted.iv,
    tag: encrypted.tag,
  });
}
```

### 2. 通信時の暗号化（Encryption in Transit）

```typescript
// next.config.js
module.exports = {
  // HTTPS強制
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};
```

## 監査ログ

### アクセスログの記録

```sql
-- 監査ログテーブル
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  action VARCHAR(100) NOT NULL, -- 'view', 'update', 'delete', 'export'
  resource_type VARCHAR(100) NOT NULL, -- 'profile', 'values', 'ratings'
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);
```

```typescript
/**
 * 監査ログを記録
 */
async function logAudit(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  request: Request
): Promise<void> {
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  await db.insert(auditLogs).values({
    userId,
    action,
    resourceType,
    resourceId,
    ipAddress,
    userAgent,
  });
}
```

## ベストプラクティス

### ✅ DO

- **データ分類**を明確にする
- **デフォルトでプライバシー保護**を実装
- **同意管理**を適切に実装
- **削除権**を実装
- **データポータビリティ**を提供
- **暗号化**（保存時・通信時）を実装
- **監査ログ**を記録

### ❌ DON'T

- **個人情報を平文**で保存しない
- **同意なし**でデータ収集しない
- **削除リクエスト**を無視しない
- **データ保持期間**を無期限にしない
- **監査ログなし**で機密データにアクセスしない

## チェックリスト

- [ ] データ分類を定義
- [ ] プライバシーポリシーを作成
- [ ] 同意管理を実装
- [ ] 削除権を実装
- [ ] データポータビリティを実装
- [ ] 暗号化を実装（保存時・通信時）
- [ ] 監査ログを実装
- [ ] データ保持期間を設定
- [ ] 定期的なデータクリーンアップを実装
- [ ] プライバシー影響評価（PIA）を実施

## 参考資料

- [GDPR公式サイト](https://gdpr.eu/)
- [個人情報保護委員会](https://www.ppc.go.jp/)
- [Privacy by Design](https://www.ipc.on.ca/wp-content/uploads/resources/7foundationalprinciples.pdf)
