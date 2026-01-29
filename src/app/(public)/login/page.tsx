import Link from "next/link";
import { AnonymousLoginForm } from "@/components/auth/anonymous-login-form";
import { GitHubLoginForm } from "@/components/auth/github-login-form";
import { GoogleLoginForm } from "@/components/auth/google-login-form";


export default async function Page(props: {
  searchParams?: Promise<{
    type?: string;
    error?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const isTrialMode =
    searchParams?.type === "trial" ||
    searchParams?.error === "anonymous_sign_in_failed";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8">
      {/* 開発者情報ヘッダー */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold">
          {isTrialMode ? "ゲスト・お試しログイン" : "開発中 masakinihirota"}
        </h2>
        <p className="text-sm text-gray-400">
          {isTrialMode
            ? "お名前やパスワードを登録せずに、今すぐサービスを体験できます。"
            : `現在の環境: ${process.env.NODE_ENV}`}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          昨日僕が感動したことを、今日の君はまだ知らない。
        </p>
      </div>

      <h1 className="text-2xl font-bold mb-8">
        {isTrialMode
          ? "匿名ログインで体験を開始する"
          : "ユーザーの認証方法を選択してください"}
      </h1>

      {/* ログインフォーム */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center">
        <AnonymousLoginForm
          className={isTrialMode ? "max-w-md mx-auto" : "flex-1 min-w-0"}
        />

        {!isTrialMode && (
          <>
            <GoogleLoginForm className="flex-1 min-w-0" />
            <GitHubLoginForm className="flex-1 min-w-0" />
          </>
        )}
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
