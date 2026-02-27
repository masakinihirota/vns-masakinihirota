import * as Concept from "@/components/concept";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "価値観サイトのコンセプト | 幽霊から実体へ",
  description: "幽霊（匿名）から実体（プロフィール）へと変化し、価値観で繋がる「価値観サイト」の仕組みを解説します。",
};

/**
 * 価値観サイトコンセプト説明ページ
 * ネームスペースインポートを利用してコンポーネントを配置
 */
export default function ConceptPage() {
  return (
    <main className="min-h-screen py-12">
      <Concept.ConceptContainer />
    </main>
  );
}
