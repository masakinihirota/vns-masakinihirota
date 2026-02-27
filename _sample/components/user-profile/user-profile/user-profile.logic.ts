import { useState, useCallback } from "react";

// --- Types ---

export type QuantumState = "unobserved" | "observing" | "collapsed";

export type PersonaTheme = "cyber" | "business" | "chaos" | "zen";

export interface Persona {
  id: string;
  name: string;
  role: string;
  bio: string;
  theme: PersonaTheme;
  avatarSrc: string;
  maskIconSrc: string; // The icon to select this persona
  quantumInstability: number; // 0-1, likelihood of glitching
}

// --- Constants (The 1000 Masks) ---

export const PERSONAS: Persona[] = [
  {
    id: "mask_001",
    name: "Masakini (The Observer)",
    role: "Quantum Architect",
    bio: "Observing the code until it collapses into a feature. I am everywhere and nowhere.",
    theme: "cyber",
    avatarSrc: "/Images/avatar_quantum.png",
    maskIconSrc: "/Images/mask_default.png",
    quantumInstability: 0.2,
  },
  {
    id: "mask_002",
    name: "Hirota (The Professional)",
    role: "Senior Engineer",
    bio: "Delivering structured, type-safe solutions. No side effects allowed.",
    theme: "business",
    avatarSrc: "/Images/avatar_quantum.png", // Placeholder
    maskIconSrc: "/Images/mask_default.png",
    quantumInstability: 0.05,
  },
  {
    id: "mask_666",
    name: "Schrödinger's Cat",
    role: "Dead/Alive",
    bio: "Meow? (The box is closed, I might be plotting world domination)",
    theme: "chaos",
    avatarSrc: "/Images/cat_box.png",
    maskIconSrc: "/Images/mask_default.png",
    quantumInstability: 0.9,
  },
];

// --- Logic / Hooks ---

export const useSchrodingerProfile = () => {
  const [quantumState, setQuantumState] = useState<QuantumState>("unobserved");
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);

  // "Observe" the profile (Hover/Click)
  const observe = useCallback(() => {
    if (quantumState === "collapsed") return;

    setQuantumState("observing");

    // Simulate quantum collapse delay
    setTimeout(() => {
      // Collapse wave function: Randomly pick a persona if none selected, or default
      if (!currentPersona) {
        setCurrentPersona(PERSONAS[0]);
      }
      setQuantumState("collapsed");
    }, 800);
  }, [quantumState, currentPersona]);

  // "Switch Mask" (Change Persona)
  const switchMask = useCallback((personaId: string) => {
    const target = PERSONAS.find((p) => p.id === personaId);
    if (target) {
      setQuantumState("observing"); // Re-glitch on switch
      setTimeout(() => {
        setCurrentPersona(target);
        setQuantumState("collapsed");
      }, 500);
    }
  }, []);

  return {
    quantumState,
    currentPersona,
    observe,
    switchMask,
    availablePersonas: PERSONAS,
  };
};
