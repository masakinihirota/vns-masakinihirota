"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function SearchingEffect() {
  const [text, setText] = useState("Scanning Multiverse...");

  useEffect(() => {
    const texts = [
      "Accessing Akashic Records...",
      "Resonating Values...",
      "Syncing Wavelengths...",
      "Observing Quantum States...",
      "Collapsing Wavefunctions...",
      "Finding Soul Echoes...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setText(texts[i % texts.length]);
      i++;
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-8">
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 border-4 border-primary rounded-full opacity-50"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-secondary rounded-full opacity-50"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.7, 0.3],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">👁️</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold tracking-widest animate-pulse text-primary">SEARCHING</h3>
        <p className="text-muted-foreground font-mono text-sm max-w-xs mx-auto h-6">{text}</p>
      </div>

      <div className="grid grid-cols-5 gap-1 opacity-50">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-8 bg-primary"
            animate={{
              height: [10, 30, 10],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
