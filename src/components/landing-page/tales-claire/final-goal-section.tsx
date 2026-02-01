"use client";

export const FinalGoalSection = () => {
  return (
    <section id="final-goal" className="py-12 animate-fade-in-up delay-600">
      <div className="max-w-3xl mx-auto px-6 text-center text-slate-800 dark:text-neutral-200">
        <h3 className="text-2xl font-bold mb-8">サイトの最終目標</h3>

        <div className="space-y-6 text-lg font-medium">
          <div>
            <span className="font-bold mr-2">組織</span>
            <span>パートナー(ライフパートナー)を見つける</span>
          </div>

          <div>
            <span className="font-bold mr-2">国</span>
            <span>ノーベル平和賞を獲得する</span>
          </div>
        </div>
      </div>
    </section>
  );
};
