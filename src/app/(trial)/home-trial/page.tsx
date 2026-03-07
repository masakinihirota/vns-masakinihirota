import { cookies, headers } from "next/headers";
import Link from "next/link";
import * as Auth from "@/components/auth";

export const metadata = {
  title: "ホーム (お試し体験)",
  description: "トライアルモードでのホーム画面です",
};

/**
 * トライアル用のホーム画面
 * お試しモード専用の実装（リダイレクトループを防止）
 */
export default async function HomeTrialPage() {
  const cookieStore = await cookies();
  const sessionHdrs = await headers();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ホーム (お試し体験)
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              トライアルモードでご利用中です
            </p>
          </div>
        </div>

        {/* トライアル情報 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            お試し体験について
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            このページは本登録を行わずに masakinihirota をお試しいただけるページです。
            ここでのデータはブラウザに一時保存され、本登録時にはリセットされます。
          </p>
          <div className="flex gap-4">
            <Link
              href="/trial"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              始める
            </Link>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
