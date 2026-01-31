"use client";

import { ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-6 flex items-center text-sm text-muted-foreground">
        <Link href="/tutorial" className="hover:text-primary transition-colors">
          チュートリアル
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-semibold text-foreground">ヘルプ・FAQ</span>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">ヘルプセンター</h1>
        <p className="text-muted-foreground">
          よくある質問とトラブルシューティング
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <CardTitle>よくある質問</CardTitle>
          </div>
          <CardDescription>カテゴリー別のFAQを確認できます</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>アカウント設定の変更方法は？</AccordionTrigger>
              <AccordionContent>
                画面左下のユーザーアイコンをクリックし、「設定」メニューからプロフィールの編集やアカウント情報の変更が行えます。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>マッチングが成立しません</AccordionTrigger>
              <AccordionContent>
                プロフィール情報の充実度が高いほどマッチング精度が向上します。特に「価値観」と「スキル」の項目を詳しく入力することをお勧めします。また、ドリフト機能を使うことで予期せぬ出会いが見つかるかもしれません。
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>退会するには？</AccordionTrigger>
              <AccordionContent>
                設定ページの最下部にある「アカウント削除」から手続きが可能です。なお、削除されたデータは復元できませんのでご注意ください。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
