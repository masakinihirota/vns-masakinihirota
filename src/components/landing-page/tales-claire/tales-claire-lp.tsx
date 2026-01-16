"use client";

import React from "react";
import { BackgroundCanvas } from "./background-canvas";
import { ConceptSection } from "./concept-section";
import { DeclarationsSection } from "./declarations-section";
import { Footer } from "./footer";
import { HeroSection } from "./hero-section";
import { InspirationSection } from "./inspiration-section";
import { StartLinksSection } from "./start-links-section";

export const TalesClaireLP = () => {
  return (
    <div className="antialiased selection:bg-blue-500 selection:text-white min-h-screen relative text-neutral-200 font-sans bg-[#0a0a0a]">
      {/* Background Animation */}
      <BackgroundCanvas />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col gap-24">
        {/* 1. Name & Catchphrase */}
        <HeroSection />

        {/* 2. Description (Declarations & Concept) */}
        <section id="about" className="space-y-16">
          <DeclarationsSection />
          <ConceptSection />
        </section>

        {/* 3. Start Links */}
        <StartLinksSection />

        {/* 4. Reference Video & Explanation */}
        <InspirationSection />

        {/* Footer */}
        <Footer />
      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};
