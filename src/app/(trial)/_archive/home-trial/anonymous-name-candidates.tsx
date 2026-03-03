"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { generateRandomAnonymousName } from "@/lib/trial-storage";

interface AnonymousNameCandidate {
    id: string;
    name: string;
    timestamp: number;
}

interface AnonymousNameCandidatesProps {
    constellation: string;
    onNameSelect: (name: string) => void;
    onRestartConstellationSelection: () => void;
}

/**
 * 匿名名の候補表示と選択コンポーネント
 * 3つの候補をランダムに表示し、次へ/戻るボタンで履歴を辿ります
 */
export function AnonymousNameCandidates({
    constellation,
    onNameSelect,
    onRestartConstellationSelection,
}: AnonymousNameCandidatesProps) {
    // 現在表示中の候補セット（3つ）
    const [currentCandidates, setCurrentCandidates] = useState<AnonymousNameCandidate[]>(() => {
        return Array.from({ length: 3 }, (_, i) => ({
            id: `${Date.now()}-${i}`,
            name: generateRandomAnonymousName(constellation),
            timestamp: Date.now(),
        }));
    });

    // 履歴（以前表示した候補セット）
    const [history, setHistory] = useState<AnonymousNameCandidate[][]>([]);

    // 現在表示中のステップ（候補セット内での位置）
    const [currentStepInHistory, setCurrentStepInHistory] = useState(0);

    /**
     * 新しい候補セットを生成
     */
    const generateNewCandidates = useCallback(() => {
        const newCandidates = Array.from({ length: 3 }, (_, i) => ({
            id: `${Date.now()}-${i}`,
            name: generateRandomAnonymousName(constellation),
            timestamp: Date.now(),
        }));

        // 履歴に現在の候補セットを保存
        const newHistory = [...history.slice(0, currentStepInHistory + 1), currentCandidates];
        setHistory(newHistory);

        // 新しい候補セットを表示
        setCurrentCandidates(newCandidates);
        setCurrentStepInHistory(newHistory.length);
    }, [history, currentStepInHistory, currentCandidates, constellation]);

    /**
     * 履歴を戻る
     */
    const goBack = useCallback(() => {
        if (currentStepInHistory === 0) return;

        const previousCandidates = history[currentStepInHistory - 1];
        if (previousCandidates) {
            setCurrentCandidates(previousCandidates);
            setCurrentStepInHistory(currentStepInHistory - 1);
        }
    }, [history, currentStepInHistory]);

    /**
     * 履歴を進む（次へ）
     */
    const goForward = useCallback(() => {
        if (currentStepInHistory >= history.length) return;

        const nextCandidates = history[currentStepInHistory];
        if (nextCandidates) {
            setCurrentCandidates(nextCandidates);
            setCurrentStepInHistory(currentStepInHistory + 1);
        }
    }, [history, currentStepInHistory]);

    const canGoBack = currentStepInHistory > 0;
    const canGoForward = currentStepInHistory < history.length;

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
                {/* ヘッダー */}
                <div className="mb-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {constellation} のあなたにぴったりな名前は...💫
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        3つの候補から選んでください
                    </h2>
                </div>

                {/* 候補の表示 */}
                <div className="mb-8 space-y-4">
                    {currentCandidates.map((candidate, index) => (
                        <div
                            key={candidate.id}
                            className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {index + 1}. {candidate.name}
                                </span>
                                <button
                                    onClick={() => {
                                        console.log("Button clicked for name:", candidate.name);
                                        onNameSelect(candidate.name);
                                    }}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100"
                                >
                                    <Check className="w-4 h-4" />
                                    これにする
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 操作ボタン */}
                <div className="mb-8 space-y-4">
                    {/* 次へ/戻るボタン */}
                    <div className="flex gap-4">
                        <button
                            onClick={goBack}
                            disabled={!canGoBack}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-all disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            もどる
                        </button>
                        <button
                            onClick={generateNewCandidates}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
                        >
                            他の候補を見る
                        </button>
                        <button
                            onClick={goForward}
                            disabled={!canGoForward}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-all disabled:cursor-not-allowed"
                        >
                            すすむ
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* 履歴情報 */}
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        {currentStepInHistory === 0 ? "最新の候補です" : `履歴: ${currentStepInHistory}/${history.length}`}
                    </p>
                </div>

                {/* 星座を選び直すボタン */}
                <button
                    onClick={onRestartConstellationSelection}
                    className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all text-sm"
                >
                    星座を選び直す
                </button>
            </div>
        </div>
    );
}
