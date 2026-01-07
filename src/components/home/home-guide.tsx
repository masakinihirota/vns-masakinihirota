"use client";

import { BookOpen, HelpCircle, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const HomeGuide = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* チュートリアル */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-blue-500 text-white">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">チュートリアル</h3>
                            <p className="text-sm text-muted-foreground">
                                VNSの基本操作を覚える
                            </p>
                        </div>
                    </div>
                    <p className="text-sm mb-6 line-clamp-2">
                        「はじまりの国」の女王様に会って、Lvを上げながら世界観と機能を学びましょう。
                    </p>
                    <Button asChild variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href="/tutorial" className="flex items-center justify-center gap-2">
                            もっと知る <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* ドキュメント/ヘルプ */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-amber-500 text-white">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">ドキュメント</h3>
                            <p className="text-sm text-muted-foreground">
                                詳しい仕様やルールを確認
                            </p>
                        </div>
                    </div>
                    <p className="text-sm mb-6 line-clamp-2">
                        オアシス宣言やドリフトなど、VNS独自の用語や仕組みを詳しく解説します。
                    </p>
                    <Button asChild variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30">
                        <Link href="/tutorial/docs" className="flex items-center justify-center gap-2">
                            資料を読む <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* サポート/FAQ */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-emerald-500 text-white">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">ヘルプ・FAQ</h3>
                            <p className="text-sm text-muted-foreground">
                                困った時の解決策
                            </p>
                        </div>
                    </div>
                    <p className="text-sm mb-6 line-clamp-2">
                        よくある質問や、操作に迷った時のトラブルシューティングを確認できます。
                    </p>
                    <Button asChild variant="outline" className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                        <Link href="/tutorial/help" className="flex items-center justify-center gap-2">
                            ヘルプを見る <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
