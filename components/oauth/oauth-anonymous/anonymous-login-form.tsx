'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/client'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * 匿名ログインフォームコンポーネント
 * ユーザー情報なしで一時的なアクセスを提供します
 */
export function AnonymousLoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAnonymousLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("匿名サインインを試行中...");
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) throw error

      console.log("匿名サインイン成功:", data);

      // ログイン成功後にリダイレクト（保護されたルートへ）
      router.push('/protected')
    } catch (error: unknown) {
      console.error("匿名サインインエラー:", error);
      setError(error instanceof Error ? error.message : 'ログイン中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ようこそ！</CardTitle>
          <CardDescription>匿名でサービスを体験できます</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnonymousLogin}>
            <div className="flex flex-col gap-6">
              {error && (
                <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'ログイン中...' : '匿名で続ける'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                匿名ログインではデータが永続化されない場合があります
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
