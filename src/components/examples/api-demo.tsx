/**
 * API Demo Components
 *
 * @description
 * - Hono RPC + TanStack Query の使用例
 * - GET リクエスト (useApiQuery)
 * - エラーハンドリング
 * - ローディング状態の管理
 */

'use client';

import { useApiQuery, handleApiResponse } from '@/lib/hooks/use-api';
import { client } from '@/lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Health Check Component
 *
 * @example
 * ```tsx
 * <HealthCheckDemo />
 * ```
 */
export function HealthCheckDemo() {
    const { data, isLoading, error, refetch } = useApiQuery<{
        status: string;
        timestamp: number;
        version?: string;
    }>(
        ['health'],
        async () => {
            const res = await client.health.$get();
            return handleApiResponse(res);
        }
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Health Check API</CardTitle>
                <CardDescription>GET /api/health - サーバーの状態を確認</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Loading...</span>
                    </div>
                )}

                {error && (
                    <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                        <p className="font-semibold">Error: {error.name}</p>
                        <p>{error.message}</p>
                    </div>
                )}

                {data && (
                    <div className="space-y-2">
                        <div className="rounded-md bg-primary/10 p-4">
                            <p className="text-sm font-medium">Status: {data.status}</p>
                            <p className="text-sm text-muted-foreground">
                                Timestamp: {new Date(data.timestamp).toLocaleString('ja-JP')}
                            </p>
                            {data.version && (
                                <p className="text-sm text-muted-foreground">Version: {data.version}</p>
                            )}
                        </div>
                    </div>
                )}

                <Button onClick={() => refetch()} variant="outline" size="sm">
                    Refresh
                </Button>
            </CardContent>
        </Card>
    );
}

/**
 * User Info Component
 *
 * @description
 * - 認証済みユーザーの情報を表示
 * - セッションがない場合はログインを促す
 *
 * @example
 * ```tsx
 * <UserInfoDemo />
 * ```
 */
export function UserInfoDemo() {
    const { data, isLoading, error, refetch } = useApiQuery<{
        id: string;
        email: string;
        name: string;
        role: string;
    }>(
        ['users', 'me'],
        async () => {
            const res = await client.users.me.$get();
            return handleApiResponse(res);
        },
        {
            // 認証エラーの場合はリトライしない
            retry: false,
        }
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Info API</CardTitle>
                <CardDescription>GET /api/users/me - ログインユーザー情報</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Loading...</span>
                    </div>
                )}

                {error && (
                    <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                        <p className="font-semibold">Error: {error.name}</p>
                        <p>{error.message}</p>
                        {error.code === 'UNAUTHORIZED' && (
                            <p className="mt-2">ログインが必要です。</p>
                        )}
                    </div>
                )}

                {data && (
                    <div className="space-y-2">
                        <div className="rounded-md bg-primary/10 p-4 space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">ID:</span> {data.id}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Email:</span> {data.email}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Name:</span> {data.name}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Role:</span>{' '}
                                <span className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                    {data.role}
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                <Button onClick={() => refetch()} variant="outline" size="sm">
                    Refresh
                </Button>
            </CardContent>
        </Card>
    );
}
