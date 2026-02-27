/**
 * ペナルティ管理 - クライアント側コンテンツ
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

import { getPenaltiesAction } from '../../actions';

import { PenaltyIssueForm } from './penalty-issue-form';



export interface Penalty {
    id: string;
    type: string;
    reason: string;
    targetName: string | null;
    issuedAt: string;
}

export interface PenaltiesContentProperties {
    initialPenalties: Penalty[];
}

/**
 *
 * @param root0
 * @param root0.initialPenalties
 */
export function PenaltiesContent({ initialPenalties }: PenaltiesContentProperties) {
    const [penaltiesList, setPenaltiesList] = useState<Penalty[]>(initialPenalties);
    const [loading, setLoading] = useState(false);

    const loadPenalties = async () => {
        setLoading(true);
        try {
            const result = await getPenaltiesAction();
            if (result.success) {
                setPenaltiesList(result.data || []);
            } else {
                toast.error(result.error || 'Failed to load penalties');
            }
        } finally {
            setLoading(false);
        }
    };

    const penaltyBadge = (type: string) => {
        const colors: Record<string, string> = {
            notice: 'bg-blue-100 text-blue-800',
            warning: 'bg-yellow-100 text-yellow-800',
            card: 'bg-orange-100 text-orange-800',
            leave: 'bg-red-100 text-red-800',
            another_dimension: 'bg-purple-100 text-purple-800',
        };

        return (
            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${colors[type] || colors.notice}`}>
                {type}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">⚠️ ペナルティ管理</h1>
                <p className="text-muted-foreground mt-1">ペナルティの発行と履歴管理</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ペナルティ発行フォーム */}
                <div>
                    <PenaltyIssueForm onSuccess={loadPenalties} />
                </div>

                {/* ペナルティ一覧 */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">ペナルティ履歴（直近100件）</h2>
                        <Button
                            onClick={loadPenalties}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                        >
                            🔄 更新
                        </Button>
                    </div>

                    <div className="bg-card rounded-lg border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>対象ユーザー</TableHead>
                                    <TableHead>種別</TableHead>
                                    <TableHead>理由</TableHead>
                                    <TableHead>発行日</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {penaltiesList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            ペナルティがありません
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    penaltiesList.map((penalty) => (
                                        <TableRow key={penalty.id}>
                                            <TableCell className="font-medium">
                                                {penalty.targetName || '(削除済み)'}
                                            </TableCell>
                                            <TableCell>{penaltyBadge(penalty.type)}</TableCell>
                                            <TableCell className="text-sm max-w-xs truncate">
                                                {penalty.reason}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(penalty.issuedAt).toLocaleString('ja-JP')}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
