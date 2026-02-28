/**
 * API Mutation Demo Component
 *
 * @description
 * - Hono RPC + TanStack Query の Mutation 使用例
 * - POST リクエスト (useApiMutation)
 * - キャッシュの無効化
 * - 楽観的更新（Optimistic Update）
 */

'use client';

import { useState } from 'react';
import { useApiMutation, useQueryClient, handleApiResponse } from '@/lib/hooks/use-api';
import { client } from '@/lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

/**
 * Echo Test Component
 *
 * @description
 * - POST /api/poc/echo のテスト
 * - Mutation の基本的な使い方を示す
 */
export function EchoTestDemo() {
    const [message, setMessage] = useState('');
    const queryClient = useQueryClient();

    const echoMutation = useApiMutation<
        { echo: string; timestamp: number },
        { message: string }
    >(
        async (input: { message: string }) => {
            const res = await client.poc.echo.$post({
                json: input,
            });
            return handleApiResponse(res);
        },
        {
            onSuccess: (data) => {
                toast.success('Echo成功!', {
                    description: `Server replied: ${data.echo}`,
                });
            },
            onError: (error) => {
                toast.error('Echo失敗', {
                    description: error.message,
                });
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            echoMutation.mutate({ message });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Echo Test (Mutation)</CardTitle>
                <CardDescription>POST /api/poc/echo - メッセージをエコーバック</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Input
                            id="message"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={echoMutation.isPending}
                        />
                    </div>

                    <Button type="submit" disabled={echoMutation.isPending || !message.trim()}>
                        {echoMutation.isPending ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Sending...
                            </>
                        ) : (
                            'Send Echo'
                        )}
                    </Button>

                    {echoMutation.isSuccess && echoMutation.data && (
                        <div className="rounded-md bg-primary/10 p-4 text-sm">
                            <p className="font-medium">Response:</p>
                            <p className="text-muted-foreground">Echo: {echoMutation.data.echo}</p>
                            <p className="text-muted-foreground">
                                Timestamp: {new Date(echoMutation.data.timestamp).toLocaleString('ja-JP')}
                            </p>
                        </div>
                    )}

                    {echoMutation.isError && (
                        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                            <p className="font-semibold">Error: {echoMutation.error.name}</p>
                            <p>{echoMutation.error.message}</p>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

/**
 * Query Invalidation Demo
 *
 * @description
 * - キャッシュの無効化デモ
 * - Mutation後にQueryを再取得
 */
export function QueryInvalidationDemo() {
    const queryClient = useQueryClient();
    const [isInvalidating, setIsInvalidating] = useState(false);

    const handleInvalidate = async () => {
        setIsInvalidating(true);
        try {
            // 'health' キーを持つすべてのクエリを無効化
            await queryClient.invalidateQueries({ queryKey: ['health'] });
            toast.success('キャッシュを無効化しました', {
                description: 'Healthチェックが再取得されます',
            });
        } finally {
            setIsInvalidating(false);
        }
    };

    const handleClearAll = () => {
        queryClient.clear();
        toast.success('すべてのキャッシュをクリアしました');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cache Management</CardTitle>
                <CardDescription>TanStack Query のキャッシュ管理</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Button
                        onClick={handleInvalidate}
                        disabled={isInvalidating}
                        variant="outline"
                        className="w-full"
                    >
                        {isInvalidating ? 'Invalidating...' : 'Invalidate Health Query'}
                    </Button>

                    <Button onClick={handleClearAll} variant="outline" className="w-full">
                        Clear All Cache
                    </Button>
                </div>

                <div className="rounded-md bg-muted p-4 text-sm">
                    <p className="font-medium mb-2">使用例:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Mutation成功後にQueryを再取得</li>
                        <li>手動でキャッシュをリフレッシュ</li>
                        <li>特定のキーのみ無効化</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
