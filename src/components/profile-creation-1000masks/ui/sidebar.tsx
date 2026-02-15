import { Plus, Search } from 'lucide-react';
import React from 'react';
import { getMaskIcon, Profile } from '../profile-creation-1000masks.logic';

interface SidebarProps {
  profiles: Profile[];
  activeProfileId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProfileSelect: (id: string) => void;
  onCreateNew: () => void;
  filteredProfiles: Profile[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeProfileId,
  searchQuery,
  onSearchChange,
  onProfileSelect,
  onCreateNew,
  filteredProfiles,
}) => {


  return (
    <div className="w-[28rem] bg-white dark:bg-[#0B0F1A] border-r border-slate-200 dark:border-white/5 flex flex-col shadow-sm shrink-0 h-full transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-white/5 shrink-0">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">V</div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800 dark:text-neutral-100 uppercase">1000 Masks</h1>
        </div>
        <button onClick={onCreateNew} className="w-full flex items-center justify-center space-x-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-4 rounded-[1.25rem] shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-95 font-black text-lg mb-8 text-left">
          <Plus size={20} />
          <span>仮面を新規作成</span>
        </button>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
          <input
            type="text"
            placeholder="Search Masks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-100/50 dark:bg-white/5 border-transparent dark:border-white/10 rounded-xl text-lg font-bold outline-none focus:bg-white dark:focus:bg-[#161B22] focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-neutral-200"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-left scroll-smooth">
        {filteredProfiles.map(p => {
          const Icon = getMaskIcon(p.maskId, p.avatarType);
          const isActive = activeProfileId === p.id;
          const cardStyles = p.isGhost
            ? isActive ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 ring-4 ring-purple-500/5 shadow-lg text-left' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 opacity-80 grayscale hover:grayscale-0 text-left'
            : isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-4 ring-blue-500/5 shadow-lg text-left' : 'bg-white dark:bg-transparent border-transparent dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-left';

          return (
            <button key={p.id} onClick={() => onProfileSelect(p.id)} className={`w-full text-left p-6 rounded-[2rem] transition-all flex flex-col border-2 ${cardStyles}`}>
              <div className="flex items-center w-full mb-2 text-left">
                <div className={`p-3 rounded-xl mr-5 ${isActive ? (p.isGhost ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400') : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600'}`}><Icon size={24} /></div>
                <div className="flex-1 min-w-0 text-left">
                  <p className={`font-black truncate text-lg ${isActive ? (p.isGhost ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300') : 'text-slate-700 dark:text-slate-400'}`}>{p.name}</p>
                </div>
              </div>
              <div className="pl-[4.75rem] w-full flex items-center space-x-2 text-left">
                <p className={`text-lg font-black truncate uppercase tracking-widest ${isActive ? (p.isGhost ? 'text-purple-400 dark:text-purple-500' : 'text-blue-400 dark:text-blue-500') : 'text-slate-400 dark:text-slate-600'}`}>{p.constellationName}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
