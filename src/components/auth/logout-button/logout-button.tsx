"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface LogoutButtonProps {
    /** 複数の認証方法を持っている場合に警告を表示 */
    hasMultipleAuthMethods?: boolean;
    /** 匿名ユーザーの場合 */
    isAnonymous?: boolean;
    /** ボタンのバリアント */
    variant?: "default" | "destructive" | "outline" | "ghost" | "link";
    /** クラス名 */
    className?: string;
    /** 子要素（カスタムボタン内容） */
    children?: React.ReactNode;
    /** DropdownMenuItem内で使用する場合 */
    asDropdownItem?: boolean;
}

/**
 * ログアウトボタンコンポーネント
 *
 * ## 機能
 * - 確認ダイアログ表示
 * - 複数認証を持つユーザーへの警告
 * - 匿名ユーザーへのデータ消失警告
 * - カスタムエンドポイント `/api/auth/sign-out` を使用
 */
export function LogoutButton({
    hasMultipleAuthMethods = false,
    isAnonymous = false,
    variant = "ghost",
    className = "",
    children,
    asDropdownItem = false,
}: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/sign-out", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // ログアウト成功
                router.push("/login");
                router.refresh();
            } else {
                console.error("Logout failed:", await response.text());
                alert("ログアウトに失敗しました。再度お試しください。");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("ログアウトに失敗しました。ネットワーク接続を確認してください。");
            setIsLoading(false);
        }
    };

    const getWarningMessage = () => {
        const warnings: string[] = [];

        if (hasMultipleAuthMethods) {
            warnings.push(
                "⚠️ 複数の認証方法が登録されています。ログアウトすると、全ての認証方法（Google、GitHub、匿名）が削除されます。"
            );
        }

        if (isAnonymous) {
            warnings.push(
                "⚠️ 匿名アカウントでは、ログアウト後にデータが復元できない場合があります。ブラウザのローカルストレージは保持されますが、別のデバイスからはアクセスできません。"
            );
        }

        return warnings.length > 0 ? warnings.join("\n\n") : null;
    };

    const warningMessage = getWarningMessage();

    const buttonContent = children || (
        <>
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
        </>
    );

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={variant}
                    className={className}
                    disabled={isLoading}
                >
                    {buttonContent}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>ログアウトの確認</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3">
                            <p>本当にログアウトしますか?</p>

                            {warningMessage && (
                                <div className="p-3 text-sm rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                    <div className="whitespace-pre-line text-yellow-800 dark:text-yellow-200">
                                        {warningMessage}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                ログアウト後は、再度ログインが必要になります。
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isLoading ? "ログアウト中..." : "ログアウト"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
