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
    <div className="w-[28rem] bg-white border-r border-slate-200 flex flex-col shadow-sm shrink-0 h-full">
      <div className="p-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">V</div>
          <h1 className="text-xl font-black tracking-tighter text-slate-800">1000 Masks</h1>
        </div>
        <button onClick={onCreateNew} className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[1.25rem] shadow-xl shadow-blue-100 transition-all active:scale-95 font-black text-lg mb-8 text-left">
          <Plus size={20} />
          <span>プロフィールを新規に作成</span>
        </button>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="名前・星座・目的で検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-100/50 border-transparent rounded-xl text-lg font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-left">
        {filteredProfiles.map(p => {
          const Icon = getMaskIcon(p.maskId, p.avatarType);
          const isActive = activeProfileId === p.id;
          const cardStyles = p.isGhost
            ? isActive ? 'bg-purple-50 border-purple-200 ring-4 ring-purple-500/5 shadow-lg text-left' : 'bg-slate-50 border-slate-100 opacity-80 grayscale hover:grayscale-0 text-left'
            : isActive ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-500/5 shadow-lg text-left' : 'bg-white border-transparent hover:bg-slate-50 text-left';

          return (
            <button key={p.id} onClick={() => onProfileSelect(p.id)} className={`w-full text-left p-6 rounded-[2rem] transition-all flex flex-col border-2 ${cardStyles}`}>
              <div className="flex items-center w-full mb-2 text-left">
                <div className={`p-3 rounded-xl mr-5 ${isActive ? (p.isGhost ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600') : 'bg-slate-100 text-slate-400'}`}><Icon size={24} /></div>
                <div className="flex-1 min-w-0 text-left"><p className={`font-black truncate text-lg ${isActive ? (p.isGhost ? 'text-purple-700' : 'text-blue-700') : 'text-slate-700'}`}>{p.name}</p></div>
              </div>
              <div className="pl-[4.75rem] w-full flex items-center space-x-2 text-left"><p className={`text-lg font-black truncate uppercase ${isActive ? (p.isGhost ? 'text-purple-400' : 'text-blue-400') : 'text-slate-400'}`}>{p.constellationName}</p></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
