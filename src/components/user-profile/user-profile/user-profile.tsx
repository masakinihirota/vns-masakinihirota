import Image from "next/image";
import { cn } from "@/lib/utils";
import { Persona, QuantumState } from "./user-profile.logic";

// --- Components ---

interface UserProfileProps {
  quantumState: QuantumState;
  currentPersona: Persona | null;
  availablePersonas: Persona[];
  onObserve: () => void;
  onSwitchMask: (id: string) => void;
}

export function UserProfile({
  quantumState,
  currentPersona,
  availablePersonas,
  onObserve,
  onSwitchMask,
}: UserProfileProps) {
  // Theme map for styling based on persona theme
  const themeStyles = {
    cyber:
      "bg-slate-900 border-cyan-500 text-cyan-50 shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    business: "bg-white border-slate-200 text-slate-800 shadow-md",
    chaos:
      "bg-red-950 border-red-600 text-red-100 shadow-[0_0_30px_rgba(220,38,38,0.6)] font-mono",
    zen: "bg-stone-100 border-stone-300 text-stone-700",
  };

  const currentTheme = currentPersona?.theme
    ? themeStyles[currentPersona.theme]
    : "bg-black text-white";

  return (
    <div
      className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group transition-all duration-500"
      onMouseEnter={onObserve}
      onClick={onObserve}
    >
      {/* Background / Base Layer */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-700",
          currentTheme
        )}
      >
        {/* Quantum Noise / Glitch Overlay (Active during 'observing' or 'unobserved') */}
        {(quantumState === "unobserved" || quantumState === "observing") && (
          <div className="absolute inset-0 bg-black z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-48 h-48 animate-pulse mb-4">
              {/* Schrödinger's Box Placeholder */}
              <Image
                src="/Images/cat_box.png"
                alt="The Box"
                fill
                className={cn(
                  "object-contain transition-opacity duration-300",
                  quantumState === "observing"
                    ? "opacity-50 blur-sm"
                    : "opacity-100"
                )}
              />
            </div>
            <h2
              className={cn(
                "text-2xl font-bold tracking-widest text-white transition-all",
                quantumState === "observing" &&
                  "animate-bounce text-red-500 blur-[1px]"
              )}
            >
              {quantumState === "observing" ? "OBSERVING..." : "UNOBSERVED"}
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Hover to collapse the wave function.
            </p>
          </div>
        )}

        {/* Content Layer (Visible when 'collapsed') */}
        <div
          className={cn(
            "relative z-10 p-6 h-full flex flex-col transition-opacity duration-500",
            quantumState === "collapsed" ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Avatar Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-current shadow-xl">
              {currentPersona && (
                <Image
                  src={currentPersona.avatarSrc}
                  alt={currentPersona.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Info Area */}
          <div className="mt-6 text-center space-y-2">
            <h1 className="text-3xl font-bold">{currentPersona?.name}</h1>
            <p className="text-lg opacity-80 uppercase tracking-widest">
              {currentPersona?.role}
            </p>
            <div className="w-16 h-1 bg-current mx-auto my-4 opacity-50" />
            <p className="text-sm leading-relaxed max-w-xs mx-auto opacity-90">
              {currentPersona?.bio}
            </p>
          </div>

          {/* Mask Selector (The 1000 Masks) */}
          <div className="mt-8 pt-4 border-t border-current/20">
            <p className="text-xs text-center mb-2 opacity-60">
              SELECT PERSONA
            </p>
            <div className="flex justify-center gap-3">
              {availablePersonas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwitchMask(persona.id);
                  }}
                  className={cn(
                    "relative w-10 h-10 rounded-full border-2 overflow-hidden transition-transform hover:scale-110 focus:outline-none focus:ring-2 ring-offset-2",
                    currentPersona?.id === persona.id
                      ? "ring-2 ring-offset-2 ring-current scale-110"
                      : "opacity-60 hover:opacity-100 border-transparent"
                  )}
                  title={persona.name}
                >
                  <Image
                    src={persona.maskIconSrc}
                    alt={persona.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Glitch Overlay Effect (CSS trickery) */}
      {quantumState === "observing" && (
        <div className="absolute inset-0 z-50 pointer-events-none mix-blend-difference bg-white/10 animate-pulse" />
      )}
    </div>
  );
}
