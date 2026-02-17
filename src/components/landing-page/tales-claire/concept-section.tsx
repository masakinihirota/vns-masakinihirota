"use client";


export const ConceptSection = () => {
  return (
    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/5 p-8 md:p-12 rounded-2xl space-y-8 animate-fade-in-up delay-200 shadow-sm dark:shadow-none">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-4">
          VNSとは価値観でつながるネットワーク
        </h3>
        <p className="text-lg text-slate-700 dark:text-muted-foreground leading-relaxed">
          SNSが「社会的なつながり（Social）」を作る場所なら、
          <br className="hidden md:inline" />
          VNSは
          <strong className="text-blue-600 dark:text-blue-400 font-bold mx-1">
            「価値観（Value）」
          </strong>
          でつながる場所です。SNSとは別ベクトルのコミュニケーションを提供します。
        </p>
        <p className="text-lg text-slate-700 dark:text-muted-foreground leading-relaxed text-left max-w-2xl mx-auto">
          あなたの「好きな作品」「大切にしている価値観」「スキル」を頼りに、話が合う仲間や、心地よい居場所（組織・国）を見つけましょう。
        </p>
      </div>
    </div>
  );
};
