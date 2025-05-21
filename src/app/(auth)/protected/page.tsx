import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/oauth/logout-button-auth";
import { createClient } from "@/lib/supabase/server";
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
    <div className="flex h-svh w-full items-center justify-center gap-2">
      {/* TOP ページへのリンク */}
      <Link
        href="/"
        className="text-sm text-blue-500"
      >
        TOPページ
      </Link>
      <p>
        Protected ページ
        <br />
        <span className="text-sm text-muted-foreground">
          Hello <span>{userData.user.email}</span>
        </span>
      </p>
      <LogoutButton />
      <br />

      {/* データを表示 */}
      {/* root_accountテーブルの全ユーザーデータを表示 */}
      {/* RLSを有効化することで自分自身のデータだけが見える。 */}
      <h2 className="mb-2 text-lg font-bold">root_accountテーブル全データ</h2>
      {rootAccountError && (
        <p className="text-red-500">エラー: {rootAccountError.message}</p>
      )}
      <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(rootAccounts, null, 2)}
      </pre>
    </div>
  );
}
