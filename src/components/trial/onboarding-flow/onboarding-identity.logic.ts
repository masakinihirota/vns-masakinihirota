"use client";


export type IdentityColor = {
  name: string;
  text: string;
  bg: string;
  border: string;
  solid: string;
};

export type Identity = {
  name: string;
  sign: string | null;
  color: IdentityColor | null;
  isRandom: boolean;
};

export const COLORS: IdentityColor[] = [
  { name: 'Red', text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', solid: 'bg-red-500' },
  { name: 'Blue', text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', solid: 'bg-blue-500' },
  { name: 'Emerald', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', solid: 'bg-emerald-500' },
  { name: 'Amber', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', solid: 'bg-amber-500' },
  { name: 'Pink', text: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', solid: 'bg-pink-500' },
  { name: 'Indigo', text: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', solid: 'bg-indigo-500' },
  { name: 'Cyan', text: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', solid: 'bg-cyan-500' },
  { name: 'Orange', text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', solid: 'bg-orange-500' },
  { name: 'Violet', text: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/30', solid: 'bg-violet-500' },
  { name: 'Rose', text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', solid: 'bg-rose-500' },
] as const;

export const CONSTELLATIONS = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'] as const;
export const ADJECTIVES = ['煌めく', '情熱の', '静寂の', '輝く', '優雅な', '神秘の', '強固な', '知的な', '慈愛の', '自由な', '不屈の', '夢幻の'] as const;

const STORAGE_KEY = "vns_trial_identity";

/**
 * トライアル用アイデンティティ生成ロジック
 */
export function useOnboardingIdentityLogic() {
  const generateIdentityObject = (specificSign: string | null = null): Identity => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const sign = specificSign || CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
    const id = Math.floor(10 + Math.random() * 89);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      name: `${adj}${sign}#${id}`,
      sign: sign,
      color: color,
      isRandom: false
    };
  };

  const saveIdentityToBrowser = (identity: Identity) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  };

  const clearIdentityFromBrowser = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadIdentityFromBrowser = (): Identity | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as Identity;
    } catch {
      return null;
    }
  };

  return {
    generateIdentityObject,
    saveIdentityToBrowser,
    clearIdentityFromBrowser,
    loadIdentityFromBrowser,
  };
}
