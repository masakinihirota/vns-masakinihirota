import Link from "next/link";
import { Button as DadsButton } from "@/components/dads";

import { AnonymousLoginForm } from "@/components/auth/anonymous-login-form";
import { GitHubLoginForm } from "@/components/auth/github-login-form";
import { GoogleLoginForm } from "@/components/auth/google-login-form";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8">
      {/* 開発者情報ヘッダー */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold">開発中 masakinihirota</h2>
        <p className="text-sm text-gray-400">現在の環境: development</p>
        <p className="text-sm text-gray-400 mt-2">
          昨日僕が感動したことを、今日の君はまだ知らない。
        </p>
        <p className="text-sm text-gray-400">ログインしていません</p>
        <div className="mt-4 p-4 border border-gray-700 rounded bg-gray-900 inline-block">
          <p className="text-xs text-gray-400 mb-2">DADS Component Verification</p>
          <div className="flex gap-2 justify-center">
            <DadsButton variant="solid-fill" size="sm">
              Solid Fill
            </DadsButton>
            <DadsButton variant="outline" size="sm">
              Outline
            </DadsButton>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-8">ユーザーの認証方法を選択してください</h1>

      {/* ログインフォーム */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center">
        <AnonymousLoginForm className="flex-1 min-w-0" />
        <GoogleLoginForm className="flex-1 min-w-0" />
        <GitHubLoginForm className="flex-1 min-w-0" />
      </div>

      <Link href="/" className="text-sm text-blue-500 mt-8 hover:text-blue-400 transition-colors">
        TOPページに戻る
      </Link>
    </div>
  );
}
