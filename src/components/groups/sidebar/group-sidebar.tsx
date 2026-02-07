import { Plus, Search, Users } from "lucide-react";
import { Member } from "../groups.types";

interface GroupSidebarProps {
  members: Member[];
  selectedMember: Member;
  onSelectMember: (member: Member) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const GroupSidebar = ({
  members,
  selectedMember,
  onSelectMember,
  searchQuery,
  onSearchChange,
}: GroupSidebarProps) => {
  return (
    <div className="w-64 border-l border-white/20 bg-white/10 backdrop-blur-md flex flex-col h-full shrink-0 shadow-lg z-20">
      <div className="p-3 border-b border-white/20 bg-white/5 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
          <Users size={14} /> メンバーリスト
        </span>
        <button
          aria-label="メンバーを追加"
          className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="p-3 bg-white/5">
        <div className="relative">
          <Search className="absolute left-2 top-2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="メンバー検索..."
            className="w-full bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded px-7 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelectMember(member)}
            className={`w-full flex items-center gap-2 px-4 py-3 border-b border-white/10 text-left transition-all ${
              selectedMember.id === member.id
                ? "bg-indigo-50/50 dark:bg-indigo-900/30 border-r-4 border-r-indigo-600"
                : "hover:bg-white/20 dark:hover:bg-white/5"
            }`}
          >
            <span className="text-xl">{member.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                {member.name}
              </div>
              <div className="text-[9px] text-gray-400 truncate">
                #{member.traits.join(" #")}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
