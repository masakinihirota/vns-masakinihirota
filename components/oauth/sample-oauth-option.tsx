import Link from "next/link";
import type React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TbUserQuestion } from "react-icons/tb";

// Correct the import path or create the missing 'badge' component if it doesn't exist
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthOptions() {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        ユーザーの認証方法を選択してください
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 匿名認証 */}
        <AuthOptionCard
          title="匿名認証"
          icon={<TbUserQuestion className="h-6 w-6" />}
          href="/anonymous-client"
          features={[
            { label: "ルートアカウント", value: "1" },
            { label: "ユーザープロフィール", value: "3枚" },
            { label: "所持ポイント", value: "500" },
            { label: "価値観登録", value: "NG", isNegative: true },
            { label: "作品登録", value: "NG", isNegative: true },
            { label: "タグ登録", value: "NG", isNegative: true },
            { label: "データ読み込み", value: "OK" },
            { label: "データ保存", value: "NG", isNegative: true },
            { label: "データ削除", value: "NG", isNegative: true },
            { label: "広告", value: "あり強制", isNegative: true },
            { label: "オアシス宣言", value: "なし", isNegative: true },
          ]}
        />

        {/* Google認証 */}
        <AuthOptionCard
          title="Google認証"
          icon={<FcGoogle className="h-6 w-6" />}
          href="/oauth-google"
          features={[
            { label: "ルートアカウント", value: "1" },
            { label: "ユーザープロフィール", value: "10枚" },
            { label: "所持ポイント", value: "1000" },
            { label: "価値観登録", value: "OK" },
            { label: "作品登録", value: "OK" },
            { label: "タグ登録", value: "OK" },
            { label: "データ読み込み", value: "OK" },
            { label: "データ保存", value: "OK" },
            { label: "データ削除", value: "OK" },
            { label: "広告", value: "選択可能" },
            { label: "オアシス宣言", value: "あり" },
          ]}
        />

        {/* GitHub認証 */}
        <AuthOptionCard
          title="GitHub認証"
          icon={<FaGithub className="h-6 w-6" />}
          href="/oauth-github"
          features={[
            { label: "ルートアカウント", value: "1" },
            { label: "ユーザープロフィール", value: "15枚" },
            { label: "所持ポイント", value: "2500" },
            { label: "価値観登録", value: "OK" },
            { label: "作品登録", value: "OK" },
            { label: "タグ登録", value: "OK" },
            { label: "データ読み込み", value: "OK" },
            { label: "データ保存", value: "OK" },
            { label: "データ削除", value: "OK" },
            { label: "広告", value: "選択可能" },
            { label: "オアシス宣言", value: "あり" },
          ]}
        />
      </div>
    </div>
  );
}

interface FeatureItem {
  label: string;
  value: string;
  isNegative?: boolean;
}

interface AuthOptionCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  features: FeatureItem[];
}

function AuthOptionCard({ title, icon, href, features }: AuthOptionCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-md border-2 border-green-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="space-y-1 text-sm">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex justify-between"
            >
              <span className="font-medium">{feature.label}:</span>
              <span
                className={
                  feature.isNegative ? "text-red-500" : "text-green-600"
                }
              >
                {feature.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant="default"
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium transition-colors"
        >
          <Link
            href={href}
            className="text-white dark:text-white px-6"
          >
            サインイン
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
