"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, HelpCircle, Lock, X } from "lucide-react";
import { useState } from "react";
import { TUTORIAL_KEYWORDS, TutorialKeyword } from "./tutorial-keywords.data";

interface KeywordModalProps {
    isOpen: boolean;
    onClose: () => void;
    unlockedIds: string[];
    learnedIds: string[];
    onLearn: (id: string) => void;
}

export const KeywordModal = ({
    isOpen,
    onClose,
    unlockedIds,
    learnedIds,
    onLearn,
}: KeywordModalProps) => {
    const [selectedKeywordId, setSelectedKeywordId] = useState<string | null>(null);

    const selectedKeyword = TUTORIAL_KEYWORDS.find((k) => k.id === selectedKeywordId);

    const handleSelect = (keyword: TutorialKeyword) => {
        if (!unlockedIds.includes(keyword.id)) return;

        setSelectedKeywordId(keyword.id);
        if (!learnedIds.includes(keyword.id)) {
            onLearn(keyword.id);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-4xl h-auto my-auto bg-slate-900/90 border border-indigo-500/30 rounded-2xl shadow-2xl flex overflow-hidden backdrop-blur-xl"
                        style={{ maxHeight: 'calc(100vh - 8rem)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left Sidebar: Keyword List */}
                        <div className="w-1/3 border-r border-white/10 flex flex-col bg-black/20">
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <HelpCircle className="text-indigo-400" size={20} />
                                    学習キーワード
                                </h2>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {TUTORIAL_KEYWORDS.map((keyword) => {
                                    const isUnlocked = unlockedIds.includes(keyword.id);
                                    const isLearned = learnedIds.includes(keyword.id);
                                    const isSelected = selectedKeywordId === keyword.id;

                                    return (
                                        <button
                                            key={keyword.id}
                                            onClick={() => handleSelect(keyword)}
                                            disabled={!isUnlocked}
                                            className={`
                        w-full text-left p-3 rounded-lg flex items-center justify-between transition-all
                        ${isSelected
                                                    ? "bg-indigo-600/30 border border-indigo-500/50 text-white"
                                                    : isUnlocked
                                                        ? "bg-white/5 hover:bg-white/10 text-slate-200 border border-transparent"
                                                        : "bg-black/20 text-slate-600 cursor-not-allowed border border-transparent"
                                                }
                      `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                          p-2 rounded-full
                          ${isUnlocked ? "bg-indigo-900/50 text-indigo-300" : "bg-slate-800/50 text-slate-600"}
                        `}>
                                                    {isUnlocked ? <keyword.icon size={16} /> : <Lock size={16} />}
                                                </div>
                                                <span className="font-medium text-sm truncate">
                                                    {isUnlocked ? keyword.label : "？？？"}
                                                </span>
                                            </div>

                                            {isLearned && (
                                                <Check size={16} className="text-emerald-400 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Content: Details */}
                        <div className="flex-1 flex flex-col relative bg-slate-900/50">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10 text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            {selectedKeyword ? (
                                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                                    <div className="w-24 h-24 bg-indigo-500/20 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                        <selectedKeyword.icon size={48} className="text-indigo-400" />
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">
                                        {selectedKeyword.label}
                                    </h3>

                                    <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                                        {selectedKeyword.description}
                                    </p>

                                    <div className="mt-8 flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/50">
                                        <Check size={14} /> 学習済み
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
                                    <HelpCircle size={64} className="mb-4 opacity-20" />
                                    <p className="text-lg">左のリストからキーワードを選択してください</p>
                                    <p className="text-sm mt-2 opacity-60">
                                        物語が進むと、新しいキーワードが解放されます
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
