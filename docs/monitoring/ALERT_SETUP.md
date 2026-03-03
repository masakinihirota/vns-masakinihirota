# アラート・監視設定ガイド

> 本番環境での監視とアラート設定のベストプラクティス
> 作成日: 2026-03-03

## 概要

本ドキュメントは、VNS アプリケーションの本番環境における監視・アラート設定のガイドラインです。

---

## 1. 推奨監視サービス

### 1.1 エラートラッキング: Sentry

**設定手順:**

```bash
# Sentryのインストール
pnpm add @sentry/nextjs
pnpm sentry-wizard
```

**設定ファイル: `sentry.client.config.ts`**

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // パフォーマンストレーシング: 10%

  // エラーフィルタリング
  beforeSend(event, hint) {
    // 開発環境では送信しない
    if (process.env.NODE_ENV === "development") {
      return null;
    }

    // 404エラーは除外
    if (event.exception?.values?.[0]?.type === "NotFoundError") {
      return null;
    }

    return event;
  },
});
```

**統合コード: `src/lib/logger/transports.ts`**

```typescript
import * as Sentry from "@sentry/nextjs";

export const sentryTransport: LogTransport = (entry: LogEntry) => {
  if (entry.level === "error" || entry.level === "fatal") {
    Sentry.captureMessage(entry.message, {
      level: entry.level === "fatal" ? "fatal" : "error",
      extra: {
        context: entry.context,
        metadata: entry.metadata,
        error: entry.error,
      },
    });
  }
};
```

---

### 1.2 APM: Vercel Analytics / Datadog

**Vercel Analyticsの場合:**

```bash
pnpm add @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Datadogの場合（高度な監視が必要な場合）:**

```typescript
// lib/monitoring/datadog.ts
import { datadogRum } from "@datadog/browser-rum";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_DATADOG_APP_ID) {
  datadogRum.init({
    applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID,
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
    site: "datadoghq.com",
    service: "vns-masakinihirota",
    env: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
  });
}
```

---

### 1.3 ログ管理: AWS CloudWatch Logs

**Vercel環境でのCloudWatch連携:**

```typescript
// lib/logger/transports.ts
import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";

const cloudwatchClient = new CloudWatchLogsClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const cloudwatchTransport: LogTransport = async (entry: LogEntry) => {
  try {
    await cloudwatchClient.send(
      new PutLogEventsCommand({
        logGroupName: "/vns/production",
        logStreamName: "app-logs",
        logEvents: [
          {
            message: JSON.stringify(entry),
            timestamp: new Date(entry.timestamp).getTime(),
          },
        ],
      })
    );
  } catch (error) {
    console.error("Failed to send log to CloudWatch:", error);
  }
};
```

---

## 2. アラートルール設定

### 2.1 セキュリティイベント

**重要度: 高（即時アラート）**

- 不正な管理画面アクセス試行
- 複数回の認証失敗（ブルートフォース攻撃の可能性）
- 権限外リソースへのアクセス試行

**Sentryアラート設定:**

1. Sentry Dashboard → Alerts → Create Alert Rule
2. 条件設定:
   - Event Type: `error`
   - Tag: `event:authorization_failed` または `event:authentication_failed`
   - Threshold: 5 errors in 5 minutes
3. アクション: Slack通知 / Email

**ログベース検知（CloudWatch Alarms）:**

```json
{
  "filterPattern": "[SECURITY_EVENT]",
  "metricName": "SecurityEvents",
  "metricNamespace": "VNS/Security",
  "metricValue": "1",
  "defaultValue": 0
}
```

アラーム設定:
- 閾値: 5イベント / 5分間
- アクション: SNS → Slack Webhook

---

### 2.2 システムエラー

**重要度: 中（30分以内に対応）**

- データベース接続失敗
- 外部サービス連携エラー
- メモリ使用率90%超過

**Health Check監視:**

```bash
# Vercel Cron Job で定期ヘルスチェック
# vercel.json
{
  "crons": [
    {
      "path": "/api/health",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**外部監視（UptimeRobot / Pingdom）:**

- URL: `https://your-app.vercel.app/api/health`
- 間隔: 5分
- タイムアウト: 30秒
- 失敗時アクション: Email / Slack通知

---

### 2.3 パフォーマンス劣化

**重要度: 低（24時間以内に調査）**

- API レスポンス時間 > 3秒
- データベースクエリ > 1秒
- エラー率 > 1%

**Datadogモニター設定:**

```yaml
name: "Slow API Response"
type: metric alert
query: "avg(last_5m):avg:trace.web.request.duration{env:production} > 3"
message: |
  API response time is slow.
  Please investigate performance issues.
  @slack-engineering
```

---

## 3. 通知チャネル設定

### 3.1 Slack統合

**Incoming Webhook設定:**

1. Slack Workspace → Apps → Incoming Webhooks
2. チャネル選択: `#production-alerts`
3. Webhook URL取得
4. 環境変数設定: `SLACK_WEBHOOK_URL`

**通知実装例:**

```typescript
// lib/notifications/slack.ts
export async function sendSlackAlert(
  message: string,
  severity: "info" | "warning" | "critical"
) {
  const colors = {
    info: "#36a64f",
    warning: "#ff9800",
    critical: "#f44336",
  };

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attachments: [
        {
          color: colors[severity],
          title: "Production Alert",
          text: message,
          footer: "VNS Monitoring",
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }),
  });
}
```

### 3.2 Email通知

**SendGrid / AWS SES設定:**

```typescript
// lib/notifications/email.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendAlertEmail(
  subject: string,
  body: string,
  recipients: string[]
) {
  await sgMail.send({
    from: "alerts@vns-masakinihirota.com",
    to: recipients,
    subject: `[ALERT] ${subject}`,
    html: body,
  });
}
```

---

## 4. ダッシュボード設定

### 4.1 Grafana（オプション）

**メトリクス可視化:**

- エラー率推移
- レスポンスタイム（p50, p95, p99）
- リクエスト数
- データベースクエリ実行時間

### 4.2 Vercel Dashboard

デフォルトで以下が提供される:
- デプロイログ
- 関数実行ログ
- エラーログ
- パフォーマンス統計

---

## 5. 運用チェックリスト

### 5.1 日次チェック

- [ ] エラーログ確認（Sentry Dashboard）
- [ ] ヘルスチェックステータス確認
- [ ] パフォーマンスメトリクス確認

### 5.2 週次チェック

- [ ] セキュリティイベントレビュー
- [ ] アラート頻度分析
- [ ] 誤検知アラートの調整

### 5.3 月次チェック

- [ ] アラート設定の見直し
- [ ] 閾値の調整
- [ ] 新機能の監視項目追加

---

## 6. インシデント対応フロー

### レベル1: Critical（即時対応）

- データベース完全障害
- 全体的なサービス停止
- セキュリティ侵害

**対応:**
1. Slack `@channel` で緊急通知
2. オンコールエンジニアに電話連絡
3. 15分以内に初動対応開始

### レベル2: High（30分以内）

- 部分的な機能障害
- 重大なパフォーマンス劣化
- 複数のセキュリティイベント

**対応:**
1. Slack通知
2. 担当エンジニアに連絡
3. 30分以内に対応開始

### レベル3: Medium（4時間以内）

- 軽微な機能不具合
- パフォーマンス警告
- 単発のエラー

**対応:**
1. チケット作成
2. 次の営業時間内に調査

---

## 7. 環境変数一覧

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# CloudWatch（オプション）
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# SendGrid（オプション）
SENDGRID_API_KEY=SG...

# Datadog（オプション）
NEXT_PUBLIC_DATADOG_APP_ID=...
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=...
```

---

## 参考リンク

- [Sentry Documentation](https://docs.sentry.io/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)
- [Datadog RUM](https://docs.datadoghq.com/real_user_monitoring/)
