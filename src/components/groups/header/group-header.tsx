import {
  Brain,
  Heart,
  LayoutDashboard,
  ShieldAlert,
  TableProperties,
} from "lucide-react";
import { useMemo } from "react";

export const GroupHeader = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: any) => void;
}) => {
  const tabs = useMemo(
    () => [
      { id: "plaza", label: "広場", icon: LayoutDashboard },
      { id: "evaluation", label: "作品評価", icon: TableProperties },
      { id: "values", label: "価値観", icon: Heart },
      { id: "skills", label: "スキル", icon: Brain },
      { id: "admin", label: "管理室", icon: ShieldAlert },
    ],
    []
  );

  return (
    <header className="h-14 border-b border-white/20 bg-white/70 dark:bg-black/40 backdrop-blur-md flex items-center justify-between px-4 z-30 shrink-0 shadow-sm sticky top-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-md">
            MH
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-white hidden lg:block">
            masakinihirota Lab
          </span>
        </div>

        <nav className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-4 text-xs font-bold transition-all relative ${
                activeTab === tab.id
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <span className="block text-[10px] font-bold text-gray-500 dark:text-gray-400">
            リーダー
          </span>
        </div>
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-lg border border-white/50 dark:border-white/10 shadow-inner">
          😎
        </div>
      </div>
    </header>
  );
};
