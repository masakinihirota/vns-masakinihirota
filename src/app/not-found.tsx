"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
            <div className="max-w-md w-full text-center">
                {/* 404アイコン */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
                        <svg
                            className="w-12 h-12 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        ページが見つかりません
                    </h2>
                </div>

                {/* 説明文 */}
                <p className="text-gray-600 mb-8">
                    お探しのページは存在しないか、移動または削除された可能性があります。
                </p>

                {/* アクションボタン */}
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        トップページに戻る
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        前のページに戻る
                    </button>
                </div>

                {/* 追加情報 */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        問題が解決しない場合は、
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 underline ml-1">
                            ログインページ
                        </Link>
                        からお試しください。
                    </p>
                </div>
            </div>
        </div>
    );
}
