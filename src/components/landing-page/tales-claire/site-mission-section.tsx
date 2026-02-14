"use client";

export const SiteMissionSection = () => {
  return (
    <section className="space-y-6 font-serif max-w-3xl mx-auto text-center animate-fade-in-up delay-200">
      <p className="text-lg md:text-xl text-slate-700 dark:text-muted-foreground font-medium">
        サイトの目的
      </p>
      <div className="text-base md:text-lg text-slate-600 dark:text-muted-foreground space-y-4 leading-relaxed">
        <p>
          このサイトの目的は、価値観で友達を作ることです。
        </p>
        <p>
          最初はあなたの価値観のデータがないため、「幽霊」の状態として始まります。<br />
          「幽霊」の状態はこの世界を見ることはできますが、相手からは見えません。
        </p>
        <p>
          なので、自分の <strong className="font-bold text-indigo-600 dark:text-indigo-400">「仮面（プロフィール）」</strong> を作ってください。<br />
          仮面とは、あなたの価値観を記した自己紹介データです。<br />
          このデータを元に、あなたの価値観と合う人を探します。
        </p>
        <p>
          <strong className="font-bold text-indigo-600 dark:text-indigo-400">「仮面（プロフィール）」</strong> を作って、「マッチング機能」から価値観の近い人を探しましょう。
        </p>
        <p>
          価値観の近い人を見つけたら、<strong className="font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-md inline-block">一緒に何かをします。</strong>
        </p>
        <p>
          例えば、<strong className="font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-md inline-block">遊んだり、ものを作ったり、パートナーを見つけたりします。</strong>
        </p>
      </div>
    </section>
  );
};
