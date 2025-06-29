import { createClient } from "@/lib/supabase/server";

export default async function GetData() {
  const supabase = await createClient();

  // user_profilesテーブルの全データを取得
  const { data: userProfiles, error: userProfilesError } = await supabase
    .from("user_profiles")
    .select("*");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="mb-4 text-xl font-bold">user_profilesテーブル全データ</h2>

      {userProfilesError && (
        <p className="text-red-500 mb-4">エラー: {userProfilesError.message}</p>
      )}

      {userProfiles && userProfiles.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {userProfiles.length}件のレコードが見つかりました
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs overflow-x-auto border">
            {JSON.stringify(userProfiles, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-muted-foreground">
          user_profilesテーブルにデータがありません
        </p>
      )}
    </div>
  );
}
