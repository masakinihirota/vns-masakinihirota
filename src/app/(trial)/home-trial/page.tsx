"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrialStorage } from "@/lib/trial-storage";
import { ConstellationSelection } from "./constellation-selection";
import { AnonymousNameCandidates } from "./anonymous-name-candidates";

type PagePhase = "loading" | "constellation_selection" | "name_selection" | "dashboard";

/**
 * お試しモード専用ホームページ
 * localStorageのデータを使用して表示
 */
export default function HomeTrialPage() {
    const router = useRouter();
    const [trialData, setTrialData] = useState<any>(null);
    const [phase, setPhase] = useState<PagePhase>("loading");
    const [selectedConstellation, setSelectedConstellation] = useState<string>("");

    useEffect(() => {
        // お試しモードフラグを確認
        const isTrial = localStorage.getItem("vns_trial_mode") === "true";

        if (!isTrial) {
            // お試しモードでない場合はトップページへ
            router.push("/");
            return;
        }

        // お試しデータを読み込み
        const data = TrialStorage.load();
        setTrialData(data);

        // 既に匿名名が決まっているか確認
        if (data && data.rootAccount && data.rootAccount.display_name) {
            setPhase("dashboard");
        } else {
            setPhase("constellation_selection");
        }
    }, [router]);

    const handleConstellationSelect = (constellation: string) => {
        setSelectedConstellation(constellation);
        setPhase("name_selection");
    };

    const handleNameSelect = (name: string) => {
        console.log("handleNameSelect called with:", name);
        if (!trialData) return;

        const updated = { ...trialData };
        updated.rootAccount = {
            display_id: name,
            display_name: name,
            activity_area_id: null,
            core_activity_start: '09:00',
            core_activity_end: '18:00',
            holidayActivityStart: '10:00',
            holidayActivityEnd: '19:00',
            uses_ai_translation: false,
            nativeLanguages: ['ja'],
            agreed_oasis: true,
            zodiac_sign: selectedConstellation,
            birth_generation: '平成',
            week_schedule: {
                mon: 'work',
                tue: 'work',
                wed: 'work',
                thu: 'work',
                fri: 'work',
                sat: 'leisure',
                sun: 'leisure',
            },
            created_at: new Date().toISOString(),
        };
        console.log("Saving trial data:", updated);
        TrialStorage.save(updated);
        setTrialData(updated);
        console.log("Setting phase to dashboard");
        setPhase("dashboard");
    };

    const handleRestartConstellationSelection = () => {
        setSelectedConstellation("");
        setPhase("constellation_selection");
    };

    if (phase === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
                </div>
            </div>
        );
    }

    // 星座選択画面
    if (phase === "constellation_selection") {
        return <ConstellationSelection onConstellationSelect={handleConstellationSelect} />;
    }

    // 匿名名選択画面
    if (phase === "name_selection") {
        return (
            <AnonymousNameCandidates
                constellation={selectedConstellation}
                onNameSelect={handleNameSelect}
                onRestartConstellationSelection={handleRestartConstellationSelection}
            />
        );
    }

    // ダッシュボード画面（匿名名が決まったら表示される）
    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* ヘッダー */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6 border-2 border-orange-300">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                お試しモード
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-1">
                                ようこそ、<span className="font-bold text-orange-600 dark:text-orange-400">{trialData?.rootAccount?.display_name || "ゲスト"}</span>さん
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                ✨ あなたの星座匿名（コンステレーション・アノニマス constellation）
                            </p>
                        </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                            ⚡ お試しモード中です。すべてのデータはブラウザのみに保存され、サーバーには送信されません。
                        </p>
                    </div>
                </div>

                {/* ポイント情報 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        利用可能ポイント
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                            {trialData?.points?.current || 0}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            / {1000000} pt
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        機能を使用するとポイントが消費されます
                    </p>
                </div>

                {/* アカウント情報 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        お試しアカウント情報
                    </h2>
                    <dl className="grid grid-cols-1 gap-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                星座匿名（コンステレーション・アノニマス）
                            </dt>
                            <dd className="mt-1 text-lg text-gray-900 dark:text-white font-serif">
                                {trialData?.rootAccount?.display_name || "N/A"}
                            </dd>
                            <dd className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                色とマテリアルと星座の組み合わせで生成された匿名識別子です
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">作成日時</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {trialData?.createdAt ? new Date(trialData.createdAt).toLocaleString("ja-JP") : "N/A"}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* 利用可能機能 */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        お試し可能な機能
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">👥</span>
                                <h3 className="font-medium text-gray-900 dark:text-white">グループ作成</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                最大2つまで作成可能（無料）
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                作成済み: {trialData?.groups?.length || 0} / 2
                            </p>
                        </div>

                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">🏛️</span>
                                <h3 className="font-medium text-gray-900 dark:text-white">国の作成</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                最大1つまで作成可能（10pt）
                            </p>
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                {trialData?.nation ? "作成済み" : "未作成"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 本登録すると、すべての機能が無制限で利用できるようになります
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
