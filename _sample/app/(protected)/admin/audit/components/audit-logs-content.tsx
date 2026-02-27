/**
 * 監査ログ検索 - クライアント側コンテンツ
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { searchAuditLogsAction } from '../../actions';


export interface AuditLog {
    id: string;
    action: string;
    adminName: string | null;
    targetType: string | null;
    riskLevel: string;
    result: string;
    timestamp: string;
}

export interface AuditLogsContentProperties {
    initialLogs: AuditLog[];
    initialTotal: number;
}

/**
 *
 * @param root0
 * @param root0.initialLogs
 * @param root0.initialTotal
 */
export function AuditLogsContent({ initialLogs, initialTotal }: AuditLogsContentProperties) {
    const [keyword, setKeyword] = useState('');
    const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
    const [total, setTotal] = useState(initialTotal);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const result = await searchAuditLogsAction({
                keyword,
                page: 1,
            });

            if (result.success && result.data) {
                setLogs(result.data.logs);
                setTotal(result.data.total);
                setPage(1);
            } else {
                toast.error(result.error || 'Search failed');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = async (newPage: number) => {
        setLoading(true);
        try {
            const result = await searchAuditLogsAction({
                keyword,
                page: newPage,
            });

            if (result.success && result.data) {
                setLogs(result.data.logs);
                setPage(newPage);
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const riskBadge = (riskLevel: string) => {
        const colors: Record<string, string> = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800',
        };

        return (
            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${colors[riskLevel] || colors.low}`}>
                {riskLevel}
            </span>
        );
    };

    const limit = 50;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">🔍 監査ログ検索</h1>
                <p className="text-muted-foreground mt-1">全操作履歴を検索・確認</p>
            </div>

            {/* 検索バー */}
            <div className="bg-card p-4 rounded-lg border flex gap-2">
                <Input
                    placeholder="キーワード検索（操作種別など）"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={loading}
                    className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                    🔍 検索
                </Button>
            </div>

            {/* ログテーブル */}
            <div className="bg-card rounded-lg border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>操作</TableHead>
                            <TableHead>操作者</TableHead>
                            <TableHead>対象</TableHead>
                            <TableHead>リスク</TableHead>
                            <TableHead>結果</TableHead>
                            <TableHead>タイムスタンプ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    ログがありません
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-muted/50">
                                    <TableCell className="font-mono text-xs">{log.action}</TableCell>
                                    <TableCell className="text-sm">{log.adminName || '(Unknown)'}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {log.targetType}
                                    </TableCell>
                                    <TableCell>{riskBadge(log.riskLevel)}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${log.result === 'success'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {log.result}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleString('ja-JP')}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ページネーション */}
            {logs.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        全 {total} 件中 {(page - 1) * limit + 1} - {Math.min(page * limit, total)} 件
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1 || loading}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            ← 前へ
                        </Button>
                        <div className="flex items-center gap-1 px-3 py-1 font-medium">
                            {page} / {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages || loading}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            次へ →
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
