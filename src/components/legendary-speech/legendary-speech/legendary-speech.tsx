"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GlobalHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const LegendarySpeech = () => {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-[#fdf6e3] text-[#443322] dark:bg-neutral-950 dark:text-neutral-200 min-h-screen font-sans selection:bg-[#faedcd] selection:text-[#443322] transition-colors duration-300">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@300;400;700&display=swap');

          .serif {
            font-family: 'Noto Serif JP', serif;
          }

          .font-sans-jp {
            font-family: 'Noto Sans JP', sans-serif;
          }
        `}</style>

        <GlobalHeader showSidebarTrigger={false} isPublic={true} />

        <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans-jp w-full">
          {/* Navigation */}
          <div className="mb-8 flex justify-start">
            <Button
              asChild
              variant="ghost"
              className="text-[#443322]/60 hover:text-[#443322] dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-[#faedcd]/50 dark:hover:bg-white/10 gap-2"
            >
              <Link href="/landing-page?tab=rebirth#inspiration">
                <ArrowLeft className="size-4" />
                戻る
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold serif mb-4 dark:text-white">
              『断頭台の演説』
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              出典:{" "}
              <a
                href="https://www.youtube.com/watch?v=q8_9ckoVV5M"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-orange-600 dark:hover:text-orange-400"
              >
                【公式】『テイルズ オブ リバース』「断頭台の演説」(YouTube)
              </a>
            </p>
          </header>

          {/* Main Content */}
          <main className="space-y-12">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold border-b border-[#fb923c] dark:border-orange-500/50 pb-2 mb-8 mt-12 dark:text-orange-400">
                セクション1: 女王の問いかけ
              </h2>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    アガーテ女王
                  </span>
                  <p>
                    皆さん聞いてください。私たちヒューマとガジュマは、隣人として、良き友として、共存の道を歩んしてきました。
                  </p>
                  <p className="mt-2">
                    それが今、争いを始めようとしています。種族の違い、ただそれだけの理由で。
                  </p>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm bg-white dark:bg-white/10 border-r-4 border-gray-400 dark:border-neutral-500 text-left">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-gray-600 dark:text-neutral-400">
                    市民
                  </span>
                  <p>
                    そんな単純なことじゃない！正しい形になろうとしているんだ！女王様は俺たちの味方じゃないのか？
                  </p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    アガーテ女王
                  </span>
                  <p>
                    種族って何ですか？私たちは姿は違っていても、楽しい時は笑い、悲しい時には涙を流します。それはなぜでしょう？私たちの心は同じだからです。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold border-b border-[#fb923c] dark:border-orange-500/50 pb-2 mb-8 mt-12 dark:text-orange-400">
                セクション2: ひとつの種族
              </h2>

              <div className="flex justify-end mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm bg-white dark:bg-white/10 border-r-4 border-gray-400 dark:border-neutral-500 text-left">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-gray-600 dark:text-neutral-400">
                    市民
                  </span>
                  <p>ねえ、あれは本当に女王様なの？</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    アガーテ女王
                  </span>
                  <p className="mt-2 serif italic text-lg leading-relaxed dark:text-neutral-200">
                    私は思うんです。身体なんて、人の心(魂)を入れるためのただの「入れ物」でしかない。
                  </p>
                  <div className="mt-4 border-b-2 border-dashed border-[#faedcd] dark:border-orange-500/30 inline-block">
                    <p className="serif font-bold text-xl dark:text-white">
                      もし種族というものがあるのなら、私たちはガジュマでもヒューマでもなく、大地に生きる、人という「一つの種族」なんだって。
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>「あっ・・」</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    アガーテ女王
                  </span>
                  <p>
                    思い出してください。私たちには、共に笑い、泣き、悲しみ、喜べる時間があったはずです。親切にしてもらったこととか、一緒に美味しい物を食べたりとか、
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold border-b border-[#fb923c] dark:border-orange-500/50 pb-2 mb-8 mt-12 dark:text-orange-400">
                セクション3: ピーチパイの記憶
              </h2>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    アガーテ女王
                  </span>
                  <p>
                    私の知っている村では、おばさんがパイを焼くたびにみんなが集まって、ヒューマもガジュマもなく、みんなが美味しい美味しいって食べるんです。
                  </p>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm bg-white dark:bg-white/10 border-r-4 border-gray-400 dark:border-neutral-500 text-left">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-gray-600 dark:text-neutral-400">
                    市民
                  </span>
                  <p>
                    騙されるな！あいつは命が惜しいから俺たちを丸め込もうとしてるんだ！
                  </p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-orange-400 dark:border-orange-500">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    クレア/アガーテ女王
                  </span>
                  <p>死ぬのが怖くて言っているんじゃありません・・・</p>
                  <p className="mt-3 text-xl font-bold serif text-[#e76f51] dark:text-orange-400">
                    大好きな人たちと憎しみ合って生きるのは、死ぬのと同じくらい辛いことだと思うから・・・
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold border-b border-[#fb923c] dark:border-orange-500/50 pb-2 mb-8 mt-12 dark:text-orange-400">
                セクション4: アガーテ女王のお願い
              </h2>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-green-900 dark:text-green-400">
                    騎士(ミルハウスト)
                  </span>
                  <p>陛下！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>…あれはアガーテじゃない！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-gray-500 dark:text-neutral-400">
                    ザビィ
                  </span>
                  <p>「キィッー」</p>
                </div>
              </div>

              <div className="flex justify-start mb-6 w-full">
                <div className="relative p-6 px-8 rounded-2xl rounded-tl-none w-full shadow-sm bg-white dark:bg-white/5 backdrop-blur-md border-l-8 border-orange-400 dark:border-orange-500">
                  <span className="text-[0.75rem] font-bold mb-4 block tracking-widest text-orange-800 dark:text-orange-400">
                    クレア/アガーテ女王
                  </span>
                  <p className="text-lg">
                    どうか私の最後のお願いを聞いてください。
                  </p>
                  <p className="text-lg mt-4">
                    皆さんがパイを、ピーチパイを食べることがあったら、一度だけ目を閉じて考えてください。
                  </p>

                  <div className="mt-8 py-6 px-4 bg-orange-50 dark:bg-orange-500/10 rounded-lg border-y border-orange-100 dark:border-orange-500/20 text-center">
                    <h3 className="text-xl md:text-2xl serif font-bold text-[#e76f51] dark:text-orange-400">
                      「あなたの美味しいと感じる心に種族はありますか？」
                    </h3>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold border-b border-[#fb923c] dark:border-orange-500/50 pb-2 mb-8 mt-12 dark:text-orange-400">
                セクション5: 再会
              </h2>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-green-900 dark:text-green-400">
                    騎士(ミルハウスト)
                  </span>
                  <p>続けー</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>クレア！</p>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm bg-white dark:bg-white/10 border-r-4 border-gray-400 dark:border-neutral-500 text-left">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-red-700 dark:text-red-400">
                    兵士
                  </span>
                  <p>この野郎！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>クレア！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-orange-300 dark:border-orange-400">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    クレア
                  </span>
                  <p>ヴェイグ！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>どけーッ！邪魔をするなッー！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-orange-300 dark:border-orange-400">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    クレア
                  </span>
                  <p>ヴェイグーーーッ！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>クレアーーーーーッ！</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-gray-500 dark:text-neutral-400">
                    ザビィ
                  </span>
                  <p>「キィッーキィッーキィッ」</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>クレア、クレアなんだな？</p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-orange-300 dark:border-orange-400">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-orange-800 dark:text-orange-400">
                    クレア
                  </span>
                  <p>
                    あたし、信じてた・・・どんな姿をしていても、ヴェイグなら気づいてくれるって・・・
                  </p>
                </div>
              </div>

              <div className="flex justify-start mb-6">
                <div className="relative p-4 px-5 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm bg-white/90 dark:bg-white/5 backdrop-blur-md border-l-4 border-[#d4a373] dark:border-orange-500/50">
                  <span className="text-[0.75rem] font-bold mb-1.5 block tracking-widest text-blue-900 dark:text-blue-400">
                    ヴェイグ
                  </span>
                  <p>クレア・・・</p>
                </div>
              </div>
            </section>
          </main>

          <footer className="text-center text-xs text-gray-400 mt-20 pb-12 border-t border-gray-200/50 dark:border-neutral-800 pt-8">
            &copy; Tales of Rebirth / BANDAI NAMCO Entertainment Inc.
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
