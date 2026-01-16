"use client";

import React from "react";

export const HeroSection = () => {
  return (
    <header className="flex flex-col items-center text-center space-y-8 min-h-[60vh] justify-center animate-fade-in-up">
      <div className="space-y-2">
        <p className="text-blue-500 tracking-[0.2em] text-sm font-medium uppercase">
          Value Network Service
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-serif">
          VNS masakinihirota
        </h1>
      </div>

      <div className="h-px w-24 bg-gradient-to-r from-transparent via-neutral-400 to-transparent"></div>

      <h2 className="text-2xl md:text-4xl font-light leading-relaxed font-serif bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent max-w-3xl">
        「昨日僕が感動した作品を、
        <br className="md:hidden" />
        今日の君はまだ知らない。」
      </h2>

      <style jsx>{`
        .font-serif {
          font-family: "Noto Serif JP", serif;
        }
      `}</style>
    </header>
  );
};
