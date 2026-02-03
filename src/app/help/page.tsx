import {
  ArrowRight,
  Book,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function HelpPage() {
  const categories = [
    {
      title: "オアシス宣言 (Oasis Declaration)",
      description:
        "VNSの根幹となる最も重要な指針です。この場所が「安らぎの地」であることを守るための誓いです。",
      icon: ShieldCheck,
      href: "/oasis",
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
    {
      title: "用語集 (Glossary)",
      description:
        "オアシス宣言、人間宣言、千の仮面など、VNSの根幹となる概念や用語を解説します。",
      icon: Book,
      href: "/help/glossary",
      color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
    },
    {
      title: "議論 (Core Discussion)",

      description:
        "VNSへの批判的な意見に対する、思想的な回答と対論。より深い「なぜ」に応えます。",
      icon: Zap,
      href: "/help/discussion",
      color:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
    {
      title: "FAQ (よくある質問)",
      description:
        "機能の使い方、システムの仕組み、Amazonアソシエイト設定などの一般的な疑問にお答えします。",
      icon: HelpCircle,
      href: "/help/faq",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      title: "お問い合わせ",
      description: "解決しない場合は、運営チームまで直接お声がけください。",
      icon: MessageCircle,
      href: "/contact",
      color: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            ヘルプセンター & ドキュメント
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            VNS masakinihirota の世界観やシステムについて、詳しく解説します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group block bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-5">
                <div className={`${cat.color} p-4 rounded-2xl`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {cat.title}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-lg text-slate-400 dark:text-slate-500 italic">
            "インターネットの情報を真っ先に拾い、価値あるものへと変える場所。"
          </p>
        </div>
      </div>
    </div>
  );
}
