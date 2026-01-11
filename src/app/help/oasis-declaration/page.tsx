import {
  ShieldCheck,
  Info,
  Heart,
  Ghost,
  Globe,
  Star,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function OasisDeclarationPage() {
  const principles = [
    {
      icon: Ghost,
      title: "翼を休める場所の提供",
      description:
        "インターネットの喧騒から離れ、砂漠の中の『命の水』を授かるような、心安らぐ場所を創造します。",
    },
    {
      icon: Globe,
      title: "ユーザー主導の環境",
      description:
        "不本意な広告や情報に翻弄されるのではなく、ユーザー自身が環境の主導権を握ります。",
    },
    {
      icon: Star,
      title: "共通価値観のコミュニティ",
      description:
        "高い倫理性と共通の価値観を持った人々が集う、真のオアシスとして機能します。",
    },
    {
      icon: ShieldCheck,
      title: "相互承認による参加",
      description:
        "お互いの価値観を認め合う心があれば、出自や立場を問わず、誰もが自由に参加できます。",
    },
    {
      icon: Heart,
      title: "優しい世界の維持と拡大",
      description:
        "きれいな世界、優しい世界をみんなで守り、次の世代へと広めていくことを誓います。",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* ヒーローセクション */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-sm font-black tracking-widest uppercase">
            <ShieldCheck className="w-5 h-5" />
            最上位の誓い
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter">
            オアシス宣言
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            インターネットという情報の洪水の中で、
            <br className="hidden md:block" />
            VNSが「安らぎの場所」であることを内外に宣言します。
          </p>
        </div>

        {/* モットー */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Info className="w-32 h-32" />
          </div>
          <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
            Our Motto
          </h2>
          <blockquote className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-snug">
            「褒めるときは大きな声でみんなの前で、
            <br />
            叱るときは二人きりで小さな声で。」
          </blockquote>
        </div>

        {/* 宣言の5ヶ条 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, idx) => (
            <div
              key={p.title}
              className={`p-8 rounded-[2.5rem] border transition-all ${
                idx === 4
                  ? "md:col-span-2 bg-teal-600 border-teal-500 text-white"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start gap-6">
                <div
                  className={`p-4 rounded-2xl ${idx === 4 ? "bg-white/20 text-white" : "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"}`}
                >
                  <p.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3
                    className={`text-xl font-bold ${idx === 4 ? "text-white" : "text-slate-800 dark:text-white"}`}
                  >
                    {idx + 1}. {p.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${idx === 4 ? "text-teal-50" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {p.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 同意の重みについての解説 */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-[3rem] p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-red-100 dark:bg-red-900/40 p-6 rounded-3xl">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-red-800 dark:text-red-400">
                同意しない場合の制限
              </h2>
              <p className="text-red-700 dark:text-red-300 leading-relaxed">
                オアシス宣言を「守る」ことができない方は、VNSのすべての書き込み・表現機能を制限されます。
                <br />
                世界を観測（ウォッチ）することは可能ですが、オアシスの平穏を守るため、その一部となることは叶いません。
              </p>
            </div>
          </div>
        </div>

        {/* フッターリンク */}
        <div className="text-center pt-8">
          <Link
            href="/user-profiles/new"
            className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-black hover:gap-4 transition-all"
          >
            プロフィール作成（価値観の登録）に戻る
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
