"use client";

export function DeclarationsSection() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/50 bg-white/80 p-8 shadow-sm ring-1 ring-black/5 transition-colors duration-300 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:ring-white/5 dark:hover:bg-white/10">
                <div className="mb-4 text-3xl opacity-80">🏝️</div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-foreground">
                    オアシス宣言
                </h3>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-muted-foreground">
                    インターネットという情報の洪水の中での休息地。「褒めるときは大きな声で、叱るときは二人きりで」をモットーに、争うことなく翼を休められる場所を作ります。
                </p>
            </div>

            <div className="rounded-xl border border-white/50 bg-white/80 p-8 shadow-sm ring-1 ring-black/5 transition-colors duration-300 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:ring-white/5 dark:hover:bg-white/10">
                <div className="mb-4 text-3xl opacity-80">🧬</div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-foreground">
                    人間宣言
                </h3>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-muted-foreground">
                    人は間違いを犯し、再挑戦できる生き物です。過去の発言は過去の自分。変わることを恐れず、失敗から学ぶ成長を、包容力を持って見守る世界です。
                </p>
            </div>

            <div className="rounded-xl border border-white/50 bg-white/80 p-8 shadow-sm ring-1 ring-black/5 transition-colors duration-300 hover:bg-white dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:ring-white/5 dark:hover:bg-white/10">
                <div className="mb-4 text-3xl opacity-80">💎</div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-foreground">
                    正直宣言
                </h3>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-muted-foreground">
                    できるだけ正直に行動すること。自身の価値観に嘘をつかず、好きなものを好きと言える環境を大切にします。
                </p>
            </div>
        </div>
    );
}
