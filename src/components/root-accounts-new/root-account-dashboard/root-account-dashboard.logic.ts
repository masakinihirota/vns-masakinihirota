import {
  User,
  Settings,
  Shield,
  Globe,
  Award,
  AlertTriangle,
  CreditCard,
  Activity,
  ChevronRight,
  Plus,
  MoreHorizontal,
  MapPin,
  Calendar,
  Languages,
  LayoutDashboard,
  Users,
  LogOut,
  ArrowRightLeft,
  UserPlus,
  Edit3,
} from "lucide-react";

export type FileStatusEnum = "active" | "suspended" | "archived";

export interface Language {
  id: string;
  name: string;
  native_name: string;
}

export interface RootAccount {
  id: string;
  display_id: string;
  display_name: string;
  statement: string;
  mother_tongue_code: string;
  site_language_code: string;
  location: string;
  birth_generation: string;
  level: number;
  total_points: number;
  warning_count: number;
  status: FileStatusEnum;
  created_at: string;
  last_login_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  role: string;
  is_active: boolean;
  description?: string;
}

export interface PointsTransaction {
  id: number;
  delta: number;
  reason: string;
  description: string;
  created_at: string;
}

// Mock Database
export const MOCK_DB = {
  root_account: {
    id: "uuid-1234-root",
    display_id: "user_001",
    display_name: "山田 太郎",
    statement: "テクノロジーとデザインの融合を目指しています。",
    mother_tongue_code: "ja",
    site_language_code: "ja",
    location: "東京都",
    birth_generation: "1990s",
    level: 12,
    total_points: 1540,
    warning_count: 0,
    status: "active",
    created_at: "2023-01-15T10:00:00Z",
    last_login_at: "2023-10-27T09:30:00Z",
  } as RootAccount,

  languages: [
    { id: "ja", name: "Japanese", native_name: "日本語" },
    { id: "en", name: "English", native_name: "English" },
    { id: "ko", name: "Korean", native_name: "한국어" },
  ] as Language[],

  // Extra requirement: Multiple profiles
  profiles: [
    {
      id: "pf-1",
      name: "メイン (個人)",
      role: "Admin",
      is_active: true,
      description: "プライベートな活動用",
    },
    {
      id: "pf-2",
      name: "Tech Dev",
      role: "Developer",
      is_active: false,
      description: "技術記事の投稿用アカウント",
    },
    {
      id: "pf-3",
      name: "GameMaster",
      role: "User",
      is_active: false,
      description: "ゲームコミュニティ用",
    },
  ] as UserProfile[],

  transactions: [
    {
      id: 101,
      delta: 50,
      reason: "login_bonus",
      description: "週間ログインボーナス",
      created_at: "2023-10-27",
    },
    {
      id: 102,
      delta: 100,
      reason: "contribution",
      description: "記事投稿報酬",
      created_at: "2023-10-25",
    },
    {
      id: 103,
      delta: -20,
      reason: "penalty",
      description: "未活動ペナルティ",
      created_at: "2023-10-20",
    },
  ] as PointsTransaction[],
};
