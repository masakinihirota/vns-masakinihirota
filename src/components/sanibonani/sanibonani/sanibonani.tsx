"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Sanibonani = () => {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-[#fdf6e3] text-[#443322] dark:bg-neutral-950 dark:text-neutral-200 min-h-screen font-sans transition-colors duration-300">
        <GlobalHeader showSidebarTrigger={false} isPublic={true} />
        <main className="container py-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 w-full">
          <div className="flex justify-start">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/landing-page?tab=sanibona#inspiration">
                <ArrowLeft className="size-4" />
                戻る
              </Link>
            </Button>
          </div>

          <Card className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="text-center space-y-4 py-16 border-b border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/50" />

              <div className="space-y-3 relative z-10">
                <p className="text-xs font-bold tracking-[0.2em] text-blue-600 dark:text-blue-400 uppercase opacity-80">
                  TED Talks Daily
                </p>
                <CardTitle className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  会話を「取引」のように扱うとき、
                  <br className="hidden md:block" />
                  私たちは何を失うのか
                </CardTitle>
              </div>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium italic">
                カヤ・ドランガ（Khaya Dlanga）
              </p>
            </CardHeader>

            <CardContent className="p-8 md:p-16 space-y-8 text-lg md:text-xl leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-light text-justify md:text-left">
              <p>
                私の国には、部屋に入るときに挨拶をするという非常に大切な伝統があります。しかし、それは単なる挨拶ではありません。私が今から教える言葉に、皆さんも応えてほしいのです。とても簡単ですから、恥ずかりがらずにやってみてください。
              </p>

              <p>
                私が「サニボナニ（Sanibonani）」と言ったら、皆さんは「サクボナニ（Sakubonani）」と返してください。準備はいいですか？
              </p>

              <p className="py-2 font-semibold text-slate-900 dark:text-white">
                「サニボナニ！」
                <br />
                （会場：サクボナニ！）
              </p>

              <p>
                ありがとうございます。私の文化では、挨拶もせずに部屋に入るのは非常に失礼なこととされています。「サニボナニ」という言葉の本当の意味は、「私たちはあなたたちを見ています（We
                see
                you）」です。私は一人でここに立っていますが、なぜ「私たち」と言うのでしょうか。
              </p>

              <p>
                それは、「今の私を作っているすべて、私が背負ってきたすべての物語が、あなたの持つすべての物語を見ている」という意味だからです。また、私の先祖も私と共にいて、あなたを見ているという意味も含まれています。これが「サニボナニ」の真意です。
              </p>

              <p>
                さて、今日私がここに来た理由は、新しい知見を披露するためでも、舌を噛みそうな早口言葉を披露するためでもありません。ただ「会話のための会話」をし、「物語のための物語」を語るために来ました。
              </p>

              <p>
                南アフリカの哲学者スティーブ・ビコは、著書『I Write What I
                Like』の中で、西洋人はアフリカ人が「特定の結論や目的を持たずに、ただ会話を楽しむ能力」に驚くことが多いと記しています。今日は、私もそれに倣いたいと思います。
              </p>

              <p>
                一つ、物語をさせてください。私が広告業界で働き始めた頃、同じく広告の仕事をしていた従兄弟が、あの伝説的な俳優ウィリアム・シャトナーと南アフリカでCM撮影をすることになりました。私は彼の出演作『ボストン・リーガル』の大ファンで、その熱意がシャトナー氏に伝わり、なんと彼がアメリカに帰る前日に一緒にランチをすることになったのです。
              </p>

              <p>
                訪れたのは、人生で行ったこともないような超高級ホテルでした。シャトナー氏は非常に寛大で、最高級のウイスキーとシガーを振る舞ってくれました。彼は家族のこと、宗教のことなど、まるで「長年離れていた祖父」のように親身に話をしてくれました。何より驚いたのは、彼の「聴く力」です。全身全霊で私たちの話に耳を傾けてくれたのです。
              </p>

              <p>
                2時間半の素晴らしい時間の後、彼が去り際にウェイターにこう言いました。「支払いは彼らがするよ」。
              </p>

              <p>
                会場は笑いに包まれましたが、私は「見てもらえた（Seen）」と感じました。あの経験はプライスレスだったのです。
              </p>

              <p>
                また、私はアパルトヘイト（人種隔離政策）が終わる頃の南アフリカで育ちました。かつて白人専用だった公立学校に通った最初の黒人の子供の一人です。ある日、図書館で白人の友人と月の写真を見ていたとき、彼が「月の中に男の人の顔が見えるよ」と言いました。私は驚きました。私の村では、月には「桶を頭に載せ、子供を背負った女性」が見えると教わってきたからです。
              </p>

              <p>
                どちらの物語が正しいか、どちらが重要かということではありません。異なる文化の溝を埋めるには、あらゆる物語を受け入れることが不可欠です。「自分の知っているバージョンだけが正しい」と思い込む世界では、架け橋を築くことはできません。
              </p>

              <p>
                最後に、なぜ私が「目的のない会話」にこだわるのかをお話しします。
                <br />
                現代の私たちは、いつから「すべての会話にKPI（成果指標）やメリット」を求めるようになったのでしょうか。あらゆる会話の裏には「誰かと繋がりたい」という切実な願いがあります。私たちは孤独と戦うためにテクノロジーを使いますが、実際にはデバイスに詳しくなる一方で、隣人のことは何も知らなくなっています。「テクノロジーを知り、隣人を知るな」という新しい戒律が生まれたかのようです。
              </p>

              <p>
                数年前、私の弟が自ら命を絶ちました。彼はデバイスを通じたオンラインギャンブルに依存していました。彼は深い恥じらいを感じ、私たちに助けを求める会話をすることができませんでした。そして翌年、母もまた、息子を失った心の痛みから亡くなりました。
              </p>

              <p>
                AI（人工知能）は、これからあらゆるタスクやアルゴリズムを肩代わりしていくでしょう。しかし、AIに決して奪えないものがあります。それは私たちの「人間性」です。AIは美しい物語を作れますが、ある人の心から別の人の心へ届けるような物語を語ることはできません。
              </p>

              <p>
                人間を人間たらしめるのは、単に情報を交換することではありません。ただ「繋がるためだけに繋がる」という行為そのものなのです。
              </p>

              <p>ありがとうございました。</p>

              <div className="text-center pt-12 border-t border-slate-200 dark:border-white/10">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-12 h-12 border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <Link href="/landing-page?tab=sanibona#inspiration">
                    インスピレーションセクションに戻る
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
