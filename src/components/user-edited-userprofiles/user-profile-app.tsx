/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Home,
  Search,
  Settings,
  Plus,
  Edit3,
  Save,
  X,
  Briefcase,
  Heart,
  Zap,
  Layers,
  Box,
  FileText,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Image as ImageIcon,
  ArrowLeft,
  BookOpen,
  Clapperboard,
  MonitorPlay,
  Trash2,
  Info,
  Moon,
  Sun,
  Check,
  Trophy,
  Loader2,
  AlertCircle,
  Clock,
  History,
  Target,
} from "lucide-react";
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";

// --- Types ---

type SlotType = "work" | "value" | "skill";
type SectionId =
  | "work_future"
  | "work_current"
  | "work_life"
  | "value"
  | "skill";

interface Slot {
  id: string;
  type: SlotType;
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  author?: string;
  tier?: 1 | 2 | 3;
}

interface Package {
  id: string;
  type: SlotType;
  title: string;
  category: string;
  description?: string;
  items: Slot[];
}

interface UserProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  attributes: {
    purpose: string;
    role: string;
    type: string;
  };
  equippedSlots: {
    worksFuture: Slot[];
    worksCurrent: Slot[];
    worksLife: Slot[];
    values: Slot[];
    skills: Slot[];
  };
  equippedPackages: {
    worksFuture: Package[];
    worksCurrent: Package[];
    worksLife: Package[];
    values: Package[];
    skills: Package[];
  };
}

// --- Mock Data ---

const ITEMS: Record<string, Slot> = {
  // Manga
  op: {
    id: "w-m1",
    type: "work",
    category: "漫画",
    title: "ONE PIECE",
    author: "尾田 栄一郎",
    tier: 1,
  },
  bg: {
    id: "w-m2",
    type: "work",
    category: "漫画",
    title: "BLUE GIANT",
    author: "石塚 真一",
    tier: 1,
  },
  frieren: {
    id: "w-m3",
    type: "work",
    category: "漫画",
    title: "葬送のフリーレン",
    author: "山田鐘人",
    tier: 2,
  },
  jjk: {
    id: "w-m4",
    type: "work",
    category: "漫画",
    title: "呪術廻戦",
    author: "芥見 下々",
    tier: 2,
  },
  spy: {
    id: "w-m5",
    type: "work",
    category: "漫画",
    title: "SPYxFAMILY",
    author: "遠藤 達哉",
    tier: 3,
  },
  naruto: {
    id: "w-m6",
    type: "work",
    category: "漫画",
    title: "NARUTO",
    author: "岸本 斉史",
    tier: 1,
  },
  slam: {
    id: "w-m7",
    type: "work",
    category: "漫画",
    title: "SLAM DUNK",
    author: "井上 雄彦",
    tier: 1,
  },

  // Anime
  eva: {
    id: "w-a1",
    type: "work",
    category: "アニメ",
    title: "新世紀エヴァンゲリオン",
    author: "庵野 秀明",
    tier: 1,
  },
  bebop: {
    id: "w-a2",
    type: "work",
    category: "アニメ",
    title: "COWBOY BEBOP",
    author: "渡辺 信一郎",
    tier: 1,
  },
  gits: {
    id: "w-a3",
    type: "work",
    category: "アニメ",
    title: "攻殻機動隊 SAC",
    author: "神山 健治",
    tier: 2,
  },

  // Movie
  inter: {
    id: "w-mv1",
    type: "work",
    category: "映画",
    title: "インターステラー",
    author: "C. Nolan",
    tier: 1,
  },
  lala: {
    id: "w-mv2",
    type: "work",
    category: "映画",
    title: "ラ・ラ・ランド",
    author: "D. Chazelle",
    tier: 2,
  },

  // Values
  kaizen: {
    id: "v1",
    type: "value",
    category: "Mindset",
    title: "継続的改善",
    description: "昨日より少し良くする",
  },
  user: {
    id: "v2",
    type: "value",
    category: "Product",
    title: "ユーザーファースト",
    description: "使う人の痛みを解決する",
  },
  open: {
    id: "v3",
    type: "value",
    category: "Team",
    title: "透明性",
    description: "情報はオープンに",
  },

  // Skills
  react: { id: "s1", type: "skill", category: "Frontend", title: "React" },
  ts: { id: "s2", type: "skill", category: "Language", title: "TypeScript" },
  ui: { id: "s3", type: "skill", category: "Design", title: "UI Design" },
  python: { id: "s4", type: "skill", category: "Backend", title: "Python" },
};

const MOCK_PACKAGES: Package[] = [
  {
    id: "pkg-m1",
    type: "work",
    category: "漫画",
    title: "王道・冒険セット",
    description: "ジャンプ系を中心とした熱い作品群",
    items: [ITEMS.op, ITEMS.naruto, ITEMS.jjk, ITEMS.slam],
  },
  {
    id: "pkg-m2",
    type: "work",
    category: "漫画",
    title: "感動・ドラマセット",
    description: "涙なしでは読めない名作",
    items: [ITEMS.op, ITEMS.bg, ITEMS.frieren, ITEMS.lala],
  },
  {
    id: "pkg-a1",
    type: "work",
    category: "アニメ",
    title: "SF・サイバーパンク",
    description: "近未来の世界観",
    items: [ITEMS.eva, ITEMS.gits, ITEMS.bebop],
  },
  {
    id: "pkg-mv1",
    type: "work",
    category: "映画",
    title: "映像美・名作選",
    description: "圧倒的なビジュアル体験",
    items: [ITEMS.inter, ITEMS.lala],
  },
  {
    id: "pkg-v1",
    type: "value",
    category: "Values",
    title: "スタートアップ思考",
    description: "スピードと成長を重視",
    items: [ITEMS.kaizen, ITEMS.user, ITEMS.open],
  },
  {
    id: "pkg-s1",
    type: "skill",
    category: "Skills",
    title: "モダンフロントエンド",
    description: "Reactエコシステム",
    items: [ITEMS.react, ITEMS.ts, ITEMS.ui],
  },
];

const MOCK_PROFILES: UserProfile[] = [
  {
    id: "u1",
    name: "佐藤 健太",
    handle: "@kenta_dev",
    bio: "フロントエンドエンジニア。UXデザインに関心があります。",
    avatarUrl: "https://placehold.co/100x100/2563eb/white?text=K",
    coverUrl: "https://placehold.co/800x200/1e293b/white?text=Cover",
    attributes: {
      purpose: "技術課題解決",
      role: "Builder",
      type: "Protagonist",
    },
    equippedSlots: {
      worksFuture: [],
      worksCurrent: [ITEMS.bg],
      worksLife: [ITEMS.op],
      values: [],
      skills: [ITEMS.react],
    },
    equippedPackages: {
      worksFuture: [],
      worksCurrent: [MOCK_PACKAGES[3]],
      worksLife: [MOCK_PACKAGES[0]],
      values: [MOCK_PACKAGES[4]],
      skills: [],
    },
  },
];

// --- Helper Functions ---

// Tierのローテーションロジック
const getNextTier = (current?: number): 1 | 2 | 3 | undefined => {
  if (current === 1) return 2;
  if (current === 2) return 3;
  if (current === 3) return undefined;
  return 1;
};

// --- Generic UI Components ---

const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: any) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const sizes = {
    default: "h-8 px-3 py-1",
    sm: "h-6 px-2 text-xs",
    icon: "h-6 w-6",
  };
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    ghost:
      "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    destructive:
      "bg-white text-red-500 border border-slate-200 hover:bg-red-50 hover:border-red-200 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-red-900/20",
  };
  return (
    <button
      className={`${baseStyle} ${sizes[size as keyof typeof sizes]} ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: any) => (
  <input
    className={`flex h-8 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:focus-visible:ring-blue-400 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }: any) => (
  <textarea
    className={`flex min-h-[60px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:focus-visible:ring-blue-400 ${className}`}
    {...props}
  />
);

// --- List Items ---

const TierBadge = ({
  tier,
  onClick,
}: {
  tier?: number;
  onClick?: () => void;
}) => {
  const colors = {
    1: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    2: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    3: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    none: "bg-slate-50 text-slate-300 border-slate-100 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800",
  };

  const currentStyle = tier ? colors[tier as 1 | 2 | 3] : colors.none;
  const content = tier ? `Tier ${tier}` : "No Tier";

  if (onClick) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`text-[10px] font-bold px-1.5 rounded border whitespace-nowrap transition-all hover:opacity-80 active:scale-95 ${currentStyle}`}
        title="クリックでTierを変更"
      >
        {content}
      </button>
    );
  }

  if (!tier) return null;

  return (
    <span
      className={`text-[10px] font-bold px-1.5 rounded border ${currentStyle} whitespace-nowrap`}
    >
      {content}
    </span>
  );
};

const CompactSlotItem = ({
  item,
  onAction,
  actionIcon,
  onClick,
  onTierChange,
  isEquipped = false,
  isRegistered = false,
  isPackageMember = false,
}: {
  item: Slot;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  onClick?: () => void;
  onTierChange?: () => void;
  isEquipped?: boolean;
  isRegistered?: boolean;
  isPackageMember?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-2 px-2 py-1.5 border-b border-slate-100 last:border-0 text-sm transition-colors
        dark:border-slate-800
        ${isEquipped ? "bg-white dark:bg-slate-900" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${isRegistered
          ? "bg-blue-50 dark:bg-blue-900/20 text-slate-600 dark:text-slate-300"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
        }
      `}
    >
      {isEquipped && (
        <GripVertical className="w-3 h-3 text-slate-300 dark:text-slate-600 cursor-grab" />
      )}

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span
          className={`font-medium truncate ${isRegistered ? "text-blue-700 dark:text-blue-300" : ""}`}
        >
          {item.title}
        </span>
        {item.author && (
          <>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-500 truncate">
              {item.author}
            </span>
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {!isEquipped && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">
            {item.category}
          </span>
        )}

        <TierBadge tier={item.tier} onClick={onTierChange} />
      </div>

      {isRegistered && !isEquipped ? (
        <div
          className="w-6 h-6 flex items-center justify-center text-blue-500 dark:text-blue-400"
          title={
            isPackageMember
              ? "セットに含まれています"
              : "登録済み (クリックで解除)"
          }
        >
          {isPackageMember ? (
            <Layers className="w-3 h-3 opacity-50" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </div>
      ) : (
        onAction &&
        actionIcon && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {actionIcon}
          </button>
        )
      )}
    </div>
  );
};

// --- Equipped Package Component ---
const EquippedPackageItem = ({
  pkg,
  onRemove,
  onUpdateTier,
}: {
  pkg: Package;
  onRemove: () => void;
  onUpdateTier: (itemId: string, currentTier?: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden mb-2">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-transform">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1 rounded">
            <Layers className="w-3 h-3" />
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                {pkg.title}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 rounded-full">
                {pkg.items.length}
              </span>
            </div>
            {!isOpen && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full">
                {pkg.items.map((i) => i.title).join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] gap-1 px-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            onClick={(e: any) => {
              e.stopPropagation(); /* 編集ロジック */
            }}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-6 w-6 p-0 border-0 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e: any) => {
              e.stopPropagation();
              onRemove();
            }}
            title="このセットをまとめて削除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 pl-8">
          {pkg.items.map((item) => (
            <CompactSlotItem
              key={item.id}
              item={item}
              isEquipped={false}
              onTierChange={() => onUpdateTier(item.id, item.tier)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Layout Parts ---

const GlobalNav = ({
  isDarkMode,
  toggleDarkMode,
}: {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}) => (
  <nav className="w-12 bg-slate-900 dark:bg-black flex flex-col items-center py-3 gap-4 shrink-0 z-20 border-r border-slate-800">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-900/20">
      V
    </div>
    <div className="flex flex-col gap-2 w-full px-1">
      <Button
        variant="ghost"
        className="w-full h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
      >
        <Home className="w-4 h-4" />
      </Button>
    </div>
    <div className="mt-auto flex flex-col gap-2">
      <Button
        variant="ghost"
        className="w-full h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        className="w-full h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  </nav>
);

const ProfileListSidebar = ({ profiles, activeId, onSelect }: any) => (
  <div className="w-56 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
    <div className="h-10 flex items-center px-3 border-b border-slate-200 dark:border-slate-800">
      <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Profiles
      </h2>
    </div>
    <div className="p-2 space-y-1 flex-1 overflow-y-auto">
      {profiles.map((p: any) => (
        <div
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`
            flex items-center gap-2 p-2 rounded-md cursor-pointer border transition-colors
            ${p.id === activeId
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              : "bg-white dark:bg-slate-900 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
            }
          `}
        >
          <img
            src={p.avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium truncate leading-tight ${p.id === activeId ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-slate-200"}`}
            >
              {p.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500 truncate">
              {p.handle}
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        className="w-full mt-2 text-xs border-dashed text-slate-500 dark:text-slate-400 h-8 dark:border-slate-700 dark:bg-slate-900/50"
      >
        <Plus className="w-3 h-3 mr-1" /> Add Profile
      </Button>
    </div>
  </div>
);

// インベントリサイドバー
const InventorySidebar = ({
  activeSectionId,
  onEquipPackage,
  onEquipItem,
  onRemoveItem,
  onUpdateTier,
  localTiers,
  setLocalTiers,
  profile,
}: {
  activeSectionId: SectionId;
  onEquipPackage: (pkg: Package) => void;
  onEquipItem: (item: Slot) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateTier: (itemId: string, newTier?: 1 | 2 | 3) => void;
  localTiers: Record<string, 1 | 2 | 3 | undefined>;
  setLocalTiers: React.Dispatch<
    React.SetStateAction<Record<string, 1 | 2 | 3 | undefined>>
  >;
  profile: UserProfile;
}) => {
  const [selectedWorkCategory, setSelectedWorkCategory] = useState<
    string | null
  >(null);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const currentSlotType: SlotType = activeSectionId.startsWith("work")
    ? "work"
    : (activeSectionId as SlotType);

  // Key取得ヘルパー
  const getProfileKeys = (
    sectionId: SectionId
  ): keyof UserProfile["equippedSlots"] => {
    if (sectionId === "work_future") return "worksFuture";
    if (sectionId === "work_current") return "worksCurrent";
    if (sectionId === "work_life") return "worksLife";
    if (sectionId === "value") return "values";
    if (sectionId === "skill") return "skills";
    return "worksCurrent";
  };
  const currentProfileKey = getProfileKeys(activeSectionId);

  const WORK_CATEGORIES = [
    { id: "漫画", label: "漫画", icon: BookOpen },
    { id: "アニメ", label: "アニメ", icon: MonitorPlay },
    { id: "映画", label: "映画", icon: Clapperboard },
    { id: "小説", label: "小説", icon: BookOpen },
  ];

  // 全セクションから登録済みかチェックする関数 (一括同期のため)
  const isItemRegisteredGlobally = (itemId: string) => {
    const allKeys: (keyof UserProfile["equippedSlots"])[] = [
      "worksFuture",
      "worksCurrent",
      "worksLife",
      "values",
      "skills",
    ];
    for (const key of allKeys) {
      if (profile.equippedSlots[key].some((i) => i.id === itemId)) return true;
      if (
        profile.equippedPackages[key].some((pkg) =>
          pkg.items.some((i) => i.id === itemId)
        )
      )
        return true;
    }
    return false;
  };

  const isPackageRegistered = (pkgId: string) =>
    profile.equippedPackages[currentProfileKey].some((p) => p.id === pkgId);
  // 表示中のセクションでの登録状態（チェックマーク用）
  const isItemRegisteredInCurrentSection = (itemId: string) => {
    const isSlot = profile.equippedSlots[currentProfileKey].some(
      (i) => i.id === itemId
    );
    const isPkg = profile.equippedPackages[currentProfileKey].some((pkg) =>
      pkg.items.some((i) => i.id === itemId)
    );
    return isSlot || isPkg;
  };
  // パッケージ内かどうか（現在のセクション）
  const isItemInPackageInCurrentSection = (itemId: string) =>
    profile.equippedPackages[currentProfileKey].some((pkg) =>
      pkg.items.some((i) => i.id === itemId)
    );

  const getNextTier = (current?: number): 1 | 2 | 3 | undefined => {
    if (current === 1) return 2;
    if (current === 2) return 3;
    if (current === 3) return undefined;
    return 1;
  };

  const handleTierClick = (item: Slot) => {
    const current = item.tier;
    const next = getNextTier(current);

    if (isItemRegisteredGlobally(item.id)) {
      // どこかに登録されていれば一括更新
      onUpdateTier(item.id, next);
    } else {
      setLocalTiers((prev) => ({ ...prev, [item.id]: next }));
    }
  };

  const handleItemRowClick = (item: Slot) => {
    if (isItemInPackageInCurrentSection(item.id)) return;

    if (
      profile.equippedSlots[currentProfileKey].some((i) => i.id === item.id)
    ) {
      onRemoveItem(item.id);
    } else {
      const tierToEquip = localTiers[item.id] ?? item.tier;
      onEquipItem({ ...item, tier: tierToEquip });
    }
  };

  const getDisplayItem = (originalItem: Slot) => {
    // 登録済みならそのデータを優先（Tier同期）
    const allKeys: (keyof UserProfile["equippedSlots"])[] = [
      "worksFuture",
      "worksCurrent",
      "worksLife",
      "values",
      "skills",
    ];
    for (const key of allKeys) {
      const slot = profile.equippedSlots[key].find(
        (i) => i.id === originalItem.id
      );
      if (slot) return slot;
      const pkgItem = profile.equippedPackages[key]
        .flatMap((p) => p.items)
        .find((i) => i.id === originalItem.id);
      if (pkgItem) return pkgItem;
    }

    return {
      ...originalItem,
      tier: localTiers[originalItem.id] ?? originalItem.tier,
    };
  };

  const getAvailablePackages = useCallback(() => {
    return MOCK_PACKAGES.filter((pkg: Package) => {
      if (pkg.type !== currentSlotType) return false;
      if (
        currentSlotType === "work" &&
        selectedWorkCategory &&
        pkg.category !== selectedWorkCategory
      )
        return false;
      return true;
    });
  }, [currentSlotType, selectedWorkCategory]);

  const filteredPackages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return getAvailablePackages().filter((pkg) => {
      if (!query) return true;
      return (
        pkg.title.toLowerCase().includes(query) ||
        pkg.items.some((i: Slot) => i.title.toLowerCase().includes(query))
      );
    });
  }, [getAvailablePackages, searchQuery]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return Object.values(ITEMS).filter((item) => {
      if (item.type !== currentSlotType) return false;
      if (
        currentSlotType === "work" &&
        selectedWorkCategory &&
        item.category !== selectedWorkCategory
      )
        return false;
      if (!query) return true;
      return item.title.toLowerCase().includes(query);
    });
  }, [currentSlotType, selectedWorkCategory, searchQuery]);

  const renderPackageItem = (pkg: Package) => {
    const isExpanded = expandedPackageId === pkg.id || searchQuery.length > 0;
    const registered = isPackageRegistered(pkg.id);

    return (
      <div
        key={pkg.id}
        className={`
          border rounded-lg overflow-hidden shadow-sm transition-all
          ${registered
            ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
          }
        `}
      >
        <div
          className="p-3 cursor-pointer"
          onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded shrink-0 ${registered ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
              >
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4
                  className={`text-sm font-bold leading-tight truncate ${registered ? "text-blue-800 dark:text-blue-200" : "text-slate-800 dark:text-slate-200"}`}
                >
                  {pkg.title}
                </h4>
                <div
                  className={`text-[10px] mt-0.5 ${registered ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-500"}`}
                >
                  {pkg.items.length} items
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-end shrink-0">
              {registered ? (
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 px-2 h-7">
                  <Check className="w-3 h-3" />{" "}
                  <span className="hidden sm:inline">Added</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="h-7 text-[10px] gap-1 px-2 w-full"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onEquipPackage(pkg);
                  }}
                >
                  <Plus className="w-3 h-3" /> セット追加
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] gap-1 px-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                onClick={(e: any) => {
                  e.stopPropagation();
                }}
              >
                <Edit3 className="w-3 h-3" /> 編集
              </Button>
            </div>
          </div>
          {pkg.description && (
            <p
              className={`text-xs mt-2 pl-1 border-l-2 truncate ${registered ? "text-blue-600/70 dark:text-blue-400/70 border-blue-200 dark:border-blue-800" : "text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800"}`}
            >
              {pkg.description}
            </p>
          )}
        </div>
        {isExpanded && (
          <div
            className={`border-t pl-8 ${registered ? "border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/20" : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30"}`}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              Included
            </div>
            {pkg.items.map((item) => {
              const displayItem = getDisplayItem(item);
              return (
                <CompactSlotItem
                  key={item.id}
                  item={displayItem}
                  isRegistered={isItemRegisteredInCurrentSection(item.id)}
                  isPackageMember={true}
                  onTierChange={() => handleTierClick(displayItem)}
                />
              );
            })}
          </div>
        )}
        {!isExpanded && (
          <div
            onClick={() => setExpandedPackageId(pkg.id)}
            className={`p-1 flex justify-center cursor-pointer ${registered ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30" : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
          >
            <ChevronDown
              className={`w-3 h-3 ${registered ? "text-blue-400 dark:text-blue-300" : "text-slate-400 dark:text-slate-500"}`}
            />
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (currentSlotType === "work" && !selectedWorkCategory) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {WORK_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedWorkCategory(cat.id)}
              className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <cat.icon className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 mb-2 transition-colors" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      );
    }

    const allPackages = getAvailablePackages();
    const isPackageEmpty = allPackages.length === 0;

    return (
      <div className="space-y-6">
        <div className="sticky top-0 bg-slate-50 dark:bg-slate-950 z-10 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="作品名・セット名を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-blue-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Layers className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              セット(スロット)
            </h3>
          </div>

          {isPackageEmpty ? (
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-3 text-center">
              <Box className="w-8 h-8 text-blue-300 dark:text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                スロットは未作成です
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mb-3 leading-relaxed">
                よく使う作品の組み合わせを「セット」として保存できます。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7 bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Plus className="w-3 h-3 mr-1" /> スロット作成
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPackages.map((pkg) => renderPackageItem(pkg))}
              {filteredPackages.length === 0 && searchQuery && (
                <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center py-2 border border-dashed border-slate-200 dark:border-slate-800 rounded">
                  該当なし
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <FileText className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              単品リスト
            </h3>
          </div>
          <div className="space-y-0 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
            {filteredItems.map((item) => {
              const displayItem = getDisplayItem(item);
              return (
                <div
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <CompactSlotItem
                    item={displayItem}
                    isRegistered={isItemRegisteredInCurrentSection(item.id)}
                    isPackageMember={isItemInPackageInCurrentSection(item.id)}
                    onClick={() => handleItemRowClick(displayItem)}
                    onTierChange={() => handleTierClick(displayItem)}
                    actionIcon={<Plus className="w-4 h-4" />}
                  />
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center py-4">
                該当なし
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const sectionLabel = (() => {
    switch (activeSectionId) {
      case "work_future":
        return "Works (Future)";
      case "work_current":
        return "Works (Current)";
      case "work_life":
        return "Works (Life)";
      case "value":
        return "Values";
      case "skill":
        return "Skills";
      default:
        return "";
    }
  })();

  const currentInfo = {
    bg: activeSectionId.startsWith("work")
      ? "bg-blue-50 dark:bg-blue-950/30"
      : activeSectionId === "value"
        ? "bg-pink-50 dark:bg-pink-950/30"
        : "bg-amber-50 dark:bg-amber-950/30",
    color: activeSectionId.startsWith("work")
      ? "text-blue-600 dark:text-blue-400"
      : activeSectionId === "value"
        ? "text-pink-600 dark:text-pink-400"
        : "text-amber-600 dark:text-amber-400",
    icon: activeSectionId.startsWith("work")
      ? Briefcase
      : activeSectionId === "value"
        ? Heart
        : Zap,
  };
  const CurrentIcon = currentInfo.icon;

  return (
    <div className="w-[340px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-10 shadow-xl shadow-slate-200/50 dark:shadow-black/50">
      <div
        className={`h-10 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 ${currentInfo.bg}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {activeSectionId.startsWith("work") && selectedWorkCategory && (
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 -ml-2 mr-1 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              onClick={() => {
                setSelectedWorkCategory(null);
                setSearchQuery("");
              }}
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </Button>
          )}
          <h2
            className={`font-semibold text-sm flex items-center gap-2 truncate ${currentInfo.color}`}
          >
            <CurrentIcon className="w-4 h-4 shrink-0" />
            {activeSectionId.startsWith("work") && selectedWorkCategory
              ? selectedWorkCategory
              : sectionLabel}
          </h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 bg-slate-50/30 dark:bg-black/20">
        {renderContent()}
      </div>
    </div>
  );
};

// --- Main Area ---

const MainEditor = ({
  profile,
  activeSection,
  onSectionSelect,
  onUpdate,
  onUpdateTier,
  onSave,
  isSaving,
  isDirty,
}: any) => {
  const getKeys = (
    sectionId: SectionId
  ): keyof UserProfile["equippedSlots"] => {
    if (sectionId === "work_future") return "worksFuture";
    if (sectionId === "work_current") return "worksCurrent";
    if (sectionId === "work_life") return "worksLife";
    if (sectionId === "value") return "values";
    if (sectionId === "skill") return "skills";
    return "worksCurrent";
  };

  const handleRemoveSlot = (slotId: string, sectionId: SectionId) => {
    const key = getKeys(sectionId);
    const updated = profile.equippedSlots[key].filter(
      (s: any) => s.id !== slotId
    );
    onUpdate({
      ...profile,
      equippedSlots: { ...profile.equippedSlots, [key]: updated },
    });
  };

  const handleRemovePackage = (packageIndex: number, sectionId: SectionId) => {
    const key = getKeys(sectionId);
    const updated = [...profile.equippedPackages[key]];
    updated.splice(packageIndex, 1);
    onUpdate({
      ...profile,
      equippedPackages: { ...profile.equippedPackages, [key]: updated },
    });
  };

  const getSectionStyle = (sectionId: SectionId) => {
    const isActive = activeSection === sectionId;
    const base =
      "border rounded-lg transition-all duration-200 relative overflow-hidden";
    if (isActive) {
      let colors = "";
      if (sectionId.startsWith("work")) {
        colors =
          "border-blue-400 dark:border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900/30 bg-white dark:bg-slate-900";
      } else if (sectionId === "value") {
        colors =
          "border-pink-400 dark:border-pink-600 ring-2 ring-pink-100 dark:ring-pink-900/30 bg-white dark:bg-slate-900";
      } else {
        colors =
          "border-amber-400 dark:border-amber-600 ring-2 ring-amber-100 dark:ring-amber-900/30 bg-white dark:bg-slate-900";
      }
      return `${base} ${colors}`;
    }
    return `${base} border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700`;
  };

  const renderSectionContent = (
    sectionId: SectionId,
    title: string,
    icon: any
  ) => {
    const key = getKeys(sectionId);
    const packages: Package[] = profile.equippedPackages[key];
    const items: Slot[] = profile.equippedSlots[key];
    const totalCount =
      packages.reduce((acc, p) => acc + p.items.length, 0) + items.length;

    return (
      <section
        className={getSectionStyle(sectionId)}
        onClick={() => onSectionSelect(sectionId)}
      >
        <div
          className={`px-3 py-2 flex items-center justify-between border-b ${activeSection === sectionId ? "bg-opacity-50 dark:bg-slate-900/50" : "bg-slate-100 dark:bg-slate-800"}`}
        >
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 capitalize">
            {React.createElement(icon, { className: "w-3 h-3" })}
            {title}
          </h3>
          <span className="text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 rounded border border-slate-200 dark:border-slate-700">
            {totalCount} items
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 min-h-[32px] p-2 space-y-2">
          {packages.length > 0 && (
            <div className="space-y-2">
              {packages.map((pkg, idx) => (
                <EquippedPackageItem
                  key={`${pkg.id}-${idx}`}
                  pkg={pkg}
                  onRemove={() => handleRemovePackage(idx, sectionId)}
                  onUpdateTier={(itemId, currentTier) => {
                    const next = getNextTier(currentTier);
                    onUpdateTier(itemId, next);
                  }}
                />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div
              className={`space-y-0 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden ${packages.length > 0 ? "mt-4" : ""}`}
            >
              {items.map((slot) => (
                <CompactSlotItem
                  key={slot.id}
                  item={slot}
                  isEquipped
                  onAction={() => handleRemoveSlot(slot.id, sectionId)}
                  actionIcon={<X className="w-4 h-4" />}
                  onTierChange={() => {
                    const next = getNextTier(slot.tier);
                    onUpdateTier(slot.id, next);
                  }}
                />
              ))}
            </div>
          )}

          {totalCount === 0 && (
            <div className="text-xs text-slate-400 dark:text-slate-600 text-center py-4">
              アイテムがありません
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/30 dark:bg-black/30 overflow-hidden">
      <div className="h-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Edit3 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
            Editor
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {isDirty && (
            <span className="flex items-center text-[10px] text-amber-600 dark:text-amber-400 animate-pulse mr-2">
              <AlertCircle className="w-3 h-3 mr-1" /> Unsaved
            </span>
          )}
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Preview
          </Button>
          <Button
            size="sm"
            className={`h-7 text-xs gap-1 min-w-[70px] transition-all ${isDirty ? "ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-slate-900" : ""}`}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {isSaving ? "Saving" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 flex gap-4 items-start shadow-sm">
            <div className="w-16 h-16 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden relative group cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  Display Name
                </label>
                <Input
                  value={profile.name}
                  className="h-7 text-sm"
                  onChange={(e: any) =>
                    onUpdate({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  Bio
                </label>
                <Input
                  value={profile.bio}
                  className="h-7 text-sm"
                  onChange={(e: any) =>
                    onUpdate({ ...profile, bio: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
            Equipped Slots
          </div>

          {renderSectionContent("work_future", "Works (Future)", Target)}
          {renderSectionContent("work_current", "Works (Current)", Clock)}
          {renderSectionContent("work_life", "Works (Life)", History)}

          {renderSectionContent("value", "Values", Heart)}
          {renderSectionContent("skill", "Skills", Zap)}
        </div>
      </div>
    </div>
  );
};

// --- App Container ---

const UserProfileApp = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>("u1");
  const [activeSectionId, setActiveSectionId] =
    useState<SectionId>("work_current");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [localTiers, setLocalTiers] = useState<
    Record<string, 1 | 2 | 3 | undefined>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfiles = localStorage.getItem("vns_profiles");
      const savedTiers = localStorage.getItem("vns_local_tiers");
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles)); // eslint-disable-line
      }
      if (savedTiers) {
        setLocalTiers(JSON.parse(savedTiers));
      }
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("vns_profiles", JSON.stringify(profiles));
    localStorage.setItem("vns_local_tiers", JSON.stringify(localTiers));
  }, [profiles, localTiers]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    setIsDirty(true);
  };

  const updateLocalTiers: React.Dispatch<
    React.SetStateAction<Record<string, 1 | 2 | 3 | undefined>>
  > = (value) => {
    setLocalTiers(value);
    setIsDirty(true);
  };

  const handleProfileSelect = (id: string) => {
    if (id === activeProfileId) return;
    if (isDirty) {
      if (
        window.confirm(
          "保存されていない変更があります。移動しますか？\n（未保存の変更は破棄される可能性があります）"
        )
      ) {
        setActiveProfileId(id);
      }
    } else {
      setActiveProfileId(id);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsDirty(false);
      setIsSaving(false);
    }, 800);
  };

  const getKeys = (
    sectionId: SectionId
  ): keyof UserProfile["equippedSlots"] => {
    if (sectionId === "work_future") return "worksFuture";
    if (sectionId === "work_current") return "worksCurrent";
    if (sectionId === "work_life") return "worksLife";
    if (sectionId === "value") return "values";
    if (sectionId === "skill") return "skills";
    return "worksCurrent";
  };

  const handleEquipPackage = (pkg: Package) => {
    const currentType = activeSectionId.startsWith("work")
      ? "work"
      : activeSectionId;
    if (pkg.type !== currentType) return;

    const key = getKeys(activeSectionId);
    const currentPackages = activeProfile.equippedPackages[key];
    const currentItems = activeProfile.equippedSlots[key];

    if (currentPackages.some((p: any) => p.id === pkg.id)) return;

    const newItemsList = currentItems.filter(
      (item: any) => !pkg.items.some((pkgItem) => pkgItem.id === item.id)
    );

    const updatedProfile = {
      ...activeProfile,
      equippedSlots: { ...activeProfile.equippedSlots, [key]: newItemsList },
      equippedPackages: {
        ...activeProfile.equippedPackages,
        [key]: [...currentPackages, pkg],
      },
    };
    handleUpdateProfile(updatedProfile);
  };

  const handleEquipItem = (item: Slot) => {
    const currentType = activeSectionId.startsWith("work")
      ? "work"
      : activeSectionId;
    if (item.type !== currentType) return;

    const key = getKeys(activeSectionId);
    const currentItems = activeProfile.equippedSlots[key];
    const currentPackages = activeProfile.equippedPackages[key];

    const isAlreadyEquipped =
      currentItems.some((i: any) => i.id === item.id) ||
      currentPackages.some((pkg: any) =>
        pkg.items.some((pkgItem: any) => pkgItem.id === item.id)
      );

    if (isAlreadyEquipped) return;

    const updatedProfile = {
      ...activeProfile,
      equippedSlots: {
        ...activeProfile.equippedSlots,
        [key]: [...currentItems, item],
      },
    };
    handleUpdateProfile(updatedProfile);
  };

  const handleRemoveItemById = (itemId: string) => {
    const key = getKeys(activeSectionId);
    const currentItems = activeProfile.equippedSlots[key];
    const updatedItems = currentItems.filter((i: any) => i.id !== itemId);

    const updatedProfile = {
      ...activeProfile,
      equippedSlots: { ...activeProfile.equippedSlots, [key]: updatedItems },
    };
    handleUpdateProfile(updatedProfile);
  };

  const handleUpdateTier = (itemId: string, newTier?: 1 | 2 | 3) => {
    // Iterate over all keys to support global updates
    const keys: (keyof UserProfile["equippedSlots"])[] = [
      "worksFuture",
      "worksCurrent",
      "worksLife",
      "values",
      "skills",
    ];

    let hasChanged = false;
    const newEquippedSlots = { ...activeProfile.equippedSlots };
    const newEquippedPackages = { ...activeProfile.equippedPackages };

    keys.forEach((key) => {
      // 1. Update Slots
      const currentItems = newEquippedSlots[key];
      newEquippedSlots[key] = currentItems.map((item: any) => {
        if (item.id === itemId) {
          hasChanged = true;
          return { ...item, tier: newTier };
        }
        return item;
      });

      // 2. Update Package Items
      const currentPackages = newEquippedPackages[key];
      newEquippedPackages[key] = currentPackages.map((pkg: any) => {
        const updatedItems = pkg.items.map((item: any) => {
          if (item.id === itemId) {
            hasChanged = true;
            return { ...item, tier: newTier };
          }
          return item;
        });
        return { ...pkg, items: updatedItems };
      });
    });

    if (hasChanged) {
      handleUpdateProfile({
        ...activeProfile,
        equippedSlots: newEquippedSlots,
        equippedPackages: newEquippedPackages,
      });
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
        <GlobalNav
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <ProfileListSidebar
          profiles={profiles}
          activeId={activeProfileId}
          onSelect={handleProfileSelect}
        />
        <MainEditor
          profile={activeProfile}
          activeSection={activeSectionId}
          onSectionSelect={setActiveSectionId}
          onUpdate={handleUpdateProfile}
          onUpdateTier={handleUpdateTier} // MainEditorにも渡す
          onSave={handleSave}
          isSaving={isSaving}
          isDirty={isDirty}
        />
        <InventorySidebar
          activeSectionId={activeSectionId}
          onEquipPackage={handleEquipPackage}
          onEquipItem={handleEquipItem}
          onRemoveItem={handleRemoveItemById}
          onUpdateTier={handleUpdateTier}
          localTiers={localTiers}
          setLocalTiers={updateLocalTiers}
          profile={activeProfile}
        />
      </div>
    </div>
  );
};

export default UserProfileApp;
