/**
 * Admin Dashboard - クライアント側コンテンツ
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getDashboardKPIAction, searchAuditLogsAction } from '../actions';


export interface DashboardData {
    kpi: any;
    recentLogs: any[];
}

export interface DashboardContentProperties {
    initialData: DashboardData;
}

/**
 *
 * @param root0
 * @param root0.initialData
 */
export function DashboardContent({ initialData }: DashboardContentProperties) {
    const [kpi, setKpi] = useState<any>(initialData.kpi);
    const [recentLogs, setRecentLogs] = useState<any[]>(initialData.recentLogs);
    const [loading, setLoading] = useState(false);

    const StatCard = ({
        label,
        value,
        icon,
        color = 'blue',
    }: {
        label: string;
        value: number | string;
        icon: string;
        color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
    }) => {
        const colorMap = {
            blue: 'bg-blue-50 border-blue-200',
            green: 'bg-green-50 border-green-200',
            red: 'bg-red-50 border-red-200',
            yellow: 'bg-yellow-50 border-yellow-200',
            purple: 'bg-purple-50 border-purple-200',
        };

        return (
            <div className={`p-4 rounded-lg border ${colorMap[color]}`}>
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        );
    };

    const QuickActionButton = ({
        label,
        icon,
        href,
    }: {
        label: string;
        icon: string;
        href: string;
    }) => (
        <Link href={href}>
            <Button className="w-full justify-start gap-2" variant="outline">
                <span className="text-lg">{icon}</span>
                {label}
            </Button>
        </Link>
    );

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const kpiResult = await getDashboardKPIAction();
            if (kpiResult.success) {
                setKpi(kpiResult.data);
            }

            const logsResult = await searchAuditLogsAction({
                keyword: '',
                page: 1,
            });
            if (logsResult.success && logsResult.data) {
                setRecentLogs(logsResult.data.logs.slice(0, 5));
            }
            toast.success('Dashboard refreshed');
        } catch {
            toast.error('Failed to refresh');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">全体概要とリアルタイム統計</p>
                </div>
                <Button onClick={handleRefresh} disabled={loading} variant="outline">
                    🔄 更新
                </Button>
            </div>

            {/* KPI カード */}
            {kpi && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        label="総ユーザー数"
                        value={kpi.totalUsers}
                        icon="👥"
                        color="blue"
                    />
                    <StatCard
                        label="アクティブユーザー"
                        value={kpi.activeUsers}
                        icon="✅"
                        color="green"
                    />
                    <StatCard
                        label="待機中の承認"
                        value={kpi.pendingApprovals}
                        icon="⏳"
                        color="yellow"
                    />
                    <StatCard
                        label="本日のペナルティ"
                        value={kpi.todayPenalties}
                        icon="⚠️"
                        color="red"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* クイックアクション */}
                <Card>
                    <CardHeader>
                        <CardTitle>🚀 クイックアクション</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <QuickActionButton label="ユーザー管理" icon="👥" href="/admin/accounts" />
                        <QuickActionButton label="ペナルティ発行" icon="⚠️" href="/admin/penalties" />
                        <QuickActionButton label="作品承認" icon="✓" href="/admin/approvals" />
                        <QuickActionButton label="監査ログ" icon="🔍" href="/admin/audit" />
                    </CardContent>
                </Card>

                {/* 最近の操作ログ */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>📋 最近の操作ログ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {recentLogs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">ログはありません</p>
                            ) : (
                                recentLogs.map((log) => (
                                    <div key={log.id} className="px-3 py-2 bg-muted/50 rounded text-sm">
                                        <div className="font-mono font-semibold text-xs">
                                            {log.action}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {log.adminName} / {new Date(log.timestamp).toLocaleString('ja-JP')}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
