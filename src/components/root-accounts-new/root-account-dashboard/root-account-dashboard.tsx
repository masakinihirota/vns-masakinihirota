import React from "react";
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
import {
  RootAccount,
  UserProfile,
  PointsTransaction,
  MOCK_DB,
} from "./root-account-dashboard.logic";

// --- Local UI Components to match Sample exactly ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
    <div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "destructive" | "success";
}) => {
  const styles = {
    default: "bg-slate-100 text-slate-800",
    outline: "border border-slate-200 text-slate-600",
    destructive: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

const Button = ({
  children,
  variant = "primary",
  icon: Icon,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: React.ElementType; // Changed from any to React.ElementType
  onClick?: () => void;
  className?: string;
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const Input = ({
  label,
  value,
  readOnly = false,
}: {
  label: string;
  value: string | number;
  readOnly?: boolean;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <div
      className={`w-full px-3 py-2 rounded-md border ${readOnly ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-white border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"}`}
    >
      {value}
    </div>
  </div>
);

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${active ? "text-indigo-600" : "text-slate-400"}`} />
        {label}
      </div>
      {badge && (
        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  color: "indigo" | "emerald" | "blue" | "red" | "slate";
}

function StatsCard({ icon: Icon, label, value, subValue, color }: StatsCardProps) {
  const colorStyles: Record<string, { bg: string; text: string }> = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    red: { bg: "bg-red-50", text: "text-red-600" },
    slate: { bg: "bg-slate-100", text: "text-slate-600" },
  };
  const style = colorStyles[color] || colorStyles.slate;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-3 hover:shadow-md transition-shadow">
      <div className={`p-2 rounded-lg ${style.bg} ${style.text} flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
        <h3 className="text-lg font-bold text-slate-900 leading-tight my-0.5">{value}</h3>
        {subValue && <p className="text-[10px] text-slate-400 truncate">{subValue}</p>}
      </div>
    </div>
  );
}

// --- Main Presentation Component ---

interface RootAccountDashboardProps {
  activeTab: "overview" | "settings";
  setActiveTab: (tab: "overview" | "settings") => void;
  account: RootAccount;
  profiles: UserProfile[];
  transactions: PointsTransaction[];
}

export function RootAccountDashboard({
  activeTab,
  setActiveTab,
  account,
  profiles,
  transactions,
}: RootAccountDashboardProps) {
  // Layout Note: Using -m-6 to breakout of the parent container's padding
  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">RootAdmin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem
            icon={LayoutDashboard}
            label="管理ホーム"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarItem
            icon={Settings}
            label="設定"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              {account.display_name.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{account.display_name}</p>
              <p className="text-xs text-slate-500 truncate">Root Owner</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            icon={LogOut}
          >
            ログアウト
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto w-full">
        {/* Header Area */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === "overview" && "アカウント管理"}
              {activeTab === "settings" && "設定"}
            </h1>
            <p className="text-slate-500 mt-1">
              ルートアカウントID:{" "}
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                {account.id}
              </span>
            </p>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* 1. 最優先: ユーザープロフィール管理 (Profiles) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-slate-800">ユーザープロフィール管理</h2>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {profiles.length}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`relative group bg-white rounded-xl border transition-all duration-200 p-5 flex flex-col md:flex-row md:items-center gap-4 ${
                      profile.is_active
                        ? "border-indigo-500 shadow-md ring-1 ring-indigo-500"
                        : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Status Badge */}
                    {profile.is_active && (
                      <div className="absolute top-3 right-3 md:top-auto md:right-5 md:static order-first md:order-last">
                        <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                    )}

                    {/* Icon & Name Section */}
                    <div className="flex items-center space-x-4 min-w-[200px]">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm flex-shrink-0 ${
                          profile.is_active
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {profile.name.slice(0, 1)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{profile.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{profile.role}</p>
                      </div>
                    </div>

                    {/* Description Section - Expands to fill space */}
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 md:ml-2">
                      <p className="text-sm text-slate-600 line-clamp-2 md:line-clamp-1">
                        {profile.description || "説明文が設定されていません。"}
                      </p>
                    </div>

                    {/* Action Buttons Section */}
                    <div className="flex items-center space-x-3 w-full md:w-auto pt-2 md:pt-0 justify-end">
                      {profile.is_active ? (
                        <Button
                          variant="secondary"
                          className="flex-1 md:flex-none h-9 text-xs"
                          icon={Edit3}
                        >
                          編集
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="flex-1 md:flex-none h-9 text-xs bg-slate-900 hover:bg-slate-800"
                          icon={ArrowRightLeft}
                        >
                          切り替え
                        </Button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add New Button as a List Item */}
                <button className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors group text-slate-500 hover:text-indigo-600">
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">新しいプロフィールを作成</span>
                </button>
              </div>
            </section>

            {/* 2. 次点: 資産・ステータス・ポイント管理 (Assets & Activity) */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-800">資産・アクティビティ管理</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards - Compact Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard
                    icon={Award}
                    label="現在のレベル"
                    value={`Lv.${account.level}`}
                    subValue="Next: 460 exp"
                    color="indigo"
                  />
                  <StatsCard
                    icon={CreditCard}
                    label="保有ポイント"
                    value={account.total_points.toLocaleString()}
                    subValue="pts"
                    color="emerald"
                  />
                  <StatsCard
                    icon={AlertTriangle}
                    label="アカウント健全性"
                    value="正常"
                    subValue={`警告: ${account.warning_count}`}
                    color={account.warning_count > 0 ? "red" : "emerald"}
                  />
                  <StatsCard
                    icon={Calendar}
                    label="最終ログイン"
                    value="今日"
                    subValue="09:30 AM"
                    color="slate"
                  />
                </div>

                {/* Points Transaction History */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader
                      title="最近のポイント履歴"
                      action={
                        <Button variant="ghost" className="text-xs h-8">
                          すべて見る
                        </Button>
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                      {transactions.slice(0, 3).map((tx) => (
                        <div
                          key={tx.id}
                          className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full flex-shrink-0 ${tx.delta > 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
                            >
                              {tx.delta > 0 ? (
                                <Plus className="w-4 h-4" />
                              ) : (
                                <Activity className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {tx.description}
                              </p>
                              <p className="text-xs text-slate-500">{tx.created_at}</p>
                            </div>
                          </div>
                          <span
                            className={`font-mono font-bold ml-2 ${tx.delta > 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {tx.delta > 0 ? "+" : ""}
                            {tx.delta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            {/* 3. 最下部: 固定データ (Root Account Basic Info) */}
            <section className="pb-10">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-slate-500" />
                <h2 className="text-lg font-bold text-slate-700">ルートアカウント基本情報</h2>
              </div>

              <Card className="bg-slate-50 border-slate-200">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Input label="ルート表示名" value={account.display_name} />
                  <Input label="ユニークID" value={account.display_id} readOnly />
                  <Input
                    label="母国語"
                    value={
                      MOCK_DB.languages.find((l) => l.id === account.mother_tongue_code)
                        ?.native_name || account.mother_tongue_code
                    }
                    readOnly
                  />
                  <Input
                    label="サイト言語"
                    value={
                      MOCK_DB.languages.find((l) => l.id === account.site_language_code)
                        ?.native_name || account.site_language_code
                    }
                    readOnly
                  />
                  <Input label="登録エリア" value={account.location} readOnly />
                  <Input label="世代" value={account.birth_generation} readOnly />
                  <div className="md:col-span-2">
                    <Input label="自己紹介 (Statement)" value={account.statement} />
                  </div>
                </div>
                <div className="bg-white px-6 py-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs text-slate-400">最終更新: {account.created_at}</span>
                  <Button variant="secondary" className="h-9 text-sm" icon={Edit3}>
                    基本情報を編集
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
