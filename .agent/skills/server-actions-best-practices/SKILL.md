---
name: server-actions-best-practices
description: Next.js Server Actions を安全かつ堅牢に実装するためのベストプラクティス、バリデーション、エラーハンドリングガイド
triggers:
  - server action
  - use server
  - form handling
  - mutation
---

# Server Actions Best Practices

Next.js の Server Actions は強力ですが、不適切な実装はセキュリティリスクやバグの温床になります。このスキルでは、本番環境で安全に使用するためのパターンを定義します。

## 1. 基本原則 (Core Principles)

- **入力は信頼しない**: クライアントから送信されたデータは全て検証する。
- **認証を必須にする**: アクションの冒頭で必ず認証チェックを行う。
- **エラーは構造化して返す**: 例外をそのままスローせず、UIで扱いやすい形式で返す。
- **プログレッシブエンハンスメント**: JSが無効でも動作するように設計する（必須ではないが推奨）。

## 2. 推奨実装パターン (Recommended Pattern)

`zod` によるバリデーションと、統一されたレスポンス型を使用します。

### 型定義 (Types)

```typescript
export type ActionState<T> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>; // フィールドごとのバリデーションエラー
  data?: T;
};
```

### Server Action 実装例

```typescript
'use server'

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionState } from '@/types/action-state';

// 1. バリデーションスキーマの定義
const UpdateProfileSchema = z.object({
  fullName: z.string().min(2, '名前は2文字以上必要です').max(50),
  bio: z.string().max(160).optional(),
});

export async function updateProfile(
  prevState: ActionState<void>,
  formData: FormData
): Promise<ActionState<void>> {
  const supabase = createClient();

  // 2. 認証チェック (Security)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: '認証が必要です。' };
  }

  // 3. 入力データのパースとバリデーション (Validation)
  const validatedFields = UpdateProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: '入力内容に誤りがあります。',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, bio } = validatedFields.data;

  try {
    // 4. DB操作 (Business Logic)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, bio, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw error;

    // 5. キャッシュ更新 (Revalidation)
    revalidatePath('/profile');

    return { success: true, message: 'プロフィールを更新しました。' };
  } catch (error) {
    console.error('Profile update failed:', error);
    return { success: false, message: 'サーバーエラーが発生しました。' };
  }
}
```

## 3. セキュリティチェックリスト (Security Checklist)

- [ ] **'use server' の配置**: ファイルの先頭、または非同期関数の内部に正しく配置されているか。
- [ ] **認証/認可**: `supabase.auth.getUser()` でユーザーを確認し、リソースへのアクセス権限（RLSだけでなくアプリロジックでも）を確認しているか。
- [ ] **CSRF対策**: Server Actions はNext.jsが自動的にCSRF保護を行うが、カスタムヘッダーやOriginチェックが必要な場合もある。
- [ ] **機密情報の除外**: クライアントに戻す `data` に、パスワードハッシュや個人情報など不要なデータが含まれていないか。

## 4. クライアント側での使用 (Client Usage)

`useFormState` (React 19以降は `useActionState`) を使用して状態を管理します。

```typescript
'use client'

import { useFormState } from 'react-dom';
import { updateProfile } from './actions';

const initialState = { success: false, message: '' };

export function ProfileForm() {
  const [state, dispatch] = useFormState(updateProfile, initialState);

  return (
    <form action={dispatch}>
      <input name="fullName" required />
      {state.errors?.fullName && <p className="text-red-500">{state.errors.fullName}</p>}

      <button type="submit">Update</button>

      {state.message && (
        <p className={state.success ? "text-green-500" : "text-red-500"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

## 5. パフォーマンス (Performance)

- **直列実行の回避**: 独立した複数の非同期処理がある場合は `Promise.all` を使用する。
- **リダイレクト**:処理完了後にページ遷移する場合は `redirect()` を使用する（`try-catch` の外で呼ぶこと）。
- **バンドルサイズ**: Server Action 内で巨大なライブラリをインポートしてもクライアントバンドルには含まれないが、サーバーの起動時間には影響するため注意。
