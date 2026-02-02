"use client";

import { TutorialHeader } from "@/components/tutorial";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

const DOC_ITEMS = [
  {
    title: "オアシス宣言について",
    description: "VNSプラットフォームの理念とコミュニティガイドライン",
    href: "/oasis",
  },
  {
    title: "ドリフト機能",
    description: "偶然の出会いを創出するドリフト機能の仕組みと活用法",
    href: "#",
  },
  {
    title: "信頼スコアシステム",
    description: "相互評価と信頼スコアの算出ロジックについて",
    href: "#",
  },
  {
    title: "用語集",
    description: "VNSで使用される専門用語の解説",
    href: "#",
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <TutorialHeader title="ドキュメント" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ドキュメント</h1>
        <p className="text-muted-foreground">
          VNSの仕様やルールについての詳細資料
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DOC_ITEMS.map((item, index) => (
          <Card
            key={index}
            className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
          >
            <Link href={item.href} className="block h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-500" />
                    {item.title}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
