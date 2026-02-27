import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
    const session = await auth.api.getSession({ headers: await headers() });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* ヘッダー */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ようこそ、{session?.user?.name || "ゲスト"}さん
                    </h1>
                    <p className="text-gray-600">
                        認証済みユーザー専用のホームページです
                    </p>
                </div>

                {/* ユーザー情報カード */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        アカウント情報
                    </h2>
                    <dl className="grid grid-cols-1 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">ユーザーID</dt>
                            <dd className="mt-1 text-sm text-gray-900 font-mono">
                                {session?.user?.id || "N/A"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {session?.user?.email || "N/A"}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">ロール</dt>
                            <dd className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session?.user?.role === "admin"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}>
                                    {session?.user?.role || "user"}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* クイックアクション */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        クイックアクション
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {session?.user?.role === "admin" && (
                            <Link
                                href="/admin"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-900">管理画面</p>
                                    <p className="text-sm text-gray-500">システム設定・ユーザー管理</p>
                                </div>
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">トップページ</p>
                                <p className="text-sm text-gray-500">ランディングページに戻る</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
