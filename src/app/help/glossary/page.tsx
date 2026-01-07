import { ArrowLeft, BookOpen, Quote } from "lucide-react";
import Link from "next/link";
import React from "react";

const GLOSSARY_ITEMS = [
  {
    id: "vns",
    term: "VNS (Value Network Service)",
    category: "基本概念",
    description:
      "価値観でつながる新しいネットワークサービス。SNSが社会的なつながりを重視するのに対し、VNSは個人の価値観を尊重し、同じ価値観を持つ人同士のつながりを支援します。",
  },
  {
    id: "oasis",
    term: "オアシス宣言",
    category: "基本概念",
    description:
      "本サービスにおけるコミュニティ運営の基本理念。誹謗中傷のない、安心・安全なインターネット上の「オアシス」を目指す宣言です。",
    motto:
      "褒めるときは大きな声でみんなの前で、叱るときは二人きりで小さな声で。",
    details: [
      "インターネット上で翼を休める場所、砂漠の中で命の水を授かる場所を作ります。",
      "共通の価値観を持った人々のオアシスという場所を作ります。",
      "お互いの価値観を認めるのならば、誰もが参加できます。",
      "きれいな世界、優しい世界を守り、広めます。",
    ],
  },
  {
    id: "human",
    term: "人間宣言",
    category: "基本概念",
    description:
      "人は完璧ではなく間違いを犯す生き物であり、そこから立ち直り再挑戦（リスタート）することができるという考え方。包容力を持って見守り、成長を促す環境を整えることを目指します。",
    details: [
      "人は間違いを犯したり、再挑戦することができる。それを認めて欲しい。",
      "人は成長する生き物であり、失敗を通じて学び、次に活かすことができる。",
      "一度言ったことを撤回したり、考えを変えることは悪いことではない。過去の発言は過去の自分、現在の発言は現在の自分である。",
    ],
  },
  {
    id: "thousand-masks",
    term: "千の仮面 (Thousand Masks)",
    category: "基本概念",
    description:
      "1つのルートアカウントから複数の「ユーザープロフィール（仮面）」を作成できる機能。仕事、遊び、趣味など、目的ごとに仮面を使い分けることで、それぞれの文脈に合わせたマッチングを行います。",
  },
  {
    id: "schrodinger-cat",
    term: "シュレディンガーの猫主義",
    category: "基本概念",
    description:
      "相反する価値観が同時に存在することを認め、自分に合う世界だけを観測（選択）し、合わない世界には干渉しない生き方。観測するまで世界は確定しないという量子力学の例えを元にした、VNSの根幹システムです。",
  },
  {
    id: "drift",
    term: "ドリフト (Drift / No BAN)",
    category: "モデレーション",
    description:
      "VNSには「BAN（アカウント削除）」がありません。代わりに、所属していたコミュニティから物理的・心理的に距離を置かれる「Drift（漂流）」状態となります。存在は消されませんが、居場所を失うことで自己規律を促す仕組みです。",
  },
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/help"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors group"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-teal-200 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          ヘルプセンターに戻る
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 p-3 rounded-2xl shadow-lg shadow-teal-100">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              用語集
            </h1>
          </div>
          <p className="text-slate-500">
            VNSの世界を理解するためのキーワードをまとめています。
          </p>
        </div>

        <div className="space-y-6">
          {GLOSSARY_ITEMS.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 scroll-mt-8 hover:border-teal-200 transition-colors"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    {item.term}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-widest border border-slate-200">
                    {item.category}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>

                {item.motto && (
                  <div className="bg-teal-50/50 border-l-4 border-teal-500 p-4 rounded-r-xl">
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                      <p className="text-teal-700 font-bold italic leading-relaxed">
                        {item.motto}
                      </p>
                    </div>
                  </div>
                )}

                {item.details && (
                  <ul className="grid grid-cols-1 gap-3 mt-2">
                    {item.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">
            お探しの用語は見つかりましたか？
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/help/faq"
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-teal-200 hover:text-teal-600 transition-all shadow-sm"
            >
              FAQを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
