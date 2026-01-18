import { BookOpen, Briefcase, Trash2, Plus } from "lucide-react";
import React from "react";

interface Step3OwnWorksProps {
  formData: {
    ownWorks: { id: number; title: string; url: string }[];
  };
  addOwnWork: () => void;
  updateOwnWork: (id: number, field: "title" | "url", value: string) => void;
  removeOwnWork: (id: number) => void;
}

export const Step3OwnWorks = ({
  formData,
  addOwnWork,
  updateOwnWork,
  removeOwnWork,
}: Step3OwnWorksProps) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-4 mb-8">
        <p className="text-blue-800 dark:text-blue-200 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          入力したい項目だけ埋めてください。すべて任意です。
        </p>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            自分の作った作品
          </h2>
        </div>

        <div className="space-y-3 max-w-2xl">
          {formData.ownWorks.map((work) => (
            <div
              key={work.id}
              className="flex flex-col gap-2 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm animate-in slide-in-from-left-2"
            >
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      作品名・活動名
                    </label>
                    <input
                      type="text"
                      placeholder="例: オリジナル漫画「〇〇」、個人ブログ、YouTubeチャンネルなど"
                      value={work.title}
                      onChange={(e) =>
                        updateOwnWork(work.id, "title", e.target.value)
                      }
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      URL (任意)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={work.url}
                      onChange={(e) =>
                        updateOwnWork(work.id, "url", e.target.value)
                      }
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-orange-500 outline-none text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeOwnWork(work.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors mt-6"
                  title="削除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addOwnWork}
            disabled={formData.ownWorks.some((w) => !w.title.trim())}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors ${
              formData.ownWorks.some((w) => !w.title.trim())
                ? "text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                : "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            }`}
          >
            <Plus className="w-4 h-4" />
            作品を追加する
          </button>
        </div>
      </section>
    </div>
  );
};
