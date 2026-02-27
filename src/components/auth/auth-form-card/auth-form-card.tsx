"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthErrorInfo } from "@/lib/auth/auth-errors";
import type { AuthFeature } from "@/lib/auth/auth-features";

interface AuthFormCardProps {
    /** フォームタイトル（例: "Google認証"） */
    title: string;

    /** タイトル前のアイコン */
    icon: React.ReactNode;

    /** 認証方法の機能リスト */
    features: AuthFeature[];

    /** 現在のエラー情報 */
    error: AuthErrorInfo | null;

    /** ローディング状態 */
    isLoading: boolean;

    /** フォーム送信時のコールバック */
    onSubmit: React.FormEventHandler<HTMLFormElement>;

    /** サブタイトル/説明 */
    description?: string | React.ReactNode;

    /** 送信ボタンのラベル（デフォルト: "サインイン"） */
    submitButtonLabel?: string;

    /** ボタンのaria-label（アクセシビリティ） */
    ariaLabel?: string;

    /** フッターコンテンツ（オプション） */
    footer?: React.ReactNode;

    /** CSSクラス名 */
    className?: string;
}

export type { AuthFormCardProps };

/**
 * 各種ログインフォーム用の統一コンポーネント
 * Google/GitHub/Anonymous ログインフォームのマークアップを統一
 */
export function AuthFormCard({
    title,
    icon,
    features,
    error,
    isLoading,
    onSubmit,
    description,
    submitButtonLabel = "サインイン",
    ariaLabel,
    footer,
    className,
}: AuthFormCardProps) {
    return (
        <div className={cn("flex flex-col gap-6 w-full", className)}>
            <Card className="h-full text-white transition-all bg-black border border-green-600 hover:shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2 text-white">
                        {icon}
                        {title}
                    </CardTitle>
                    {description && (
                        <CardDescription className="text-gray-300">{description}</CardDescription>
                    )}
                </CardHeader>

                <CardContent>
                    {/* 機能リスト */}
                    <ul className="space-y-1 text-sm">
                        {features.map((feature) => (
                            <li key={feature.label} className="flex justify-between">
                                <span className="font-medium text-white">{feature.label}:</span>
                                <span
                                    className={
                                        feature.isNegative ? "text-red-500" : "text-green-500"
                                    }
                                >
                                    {feature.value}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* フォーム */}
                    <form onSubmit={onSubmit} className="mt-6">
                        <div className="flex flex-col gap-6">
                            {/* エラー表示 */}
                            {error && (
                                <div className="p-3 text-sm text-red-400 rounded-md bg-red-900/30">
                                    <p className="font-semibold mb-2">{error.message}</p>
                                    {error.recoverySteps.length > 0 && (
                                        <div className="mt-2 text-xs">
                                            <p className="font-medium mb-1">対処方法:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {error.recoverySteps.map((step, idx) => (
                                                    <li key={idx}>{step}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 送信ボタン */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isLoading}
                                aria-label={ariaLabel}
                            >
                                {isLoading ? "ログイン中..." : submitButtonLabel}
                            </Button>
                        </div>
                    </form>
                </CardContent>

                {footer && <CardFooter>{footer}</CardFooter>}
            </Card>
        </div>
    );
}
