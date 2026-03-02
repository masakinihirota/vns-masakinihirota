import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequireRole } from "@/lib/auth-guard";
import { getAdminDashboardStats } from "@/lib/db/admin-queries";

// Dynamic rendering: Do not prerender, server-render on demand
export const dynamic = 'force-dynamic';

/**
 * 管理者ページ
 *
 * @description platform_admin のみアクセス可能な管理ホーム（MVP）
 *
 * @security
 * proxy.ts + RequireRole で二重防御
 */
type AdminPageProps = {
    params: Promise<Record<string, string | string[] | undefined>>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ params, searchParams }: AdminPageProps) {
    await params;
    await searchParams;

    const stats = await getAdminDashboardStats();

    return (
        <RequireRole role="platform_admin">
            <main className="min-h-screen p-6 md:p-8">
                <section className="mx-auto max-w-6xl space-y-6">
                    <header>
                        <h1 className="text-2xl font-semibold">管理ホーム</h1>
                        <p className="text-sm opacity-80">未処理件数のプレースホルダー表示（MVP）</p>
                    </header>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle as="h2" className="text-base font-medium">通報未処理件数</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold" data-testid="unresolved-reports-count">
                                    {stats.unresolvedReports}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle as="h2" className="text-base font-medium">承認待ち件数</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold" data-testid="pending-approvals-count">
                                    {stats.pendingApprovals}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle as="h2" className="text-base font-medium">管理ログ件数（24h）</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold" data-testid="admin-logs-count">
                                    {stats.adminLogCount24h}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
        </RequireRole>
    );
};
