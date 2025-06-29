import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/oauth/logout-button-auth";
import { createClient } from "@/lib/supabase/server";
import GetData from "@/components/get-data";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: userData, error } = await supabase.auth.getUser();

  // ユーザーが存在しない場合は、ログインページにリダイレクト
  if (error || !userData?.user) {
    redirect("/login");
  }

  // root_accountテーブルの全データを取得
  const { data: rootAccounts, error: rootAccountError } = await supabase
    .from("root_account")
    .select("*");

  return (
    <div className="min-h-svh w-full p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* TOP ページへのリンク */}
        <Link
          href="/"
          className="text-sm text-blue-500 inline-block"
        >
          TOPページ
        </Link>

        <div className="text-center">
          <p>
            Protected ページ
            <br />
            <span className="text-sm text-muted-foreground">
              Hello <span>{userData.user.email}</span>
            </span>
          </p>
          <LogoutButton />
        </div>

        {/* root_accountデータを表示 */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="mb-2 text-lg font-bold">
            root_accountテーブル全データ
          </h2>
          {rootAccountError && (
            <p className="text-red-500">エラー: {rootAccountError.message}</p>
          )}
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(rootAccounts, null, 2)}
          </pre>
        </div>

        {/* user_profilesデータを表示 */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <GetData />
        </div>
      </div>
    </div>
  );
}
