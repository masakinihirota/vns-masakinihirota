import React from 'react';

interface StepHeaderProps {
  num: string;
  title: string;
  subtitle?: string;
  isGhost?: boolean;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ num, title, subtitle, isGhost }) => (
  <div className="flex items-start space-x-5 mb-8 text-left">
    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg shadow-lg shrink-0 transition-all duration-500 ${isGhost ? 'bg-purple-600 text-white shadow-purple-100' : 'bg-blue-600 text-white shadow-blue-100'}`}>
      {num}
    </div>
    <div className="pt-1">
      <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-2 uppercase">{title}</h2>
      {subtitle && <p className="text-lg text-slate-400 font-bold tracking-tight">{subtitle}</p>}
    </div>
  </div>
);
