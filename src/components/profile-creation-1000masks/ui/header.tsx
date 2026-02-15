import { AlertCircle, Save, Trash2 } from 'lucide-react';
import React from 'react';
import { getMaskIcon, Profile } from '../profile-creation-1000masks.logic';

interface HeaderProps {
  activeProfile: Profile;
  isDirty: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  isDirty,
  onNameChange,
  onSave,
  onDelete,
}) => {
  return (
    <div className={`p-8 border-b transition-all duration-500 shrink-0 bg-white/95 backdrop-blur-sm z-20 flex justify-between items-center ${isDirty ? 'border-b-amber-400 bg-amber-50/5' : 'border-b-slate-100'}`}>
      <div className="flex-1 mr-8 flex items-center space-x-8 text-left">
        <div className={`p-6 rounded-[2rem] shadow-inner transition-all duration-500 ${activeProfile.avatarType === 'ghost' ? activeProfile.isGhost ? 'bg-purple-100 text-purple-600 shadow-purple-50' : 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white shadow-blue-100'}`}>
          {React.createElement(getMaskIcon(activeProfile.maskId, activeProfile.avatarType), { size: 36 })}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-3 text-slate-400 mb-1.5 text-left">
            <span className={`text-lg font-black uppercase tracking-[0.2em] ${activeProfile.isGhost ? 'text-purple-500' : ''}`}>{activeProfile.isGhost ? 'ROOT' : 'MASK'}</span>
            <span className="text-slate-200 font-normal">|</span>
            <span className={`text-lg font-black uppercase px-4 py-1 rounded-full ${activeProfile.isGhost ? 'text-purple-500 bg-purple-50' : 'text-blue-500 bg-blue-50'}`}>{activeProfile.constellationName}</span>
          </div>
          <input
            type="text"
            value={activeProfile.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-2xl font-black bg-transparent focus:outline-none placeholder-slate-200 text-slate-800 w-full transition-all text-left"
            placeholder="名前を入力..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-8 text-left">
        {!activeProfile.isGhost && <button onClick={onDelete} className="p-4 text-slate-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-2xl" title="削除" aria-label="プロフィールを削除"><Trash2 size={24} /></button>}

        <div className="flex items-center space-x-5 text-left">
          {isDirty && (
            <div className="flex items-center space-x-3 text-amber-600 font-black animate-in fade-in slide-in-from-right-4">
              <AlertCircle size={20} />
              <span className="text-lg font-black uppercase tracking-tight">Edited</span>
            </div>
          )}
          <button
            onClick={onSave}
            className={`flex items-center space-x-3 px-8 py-3.5 text-white rounded-2xl font-black shadow-2xl transition-all active:scale-95 text-xl ${activeProfile.isGhost ? 'bg-purple-600 shadow-purple-200' : 'bg-blue-600 shadow-blue-200'
              } ${!isDirty && !activeProfile.isGhost ? 'opacity-40 grayscale pointer-events-none' : 'animate-pulse shadow-amber-200 ring-2 ring-white ring-offset-2 ring-offset-amber-400'}`}
          >
            <Save size={24} />
            <span>{isDirty ? '保存する' : '保存済'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
