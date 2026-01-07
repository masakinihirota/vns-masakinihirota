import { Book, HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HelpPage() {
  const categories = [
    {
      title: "用語集 (Glossary)",
      description:
        "オアシス宣言、人間宣言、千の仮面など、VNSの根幹となる概念や用語を解説します。",
      icon: Book,
      href: "/help/glossary",
      color: "bg-teal-50 text-teal-600",
    },
    {
      title: "よくある質問 (FAQ)",
      description:
        "サービスの基本的な使い方や、困った時の解決方法をまとめています。",
      icon: HelpCircle,
      href: "/help/faq",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "お問い合わせ",
      description: "解決しない場合は、運営チームまで直接お声がけください。",
      icon: MessageCircle,
      href: "#",
      color: "bg-slate-50 text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            ヘルプセンター & ドキュメント
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            VNS masakinihirota の世界観やシステムについて、詳しく解説します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group block bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-5">
                <div className={`${cat.color} p-4 rounded-2xl`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {cat.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 text-center">
          <p className="text-sm text-slate-400 italic">
            "インターネットの情報を真っ先に拾い、価値あるものへと変える場所。"
          </p>
        </div>
      </div>
    </div>
  );
}
