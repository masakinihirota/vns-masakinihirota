---
description: ユーザー生成コンテンツ（UGC）のモデレーションパターンと実装ガイド
triggers:
  - moderation
  - ugc
  - safety
  - report
---

# Content Moderation Patterns Skill

## 概要

このスキルは、VNS masakinihirotaプロジェクトにおける**コンテンツモデレーション**の実装パターンとベストプラクティスを提供します。
ユーザー生成コンテンツ（UGC: User Generated Content）の健全性を保ち、プラットフォームの安全性を確保するための技術的なアプローチを定義します。

## 適用タイミング

- プロフィール、グループ、コメントなどの投稿機能実装時
- 通報（Report）機能の実装時
- 自動モデレーション機能の設計時
- 管理画面（Admin Console）のモデレーションツール実装時

## モデレーションのアプローチ

### 1. Pre-Moderation (事前承認)

投稿が公開される前にチェックを行う方式。

**適用箇所**:
- 全体公開のイベント作成
- 公式認定マークの申請

### 2. Post-Moderation (事後確認)

投稿は即時公開され、その後にチェックを行う方式。

**適用箇所**:
- 通常の投稿、コメント
- プロフィール更新

### 3. Reactive Moderation (通報ベース)

ユーザーからの通報に基づいて対応する方式。

**適用箇所**:
- DM（ダイレクトメッセージ）
- クローズドなグループ内のやり取り

### 4. Automated Moderation (自動検知)

AIやキーワードフィルタリングを用いて自動的に処理する方式。

**適用箇所**:
- 全テキストコンテンツ（NGワード、スパム検知）
- 画像コンテンツ（不適切な画像の検知）

## データベース設計

### 1. コンテンツレポート（通報）

```sql
CREATE TYPE report_reason AS ENUM (
  'spam',
  'harassment',
  'hate_speech',
  'violence',
  'sexual',
  'other'
);

CREATE TYPE report_status AS ENUM (
  'pending',
  'investigating',
  'resolved',
  'dismissed'
);

CREATE TABLE content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES user_profiles(id),
  target_type VARCHAR(50) NOT NULL, -- 'profile', 'comment', 'group', 'item'
  target_id UUID NOT NULL,
  reason report_reason NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  resolution_note TEXT,
  resolved_by UUID REFERENCES user_profiles(id), -- 管理者
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_reports_status ON content_reports(status);
CREATE INDEX idx_content_reports_target ON content_reports(target_type, target_id);
```

### 2. モデレーションアクションログ

```sql
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID REFERENCES user_profiles(id), -- システムの場合はNULLまたは専用ID
  target_user_id UUID NOT NULL REFERENCES user_profiles(id),
  action_type VARCHAR(50) NOT NULL, -- 'warn', 'ban', 'delete_content', 'suspend'
  reason TEXT,
  duration_hours INTEGER, -- 一時停止の場合
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 自動モデレーションの実装

### 1. テキストフィルタリング（NGワード）

```typescript
// utils/moderation.ts

const NG_WORDS = ['badword1', 'badword2', 'spam_url']; // 実際はDBや外部辞書からロード

/**
 * 下品な言葉や禁止用語をチェック
 */
export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s+/g, '');
  return NG_WORDS.some(word => normalized.includes(word));
}

/**
 * テキスト投稿の検証フック
 */
export async function validateContent(text: string): Promise<ValidationResult> {
  if (containsProfanity(text)) {
    return {
      isValid: false,
      reason: 'inappropriate_content',
      message: '不適切な表現が含まれています。'
    };
  }

  // 外部AIサービス（OpenAI Moderation API等）によるチェック
  const aiCheck = await checkWithAI(text);
  if (!aiCheck.safe) {
     return {
      isValid: false,
      reason: 'ai_flagged',
      message: 'コンテンツポリシーに違反する可能性があります。'
    };
  }

  return { isValid: true };
}
```

### 2. AIを活用した画像検知（概要）

Cloud Vision APIやAWS Rekognition、またはOpenAI Vision Modelを使用して、アップロードされた画像をチェックします。

```typescript
import { analyzeImage } from './ai-service';

export async function checkImageSafety(imageUrl: string): Promise<boolean> {
  const analysis = await analyzeImage(imageUrl);

  // アダルト、暴力、医療画像などをチェック
  if (analysis.adult > 0.8 || analysis.violence > 0.8) {
    return false; // 安全でない
  }

  return true;
}
```

## 通報機能の実装（Server Actions）

```typescript
// app/actions/report.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const reportSchema = z.object({
  targetType: z.enum(['profile', 'comment', 'group']),
  targetId: z.string().uuid(),
  reason: z.enum(['spam', 'harassment', 'hate_speech', 'violence', 'sexual', 'other']),
  description: z.string().max(1000).optional(),
});

export async function submitReport(data: z.infer<typeof reportSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // バリデーション
  const validated = reportSchema.parse(data);

  // DB保存
  const { error } = await supabase
    .from('content_reports')
    .insert({
      reporter_id: user.id,
      target_type: validated.targetType,
      target_id: validated.targetId,
      reason: validated.reason,
      description: validated.description,
    });

  if (error) {
    console.error('Report submission failed:', error);
    throw new Error('Failed to submit report');
  }

  // 重大な違反（例: 殺害予告など）の場合、即時Slack通知などを送る処理をここに挟む
  if (validated.reason === 'violence') {
    await notifyAdmins(validated);
  }

  return { success: true };
}
```

## ベストプラクティス

### ✅ DO
1. **透明性の確保**: ユーザーに対して、何が違反でどのような措置が取られたかを明確に伝える（ただし、検知ロジックの詳細は隠す）。
2. **段階的なペナルティ**: 初回の軽微な違反には警告、繰り返しには一時停止、悪質なものにはBANと段階を設ける。
3. **誤検知への対応 (Appeal)**: ユーザーがBANや削除に対して異議申し立てできるプロセスを用意する。
4. **モデレーターのケア**: 有害なコンテンツを見続けるモデレーターの精神的負担を考慮し、AIによる事前フィルタリングを活用する。

### ❌ DON'T
1. **クライアントサイドだけのチェック**: 必ずサーバーサイドでもバリデーションを行う。
2. **過剰な検閲**: 文脈を無視した単純なキーワードマッチングで正当な発言まで削除しないように注意する。
3. **通報者の情報開示**: 通報者が誰かは、対象ユーザーには絶対に見せない。

## チェックリスト

- [ ] コンテンツレポートテーブル `content_reports` の作成
- [ ] モデレーションログテーブル `moderation_logs` の作成
- [ ] テキスト投稿時のNGワード/AIチェックの実装
- [ ] 画像アップロード時の安全性チェックの実装
- [ ] ユーザーからの通報UIとAPIの実装
- [ ] 管理者向けモデレーション画面（レポート一覧・対応）の実装
