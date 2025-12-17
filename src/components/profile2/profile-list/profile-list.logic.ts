export interface UserProfileAttributes {
  purpose: string;
  role: string;
  type: "Main" | "Sub" | "Game" | "Work";
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarColor: string;
  lastUpdated: string;
  attributes: UserProfileAttributes;
}

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "p-001",
    name: "Alpha Operator",
    handle: "@alpha_op",
    bio: "メインの開発用アカウント。全システム権限を所有。緊急時のオーバーライドが可能。",
    avatarColor: "bg-blue-600",
    lastUpdated: "2024-05-10 14:30",
    attributes: { purpose: "Development", role: "Admin", type: "Main" },
  },
  {
    id: "p-002",
    name: "Night Owl",
    handle: "@night_gamer",
    bio: "深夜帯のゲーム配信およびコミュニティ活動用。FPS/RTSを中心に活動。",
    avatarColor: "bg-purple-600",
    lastUpdated: "2024-05-09 02:15",
    attributes: { purpose: "Gaming", role: "Player", type: "Game" },
  },
  {
    id: "p-003",
    name: "Public Relations",
    handle: "@official_pr",
    bio: "対外的なアナウンスを行うための広報アカウント。表現は常に丁寧語。",
    avatarColor: "bg-emerald-600",
    lastUpdated: "2024-05-01 09:00",
    attributes: { purpose: "Business", role: "Editor", type: "Work" },
  },
  {
    id: "p-004",
    name: "Ghost Shell",
    handle: "@null_ptr",
    bio: "匿名リサーチおよび情報収集用。足跡を残さない設定。",
    avatarColor: "bg-slate-600",
    lastUpdated: "2024-04-20 11:45",
    attributes: { purpose: "Research", role: "Viewer", type: "Sub" },
  },
];

export const getTypeColor = (type: string) => {
  switch (type) {
    case "Main":
      return "border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
    case "Game":
      return "border-purple-500 text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
    case "Work":
      return "border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    default:
      return "border-slate-500 text-slate-500";
  }
};
