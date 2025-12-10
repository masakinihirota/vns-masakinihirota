import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileListProps {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
}

/**
 * ユーザープロフィールを表示するリストコンポーネント
 * @param name - ユーザー名
 * @param role - 役割
 * @param bio - 自己紹介
 * @param avatarUrl - アバター画像のURL（オプション）
 */
export const ProfileList = ({ name, role, bio, avatarUrl }: ProfileListProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 py-3 px-4 hover:bg-accent/50 rounded-lg transition-colors border-b last:border-b-0">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 w-36 shrink-0">
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
      </div>
    </div>
  );
};
