import { Briefcase, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import React from "react";
import { WorkItem } from "./types";

interface Step2OwnWorksProps {
  ownWorks: WorkItem[];
  addOwnWork: () => void;
  updateOwnWork: (id: number, field: "title" | "url", value: string) => void;
  removeOwnWork: (id: number) => void;
}

export const Step2OwnWorks: React.FC<Step2OwnWorksProps> = ({
  ownWorks,
  addOwnWork,
  updateOwnWork,
  removeOwnWork,
}) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
        <p className="text-blue-800 text-sm flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          あなたが制作した作品（漫画、小説、ゲームなど）があれば登録してください。
        </p>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            自分の作品の登録
          </h2>
        </div>

        <div className="space-y-4 max-w-3xl">
          {ownWorks.map((work) => (
            <div
              key={work.id}
              className="flex flex-col md:flex-row gap-3 animate-in slide-in-from-left-2 items-start bg-slate-50 p-4 rounded-xl border border-slate-200"
            >
              <div className="flex-1 w-full space-y-3">
                <input
                  type="text"
                  placeholder="作品タイトルを入力"
                  value={work.title}
                  onChange={(e) =>
                    updateOwnWork(work.id, "title", e.target.value)
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  autoFocus={!work.title}
                />
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    placeholder="URL (任意)"
                    value={work.url || ""}
                    onChange={(e) =>
                      updateOwnWork(work.id, "url", e.target.value)
                    }
                    className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => removeOwnWork(work.id)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start md:mt-0"
                title="削除"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            onClick={addOwnWork}
            disabled={ownWorks.some(
              (work) => !work.title.trim() || !work.url.trim()
            )}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm transition-colors py-2 px-1 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:scale-125" />
            別の作品を追加する
          </button>
        </div>
      </section>
    </div>
  );
};
