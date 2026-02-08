import { useState } from 'react';
import { RATING_TYPES, RatingType, ThemeVars } from '../features/profile-dashboard.types';

interface RatingCellProps {
  readonly value: RatingType;
  readonly isLikeMode: boolean;
  readonly onChange: (value: RatingType | 'Like') => void;
  readonly themeVars: ThemeVars;
}

/**
 * 評価（Tier/Like）を選択するセル
 */
export const RatingCell = ({ value, isLikeMode, onChange, themeVars }: RatingCellProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isTierValue = ([RATING_TYPES.TIER1, RATING_TYPES.TIER2, RATING_TYPES.TIER3] as RatingType[]).includes(value);

  const getLabel = () => {
    if (isLikeMode && isTierValue) return "Like";

    const map: Record<RatingType, string> = {
      [RATING_TYPES.TIER1]: 'Tier 1',
      [RATING_TYPES.TIER2]: 'Tier 2',
      [RATING_TYPES.TIER3]: 'Tier 3',
      [RATING_TYPES.NEUTRAL]: '普通 or 自分には合わなかった',
      [RATING_TYPES.INTERESTED_NONE]: '興味無し',
      [RATING_TYPES.UNRATED]: '未評価'
    };
    return map[value] || value;
  };

  const getStyle = () => {
    if (isLikeMode && isTierValue) return "text-indigo-400 font-black dark:text-indigo-300";
    if (value === RATING_TYPES.TIER1) return "text-indigo-400 font-black dark:text-indigo-300";
    if (value === RATING_TYPES.TIER2) return "text-emerald-500 font-bold dark:text-emerald-400";
    if (value === RATING_TYPES.TIER3) return "text-blue-500 dark:text-blue-400";
    return "opacity-40";
  };

  return (
    <td className="p-0 relative group/cell border-l border-white/10">
      <button
        className={`w-full h-full p-6 text-center font-bold tracking-tight transition-all ${getStyle()} group-hover/cell:bg-white/5 overflow-hidden text-ellipsis whitespace-nowrap outline-none focus:ring-2 focus:ring-indigo-500/50`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {getLabel()}
      </button>

      {isOpen && (
        <div className={`absolute z-50 top-full right-0 w-full mt-2 rounded-xl border p-2 shadow-2xl ${themeVars.card} min-w-[280px]`}>
          {isLikeMode ? (
            <button
              className="w-full p-4 text-left hover:bg-white/10 font-bold rounded-lg"
              onClick={() => { onChange('Like'); setIsOpen(false); }}
            >
              Like (Tier 1として保存)
            </button>
          ) : (
            <div className="grid gap-1">
              <button className="p-4 text-left hover:bg-white/10 font-bold rounded-lg" onClick={() => { onChange(RATING_TYPES.TIER1); setIsOpen(false); }}>Tier 1 (最高)</button>
              <button className="p-4 text-left hover:bg-white/10 font-bold rounded-lg" onClick={() => { onChange(RATING_TYPES.TIER2); setIsOpen(false); }}>Tier 2</button>
              <button className="p-4 text-left hover:bg-white/10 font-bold rounded-lg" onClick={() => { onChange(RATING_TYPES.TIER3); setIsOpen(false); }}>Tier 3</button>
            </div>
          )}
          <div className="border-t border-white/10 my-2"></div>
          <button className="w-full p-4 text-left hover:bg-white/10 rounded-lg text-[14pt]" onClick={() => { onChange(RATING_TYPES.NEUTRAL); setIsOpen(false); }}>普通 or 自分には合わなかった</button>
          <button className="w-full p-4 text-left hover:bg-white/10 rounded-lg text-[14pt]" onClick={() => { onChange(RATING_TYPES.INTERESTED_NONE); setIsOpen(false); }}>興味無し</button>
          <button className="w-full p-4 text-left hover:bg-white/10 rounded-lg text-[14pt] text-gray-500" onClick={() => { onChange(RATING_TYPES.UNRATED); setIsOpen(false); }}>未評価にする</button>
          <div className="bg-black/20 p-2 mt-2 rounded text-center text-[12pt] cursor-pointer" onClick={() => setIsOpen(false)}>閉じる</div>
        </div>
      )}
    </td>
  );
};
