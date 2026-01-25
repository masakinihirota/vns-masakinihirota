import { X, Heart } from "lucide-react";
import React from "react";

interface RatingHelpModalProps {
  onClose: () => void;
  context: "WORKS" | "VALUES";
}

export const RatingHelpModal = ({ onClose, context }: RatingHelpModalProps) => {
  const isWorks = context === "WORKS";

  const content = {
    WORKS: {
      like: {
        title: "LIKE",
        desc: "Tier1~3のすべてを包括する「好き」という感情です。システム上はTier1（最も好き）として扱われます。",
      },
      tier: {
        desc: "作品に対する「好き」の熱量を段階的に表現します。",
        t1: {
          title: "最も好きな作品",
          desc: "人生に影響を与えた、特別な作品。",
        },
        t2: { title: "非常に好きな作品", desc: "何度も見返したくなる作品" },
        t3: { title: "好きな作品", desc: "普通に面白い、また見たい作品。" },
      },
    },
    VALUES: {
      like: {
        title: "重視する",
        desc: "その価値観を「重視する」かどうかを選びます。システム上はTier1（最も重視）として扱われます。",
      },
      tier: {
        desc: "価値観の重要度を段階的に表現します。",
        t1: { title: "最も重要", desc: "譲れない中心的な価値観" },
        t2: { title: "重要", desc: "判断基準になる" },
        t3: { title: "ある程度意識する", desc: "状況によっては意識する" },
      },
    },
  };

  const texts = isWorks ? content.WORKS : content.VALUES;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            評価の基準について ({isWorks ? "作品" : "価値観"})
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-6">
            {/* LIKE Mode Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
                LIKE (シンプル)
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 font-bold shadow-sm ring-1 ring-pink-200 dark:ring-pink-800 pointer-events-none">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {texts.like.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                    {texts.like.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* TIER Mode Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
                TIER (段階評価)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {texts.tier.desc}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-600 dark:bg-purple-800 text-white font-bold text-xs shadow-sm flex-shrink-0">
                    T1
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {texts.tier.t1.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                      {texts.tier.t1.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-indigo-500 dark:bg-indigo-700 text-white font-bold text-xs shadow-sm flex-shrink-0">
                    T2
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {texts.tier.t2.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                      {texts.tier.t2.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center bg-teal-500 dark:bg-teal-700 text-white font-bold text-xs shadow-sm flex-shrink-0">
                    T3
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {texts.tier.t3.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                      {texts.tier.t3.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-slate-400 dark:bg-slate-600 text-white font-bold text-xs shadow-sm flex-shrink-0">
                普通
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  普通 / 合わない
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {isWorks
                    ? "普通もしくは自分に合わなかった作品。"
                    : "特に重要ではない、または意識していない価値観。"}{" "}
                  LIKE対象外。
                </p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
