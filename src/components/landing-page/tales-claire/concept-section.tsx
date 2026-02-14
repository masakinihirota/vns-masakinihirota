"use client";

export const ConceptSection = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-2xl animate-fade-in-up delay-200">
      <div className="max-w-3xl mx-auto space-y-8 leading-relaxed text-lg text-slate-700 dark:text-muted-foreground">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white text-center mb-10">
          このサイトの目的は、価値観で友達を作ることです。
        </h3>

        <div className="space-y-6">
          <p>
            最初はあなたの価値観のデータがないため、
            <strong className="text-blue-600 dark:text-blue-400 font-bold">
              「幽霊」
            </strong>
            の状態として始まります。
            <br />
            「幽霊」の状態はこの世界を見ることはできますが、相手からは見えません。
          </p>

          <p>
            なので、自分の
            <strong className="text-blue-600 dark:text-blue-400 font-bold">
              「仮面（プロフィール）」
            </strong>
            を作ってください。
            仮面とは、あなたの価値観を記した自己紹介データです。このデータを元に、あなたの価値観と合う人を探します。
          </p>

          <p>
            <strong className="text-blue-600 dark:text-blue-400 font-bold">
              「仮面（プロフィール）」
            </strong>
            を作って、
            <strong className="text-blue-600 dark:text-blue-400 font-bold">
              「マッチング機能」
            </strong>
            から価値観の近い人を探しましょう。
          </p>

          <p className="pt-6 border-t border-blue-500/10 dark:border-white/10">
            価値観の近い人を見つけたら、一緒に何かをします。
            例えば、遊んだり、ものを作ったり、パートナーを見つけたりします。
            <br className="hidden md:inline" />
            そのための機能（メッセージ機能、イベント機能、コミュニティ機能など）はこれから作成します。
          </p>
        </div>
      </div>
    </div>
  );
};
