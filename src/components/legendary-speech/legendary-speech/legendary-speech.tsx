"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LegendarySpeech = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg overflow-hidden">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            伝説のスピーチ
          </CardTitle>
          <p className="text-muted-foreground">
            VNSの思想の根幹にあるメッセージ
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video relative overflow-hidden rounded-xl border border-white/30 shadow-2xl">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/AZmYx5QBUNU"
              title="伝説のスピーチ解説動画"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
            <p>
              この動画は、VNS
              masakinihirotaが目指す「オアシス」の概念を理解する上で、最も重要なインスピレーション源の一つです。
            </p>
            <p className="font-medium text-foreground">
              「あなたが美味しいと感じる心に、種族はありますか？」
            </p>
            <p>
              社会的な属性、立場、あるいは個人の背景。それらを超えた先にある「心」のつながり。
              このスピーチが問いかける本質こそが、私たちがテクノロジーを通じて実現しようとしている世界そのものです。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
