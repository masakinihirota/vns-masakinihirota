import { X } from "lucide-react";
import React from "react";

interface RatingHelpModalProps {
  onClose: () => void;
}

export const RatingHelpModal = ({ onClose }: RatingHelpModalProps) => {
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
            評価の基準について
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-600 dark:bg-purple-800 text-white font-bold text-xs shadow-sm">
                T1
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  最も好きな作品
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  人生に影響を与えた、特別な作品。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-indigo-500 dark:bg-indigo-700 text-white font-bold text-xs shadow-sm">
                T2
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  非常に好きな作品
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  何度も見返したくなる作品
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-teal-500 dark:bg-teal-700 text-white font-bold text-xs shadow-sm">
                T3
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  好きな作品
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  普通に面白い、また見たい作品。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-slate-400 dark:bg-slate-600 text-white font-bold text-xs shadow-sm">
                普通
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  普通 / 合わない
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  普通もしくは自分に合わなかった作品。LIKE対象外。
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
