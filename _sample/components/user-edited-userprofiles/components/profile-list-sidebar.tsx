import { Plus } from "lucide-react";
import Image from "next/image";

import { ProfileListSidebarProperties } from "../user-profile-app.types";

import { Button } from "./common-ui";

/**
 * プロフィールリストサイドバー
 * @param root0
 * @param root0.profiles
 * @param root0.activeId
 * @param root0.onSelect
 */
export const ProfileListSidebar = ({ profiles, activeId, onSelect }: ProfileListSidebarProperties) => (
  <nav data-testid="profile-list-sidebar" aria-label="プロファイル一覧" className="w-56 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
    <div className="h-10 flex items-center px-3 border-b border-slate-200 dark:border-slate-800">
      <h1 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Profiles
      </h1>
    </div>
    <div className="p-2 space-y-1 flex-1 overflow-y-auto">
      {profiles.map((p) => (
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
          <Image
            src={p.avatarUrl}
            alt=""
            width={32}
            height={32}
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
  </nav>
);
