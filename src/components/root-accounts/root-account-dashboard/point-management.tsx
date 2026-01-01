import {
    Coins,
    TrendingUp,
    Zap,
    HandHeart,
    CalendarClock,
    Shield,
    History,
    Info,
} from "lucide-react";
import React from "react";
import { RootAccount } from "./root-account-dashboard.types";

interface PointManagementSectionProps {
    data: RootAccount;
}

export const PointManagementSection: React.FC<PointManagementSectionProps> = ({
    data,
}) => {
    // 次回回復量の計算 (現在保有量の50%回復、ただし上限2000ptまで)
    const calculateNextRecovery = () => {
        const recoveryAmount = Math.floor(
            data.total_points * data.daily_recovery_rate
        );
        const potentialTotal = data.total_points + recoveryAmount;
        if (potentialTotal > data.auto_recovery_max_points) {
            // 上限を超える場合は、上限までの差分のみ回復（すでに上限なら0）
            return Math.max(0, data.auto_recovery_max_points - data.total_points);
        }
        return recoveryAmount;
    };

    const nextRecoveryAmount = calculateNextRecovery();
    const progressPercentage = Math.min(
        (data.total_points / data.auto_recovery_max_points) * 100,
        100
    );

    return (
        <div className="bg-white dark:bg-slate-900 shadow-lg rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

            <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Coins className="text-amber-500" />
                            ポイント管理
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            経済活動と信頼のステータス
                        </p>
                    </div>
                    <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
                        <History size={14} />
                        履歴を見る
                    </button>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Total Points & Recovery */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Coins size={80} className="text-amber-500 transform rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                    現在の総ポイント数
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        {data.total_points.toLocaleString()}
                                    </span>
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        pt
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                                            自動回復上限
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            {data.auto_recovery_max_points.toLocaleString()} pt
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-right">
                                        上限を超えた分は自動回復しません
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/50">
                            <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full text-indigo-600 dark:text-indigo-300">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-300 mb-0.5">
                                    次回回復予定（明日）
                                </div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    +{nextRecoveryAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">pt</span>
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                                    <CalendarClock size={10} />
                                    最終回復: {new Date(data.last_recovery_at).toLocaleString('ja-JP')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Trust & Consumption */}
                    <div className="space-y-6">
                        {/* Trust Duration */}


                        {/* Consumption Stats */}
                        <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 ml-1">
                                消費済み合計ポイント
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap size={16} className="text-blue-500" />
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">活動ポイント</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                                        {data.consumed_points_activity.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <HandHeart size={16} className="text-pink-500" />
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">クリックポイント</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                                        {data.consumed_points_click.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-right">
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                    合計消費: {data.total_consumed_points.toLocaleString()} pt
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
