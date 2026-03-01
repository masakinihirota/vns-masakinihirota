import Link from "next/link";
import { redirect } from "next/navigation";

import {
  GitHubLoginForm,
  GoogleLoginForm,
} from "@/components/auth";
import { getSession } from "@/lib/auth/helper";

// 動的レンダリングを強制（headers()を使用するため）
export const dynamic = 'force-dynamic';

/**
 * ログインページ
 *
 * @description
 * Google/GitHub によるソーシャルログインを提供します。
 * 既にセッションがある場合は /home へリダイレクトします。
 *
 * @returns ログイン画面コンポーネント
 */
export default async function Page() {
  const session = await getSession();

  // ログイン済みならホームへリダイレクト
  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8">
      {/* 開発者情報ヘッダー */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold">開発中 masakinihirota</h2>
        <p className="text-sm text-gray-400">
          現在の環境: {process.env.NODE_ENV}
        </p>
      </div>

      <h1 className="text-2xl font-bold mb-8">
        ユーザーの認証方法を選択してください
      </h1>

      {/* ログインフォーム */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center">
        <GoogleLoginForm className="flex-1 min-w-0" />
        <GitHubLoginForm className="flex-1 min-w-0" />
      </div>

      <Link
        href="/"
        className="text-sm text-blue-500 mt-8 hover:text-blue-400 transition-colors"
      >
        TOPページに戻る
      </Link>
    </div>
  );
}
