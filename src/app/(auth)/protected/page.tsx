import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/oauth/logout-button-auth";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  // ユーザーが存在しない場合は、ログインページにリダイレクト
  if (error || !data?.user) {
    redirect("/login");
  }

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
          Hello <span>{data.user.email}</span>
        </span>
      </p>
      <LogoutButton />
    </div>
  );
}
