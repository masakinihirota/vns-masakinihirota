"use client";

import { ZODIAC_SYMBOLS, getZodiacColor } from "@/lib/anonymous-name-generator";
import { useOnboardingLogic } from "./onboarding-flow.logic";
import { ConfirmStep } from "./steps/confirm-step";
import { GenerateStep } from "./steps/generate-step";
import { ZodiacStep } from "./steps/zodiac-step";

export function OnboardingFlowContainer() {
  const {
    view,
    selectedZodiac,
    currentTrio,
    history,
    historyIndex,
    tempSelectedName,
    setTempSelectedName,
    confirmedName,
    handleSelectZodiac,
    handleNextCandidate,
    handleGoBack,
    goToConfirm,
    handleFinalConfirm,
    reset,
  } = useOnboardingLogic();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full min-h-[600px] bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
        {/* 背景装飾 */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[100px] rounded-full"></div>

        {view === 'experience' && selectedZodiac && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in-95 fade-in duration-1000">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-[100px] rounded-full"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-[40px] flex items-center justify-center shadow-2xl rotate-12">
                <span className="text-6xl -rotate-12">{ZODIAC_SYMBOLS[selectedZodiac]}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tighter">
                Welcome,<br />
                <span className={`bg-gradient-to-r ${getZodiacColor(selectedZodiac)} bg-clip-text text-transparent`}>
                  {confirmedName}
                </span>
              </h2>
              <p className="text-slate-400 font-medium max-w-[280px] leading-relaxed">
                あなたの物語がここから始まります。<br />神秘の力があなたを導くでしょう。
              </p>
            </div>

            <button
              onClick={reset}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 text-sm font-bold transition-all active:scale-95"
            >
              最初からやり直す
            </button>
          </div>
        )}

        {view === 'zodiac' && (
          <ZodiacStep onSelect={handleSelectZodiac} />
        )}

        {view === 'generate' && selectedZodiac && (
          <GenerateStep
            zodiac={selectedZodiac}
            candidates={currentTrio}
            selectedName={tempSelectedName}
            onSelect={setTempSelectedName}
            onNext={handleNextCandidate}
            onBack={handleGoBack}
            history={history}
            historyIndex={historyIndex}
            onConfirm={goToConfirm}
            onReset={reset}
          />
        )}

        {view === 'confirm' && selectedZodiac && tempSelectedName && (
          <ConfirmStep
            zodiac={selectedZodiac}
            name={tempSelectedName}
            onConfirm={handleFinalConfirm}
            onReset={() => {
              setTempSelectedName(null);
              // Instead of full reset, we go back to selection view
              // The logic handles this by changing view back to generate
            }}
          />
        )}
      </div>
    </div>
  );
}
