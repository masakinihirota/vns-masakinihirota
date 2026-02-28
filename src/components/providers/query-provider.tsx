/**
 * TanStack Query Provider
 *
 * @description
 * - React Query のグローバル設定
 * - キャッシュ管理、リトライロジック、デフォルト動作の設定
 * - Hono RPC との統合をサポート
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/ssr
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * Query Client のデフォルト設定
 */
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // デフォルトでは、クエリは5分間キャッシュされる
                staleTime: 5 * 60 * 1000, // 5分
                gcTime: 10 * 60 * 1000, // 10分（旧: cacheTime）

                // リトライ設定
                retry: (failureCount, error: any) => {
                    // 認証エラー、バリデーションエラーはリトライしない
                    if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
                        return false;
                    }
                    // 3回までリトライ
                    return failureCount < 3;
                },
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

                // ウィンドウフォーカス時の再取得を無効化（必要に応じて有効化）
                refetchOnWindowFocus: false,

                // ネットワーク再接続時の再取得を有効化
                refetchOnReconnect: true,
            },
            mutations: {
                // Mutation のリトライは1回のみ
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * SSR対応のQuery Client取得
 *
 * @description
 * - サーバー側では毎回新しいインスタンスを作成
 * - クライアント側ではシングルトンを使用
 */
function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: 常に新しいクエリクライアントを作成
        return makeQueryClient();
    } else {
        // Browser: シングルトンパターンでクエリクライアントを再利用
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

/**
 * Query Provider Component
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    // useState を使用してクライアントのみで初期化
    // これにより、React のサスペンスバウンダリ間でクエリクライアントが再作成されない
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}

