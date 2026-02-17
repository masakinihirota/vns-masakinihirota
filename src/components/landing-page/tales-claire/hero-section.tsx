"use client";

export const HeroSection = () => {
  return (
    <header className="flex flex-col items-center text-center space-y-8 min-h-[60vh] justify-center animate-fade-in-up">
      <div className="space-y-2">
        <p className="text-blue-500 dark:text-blue-400 tracking-[0.2em] text-lg font-medium uppercase">
          Value Network Service
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground font-serif">
          VNS
          <br className="block" />
          masakinihirota
        </h1>
      </div>

      <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 dark:via-neutral-400 to-transparent"></div>

      <h2 className="text-2xl md:text-4xl font-light leading-relaxed font-serif bg-gradient-to-br from-indigo-900 to-blue-700 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent max-w-3xl drop-shadow-sm dark:drop-shadow-none">
        「昨日僕が感動した作品を、
        <br className="md:hidden" />
        今日の君はまだ知らない。」
      </h2>

      <div className="space-y-4 font-serif">
        <p className="text-lg md:text-xl text-slate-700 dark:text-muted-foreground font-medium">
          まっさきにひろった の名前の由来
        </p>
        <p className="text-lg md:text-xl text-slate-600 dark:text-muted-foreground max-w-2xl">
          インターネットという情報の洪水の中から真っ先に価値のあるものを拾い上げる
        </p>
      </div>
    </header>
  );
};
