/**
 * ペナルティ発行フォームコンポーネント
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { issuePenaltyAction } from '../../actions';

/**
 *
 * @param root0
 * @param root0.onSuccess
 */
export function PenaltyIssueForm({ onSuccess }: { onSuccess?: () => void }) {
    const [userId, setUserId] = useState('');
    const [type, setType] = useState<'notice' | 'warning' | 'card' | 'leave' | 'another_dimension'>('warning');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !reason) {
            toast.error('Please fill all fields');
            return;
        }

        setSubmitting(true);
        try {
            const result = await issuePenaltyAction({
                targetUserId: userId,
                type,
                reason,
            });

            if (result.success) {
                toast.success(`Penalty issued: ${type}`);
                setUserId('');
                setType('warning');
                setReason('');
                onSuccess?.();
            } else {
                toast.error(result.error || 'Failed to issue penalty');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const penaltyTypeDescriptions: Record<string, string> = {
        notice: '注意: 軽微な違反',
        warning: '警告: 繰り返される違反',
        card: 'カード: 重大な違反',
        leave: 'リーブ: グループからの退出',
        another_dimension: 'アナザー・ディメンション: システム利用禁止',
    };

    return (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-4">
            <h3 className="text-lg font-semibold">ペナルティを発行</h3>

            {/* ユーザーID */}
            <div>
                <label className="text-sm font-medium mb-1 block">対象ユーザーID</label>
                <Input
                    placeholder="ユーザーID (UUID)"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={submitting}
                />
            </div>

            {/* ペナルティ種別 */}
            <div>
                <label className="text-sm font-medium mb-1 block">ペナルティ種別</label>
                <Select value={type} onValueChange={(v) => setType(v as any)} disabled={submitting}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(penaltyTypeDescriptions).map(([key, desc]) => (
                            <SelectItem key={key} value={key}>
                                {desc}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                    {penaltyTypeDescriptions[type]}
                </p>
            </div>

            {/* 理由 */}
            <div>
                <label className="text-sm font-medium mb-1 block">理由</label>
                <Textarea
                    placeholder="ペナルティの理由を記入してください"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={submitting}
                    maxLength={500}
                    rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                    {reason.length}/500
                </p>
            </div>

            {/* ボタン */}
            <div className="flex gap-2 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    onClick={() => {
                        setUserId('');
                        setType('warning');
                        setReason('');
                    }}
                >
                    キャンセル
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? '発行中...' : '✓ ペナルティを発行'}
                </Button>
            </div>
        </form>
    );
}
