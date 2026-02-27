#!/usr/bin/env tsx
/**
 * 管理者ユーザー作成スクリプト
 *
 * 使用方法:
 *   pnpm tsx scripts/create-admin.ts
 *
 * または環境変数で指定:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecurePass123! pnpm tsx scripts/create-admin.ts
 */

import { sql } from 'drizzle-orm';
import { db } from '../src/lib/db/client';
import * as schema from '../src/lib/db/schema.postgres';
import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * 管理者ユーザーを作成
 */
async function createAdminUser() {
  console.log('🔧 管理者ユーザー作成スクリプト開始...\n');

  // 環境変数から取得、なければデフォルト値
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@masakinihirota.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
  const adminName = process.env.ADMIN_NAME || 'Administrator';

  console.log(`📧 メール: ${adminEmail}`);
  console.log(`👤 名前: ${adminName}`);
  console.log(`🔒 パスワード: ${'*'.repeat(adminPassword.length)}\n`);

  try {
    // 既存の管理者ユーザーをチェック
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail),
    });

    if (existingAdmin) {
      console.log('⚠️  既に同じメールアドレスのユーザーが存在します。');
      console.log(`   ユーザーID: ${existingAdmin.id}`);
      console.log(`   ロール: ${existingAdmin.role}\n`);

      // 既存ユーザーのロールを管理者に更新
      if (existingAdmin.role !== 'admin') {
        await db.update(schema.users)
          .set({ role: 'admin' })
          .where(sql`${schema.users.id} = ${existingAdmin.id}`);
        console.log('✅ 既存ユーザーのロールを "admin" に更新しました。\n');
      } else {
        console.log('✅ 既にadminロールが設定されています。\n');
      }

      return;
    }

    // パスワードをハッシュ化
    console.log('🔐 パスワードをハッシュ化中...');
    const hashedPassword = await hash(adminPassword, SALT_ROUNDS);

    // 管理者ユーザーを作成
    console.log('👤 管理者ユーザーを作成中...');
    const [newAdmin] = await db.insert(schema.users).values({
      email: adminEmail,
      name: adminName,
      role: 'admin',
      emailVerified: true, // 管理者は即座に認証済みとする
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log(`✅ 管理者ユーザーを作成しました。`);
    console.log(`   ユーザーID: ${newAdmin.id}`);
    console.log(`   メール: ${newAdmin.email}`);
    console.log(`   ロール: ${newAdmin.role}\n`);

    // パスワード認証情報を作成
    console.log('🔑 パスワード認証情報を登録中...');
    await db.insert(schema.accounts).values({
      userId: newAdmin.id,
      accountId: adminEmail, // email-password認証の場合、accountIdにメールアドレスを使用
      providerId: 'email', // Better Authのemail-password provider
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ パスワード認証情報を登録しました。\n');
    console.log('🎉 管理者ユーザーの作成が完了しました！\n');
    console.log('次のステップ:');
    console.log(`1. http://localhost:3000/login にアクセス`);
    console.log(`2. メール: ${adminEmail}`);
    console.log(`3. パスワード: ${adminPassword}`);
    console.log('4. でログインしてください。\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    if (error instanceof Error) {
      console.error('   メッセージ:', error.message);
      console.error('   スタック:', error.stack);
    }
    process.exit(1);
  }
}

// スクリプト実行
createAdminUser()
  .then(() => {
    console.log('✨ スクリプト正常終了');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 予期しないエラー:', error);
    process.exit(1);
  });
