import { ArrowUpDown, ChevronDown, ChevronUp, UserX } from "lucide-react";
import { MOCK_WORKS } from "../groups.mock"; // For aggregation view
import { EvalTab, Member, SortConfig, Work } from "../groups.types";

interface EvaluationProps {
  activeSubTab: EvalTab;
  onSubTabChange: (tab: EvalTab) => void;
  isComparingSelf: boolean;
  currentUser: Member;
  selectedMember: Member;
  sortedWorks: Work[];
  sortConfig: SortConfig;
  onRequestSort: (key: SortConfig["key"]) => void;
}

export const EvaluationTab = ({
  activeSubTab,
  onSubTabChange,
  isComparingSelf,
  currentUser,
  selectedMember,
  sortedWorks,
  sortConfig,
  onRequestSort,
}: EvaluationProps) => {
  const SortIcon = ({ columnKey }: { columnKey: SortConfig["key"] }) => {
    if (sortConfig.key !== columnKey)
      return <ArrowUpDown size={10} className="inline ml-1 opacity-30" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp
        size={10}
        className="inline ml-1 text-indigo-600 dark:text-indigo-400"
      />
    ) : (
      <ChevronDown
        size={10}
        className="inline ml-1 text-indigo-600 dark:text-indigo-400"
      />
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black/90">
      <div className="bg-white/70 dark:bg-black/40 px-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar backdrop-blur-sm">
        <button
          onClick={() => onSubTabChange("matrix")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "matrix"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          一覧比較
        </button>
        <button
          onClick={() => onSubTabChange("aggregation")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "aggregation"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          集計ページ
        </button>
        <button
          onClick={() => onSubTabChange("detailed")}
          className={`py-3 px-2 text-[11px] font-bold ${
            activeSubTab === "detailed"
              ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400"
              : "text-gray-400"
          }`}
        >
          詳細比較
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeSubTab === "matrix" && (
          <div className="bg-white/50 dark:bg-black/20 min-h-full">
            {isComparingSelf ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-inner">
                  <UserX size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  他人との比較専用ページです
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                  自分自身との評価比較は表示できません。
                  <br />
                  右側のメンバーリストから比較したい相手を選択してください。
                </p>
              </div>
            ) : (
              <table className="w-full text-[11px] border-collapse sticky-header">
                <thead className="sticky top-0 bg-gray-100/90 dark:bg-black/80 z-10 border-b border-gray-300 dark:border-white/20 backdrop-blur-md">
                  <tr className="divide-x divide-gray-200 dark:divide-white/10">
                    <th
                      className="p-2 text-left font-bold text-gray-600 dark:text-gray-300 w-48 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                      onClick={() => onRequestSort("title")}
                    >
                      作品名 <SortIcon columnKey="title" />
                    </th>
                    <th
                      className="p-2 text-center font-bold text-indigo-600 dark:text-indigo-400 w-24 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                      onClick={() => onRequestSort("me")}
                    >
                      自分 <SortIcon columnKey="me" />
                    </th>
                    <th
                      className="p-2 text-center font-bold text-amber-600 w-24 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                      onClick={() => onRequestSort("target")}
                    >
                      {selectedMember.name} <SortIcon columnKey="target" />
                    </th>
                    <th className="p-2 text-center font-bold text-gray-600 dark:text-gray-300">
                      比較結果
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {sortedWorks.map((work) => {
                    const myRating = currentUser.ratings[work.id];
                    const targetRating = selectedMember.ratings[work.id];
                    const isMatch =
                      myRating === targetRating && myRating !== "unrated";
                    const isConflict =
                      (myRating === "T1" && targetRating === "NFM") ||
                      (myRating === "NFM" && targetRating === "T1");
                    const isDiscovery =
                      myRating === "unrated" && targetRating === "T1";
                    return (
                      <tr
                        key={work.id}
                        className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors divide-x divide-gray-100 dark:divide-white/5"
                      >
                        <td className="p-1.5 px-3 font-medium text-gray-700 dark:text-gray-300">
                          {work.title}
                        </td>
                        <td
                          className={`p-1.5 text-center font-bold ${
                            myRating === "T1"
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-gray-400"
                          }`}
                        >
                          {myRating}
                        </td>
                        <td
                          className={`p-1.5 text-center font-bold ${
                            targetRating === "T1"
                              ? "text-amber-600"
                              : "text-gray-400"
                          }`}
                        >
                          {targetRating}
                        </td>
                        <td className="p-1.5 px-3 text-center">
                          {isMatch && (
                            <span className="text-green-600 dark:text-green-400 font-bold text-[9px]">
                              共鳴
                            </span>
                          )}
                          {isConflict && (
                            <span className="text-red-500 font-bold text-[9px]">
                              ギャップ
                            </span>
                          )}
                          {isDiscovery && (
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-0.5 rounded text-[8px] transition-colors">
                              布教希望
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeSubTab === "aggregation" && (
          <div className="bg-white/50 dark:bg-black/20 min-h-full p-0">
            <table className="w-full text-[11px] border-collapse sticky-header">
              <thead className="sticky top-0 bg-gray-50/90 dark:bg-black/80 z-10 border-b-2 border-gray-200 dark:border-white/10 backdrop-blur-md">
                <tr className="divide-x divide-gray-100 dark:divide-white/5">
                  <th className="p-2 text-left font-bold text-gray-500 dark:text-gray-400 min-w-[200px]">
                    作品タイトル
                  </th>
                  <th className="p-2 text-center text-indigo-600 dark:text-indigo-400 font-black">
                    T1 (神)
                  </th>
                  <th className="p-2 text-center text-blue-600 dark:text-blue-400 font-black">
                    T2 (好)
                  </th>
                  <th className="p-2 text-center text-gray-600 dark:text-gray-400 font-black">
                    T3 (普)
                  </th>
                  <th className="p-2 text-center text-red-500 dark:text-red-400 font-black">
                    NFM
                  </th>
                  <th className="p-2 text-center text-gray-300 dark:text-gray-600 font-black">
                    未評価
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {MOCK_WORKS.map((work) => (
                  <tr
                    key={work.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/5 group divide-x divide-gray-50 dark:divide-white/5 transition-colors"
                  >
                    <td className="p-1.5 px-4 font-bold text-gray-700 dark:text-gray-300 truncate">
                      {work.title}
                    </td>
                    <td className="p-1.5 text-center font-bold bg-indigo-50/20 dark:bg-indigo-900/20">
                      {work.tiers.t1}
                    </td>
                    <td className="p-1.5 text-center dark:text-gray-400">
                      {work.tiers.t2}
                    </td>
                    <td className="p-1.5 text-center text-gray-500 dark:text-gray-500">
                      {work.tiers.t3}
                    </td>
                    <td className="p-1.5 text-center text-red-400">
                      {work.tiers.nfm}
                    </td>
                    <td className="p-1.5 text-center text-gray-300 dark:text-gray-600">
                      {work.tiers.unrated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
