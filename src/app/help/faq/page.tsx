"use client";

import { ArrowLeft, MessageSquare, Plus, Minus } from "lucide-react";
import Link from "next/link";
import React from "react";

const FAQ_ITEMS = [
  {
    question: "プロフィールはいくつまで作れますか？",
    answer:
      "現在は1つのルートアカウントにつき、最大10個までのプロフィール（千の仮面）を作成できます。",
  },
  {
    question: "名前を本名にする必要はありますか？",
    answer:
      "いいえ、VNSではプライバシーを重視しており、匿名での活動を推奨しています。十二星座に基づいた匿名名の自動生成機能もぜひご活用ください。",
  },
  {
    question: "オアシス宣言を破るとどうなりますか？",
    answer:
      "誹謗中傷などの迷惑行為が確認された場合、所属グループからの「ドリフト（追放）」や、信頼継続日数の減少などのペナルティが課される場合があります。",
  },
  {
    question: "好きな作品が見つからない場合は？",
    answer:
      "検索リストにない作品は「手動入力」で自由に追加することができます。追加した作品はあなたのプロフィールに正しく反映されます。",
  },
  {
    question: "AmazonアソシエイトID（トラッキングID）は後から変更できますか？",
    answer:
      "いいえ、AmazonアソシエイトIDは一度登録すると後から変更することはできません。登録時は正確なIDを入力するようご注意ください。",
  },
  {
    question: "Amazonアソシエイト側での追加設定は必要ですか？",
    answer:
      "はい、正しく報酬を受け取るためには、Amazonアソシエイト管理画面の「Webサイト情報の登録」に本サイトのURL（https://vns-masakinihirota.com）を追加する必要があります。未登録の場合、規約違反としてアカウント停止等の対象となる恐れがあります。",
  },
  {
    question: "自分のアフィリエイトIDがリンクに使用されません。",
    answer:
      "アフィリエイトリンクへのID反映には、信頼継続日数、サイト活動度、およびメディエーター貢献度がシステム規定値を超えている必要があります。また、ペナルティを受けている期間中も反映されません。条件を満たさない場合は、運営者のIDが使用されます。",
  },
  {
    question: "アフィリエイトの免責事項を自分で表示する必要はありますか？",
    answer:
      "Amazon規約で義務付けられている「関係性の提示」については、本サイトの全ページフッターに自動的に声明を表示しています。そのため、個別の投稿等でユーザー様が手動で表示する必要はありません。",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href="/help"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-blue-200 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          ヘルプセンターに戻る
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              よくある質問
            </h1>
          </div>
          <p className="text-slate-500">
            サービス利用に関する疑問にお答えします。
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-800">
                  {item.question}
                </span>
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-slate-400" />
                )}
              </button>
              {openIndex === idx && (
                <div className="p-6 pt-0 border-t border-slate-100 bg-blue-50/30">
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 text-white space-y-4 text-center">
          <h2 className="text-xl font-bold">解決しない場合は？</h2>
          <p className="text-blue-100 text-sm">
            サポートチームが直接対応いたします。お気軽にお問い合わせください。
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
            サポートへチャットを送る
          </button>
        </div>
      </div>
    </div>
  );
}
