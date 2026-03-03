"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateRandomAnonymousName } from "@/lib/trial-storage";

interface ConstellationSelectionProps {
    onConstellationSelect: (constellation: string) => void;
}

/**
 * 星座選択画面コンポーネント
 * 初期画面として表示され、ユーザーが星座を選びやすくします
 */
export function ConstellationSelection({ onConstellationSelect }: ConstellationSelectionProps) {
    const CONSTELLATIONS = [
        "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座",
        "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
                {/* ウェルカムメッセージ */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        いらっしゃい👋
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        まずはあなたの好きな星座を教えてください
                    </p>
                </div>

                {/* 星座選択ボタン */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CONSTELLATIONS.map(sign => (
                        <button
                            key={sign}
                            onClick={() => onConstellationSelect(sign)}
                            className="px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
                        >
                            {sign}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
