import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Heart,
  HelpCircle,
  History as HistoryIcon,
  UserCircle,
} from "lucide-react";

import { MOCK_VALUES_TOPICS } from "../groups.mock"; // Static topics
import { Member, ValueSelection } from "../groups.types";

interface ValuesProperties {
  openTopicId: string | null;
  onToggleTopic: (id: string | null) => void;
  userValueSelections: Record<string, ValueSelection>;
  selectedMember: Member;
  onValueChange: (topicId: string, choice: string) => void;
  onTierChange: (topicId: string, tier: string) => void;
}

export const ValuesTab = ({
  openTopicId,
  onToggleTopic,
  userValueSelections,
  selectedMember,
  onValueChange,
  onTierChange,
}: ValuesProperties) => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Heart className="text-rose-500" /> 共通の価値観の比較
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            右側のメンバーを選択してお題を押すと、自分との価値観の差が表示されます。
          </p>
        </div>
        <div className="flex gap-2 items-center bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm animate-in fade-in zoom-in duration-300">
          <UserCircle
            size={16}
            className="text-indigo-600 dark:text-indigo-400"
          />
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-tighter">
            ターゲット: {selectedMember.name}
          </span>
        </div>
      </div>

      <div className="space-y-3 pb-8">
        {MOCK_VALUES_TOPICS.map((topic) => {
          const isOpen = openTopicId === topic.id;
          const myValue = userValueSelections[topic.id];
          const targetValue = selectedMember.values[topic.id];

          // 比較ロジック
          const isIdentical =
            myValue && targetValue && myValue.choice === targetValue.choice;
          const isDifferent =
            myValue && targetValue && myValue.choice !== targetValue.choice;

          // 色の決定
          let bgClass = "bg-white/70 dark:bg-white/5";
          let borderClass = "border-white/20 dark:border-white/10";
          if (isIdentical) {
            bgClass = "bg-green-50/50 dark:bg-green-900/10";
            borderClass = "border-green-200 dark:border-green-800";
          }
          if (isDifferent) {
            bgClass = "bg-orange-50/50 dark:bg-orange-900/10";
            borderClass = "border-orange-200 dark:border-orange-800";
          }
          if (isOpen) {
            borderClass +=
              " ring-2 ring-indigo-200 dark:ring-indigo-800 ring-offset-1 dark:ring-offset-black";
          }

          const lastUpdated = myValue
            ? new Date(myValue.lastUpdated || "")
            : null;
          const isLocked =
            lastUpdated &&
            Date.now() - lastUpdated.getTime() > 24 * 60 * 60 * 1000;

          return (
            <div
              key={topic.id}
              className={`rounded-xl border shadow-sm transition-all duration-300 backdrop-blur-md overflow-hidden ${bgClass} ${borderClass}`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => onToggleTopic(isOpen ? null : topic.id)}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                  isOpen
                    ? "bg-black/5 dark:bg-white/5"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-sm ${
                      myValue?.tier === "T1"
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-white/10 text-gray-400 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {myValue?.tier || "-"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      {topic.title}
                      {isIdentical && (
                        <span className="text-[9px] bg-green-200 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 rounded uppercase font-bold tracking-tighter">
                          Match
                        </span>
                      )}
                      {isDifferent && (
                        <span className="text-[9px] bg-orange-200 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-1.5 rounded uppercase font-bold tracking-tighter">
                          Different
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-1 items-center">
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                        {topic.category}
                      </span>
                      {myValue && (
                        <span className="text-[9px] bg-white dark:bg-white/10 border border-gray-100 dark:border-gray-700 px-2 py-0.5 rounded-full text-indigo-600 dark:text-indigo-400 font-bold shadow-sm">
                          自分: {myValue.choice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {targetValue && (
                    <div className="hidden md:flex flex-col items-end border-l border-black/10 dark:border-white/10 pl-4">
                      <span className="text-[9px] text-gray-400 font-bold">
                        {selectedMember.name}:
                      </span>
                      <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase">
                        {targetValue.choice} (T
                        {targetValue.tier.replace("T", "")})
                      </span>
                    </div>
                  )}
                  {isOpen ? (
                    <ChevronDown size={18} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="p-6 border-t border-black/5 dark:border-white/5 grid grid-cols-12 gap-8 animate-in slide-in-from-top-2 duration-300">
                  {/* Selection Area */}
                  <div className="col-span-12 lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                        <HelpCircle size={14} /> お題の詳細
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase">
                        自分の回答を選択
                      </h4>
                      <div className="flex gap-3">
                        {topic.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => onValueChange(topic.id, opt)}
                            className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm shadow-sm transition-all ${
                              myValue?.choice === opt
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-white dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-500 hover:border-indigo-200 dark:hover:border-indigo-800"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase">
                        重要度 (Tier)
                      </h4>
                      <div className="flex gap-2">
                        {["T1", "T2", "T3"].map((t) => (
                          <button
                            key={t}
                            onClick={() => onTierChange(topic.id, t)}
                            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                              myValue?.tier === t
                                ? "bg-gray-800 dark:bg-gray-100 text-white dark:text-black border-gray-800 dark:border-gray-100"
                                : "bg-white/50 dark:bg-white/5 text-gray-400 border-gray-100 dark:border-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {t} {t === "T1" && "(最重要)"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isLocked ? (
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-500 text-[10px] font-bold shadow-inner">
                        <AlertCircle size={14} />
                        確定ログ:
                        24時間を経過したため本日の回答は固定されました。
                      </div>
                    ) : (
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold shadow-inner">
                        <Clock size={14} />
                        編集中: 24時間以内なら何度でも変更可能（履歴は1日1回）
                      </div>
                    )}
                  </div>

                  {/* Comparison Panel */}
                  <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div
                      className={`rounded-xl p-5 border shadow-sm ${
                        isIdentical
                          ? "bg-green-100/50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                          : (isDifferent
                            ? "bg-orange-100/50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800"
                            : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10")
                      }`}
                    >
                      <h4
                        className={`text-[10px] font-black uppercase mb-4 flex items-center gap-2 ${
                          isIdentical
                            ? "text-green-700 dark:text-green-300"
                            : "text-indigo-700 dark:text-indigo-300"
                        }`}
                      >
                        {isIdentical
                          ? " 感性の共鳴 "
                          : (isDifferent
                            ? " 感性の乖離 "
                            : " 未比較 ")}
                      </h4>
                      <div className="flex items-center justify-around py-2">
                        <div className="text-center">
                          <div className="text-xl mb-1">😎</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase mb-1 tracking-tighter">
                            自分
                          </div>
                          <div className="text-sm font-black text-indigo-700 dark:text-indigo-300">
                            {myValue?.choice || "?"}
                          </div>
                        </div>
                        <div className="h-10 w-px bg-black/10 dark:bg-white/10"></div>
                        <div className="text-center">
                          <div className="text-xl mb-1">
                            {selectedMember.avatar}
                          </div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase mb-1 tracking-tighter">
                            {selectedMember.name}
                          </div>
                          <div className="text-sm font-black text-indigo-700 dark:text-indigo-300">
                            {targetValue?.choice || "?"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 text-[10px] font-medium text-gray-600 dark:text-gray-300 leading-tight">
                        {isIdentical
                          ? `二人とも「${myValue.choice}」を重視しています。プロジェクトの方向性が一致しやすく、スムーズな意思決定が期待できます。`
                          : (isDifferent
                            ? `「${myValue.choice}」派のあなたと「${targetValue.choice}」派の${selectedMember.name}さん。視点の違いを対話することで、より深い洞察が得られる可能性があります。`
                            : "相手の回答データが存在しません。")}
                      </div>
                    </div>

                    <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-black/5 dark:border-white/5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-widest">
                        <HistoryIcon size={14} /> 履歴ログ
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] border-b border-black/5 dark:border-white/5 pb-2">
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            本日 ({new Date().getMonth() + 1}/
                            {new Date().getDate()})
                          </span>
                          <span className="font-black text-indigo-600 dark:text-indigo-400">
                            {myValue?.choice || "未回答"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] opacity-40">
                          <span className="text-gray-400 font-medium">
                            昨日
                          </span>
                          <span className="font-bold text-gray-400">---</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
