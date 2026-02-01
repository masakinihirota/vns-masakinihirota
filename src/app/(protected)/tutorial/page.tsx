"use client";

import { ArrowRight, BookOpen, GraduationCap, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TutorialPage() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">チュートリアル</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          VNSへようこそ。ここではプラットフォームの使い方や理念、
          困ったときの解決策を見つけることができます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ストーリーチュートリアル */}
        <Card className="flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800 transition-shadow hover:shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              推奨
            </span>
          </div>
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-full bg-indigo-600 text-white shadow-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">物語を体験する</CardTitle>
            </div>
            <CardDescription>
              女王との対話を通じて、この世界の思想と操作方法を物語形式で学びます。
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4">
            <p className="text-sm mb-6 text-muted-foreground line-clamp-3">
              ゴーストとして目覚め、地図を探し、仮面（プロフィール）を手に入れるまでの旅路です。途中から再開可能です。
            </p>
            <Button
              asChild
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Link
                href="/tutorial/story"
                className="flex items-center justify-center gap-2"
              >
                物語を始める / 再開 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* 基本ガイド */}
        <Card className="flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-full bg-blue-500 text-white shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">基本ガイド</CardTitle>
            </div>
            <CardDescription>
              VNSの基本的な操作方法や画面の見方を学びます。
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4">
            <p className="text-sm mb-6 text-muted-foreground line-clamp-3">
              プロフィール作成からマッチング、クエストの進め方など、最初に知っておきたい情報をスライド形式で解説します。
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link
                href="/tutorial/basic"
                className="flex items-center justify-center gap-2"
              >
                ガイドを見る <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* ドキュメント */}
        <Card className="flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-full bg-amber-500 text-white shadow-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">ドキュメント</CardTitle>
            </div>
            <CardDescription>
              詳細な仕様やルール、用語集を確認できます。
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4">
            <p className="text-sm mb-6 text-muted-foreground line-clamp-3">
              オアシス宣言、ドリフト機能の仕組み、信頼スコアの計算方法など、VNSの世界を深く理解するための資料です。
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              <Link
                href="/tutorial/docs"
                className="flex items-center justify-center gap-2"
              >
                資料を読む <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* ヘルプ / FAQ */}
        <Card className="flex flex-col bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800 transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-full bg-emerald-500 text-white shadow-sm">
                <HelpCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">ヘルプ・FAQ</CardTitle>
            </div>
            <CardDescription>
              困ったときの解決策やよくある質問です。
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-4">
            <p className="text-sm mb-6 text-muted-foreground line-clamp-3">
              操作に迷ったときやトラブルシューティング、アカウント設定に関する疑問などはこちらを確認してください。
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
            >
              <Link
                href="/tutorial/help"
                className="flex items-center justify-center gap-2"
              >
                解決策を探す <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
