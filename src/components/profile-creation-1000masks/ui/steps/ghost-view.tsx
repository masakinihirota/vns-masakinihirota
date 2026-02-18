import { Ghost } from "lucide-react";
import React from "react";
import { Profile } from "../../profile-creation-1000masks.logic";

interface GhostViewProps {
  activeProfile: Profile;
}

export const GhostView: React.FC<GhostViewProps> = ({ activeProfile }) => {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000 text-center transition-colors duration-300">
      <div className="bg-purple-50 dark:bg-purple-900/10 p-24 rounded-full border-[8px] border-dashed border-purple-100 dark:border-purple-900/30 shadow-inner group relative mx-auto">
        <Ghost
          size={120}
          className="text-purple-300 dark:text-purple-500 group-hover:scale-110 transition-transform duration-1000 mx-auto"
        />
        <div className="absolute top-10 right-10 animate-pulse bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-full shadow-2xl" />
        <div className="absolute bottom-10 left-10 animate-pulse bg-purple-200 dark:bg-purple-800/30 w-6 h-6 rounded-full delay-500 shadow-2xl" />
      </div>
      <div className="space-y-8 max-w-4xl px-8 mx-auto text-center">
        <div className="space-y-2">
          <p className="text-lg font-black text-purple-700 dark:text-purple-400 tracking-widest italic drop-shadow-sm uppercase">
            Ghost Mode
          </p>
          <div className="h-1 w-24 bg-purple-200 dark:bg-purple-900/40 mx-auto rounded-full shadow-inner" />
        </div>
        <div className="p-12 bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-slate-100 dark:border-white/10 inline-block shadow-2xl transition-transform hover:scale-105 mx-auto">
          <p className="text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-4 leading-none">
            Unmasked Identity
          </p>
          <p className="text-xl font-serif font-black text-purple-900 dark:text-purple-300 tracking-tight leading-tight uppercase">
            {activeProfile.constellationName}
          </p>
        </div>
      </div>
    </div>
  );
};
