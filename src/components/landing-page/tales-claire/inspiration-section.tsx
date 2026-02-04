"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const InspirationSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  // URLのパラメータからタブを初期化、なければデフォルト値を設定
  const [activeTab, setActiveTab] = useState("rebirth");

  // マウント時にURLパラメータを確認
  useEffect(() => {
    if (tabParam && (tabParam === "rebirth" || tabParam === "sanibona")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // URLを更新して、戻った時に正しいタブが表示されるようにする
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    // スクロール位置を維持するために router.replace を使用
    router.replace(`?${params.toString()}#inspiration`, { scroll: false });
  };

  return (
    <section id="inspiration" className="py-12 animate-fade-in-up delay-600">
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="p-8 border-b border-black/5 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Inspiration Source
            </h3>

            <TabsList className="bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-1 rounded-xl h-auto">
              <TabsTrigger
                value="rebirth"
                className="px-6 py-2.5 rounded-lg font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm"
              >
                断頭台の演説
              </TabsTrigger>
              <TabsTrigger
                value="sanibona"
                className="px-6 py-2.5 rounded-lg font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm"
              >
                サニボナニ
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="rebirth">
            <div className="p-8 bg-slate-50/30 dark:bg-white/[0.01] border-b border-black/5 dark:border-white/5">
              <p className="text-slate-500 dark:text-neutral-400 text-lg">
                VNSの思想に通じる、魂の演説
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Video Wrapper */}
              <div className="aspect-video bg-black relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/q8_9ckoVV5M"
                  title="Tales of Rebirth Speech"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Explanation */}
              <div className="p-8 flex flex-col justify-center space-y-6 bg-white/50 dark:bg-white/[0.02]">
                <div>
                  <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    『断頭台の演説』より
                  </h4>
                  <p className="text-lg text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tales of Rebirth (2004)
                  </p>
                </div>

                <div className="space-y-4 text-lg leading-relaxed text-slate-700 dark:text-gray-300">
                  <p>「種族って何ですか？ 私たちの心は同じだからです。」</p>
                  <p>
                    この動画は、種族間の対立と差別が渦巻く世界で、ヒロインが処刑の危機に瀕しながらも、分断された人々に「心のつながり」を訴えかけるシーンです。
                  </p>
                  <p>
                    <span className="text-slate-900 dark:text-white font-medium">
                      「あなたが美味しいと感じる心に、種族はありますか？」
                    </span>
                  </p>
                  <p>
                    この問いかけこそが、VNS masakinihirotaの核心です。
                    社会的な属性、人種、立場。それらを取り払ったとき、最後に残るのは「何に感動するか」「何を愛するか」という
                    <strong className="text-slate-900 dark:text-white ml-1">
                      価値観
                    </strong>
                    だけです。
                    VNSは、この演説が目指したような、お互いの「好き」を尊重し、争うことなく共存できる世界（オアシス）をテクノロジーで実現しようとしています。
                  </p>
                  <div className="pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full px-8 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-200 dark:border-white/20"
                    >
                      <Link href="/legendary-speech">書き起こしを読む</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sanibona">
            <div className="p-8 bg-slate-50/30 dark:bg-white/[0.01] border-b border-black/5 dark:border-white/5">
              <p className="text-slate-500 dark:text-neutral-400 text-lg">
                会話の本質と人間性を説く挨拶
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Video Wrapper */}
              <div className="aspect-video bg-black relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/HtzG2AoahAo"
                  title="What Gets Lost When We Treat Conversations Like Transactions"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Explanation */}
              <div className="p-8 flex flex-col justify-center space-y-6 bg-white/50 dark:bg-white/[0.02]">
                <div>
                  <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                    「サニボナニ」：会話を取引のように扱うとき、何を失うのか
                  </h4>
                  <p className="text-lg text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    Khaya Dlanga | TED
                  </p>
                </div>

                <div className="space-y-4 text-lg leading-relaxed text-slate-700 dark:text-gray-300">
                  <p>
                    「サニボナニ（Sanibonani）は、『私たちはあなたたちを見ています（We
                    see you）』という意味です。」
                  </p>
                  <p>
                    南アフリカの挨拶「サニボナニ」は、単なる挨拶ではなく、相手の背後にある歴史や物語をも一人の人間として尊重し、承認することを指します。
                  </p>
                  <p>
                    <span className="text-slate-900 dark:text-white font-medium">
                      「AIに決して奪えないものがあります。それは私たちの『人間性』です。」
                    </span>
                  </p>
                  <p>
                    本来の会話とは、何かを得るための取引ではなく、互いの物語を語り合う「行為そのもの」に価値があります。
                    損得勘定を抜きにして「繋がるためだけに繋がる」という温かい行為こそが、人間を人間たらしめる中心にあります。
                  </p>
                  <div className="pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full px-8 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-200 dark:border-white/20"
                    >
                      <Link href="/sanibonani">日本語版書き起こしを読む</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
