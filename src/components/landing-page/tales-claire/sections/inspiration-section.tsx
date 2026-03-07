"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabValue = "rebirth" | "sanibona" | "good-life";

export function InspirationSection() {
    const searchParameters = useSearchParams();
    const router = useRouter();
    const tabParameter = searchParameters.get("tab");

    const [activeTab, setActiveTab] = useState<TabValue>(() => {
        if (
            tabParameter === "rebirth" ||
            tabParameter === "sanibona" ||
            tabParameter === "good-life"
        ) {
            return tabParameter;
        }
        return "rebirth";
    });

    const handleTabChange = (value: string) => {
        if (value !== "rebirth" && value !== "sanibona" && value !== "good-life") {
            return;
        }
        setActiveTab(value);
        const parameters = new URLSearchParams(searchParameters.toString());
        parameters.set("tab", value);
        router.replace(`?${parameters.toString()}#inspiration`, { scroll: false });
    };

    return (
        <section id="inspiration" className="py-12">
            <div className="overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-white/5 dark:shadow-none">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="flex flex-col justify-between gap-6 border-b border-black/5 p-8 md:flex-row md:items-center dark:border-white/5">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Inspiration Source
                        </h3>

                        <TabsList className="h-auto rounded-xl border border-slate-200/50 bg-slate-100/50 p-1 dark:border-white/10 dark:bg-white/5">
                            <TabsTrigger
                                value="rebirth"
                                className="rounded-lg px-6 py-2.5 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10"
                            >
                                断頭台の演説
                            </TabsTrigger>
                            <TabsTrigger
                                value="sanibona"
                                className="rounded-lg px-6 py-2.5 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10"
                            >
                                サニボナニ
                            </TabsTrigger>
                            <TabsTrigger
                                value="good-life"
                                className="rounded-lg px-6 py-2.5 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-white/10"
                            >
                                善き人生
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value={activeTab}>
                        {activeTab === "rebirth" && (
                            <VideoPanel
                                heading="『断頭台の演説』より"
                                subheading="Tales of Rebirth (2004)"
                                videoUrl="https://www.youtube.com/embed/q8_9ckoVV5M"
                                summary="VNSの思想に通じる、魂の演説"
                                actionHref="/legendary-speech"
                                actionLabel="書き起こしを読む"
                            />
                        )}

                        {activeTab === "sanibona" && (
                            <VideoPanel
                                heading="「サニボナニ」：会話を取引のように扱うとき、何を失うのか"
                                subheading="Khaya Dlanga | TED"
                                videoUrl="https://www.youtube.com/embed/HtzG2AoahAo"
                                summary="会話の本質と人間性を説く挨拶"
                                actionHref="/sanibonani"
                                actionLabel="書き起こしを読む"
                            />
                        )}

                        {activeTab === "good-life" && (
                            <VideoPanel
                                heading="良い人生を送るための最も重要な美徳"
                                subheading="Meghan Sullivan | TED"
                                videoUrl="https://www.youtube.com/embed/g83Xl4-mvF8"
                                summary="愛のリスクと『弱さ』を共有することの重要性"
                                actionHref="/good-life"
                                actionLabel="雑談を読む"
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}

type VideoPanelProperties = {
    heading: string;
    subheading: string;
    videoUrl: string;
    summary: string;
    actionHref: string;
    actionLabel: string;
};

function VideoPanel({
    heading,
    subheading,
    videoUrl,
    summary,
    actionHref,
    actionLabel,
}: VideoPanelProperties) {
    return (
        <>
            <div className="border-b border-black/5 bg-slate-50/30 p-8 dark:border-white/5 dark:bg-white/1">
                <p className="text-lg text-slate-500 dark:text-neutral-400">{summary}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video bg-black">
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={videoUrl}
                        title={heading}
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                <div className="flex flex-col justify-center space-y-6 bg-white/50 p-8 dark:bg-white/2">
                    <div>
                        <h4 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">{heading}</h4>
                        <p className="text-lg uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                            {subheading}
                        </p>
                    </div>
                    <div className="pt-2">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full border-slate-200 px-8 hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10"
                        >
                            <Link href={actionHref}>{actionLabel}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
