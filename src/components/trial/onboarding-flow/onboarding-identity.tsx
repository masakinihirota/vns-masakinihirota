"use client";

import { Button } from '@/components/ui/button';
import {
  Check,
  ChevronLeft, ChevronRight,
  Moon,
  RefreshCw,
  Shield,
  Sparkles,
  Sun,
  X
} from 'lucide-react';
import { useTheme } from "next-themes";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ADJECTIVES, COLORS, CONSTELLATIONS, Identity } from "./onboarding-identity.logic";

const MAX_HISTORY = 200;

// 12星座のシンボル (SVG)
const ZodiacIcon = ({ sign, className = "w-5 h-5" }: { sign: string | null, className?: string }) => {
  if (!sign) return null;
  const icons: Record<string, React.ReactNode> = {
    '牡羊座': <path d="M12 22a9 9 0 0 1-9-9c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9Zm0-15a6 6 0 0 0-6 6 1 1 0 1 0 2 0 4 4 0 1 1 8 0 1 1 0 1 0 2 0 6 6 0 0 0-6-6Z" />,
    '牡牛座': <path d="M12 22c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8ZM7 2a1 1 0 0 1 1 1v2.1a9.982 9.982 0 0 1 8 0V3a1 1 0 1 1 2 0v2.75a10 10 0 1 1-12 0V3a1 1 0 0 1 1-1Z" />,
    '双子座': <path d="M5 21a1 1 0 0 1-1-1v-4h16v4a1 1 0 1 1-2 0v-3H6v3a1 1 0 0 1-1 1ZM5 3a1 1 0 0 1 1 1v3h12V4a1 1 0 1 1 2 0v4H4V4a1 1 0 0 1 1-1Zm4 6h2v6H9V9Zm4 0h2v6h-2V9Z" />,
    '蟹座': <path d="M12 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM16 3a5 5 0 1 0 0 10c1.5 0 3-.5 4-1.5L20 3h-4ZM8 11a5 5 0 1 0 0 10c-1.5 0-3-.5-4-1.5L4 11h4Z" />,
    '獅子座': <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-4 9a6 6 0 1 1 10.3-4.1l2.7 1.1a1 1 0 1 1-.8 1.8l-3-.8A6 6 0 0 1 8 17ZM4 11a1 1 0 1 1 2 0v1a6 6 0 0 0 3 5.2l-1 1.7A8 8 0 0 1 4 12v-1Z" />,
    '乙女座': <path d="M12 3a4 4 0 0 1 4 4v7c0 2-1 4-4 4s-4-2-4-4v-1h2v1a2 2 0 1 0 4 0V7a2 2 0 0 0-4 0v11a1 1 0 1 1-2 0V7a4 4 0 0 1 4-4Zm8 4v7a8 8 0 0 1-8 8l-1-2a6 6 0 0 0 7-6V7a1 1 0 1 1 2 0Z" />,
    '天秤座': <path d="M12 11h6a1 1 0 1 1 0 2h-6v4h3a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h3v-4H6a1 1 0 1 1 0-2h6V7a3 3 0 1 0-6 0 1 1 0 1 1-2 0 5 5 0 0 1 10 0v4ZM4 21a1 1 0 1 1 0-2h16a1 1 0 1 1 0 2H4Z" />,
    '蠍座': <path d="M5 3a1 1 0 0 1-1-1v11a2 2 0 1 0 4 0V4a1 1 0 1 1 2 0v11a2 2 0 1 0 4 0V4a1 1 0 1 1 2 0v8a3 3 0 0 0 3 3h1l-1 2a5 5 0 0 1-5-5v-1a4 4 0 0 1-8 0V4a1 1 0 0 1 1-1Z" />,
    '射手座': <path d="M13 3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0V5.414l-6 6V15h2a1 1 0 1 1 0 2h-2v2.586l3.293 3.293a1 1 0 0 1-1.414 1.414L12 21.414l-2.879 2.879a1 1 0 0 1-1.414-1.414L11 19.586V17H9a1 1 0 1 1 0-2h2v-3.586l-6 6a1 1 0 0 1-1.414-1.414L9.586 11H7a1 1 0 1 1 0-2h3.586l6-6H14a1 1 0 0 1-1-1Z" />,
    '山羊座': <path d="M12 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm-6 1a1 1 0 0 1 1 1v1a5 5 0 0 0 5 5 1 1 0 1 1 0 2 7 7 0 0 1-7-7v-1a1 1 0 0 1 1-1Zm14-1a1 1 0 0 1-1 1h-1a5 5 0 0 0-5 5 1 1 0 1 1-2 0 7 7 0 0 1 7-7h1a1 1 0 0 1 1-1Zm-1-5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Z" />,
    '水瓶座': <path d="M3 11l4-4 4 4 4-4 4 4a1 1 0 1 1-1.414 1.414L15 9.414l-4 4-4-4-2.586 2.586A1 1 0 0 1 3 11Zm0 6l4-4 4 4 4-4 4 4a1 1 0 1 1-1.414 1.414L15 15.414l-4 4-4-4-2.586 2.586A1 1 0 0 1 3 17Z" />,
    '魚座': <path d="M12 2a1 1 0 0 1 1 1v18a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm7 5a10 10 0 0 0-14 0 1 1 0 1 1-1.414-1.414A12 12 0 0 1 20.414 5.586 1 1 0 1 1 19 7Zm0 10a1 1 0 0 1-1.414-1.414A10 10 0 0 0 5 15.586l-1.414 1.414a12 12 0 0 1 16.828 0 1 1 0 0 1 0 1.414Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      {icons[sign]}
    </svg>
  );
};

interface AnonymousNameGeneratorHandle {
  generateAndAddSkip: () => Identity;
  resetToInitial: () => void;
}

const AnonymousNameGenerator = forwardRef<AnonymousNameGeneratorHandle, { onSelect: (identity: Identity) => void, isDarkMode: boolean }>(({ onSelect, isDarkMode }, ref) => {
  const [history, setHistory] = useState<Identity[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSignFilter, setActiveSignFilter] = useState<string | null>(null);

  const generateIdentityObject = useCallback((specificSign: string | null = null): Identity => {
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
  }, []);

  const generateNewSet = useCallback((specificSign: string | null = null) => {
    if (history.length >= MAX_HISTORY) return;

    setIsGenerating(true);
    setTimeout(() => {
      const isInitialSet = history.length === 0 && currentIndex === -1;

      const newSet = Array.from({ length: 3 }).map((_, idx) => {
        if (isInitialSet && idx === 0) {
          return { name: 'ランダム', sign: null, color: null, isRandom: true };
        }
        return generateIdentityObject(specificSign || activeSignFilter);
      });

      setHistory(prev => [...prev, newSet]);
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedIndex(0);
      setIsGenerating(false);

      if (onSelect) onSelect(newSet[0]);
      if (specificSign !== null) setActiveSignFilter(specificSign);
    }, 400);
  }, [currentIndex, history.length, activeSignFilter, onSelect, generateIdentityObject]);

  useImperativeHandle(ref, () => ({
    generateAndAddSkip: () => {
      if (history.length >= MAX_HISTORY) {
        const randomIdx = Math.floor(Math.random() * history.length);
        setCurrentIndex(randomIdx);
        const candidateIdx = (randomIdx === 0) ? Math.floor(1 + Math.random() * 2) : Math.floor(Math.random() * 3);
        setSelectedIndex(candidateIdx);
        const selected = history[randomIdx][candidateIdx];
        if (onSelect) onSelect(selected);
        return selected;
      }

      const newSet = Array.from({ length: 3 }).map(() => generateIdentityObject());
      setHistory(prev => [...prev, newSet]);
      setCurrentIndex(prev => prev + 1);
      setSelectedIndex(0);

      const primaryChoice = newSet[0];
      if (onSelect) onSelect(primaryChoice);
      return primaryChoice;
    },
    resetToInitial: () => {
      setCurrentIndex(0);
      setSelectedIndex(0);
      if (onSelect) onSelect(history[0][0]);
    }
  }));

  useEffect(() => {
    // 初回のみ
    generateNewSet(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回マウント時のみ実行（generateNewSetはstate依存のため依存配列に含めると無限ループになる）

  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedIndex(0);
      if (onSelect) onSelect(history[newIndex][0]);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedIndex(0);
      if (onSelect) onSelect(history[newIndex][0]);
    }
  };

  const handleSelectCandidate = (idx: number) => {
    setSelectedIndex(idx);
    if (onSelect) onSelect(history[currentIndex][idx]);
  };

  const currentCandidates = history[currentIndex] || [];
  const containerClass = isDarkMode ? "bg-slate-950 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl";
  const headerClass = isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200";

  return (
    <div className={`w-[320px] border rounded-lg overflow-hidden font-sans select-none transition-colors duration-300 ${containerClass}`}>
      <div className={`px-3 py-3 flex items-center justify-between border-b transition-colors duration-300 ${headerClass}`}>
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Shield className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <span className={`text-base font-black truncate uppercase tracking-tighter ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ID 生成器</span>
        </div>

        <div className="flex items-center gap-1.5 focus-within:ring-2 focus-within:ring-indigo-500">
          <span className="text-base font-mono text-slate-500 mr-1">{currentIndex + 1}/{history.length}</span>
          <div className={`flex rounded-full p-0.5 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200/50 border-slate-200'}`}>
            <button onClick={goBack} disabled={currentIndex <= 0} className={`p-2 rounded-full transition-all active:scale-90 disabled:opacity-10 ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`} aria-label="前の候補へ"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={goForward} disabled={currentIndex >= history.length - 1} className={`p-2 rounded-full transition-all active:scale-90 disabled:opacity-10 ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`} aria-label="次の候補へ"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button
            onClick={() => generateNewSet()}
            disabled={isGenerating || history.length >= MAX_HISTORY}
            className={`p-2.5 ml-1 rounded-full transition-all active:scale-95 border shadow-md animate-pulse ${isDarkMode ? 'bg-amber-400/20 border-amber-400/30 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-600'} `}
            title="新しい名前を生成"
            aria-label="新しい名前を再生成"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2 min-h-[170px]">
        {isGenerating ? (
          <div className="h-[146px] flex flex-col items-center justify-center gap-2"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          currentCandidates.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const displayName = item.name.split('#')[0];

            const randomBtnClass = isDarkMode
              ? isSelected ? "bg-linear-to-r from-indigo-600 to-purple-700 shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white ring-1 ring-indigo-400" : "bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-indigo-900/50"
              : isSelected ? "bg-linear-to-r from-indigo-500 to-purple-500 shadow-lg text-white ring-1 ring-indigo-300" : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100";

            return (
              <button
                key={idx}
                onClick={() => handleSelectCandidate(idx)}
                className={`w-full group relative flex items-center px-4 py-3 rounded-md transition-all duration-300 ${item.isRandom ? randomBtnClass : (isSelected ? (isDarkMode ? 'bg-slate-900 ring-1 ring-white/10 shadow-lg' : 'bg-white shadow-md ring-1 ring-black/5') : (isDarkMode ? 'hover:bg-slate-900/50 text-slate-400' : 'hover:bg-slate-50 text-slate-500'))}`}
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center mr-4 transition-colors flex-shrink-0 ${item.isRandom ? (isSelected ? 'bg-white/20' : (isDarkMode ? 'bg-indigo-950 border-indigo-800' : 'bg-white border-indigo-100')) : `${item.color?.bg} ${item.color?.border}`} border`}>
                  {item.isRandom ? <Sparkles className={`w-4 h-4 ${isSelected ? 'text-yellow-300 animate-pulse' : 'text-indigo-400'}`} /> : <ZodiacIcon sign={item.sign} className={`w-5 h-5 ${item.color?.text}`} />}
                </div>
                <span className={`text-base tracking-tight truncate ${isSelected ? 'font-bold' : ''} ${!item.isRandom && !isSelected ? 'text-slate-500' : ''} ${!item.isRandom && isSelected ? item.color?.text : ''}`}>
                  {displayName}
                </span>
                {isSelected && (
                  <div className="ml-auto flex items-center animate-in zoom-in">
                    <Check className={`w-5 h-5 ${item.isRandom ? 'text-white' : item.color?.text}`} />
                  </div>
                )}
                {item.isRandom && !isSelected && (
                  <span className="ml-auto text-[10px] font-black uppercase tracking-tighter opacity-40 px-1.5 py-0.5 border border-current rounded">Special</span>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className={`p-3 border-t transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
        <p className={`text-base font-bold uppercase tracking-widest mb-3 ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>星座選択</p>
        <div className="grid grid-cols-3 gap-2">
          {CONSTELLATIONS.map((sign) => (
            <button
              key={sign}
              onClick={() => generateNewSet(sign)}
              disabled={isGenerating || history.length >= MAX_HISTORY}
              className={`flex items-center justify-center py-2.5 px-2 rounded transition-all gap-2 ${activeSignFilter === sign ? 'bg-indigo-500 text-white shadow-lg' : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200')} disabled:opacity-30`}
            >
              <ZodiacIcon sign={sign} className="w-4 h-4 flex-shrink-0" />
              <span className="text-base font-bold leading-none">{sign.substring(0, 2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

AnonymousNameGenerator.displayName = "AnonymousNameGenerator";

interface OnboardingIdentityProps {
  tempIdentity: Identity;
  onSelect: (identity: Identity) => void;
  onConfirm: (identity: Identity) => void;
}

export function OnboardingIdentity({ tempIdentity, onSelect, onConfirm }: OnboardingIdentityProps) {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const generatorRef = useRef<AnonymousNameGeneratorHandle>(null);

  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');

  const handleFinalize = () => {
    onConfirm(tempIdentity);
    setShowConfirmModal(false);
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  const handleRandomSkip = () => {
    if (generatorRef.current) {
      const resultIdentity = generatorRef.current.generateAndAddSkip();
      onSelect(resultIdentity);
      setShowConfirmModal(true);
    }
  };

  const displayName = tempIdentity.name.split('#')[0];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>

      <div className="fixed top-6 right-6 z-40">
        <Button variant="outline" size="lg" onClick={toggleDarkMode} className="rounded-full shadow-lg flex items-center gap-2">
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          <span className="text-base font-bold">{isDarkMode ? 'Light' : 'Dark'}</span>
        </Button>
      </div>

      <div className={`p-8 rounded-2xl shadow-xl border w-full max-w-4xl transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col lg:flex-row gap-12 items-stretch justify-center">

          <div className="flex flex-col w-full lg:w-[320px] order-2 lg:order-1">
            <label className={`text-base font-black mb-3 uppercase tracking-widest ml-1 text-center lg:text-left ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>現在の選択</label>

            <div className={`flex-1 min-h-[200px] rounded-xl border flex flex-col items-center justify-center p-6 transition-all duration-500 ${isDarkMode ? 'border-slate-700 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
              <div className="flex flex-col items-center gap-4 w-full animate-in fade-in slide-in-from-left-2 duration-300">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border-2 flex-shrink-0 transition-all ${tempIdentity.color ? `${tempIdentity.color.bg} ${tempIdentity.color.border} ${tempIdentity.color.text}` : (isDarkMode ? 'bg-indigo-900/40 border-indigo-700 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-indigo-50 border-indigo-100 text-indigo-500')}`}>
                  {tempIdentity.sign ? <ZodiacIcon sign={tempIdentity.sign} className="w-10 h-10" /> : <Sparkles className="w-10 h-10 animate-pulse" />}
                </div>
                <div className="text-center overflow-hidden">
                  <p className={`text-2xl font-black truncate tracking-tight px-1 mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {displayName}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {!tempIdentity.isRandom ? (
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  className={`w-full py-8 rounded-xl text-lg font-bold transition-all shadow-md active:scale-95 ${tempIdentity.color?.solid || 'bg-indigo-600'}`}
                >
                  この名前に決める
                </Button>
              ) : (
                <Button
                  onClick={handleRandomSkip}
                  className="w-full py-8 bg-linear-to-r from-indigo-600 to-purple-600 text-white border-none rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 animate-in slide-in-from-bottom-2 duration-300"
                >
                  <span>ランダムでスキップ →</span>
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3 order-1 lg:order-2">
            <div className="flex items-center gap-2 ml-1 text-center lg:text-left">
              <label className={`text-base font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>あなたの匿名を選んでください</label>
            </div>
            <AnonymousNameGenerator
              ref={generatorRef}
              isDarkMode={isDarkMode}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>

      {/* 最終確認モーダルウィンドウ */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={handleCancelModal} />
          <div className={`relative w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
            <button onClick={handleCancelModal} className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="閉じる">
              <X className="w-5 h-5 opacity-40" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-4 shadow-xl ${tempIdentity.color?.bg} ${tempIdentity.color?.border} ${tempIdentity.color?.text}`}>
                <ZodiacIcon sign={tempIdentity.sign} className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold opacity-40 uppercase tracking-widest">Final Confirmation</h3>
                <p className="text-3xl font-black italic tracking-tighter">{displayName}</p>
                <p className="text-base opacity-60 pt-2">この名前で進めてよろしいですか？</p>
              </div>

              <div className="w-full flex flex-col gap-3 pt-4">
                <Button
                  size="lg"
                  onClick={handleFinalize}
                  className={`w-full py-8 text-lg font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all ${tempIdentity.color?.solid}`}
                >
                  はい、決定します
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleCancelModal}
                  className="w-full py-6 text-base font-bold opacity-60 transition-all rounded-2xl"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
