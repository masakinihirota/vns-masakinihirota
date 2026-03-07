"use client";

export function ConceptSection() {
    return (
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white/40 p-8 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5 dark:shadow-none md:p-12">
            <div className="space-y-4">
                <h3 className="border-l-4 border-blue-500 pl-4 text-2xl font-bold text-slate-900 dark:text-white">
                    VNSとは価値観でつながるネットワーク
                </h3>
                <p className="text-lg leading-relaxed text-slate-700 dark:text-muted-foreground">
                    SNSが「社会的なつながり（Social）」を作る場所なら、
                    <br className="hidden md:inline" />
                    VNSは
                    <strong className="mx-1 font-bold text-blue-600 dark:text-blue-400">
                        「価値観（Value）」
                    </strong>
                    でつながる場所です。SNSとは別ベクトルのコミュニケーションを提供します。
                </p>
                <p className="mx-auto max-w-2xl text-left text-lg leading-relaxed text-slate-700 dark:text-muted-foreground">
                    あなたの「好きな作品」「大切にしている価値観」「スキル」を頼りに、話が合う仲間や、心地よい居場所（組織・国）を見つけましょう。
                </p>
            </div>
        </div>
    );
}
