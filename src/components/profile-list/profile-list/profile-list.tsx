import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ProfileListProps {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly avatarUrl?: string;
}

/**
 * ユーザープロフィールを表示するリストコンポーネント（DADS準拠）
 *
 * @param name - ユーザー名
 * @param role - 役割
 * @param bio - 自己紹介
 * @param avatarUrl - アバター画像のURL（オプション）
 *
 * @example
 * ```tsx
 * <ProfileList
 *   name="山田太郎"
 *   role="エンジニア"
 *   bio="フルスタック開発者"
 * />
 * ```
 *
 * @remarks
 * - アバター画像がない場合は名前のイニシャルを表示します
 * - ホバー時に背景色が変わります（bg-blue-50）
 * - 最後の要素以外には下線が表示されます
 * - Tailwind CSS標準クラスのみを使用（DADS準拠）
 * - フォーカス時は黄色のリング（ring-yellow-400）が表示されます
 */
export const ProfileList = ({
  name,
  role,
  bio,
  avatarUrl,
}: ProfileListProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex items-center gap-4 py-3 px-4 hover:bg-blue-50 rounded-md transition-colors border-b border-gray-200 last:border-b-0 focus-within:outline-none focus-within:ring-4 focus-within:ring-yellow-400 focus-within:ring-offset-2"
      tabIndex={0}
      role="article"
      aria-label={`${name}のプロフィール`}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={avatarUrl} alt={`${name}のアバター`} />
        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 w-36 shrink-0">
        <div className="font-semibold text-sm text-gray-900">{name}</div>
        <div className="text-xs text-gray-600">{role}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 leading-normal line-clamp-2">
          {bio}
        </p>
      </div>
    </div>
  );
};
