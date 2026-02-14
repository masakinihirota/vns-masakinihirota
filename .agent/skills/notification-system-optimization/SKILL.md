---
description: 通知システムの最適化、優先度管理、バッチ処理のガイドライン
triggers:
  - notification
  - push
  - email
  - alert
---

# Notification System Optimization Skill

## 概要

このスキルは、VNS masakinihirotaプロジェクトにおける**通知システム**の最適化とアーキテクチャ設計に関するベストプラクティスを提供します。
イベント、マッチング、メッセージなどの通知を、ユーザー体験を損なわず、かつシステム負荷を最小限に抑えて配信するための手法を定義します。

## 適用タイミング

- 通知機能の設計・実装時
- 大量通知（ブロードキャスト）の実装時
- リアルタイム通知（WebSocket/SSE）の実装時
- 通知設定（ユーザー設定）の実装時

## 通知アーキテクチャの原則

### 1. 通知チャネルの分離

通知の種類に応じて適切なチャネルを選択します。

| チャネル              | 特性                               | 用途                                           |
| :-------------------- | :--------------------------------- | :--------------------------------------------- |
| **In-App (Realtime)** | 即時性が高い、アプリ起動中のみ     | チャット、マッチング成立、現在のアクティビティ |
| **Push Notification** | ユーザーの再エンゲージメントを促す | DM受信、重要なイベント開始、セキュリティ警告   |
| **Email**             | 保存性が高い、長文が可能           | 週次レポート、領収書、アカウント設定変更       |
| **SMS**               | 到達率が高い、コストが高い         | 二要素認証(2FA)、緊急連絡                      |

### 2. 優先度管理 (Priority Queue)

全ての通知を同じように扱うと、重要な通知が埋もれたり、遅延したりします。

```typescript
enum NotificationPriority {
  CRITICAL = 'critical', // 即時配信 (2FA, セキュリティ)
  HIGH = 'high',         // 可能な限り早く (DM, マッチング)
  NORMAL = 'normal',     // 通常 (いいね, フォロー)
  LOW = 'low',           // 遅延許容 (おすすめ, 定期レポート)
}
```

### 3. バッチ処理とダイジェスト

頻繁な通知（例: 「10人があなたの投稿にいいねしました」）は、個別に送らずにまとめることでノイズを減らします。

- **Aggregated Notification**: 「Aさん、Bさん、他8名がいいねしました」
- **Digest Email**: 「今週のコミュニティハイライト」

## データベース設計

### 1. 通知テーブル

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  type VARCHAR(50) NOT NULL, -- 'like', 'comment', 'match', 'system'
  title VARCHAR(255) NOT NULL,
  body TEXT,
  link_url VARCHAR(255),
  image_url VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'normal',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
```

### 2. 通知設定

```sql
CREATE TABLE notification_settings (
  user_id UUID PRIMARY KEY REFERENCES user_profiles(id),
  email_match BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  push_dm BOOLEAN DEFAULT TRUE,
  push_like BOOLEAN DEFAULT TRUE,
  -- 時間帯設定 (例: 23:00-07:00は通知しない)
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 実装パターン

### 1. Realtime通知 (Supabase Realtime)

```typescript
// hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 初期ロード
    fetchNotifications();

    // リアルタイム購読
    const channel = supabase
      .channel('realtime:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
          // トースト表示などのサイドエフェクト
          showToast(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return notifications;
}
```

**最適化ポイント**: 全テーブルの変更を監視せず、`filter` で対象ユーザーのみに絞ることで帯域を節約します。

### 2. バックグラウンドジョブによる通知送信

Next.js の Route Handler や Vercel Cron 、または外部のQueueサービス（Upstash QStash等）を利用します。

```typescript
// app/api/cron/process-notifications/route.ts
import { processNotificationQueue } from '@/lib/queue';

export async function GET() {
  // 未送信の通知を優先度順に取得して処理
  const results = await processNotificationQueue();
  return Response.json(results);
}
```

### 3. FCM (Firebase Cloud Messaging) 統合

モバイルアプリやWebプッシュ通知にはFCMが標準的です。

```typescript
// lib/fcm.ts
import admin from 'firebase-admin';

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data: Record<string, string>
) {
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data,
      android: { priority: 'high' },
      apns: {
         payload: { aps: { 'content-available': 1 } }
      }
    });
  } catch (error) {
    // トークンが無効ならDBから削除する処理をここに入れる
    if (error.code === 'messaging/registration-token-not-registered') {
       await removeInvalidToken(token);
    }
  }
}
```

## パフォーマンス最適化

### 1. N+1問題の回避

通知一覧を取得する際、送信元ユーザー情報（名前、アバター）を都度取得しないよう、必要な情報は通知レコード自体に非正規化して持つか、JOINで一括取得します。

```sql
-- 推奨: 必要な情報をJSONBに含める
INSERT INTO notifications (..., metadata)
VALUES (..., '{"actor_name": "Taro", "actor_avatar": "url..."}');
```

### 2. 古い通知のアーカイブ

通知テーブルは肥大化しやすいため、一定期間（例: 90日）経過した既読通知はアーカイブテーブルに移動するか、削除します。

```sql
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '90 days'
  AND is_read = TRUE;
```

### 3. バッチ送信 (Bulk Insert/Send)

一斉配信のお知らせなどは、1件ずつINSERTせず、配列を使って一括処理します。

```typescript
// 悪い例
for (const user of users) {
  await db.insert(notifications).values({...});
}

// 良い例
await db.insert(notifications).values(
  users.map(user => ({...}))
);
```

## ベストプラクティス

### ✅ DO

1. **ユーザー設定の尊重**: ユーザーがオフにした通知タイプは絶対に送らない。
2. **Quiet Hours**: 夜間のマーケティング通知を避ける。
3. **冪等性**: ネットワークエラーでの再送時に、同じ通知が重複して届かないようにする（`idempotency_key` の利用）。
4. **ディープリンク**: 通知をタップした際、トップページではなく該当のコンテンツ（詳細画面）に直接遷移させる。

### ❌ DON'T

1. **内容のない通知**: 「新しいお知らせがあります」だけの通知は開封率が低い。具体的な内容（「Aさんがあなたをフォローしました」）を含める。
2. **過剰なプッシュ**: 重要なイベント以外でのプッシュ通知はユーザー離れを招く。

## チェックリスト

- [ ] 通知テーブルとインデックスの作成
- [ ] ユーザーごとの通知設定テーブルの実装
- [ ] 優先度キューの設計
- [ ] Supabase Realtimeによる即時通知
- [ ] バックグラウンドでのバッチ処理・集約ロジック
- [ ] FCM等を用いたプッシュ通知基盤
- [ ] 定期的なデータクリーンアップジョブ
