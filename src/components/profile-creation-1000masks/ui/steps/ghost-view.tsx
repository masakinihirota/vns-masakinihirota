import { Ghost } from 'lucide-react';
import React from 'react';
import { Profile } from '../../profile-creation-1000masks.logic';

interface GhostViewProps {
  activeProfile: Profile;
}

export const GhostView: React.FC<GhostViewProps> = ({ activeProfile }) => {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000 text-center text-left">
      <div className="bg-purple-50 p-24 rounded-full border-[8px] border-dashed border-purple-100 shadow-inner group relative mx-auto text-left">
        <Ghost size={120} className="text-purple-300 group-hover:scale-110 transition-transform duration-1000 mx-auto text-left" />
        <div className="absolute top-10 right-10 animate-pulse bg-blue-100 w-10 h-10 rounded-full shadow-2xl text-left" />
        <div className="absolute bottom-10 left-10 animate-pulse bg-purple-200 w-6 h-6 rounded-full delay-500 shadow-2xl text-left" />
      </div>
      <div className="space-y-8 max-w-4xl px-8 mx-auto text-center text-left text-left">
        <div className="space-y-2 text-left text-left">
          <p className="text-lg font-black text-purple-700 tracking-widest italic drop-shadow-sm uppercase text-center text-left text-left">Ghost Mode</p>
          <div className="h-1 w-24 bg-purple-200 mx-auto rounded-full shadow-inner text-left text-left" />
        </div>
        <div className="p-12 bg-slate-50 rounded-[3rem] border-2 border-slate-100 inline-block shadow-2xl transition-transform hover:scale-105 mx-auto text-center text-left text-left text-left">
          <p className="text-lg font-black text-slate-400 uppercase tracking-[0.4em] mb-4 text-center leading-none text-left text-left text-left">Unmasked Identity</p>
          <p className="text-xl font-serif font-black text-purple-900 tracking-tight leading-tight uppercase text-center text-left text-left text-left">{activeProfile.constellationName}</p>
        </div>
      </div>
    </div>
  );
};
