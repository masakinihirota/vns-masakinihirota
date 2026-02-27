/**
 * 作品承認キュー - クライアント側コンテンツ
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { approveContentAction, getApprovalQueueAction } from '../../actions';

export interface ApprovalItem {
    id: string;
    workId: string;
    title: string;
    creatorName: string | null;
    status: string;
    createdAt: string;
    creatorId: string;
}

export interface ApprovalsContentProperties {
    initialData: ApprovalItem[];
    initialTotal: number;
}

/**
 *
 * @param root0
 * @param root0.initialData
 * @param root0.initialTotal
 */
export function ApprovalsContent({ initialData, initialTotal }: ApprovalsContentProperties) {
    const [approvalsList, setApprovalsList] = useState<ApprovalItem[]>(initialData);
    const [total, setTotal] = useState(initialTotal);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);
    const limit = 50;

    const handlePageChange = async (newPage: number) => {
        setLoading(true);
        try {
            const result = await getApprovalQueueAction(newPage, limit);
            if (result.success && result.data) {
                setApprovalsList(result.data.approvals);
                setTotal(result.data.total);
                setPage(newPage);
            } else {
                toast.error(result.error || 'Failed to load approvals');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (approvalId: string) => {
        setProcessing(approvalId);
        try {
            const result = await approveContentAction({
                approvalId,
                approved: true,
            });

            if (result.success) {
                toast.success('✓ Content approved');
                // リロードして最新データを取得
                await handlePageChange(1);
            } else {
                toast.error(result.error || 'Failed to approve');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (approvalId: string) => {
        setProcessing(approvalId);
        try {
            const result = await approveContentAction({
                approvalId,
                approved: false,
            });

            if (result.success) {
                toast.success('✗ Content rejected');
                // リロードして最新データを取得
                await handlePageChange(1);
            } else {
                toast.error(result.error || 'Failed to reject');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setProcessing(null);
        }
    };

    const calculateWaitDays = (createdAt: string) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diff = now.getTime() - created.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">✓ 作品承認キュー</h1>
                    <p className="text-muted-foreground mt-1">
                        待機中: {total} 件（{page}/{totalPages} ページ）
                    </p>
                </div>
                <Button
                    onClick={() => handlePageChange(1)}
                    disabled={loading}
                    variant="outline"
                >
                    🔄 更新
                </Button>
            </div>

            <div className="bg-card rounded-lg border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>タイトル</TableHead>
                            <TableHead>申請者</TableHead>
                            <TableHead>待機日数</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvalsList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    承認待機の作品はありません
                                </TableCell>
                            </TableRow>
                        ) : (
                            approvalsList.map((approval) => {
                                const waitDays = calculateWaitDays(approval.createdAt);
                                const isUrgent = waitDays > 7;

                                return (
                                    <TableRow
                                        key={approval.id}
                                        className={isUrgent ? 'bg-red-50' : 'hover:bg-muted/50'}
                                    >
                                        <TableCell className="font-medium max-w-sm truncate">
                                            {approval.title}
                                        </TableCell>
                                        <TableCell>{approval.creatorName || '(Unknown)'}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${isUrgent
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {waitDays} 日
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="default"
                                                disabled={processing === approval.id || loading}
                                                onClick={() => handleApprove(approval.id)}
                                            >
                                                ✓ 承認
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={processing === approval.id || loading}
                                                onClick={() => handleReject(approval.id)}
                                            >
                                                ✗ 却下
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        disabled={!hasPreviousPage || loading}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        ← 前へ
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        ページ {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={!hasNextPage || loading}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        次へ →
                    </Button>
                </div>
            )}
        </div>
    );
}
