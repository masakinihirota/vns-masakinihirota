import { memo } from "react";

const purposes = [
    {
        title: "安心で安全な場所を提供する",
        description: "(オアシス宣言 / No BAN Just Drift / 検索避け・パージ機能)",
    },
    {
        title: "目的ごとに使い分ける「複数の自分」を言葉にする",
        description:
            "(千の仮面 / プロフィール / ティア評価 / シュレディンガーの猫主義)",
    },
    {
        title: "自分に近い価値観を持った人を探す",
        description: "(価値観マッチング / 自動・手動マッチング)",
    },
    {
        title:
            "ボトムアップで気が合う仲間とグループを作り、話し相手や趣味仲間、相談相手を見つける",
        description: "(組織 / グループ / 調停者による自治)",
    },
    {
        title: "トップダウンで国を興し、仕事の受発注やイベントを行う",
        description: "(国 / マーケット / 銀行 / イベント)",
    },
    {
        title: "スキルを登録して仕事を獲得したり、他者に教えたりする",
        description:
            "(スキル登録 / マンダラチャート / ティーチングは国や組織の活動として実施)",
    },
] as const;

export const PurposeSection = memo(function PurposeSection() {
    return (
        <section className="space-y-12">
            <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:bg-linear-to-r dark:from-teal-200 dark:to-blue-200 dark:bg-clip-text dark:text-transparent md:text-3xl">
                    masakinihirotaの主な機能
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {purposes.map((item) => (
                    <div
                        key={item.title}
                        className="group relative rounded-2xl border border-white/50 bg-white/60 p-6 shadow-sm transition-colors duration-300 hover:bg-white/80 dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10"
                    >
                        <div className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-2xl bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <h3 className="mb-2 text-xl font-bold text-slate-800 transition-colors group-hover:text-slate-900 dark:text-blue-100 dark:group-hover:text-white">
                            {item.title}
                        </h3>
                        <p className="text-lg leading-relaxed text-slate-600 dark:text-indigo-200/80">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
});
