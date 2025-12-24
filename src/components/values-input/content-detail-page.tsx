"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const tags = ["タグ1", "タグ2", "タグ3"];
const choices = ["選択肢1", "選択肢2", "選択肢3", "選択肢4(追加)", "選択肢5(追加)"];
const cards = [
  { title: "タイトル", url: "URL", comment: "コメント" },
  { title: "タイトル", url: "URL", comment: "コメント" },
];
const values = [1, 2, 3, 4, 5];

export default function ContentDetailPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      {/* パンくず */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <span>パンくず</span>
        <span className="mx-1">&gt;</span>
        <span>パンくず</span>
        <span className="mx-1">&gt;</span>
        <span>パンくず</span>
      </nav>
      {/* 戻る・次へ */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          className="text-blue-600 dark:text-blue-400 hover:underline px-0 py-0 h-auto font-normal"
        >
          &lt; 戻る
        </Button>
        <Button
          variant="ghost"
          className="text-blue-600 dark:text-blue-400 hover:underline px-0 py-0 h-auto font-normal"
        >
          次へ &gt;
        </Button>
      </div>
      {/* カテゴリ・番号・作成者 */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-6">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">カテゴリ</div>
            <div className="font-semibold">基本</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">番号</div>
            <div className="font-semibold">001-0001</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">作った人(管理人、ユーザー)</div>
      </div>
      {/* お題・タグ */}
      <div className="mb-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">お題</div>
        <div className="flex gap-2 mt-1">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* 選択肢リスト */}
      <div className="mb-2">
        {choices.map((choice, i) => (
          <div key={choice} className="flex items-center justify-between py-1">
            <span>{choice}</span>
            {i >= 3 && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                登録ユーザー名
                <Trash2 className="inline-block w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer" />
              </span>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          className="text-blue-600 dark:text-blue-400 hover:underline px-0 py-0 text-xs h-auto font-normal"
        >
          +追加の選択肢
        </Button>
      </div>
      {/* カード2つ */}
      <div className="space-y-3 my-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="font-semibold mb-1">{card.title}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">{card.url}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{card.comment}</div>
          </div>
        ))}
      </div>
      {/* 関連の価値観 */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">関連の価値観</div>
        <div className="flex gap-3">
          {values.map((v) => (
            <span
              key={v}
              className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 inline-block"
            />
          ))}
        </div>
      </div>
      {/* 作成日時・更新日時 */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-6">
        <span>作成日時</span>
        <span>更新日時</span>
      </div>
    </div>
  );
}
