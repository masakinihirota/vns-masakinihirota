"use client";


export const DeclarationsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
      {/* Oasis Declaration */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-white/50 dark:border-white/5 p-8 rounded-xl hover:bg-white dark:hover:bg-white/10 transition-colors duration-300 shadow-sm dark:shadow-none ring-1 ring-black/5 dark:ring-white/5">
        <div className="text-3xl mb-4 opacity-80">🏝️</div>
        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-foreground">
          オアシス宣言
        </h3>
        <p className="text-lg text-slate-600 dark:text-muted-foreground leading-relaxed">
          インターネットという情報の洪水の中での休息地。
          「褒めるときは大きな声で、叱るときは二人きりで」をモットーに、
          争うことなく翼を休められる場所を作ります。
        </p>
      </div>

      {/* Human Declaration */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-white/50 dark:border-white/5 p-8 rounded-xl hover:bg-white dark:hover:bg-white/10 transition-colors duration-300 shadow-sm dark:shadow-none ring-1 ring-black/5 dark:ring-white/5">
        <div className="text-3xl mb-4 opacity-80">🧬</div>
        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-foreground">
          人間宣言
        </h3>
        <p className="text-lg text-slate-600 dark:text-muted-foreground leading-relaxed">
          人は間違いを犯し、再挑戦できる生き物です。
          過去の発言は過去の自分。変わることを恐れず、失敗から学ぶ成長を、
          包容力を持って見守る世界です。
        </p>
      </div>

      {/* Honesty Declaration */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-white/50 dark:border-white/5 p-8 rounded-xl hover:bg-white dark:hover:bg-white/10 transition-colors duration-300 shadow-sm dark:shadow-none ring-1 ring-black/5 dark:ring-white/5">
        <div className="text-3xl mb-4 opacity-80">💎</div>
        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-foreground">
          正直宣言
        </h3>
        <p className="text-lg text-slate-600 dark:text-muted-foreground leading-relaxed">
          できるだけ正直に行動すること。
          自身の価値観に嘘をつかず、好きなものを好きと言える環境を大切にします。
        </p>
      </div>
    </div>
  );
};
