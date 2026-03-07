"use client";

export function FinalGoalSection() {
    return (
        <section id="final-goal" className="py-12">
            <div className="mx-auto max-w-3xl px-6 text-center text-slate-800 dark:text-neutral-200">
                <h3 className="mb-8 text-2xl font-bold">サイトの最終目標</h3>

                <div className="space-y-6 text-lg font-medium">
                    <div>
                        <span className="mr-2 font-bold">テーマ</span>
                        <span>「生きる！」</span>
                    </div>

                    <div>
                        <span className="mr-2 font-bold">組織</span>
                        <span>パートナー(ライフパートナー)を見つける</span>
                    </div>

                    <div>
                        <span className="mr-2 font-bold">国</span>
                        <span>ノーベル平和賞を貰えるような国を目指す</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
