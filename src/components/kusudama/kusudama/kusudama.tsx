'use client';

import { PartyPopper, RefreshCw } from 'lucide-react';
import React from 'react';
import { ConfettiPiece } from './confetti-piece';
import type { ConfettiData } from './kusudama.logic';

interface KusudamaProps {
  readonly isOpen: boolean;
  readonly confetti: readonly ConfettiData[];
  readonly onOpen: () => void;
  readonly onReset: (e: React.MouseEvent) => void;
}

/**
 * お祝いくす玉（Celebration Kusudama）プレゼンテーションコンポーネント
 */
export const Kusudama: React.FC<KusudamaProps> = ({
  isOpen,
  confetti,
  onOpen,
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-transparent font-sans p-4 overflow-hidden relative">
      <style>
        {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0) scale(var(--piece-scale));
              opacity: 0;
            }
            5% { opacity: 1; }
            90% { opacity: 1; }
            100% {
              transform: translateY(110vh) rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) rotateZ(var(--rotate-z)) scale(var(--piece-scale));
              opacity: 0;
            }
          }
          @keyframes confetti-sway {
            0%, 100% { transform: translateX(calc(-1 * var(--sway-amount))); }
            50% { transform: translateX(var(--sway-amount)); }
          }
          .animate-confetti-fall {
            animation-name: confetti-fall;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
          }
          .animate-confetti-sway {
            animation-name: confetti-sway;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }
          @keyframes banner-drop {
            0% { transform: translateX(-50%) scaleY(0); transform-origin: top; opacity: 0; }
            20% { opacity: 1; }
            60% { transform: translateX(-50%) scaleY(1.1); transform-origin: top; }
            85% { transform: translateX(-50%) scaleY(0.98); transform-origin: top; }
            100% { transform: translateX(-50%) scaleY(1); transform-origin: top; opacity: 1; }
          }
          .animate-banner-drop {
            animation: banner-drop 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        `}
      </style>

      {/* 紙吹雪レイヤー */}
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {confetti.map((c) => (
            <ConfettiPiece key={c.id} color={c.color} delay={c.delay} />
          ))}
        </div>
      )}

      {/* ヘッダーメッセージ */}
      <div className="text-center mb-16 relative z-50">
        <h1 className="text-5xl md:text-6xl font-black text-neutral-800 dark:text-neutral-100 mb-4 tracking-tighter drop-shadow-sm">
          祝・大成功！
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-bold text-lg md:text-xl">
          おめでとうございます！
        </p>
      </div>

      {/* くす玉コンテナ */}
      <div
        className="relative w-64 h-64 md:w-72 md:h-72 flex items-start justify-center cursor-pointer z-40 transition-transform active:scale-95"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-label="くす玉を割る"
      >
        <div className="absolute top-[-300px] left-1/2 w-1.5 h-[300px] bg-neutral-300 dark:bg-neutral-700 -translate-x-1/2 z-0" />

        {/* 垂れ幕 */}
        {isOpen && (
          <div
            className="absolute top-0 left-1/2 z-10 w-40 animate-banner-drop pointer-events-none"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="bg-white dark:bg-neutral-800 border-x-8 border-red-500 shadow-2xl py-12 px-6 flex flex-col items-center rounded-sm">
              <span className="text-red-600 font-black text-5xl [writing-mode:vertical-rl] tracking-[0.2em] leading-none drop-shadow-sm">
                おめでとう
              </span>
              <div className="mt-8 w-full h-2 bg-red-500 rounded-full" />
            </div>
            <div className="flex justify-center -mt-1 gap-1">
              {[48, 64, 48].map((h, i) => (
                <div key={i} className={`w-2 bg-red-${i === 1 ? '600' : '400'} rounded-full shadow-sm`} style={{ height: `${h}px` }} />
              ))}
            </div>
          </div>
        )}

        {/* くす玉の本体（左半分） */}
        <div
          className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) z-20 pointer-events-none"
          style={{
            transformOrigin: '50% 0%',
            transform: isOpen ? 'rotate(80deg)' : 'rotate(0deg)'
          }}
        >
          <div className="absolute right-1/2 w-1/2 h-full rounded-l-full border-r border-amber-600 shadow-2xl overflow-hidden">
            <div className="w-full h-full bg-linear-to-br from-amber-400 to-amber-600" />
            <div className="absolute bottom-8 right-8 w-16 h-2 bg-red-600 rotate-45 rounded-full opacity-80" />
          </div>
        </div>

        {/* くす玉の本体（右半分） */}
        <div
          className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) z-20 pointer-events-none"
          style={{
            transformOrigin: '50% 0%',
            transform: isOpen ? 'rotate(-80deg)' : 'rotate(0deg)'
          }}
        >
          <div className="absolute left-1/2 w-1/2 h-full rounded-r-full border-l border-amber-300 shadow-2xl overflow-hidden">
            <div className="w-full h-full bg-linear-to-bl from-amber-400 to-amber-600" />
            <div className="absolute bottom-8 left-8 w-16 h-2 bg-red-600 -rotate-45 rounded-full opacity-80" />
          </div>
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="mt-40 flex flex-col items-center gap-8 z-50">
        {!isOpen && (
          <div className="flex flex-col items-center">
            <div className="w-2 h-16 bg-red-500 animate-bounce rounded-full shadow-lg" />
            <div className="w-8 h-8 rounded-full bg-red-600 -mt-2 shadow-xl flex items-center justify-center border-4 border-white dark:border-neutral-800">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <p className="text-red-600 font-black mt-4 text-xl animate-pulse tracking-[0.2em] text-center drop-shadow-sm">PULL!</p>
          </div>
        )}

        <div className="flex gap-4">
          {isOpen ? (
            <button
              onClick={onReset}
              className="group flex items-center gap-2 px-10 py-4 bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 text-neutral-800 dark:text-white rounded-full hover:bg-white/30 transition-all shadow-xl active:scale-95 font-bold text-[1.1rem]"
            >
              <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-700" />
              もう一度閉じる
            </button>
          ) : (
            <button
              onClick={onOpen}
              className="group flex items-center gap-3 px-12 py-5 bg-linear-to-r from-red-600 via-pink-500 to-red-600 bg-[length:200%_auto] hover:bg-right text-white text-3xl font-black rounded-full transition-all duration-500 shadow-[0_15px_40px_rgba(239,68,68,0.4)] active:scale-95"
            >
              <PartyPopper size={32} />
              くす玉を割る！
            </button>
          )}
        </div>
      </div>

      <p className="mt-16 text-[1rem] text-neutral-400 font-medium text-center max-w-sm px-4">
        立体的な3D回転を加えた紙吹雪により、<br />
        よりリアルに心弾むお祝いの瞬間を演出します。
      </p>
    </div>
  );
};
