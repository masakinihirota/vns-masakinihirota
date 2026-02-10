"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GlobalHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const GoodLife = () => {
  const [language, setLanguage] = useState<"ja" | "en">("ja");

  return (
    <SidebarProvider>
      <SidebarInset className="bg-[#f0f4f8] text-[#1a202c] dark:bg-neutral-950 dark:text-neutral-200 min-h-screen font-sans selection:bg-[#cbd5e0] selection:text-[#1a202c] transition-colors duration-300">
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

        <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans-jp w-full">
          {/* Navigation */}
          <div className="mb-8 flex justify-start">
            <Button
              asChild
              variant="ghost"
              className="text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-slate-100 dark:hover:bg-white/10 gap-2"
            >
              <Link href="/landing-page?tab=good-life#inspiration">
                <ArrowLeft className="size-4" />
                戻る
              </Link>
            </Button>
          </div>

          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold serif mb-4 dark:text-white">
              良い人生を送るための最も重要な美徳
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              出典:{" "}
              <a
                href="https://www.youtube.com/watch?v=g83Xl4-mvF8"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                The Most Important Virtue for a Good Life | Meghan Sullivan |
                TED - YouTube
              </a>
            </p>
          </header>

          {/* Main Content */}
          <main className="space-y-12">
            <Tabs defaultValue="report" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="report">対話レポート</TabsTrigger>
                  <TabsTrigger value="transcript">書き起こし</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="report" className="animate-fade-in-up">
                <section className="prose dark:prose-invert max-w-none text-center mb-8">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    ヒロタと真咲が、昼休みや休憩時間にこのTEDトークの内容について語り合っているシーンを想定した対話レポートです。
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold border-b border-slate-200 dark:border-neutral-700 pb-2 mb-8 mt-12 dark:text-slate-200 text-center md:text-left">
                    対話レポート：愛のリスクと「弱さ」の哲学
                  </h2>

                  {/* Hirota 1 */}
                  <div className="flex justify-start mb-6 w-full">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-xs font-bold mb-1 ml-1 text-slate-500 dark:text-slate-400">
                        ヒロタ
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tl-none shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                        <p className="text-slate-800 dark:text-slate-200">
                          さっき面白いTEDトークを見たんだ。メーガン・サリバンっていう哲学者が「もし、会う人全員を愛せるようになる薬があったら飲むか？」って学生に問いかける話なんだけど。君ならどうする？
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Masaki 1 */}
                  <div className="flex justify-end mb-6 w-full">
                    <div className="flex flex-col items-end max-w-[85%]">
                      <span className="text-xs font-bold mb-1 mr-1 text-slate-500 dark:text-slate-400">
                        真咲
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tr-none shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-slate-800 dark:text-slate-200">
                          うーん、全員ですか？
                          ちょっと怖いですね。私はパスかな。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hirota 2 */}
                  <div className="flex justify-start mb-6 w-full">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-xs font-bold mb-1 ml-1 text-slate-500 dark:text-slate-400">
                        ヒロタ
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tl-none shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                        <p className="text-slate-800 dark:text-slate-200">
                          お、動画に出てくる学生たちと同じ反応だね。ある学生が「大切な人が苦しむと自分も胃が痛くなる。それを全員分なんて耐えられない」って答えたらしい。愛っていうのは、素晴らしいだけじゃなく、実はすごくリスクがあって重いものなんだな。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Masaki 2 */}
                  <div className="flex justify-end mb-6 w-full">
                    <div className="flex flex-col items-end max-w-[85%]">
                      <span className="text-xs font-bold mb-1 mr-1 text-slate-500 dark:text-slate-400">
                        真咲
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tr-none shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-slate-800 dark:text-slate-200">
                          確かにそうですよね。でも、最近のSNSとか見てると、愛の薬どころか、みんな「全員を嫌いになる薬」を飲んでるみたいにギスギスしてませんか？
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hirota 3 */}
                  <div className="flex justify-start mb-6 w-full">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-xs font-bold mb-1 ml-1 text-slate-500 dark:text-slate-400">
                        ヒロタ
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tl-none shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                        <p className="text-slate-800 dark:text-slate-200">
                          まさに彼女もそれを指摘していたよ。現代は「倫理的な便秘」状態だって（笑）。政治的な議論や抽象的なマナーだけじゃ、この分断は解消できないって言うんだ。そこで彼女が持ち出したのが、アリストテレスとイエスの対比。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Masaki 3 */}
                  <div className="flex justify-end mb-6 w-full">
                    <div className="flex flex-col items-end max-w-[85%]">
                      <span className="text-xs font-bold mb-1 mr-1 text-slate-500 dark:text-slate-400">
                        真咲
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tr-none shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-slate-800 dark:text-slate-200">
                          哲学と宗教ですね。どう違うんですか？
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hirota 4 */}
                  <div className="flex justify-start mb-6 w-full">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-xs font-bold mb-1 ml-1 text-slate-500 dark:text-slate-400">
                        ヒロタ
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tl-none shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                        <p className="text-slate-800 dark:text-slate-200">
                          アリストテレスは「愛とは相手をもう一人の自分にすること」と言った。だから、悪い人とつながると自分まで汚染されるから、相手は慎重に選べと。でも、イエス（サマリア人の物語）の解釈は違ったんだ。相手の「弱さ」や「苦しみ」を見た時に、はらわたが突き動かされるような共感を持つこと、それが愛だと。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Masaki 4 */}
                  <div className="flex justify-end mb-6 w-full">
                    <div className="flex flex-col items-end max-w-[85%]">
                      <span className="text-xs font-bold mb-1 mr-1 text-slate-500 dark:text-slate-400">
                        真咲
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tr-none shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-slate-800 dark:text-slate-200">
                          「弱さ」でつながる……。それ、ちょっと分かります。完璧な人より、失敗談を話してくれる人の方が安心しますよね。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hirota 5 */}
                  <div className="flex justify-start mb-6 w-full">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-xs font-bold mb-1 ml-1 text-slate-500 dark:text-slate-400">
                        ヒロタ
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tl-none shadow-sm bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                        <p className="text-slate-800 dark:text-slate-200">
                          そうなんだ。トークの中では、アーサー・アーロンっていう心理学者の実験も紹介されていてね。初対面でも「自分の弱み」を見せ合う質問を重ねると、たった1時間で親友レベルの親密さが生まれるらしい。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Masaki 5 */}
                  <div className="flex justify-end mb-6 w-full">
                    <div className="flex flex-col items-end max-w-[85%]">
                      <span className="text-xs font-bold mb-1 mr-1 text-slate-500 dark:text-slate-400">
                        真咲
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tr-none shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-slate-800 dark:text-slate-200">
                          効率的な議論よりも、ちょっとした「弱音」の方が壁を壊すってことですね。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hirota 6 */}
                  <div className="flex justify-start mb-6 w-full">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-xs font-bold mb-1 ml-1 text-slate-500 dark:text-slate-400">
                        ヒロタ
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tl-none shadow-sm bg-white dark:bg-white/5 border-l-4 border-blue-400 dark:border-blue-500">
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                          その通り。僕らみたいな世代はつい「強くあれ」と思いがちだけど、実は自分の弱さをさらけ出すことが、他人と深くつながって「善き人生」を送るための近道なのかもしれないね。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Masaki 6 */}
                  <div className="flex justify-end mb-6 w-full">
                    <div className="flex flex-col items-end max-w-[85%]">
                      <span className="text-xs font-bold mb-1 mr-1 text-slate-500 dark:text-slate-400">
                        真咲
                      </span>
                      <div className="relative p-4 px-5 rounded-2xl rounded-tr-none shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-slate-800 dark:text-slate-200">
                          ヒロタさんの「胃が痛い」話も、今度じっくり聞きますよ（笑）。
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="transcript" className="animate-fade-in-up">
                <div className="flex justify-end mb-4 gap-2">
                  <Button
                    variant={language === "ja" ? "default" : "outline"}
                    onClick={() => setLanguage("ja")}
                    size="sm"
                    className="rounded-full px-4"
                  >
                    日本語
                  </Button>
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                    size="sm"
                    className="rounded-full px-4"
                  >
                    English
                  </Button>
                </div>

                <div className="p-6 md:p-10 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
                  <article className="prose dark:prose-invert max-w-none prose-lg prose-slate dark:prose-p:text-gray-300">
                    {language === "ja" ? (
                      <div className="space-y-6">
                        <p>
                          私はノートルダム大学の哲学教授です。『善き人生』についての講義を担当しており、とても人気があります。これまでのキャリアで、私は何千人もの若者を哲学で『堕落』させてきました。そして今夜、私は皆さんをも堕落させようと決意しています。現代の『善き人生』の哲学において、最も重要でありながら最も見過ごされているアイデアの一つを使ってね。
                        </p>
                        <p>
                          ほとんどの主要な哲学者や世界の主要な宗教は、『愛』という美徳を善き人生の中心に据えています。しかし、この美徳を実践するとは具体的にどういうことでしょうか？
                          学生たちに考えてもらうために、私はある思考実験を行います。「もし、会う人全員を無条件に愛せるようになる薬があったとしたら、飲みますか？」
                        </p>
                        <p>
                          皆さんなら飲みますか？
                          私はこれを何千人もの学生に問いかけてきましたが、真面目で敬虔なカトリックの新入生たちから返ってくる圧倒的な答えは『ノー』です。彼らは『全員を愛する薬』を飲みたがらないのです。
                          彼らの答えを聞くうちに、彼らがこの美徳をどう捉えているかが見えてきました。これまで聞いた中で最も深遠な答えの一つは、数年前に教えた19歳の男子学生のものでした。
                        </p>
                        <p>
                          仮に彼をクリスと呼びましょう。クリスが『全員を愛する薬』を飲まない理由を話そうと手を挙げたとき、私は「先生、負け犬たちは僕の愛に値しませんよ」なんて言うんじゃないかと半分予想していました。
                          しかし、彼の答えは実はとても深いものでした。彼はこう言いました。「先生、僕は夜、携帯電話をベッドから離れた場所に置いて寝ています。」
                        </p>
                        <p>
                          「時々、真夜中に電話が鳴ることがあります。飛び起きて、"母さんに何かあったんじゃないか"
                          と思うんです。電話を取って母が無事だと確認できるまで、胃が痛くて仕方ありません。もし世界中の全員に対してそんな風に感じていたら、僕には耐えられそうにありません。」
                          クリスは、私たちが愛についてどう考えているかの核心を突いていました。
                        </p>
                        <p>
                          愛は善き人生に不可欠ですが、同時にリスキーで危険で、時には耐え難いものでさえあります。
                          面白いことに、私たちは愛という美徳については複雑に考え込みますが、憎しみや恨みとなると簡単です。それらは確実に育てることができます。実際、現在の政治やインターネットは、私たちに『全員を憎む薬』を毎日のように自ら進んで飲ませているようなものです。
                        </p>
                        <p>
                          多くの哲学者が、この現在の混乱から抜け出す方法を見つけようとしています。私の倫理学の分野で今最もホットな話題の一つは『礼節（Civility）』の美徳です。
                          感情を抑え、より洗練された政治的対話を行い、意見の異なる人々とどう共存するかを人々に教えるべきだ、というわけです。
                        </p>
                        <p>
                          しかし、2400年の哲学史の中で、礼節を主要な徳目と見なした主要な思想家は思い当たりません。礼節は美徳ではありますが、せいぜい三流、三部リーグの美徳です。（笑）
                          一方、愛は『深遠な魔法』です。私が研究している哲学者たちは、愛という美徳こそが私たちの倫理的・社会的健全性にとって不可欠だと考えています。
                        </p>
                        <p>
                          難しいのは、どうやって自分にその『愛の薬』を飲ませるかです。そこで、その道筋をつけるために、古代の愛に関する偉大な二人の哲学者を紹介したいと思います。彼らの意見は全て一致しているわけではありませんが、現在の混乱から抜け出すために取り戻すべき深い洞察を持っています。一人目はマケドニアのアリストテレスです。
                        </p>
                        <p>
                          彼は2400年前に善き人生についての講座を開いていました。彼の大きなアイデアは、愛とは単に自分の中で起こる感情ではないということでした。人を愛するとき、相手を『もう一人の自分』として経験するのです。愛には、自分と他者の間の膜を溶かす力があります。
                          愛する人が何か素晴らしいことを成し遂げたり、並外れた美徳を持っていたりすると、その達成や美徳が自分の中に入ってくるとアリストテレスは考えました。
                        </p>
                        <p>
                          逆に、愛する人が恥ずべきことをしたり悪徳を持っていたりすると、それも自分の中に入ってきます。アリストテレスは、だからこそ愛する相手は慎重に選ぶべきだと考えました。悪いものが自分の中に入ってこないようにね。
                          それから約500年後、もう一人の偉大な哲学者が登場し、この議論に革新をもたらしました。
                        </p>
                        <p>
                          ナザレのイエスです。多くの人はイエスを哲学者とは考えませんが、福音書を読めば、彼が常に古代ギリシャの哲学者たちに匹敵するような哲学的論争を行っていることが分かります。
                          私が思うに、その最たるものがルカによる福音書にあります。イエスはあるユダヤ教の倫理学者から質問を受けます。
                        </p>
                        <p>
                          ユダヤ教における善き人生の核心は、神を愛し、隣人をもう一人の自分として愛することです。その倫理学者はイエスに「それはどういう意味ですか？」と尋ねます。
                          イエスはある思考実験で答えます。「ある日、一人の男がエルサレムからエリコへ下る道を歩いていたとき、強盗に襲われました。彼らは男の服を剥ぎ取り、持ち物をすべて奪い、半殺しにして去っていきました。」
                        </p>
                        <p>
                          「男は道端で死にかけていました。二人の男が通りかかり、瀕死の男に気づきましたが、心動かされることなく通り過ぎていきました。
                          三番目にやってきたのはサマリヤ人でした。彼は男を見て、はらわたが煮えくり返るような衝撃を受けました。」
                          ルカによる福音書で使われているギリシャ語は『スプランクニゾマイ（splagchnizomai）』、内臓が激しく動くという意味です。
                        </p>
                        <p>
                          古代世界では、愛のような強い感情は心臓ではなく、腸（はらわた）に宿ると考えられていました。もし古代哲学風のバレンタインカードを作るとしたら、ハート型ではなく、腸のぐるぐる巻きや、肝臓や腎臓の形に切り抜いて渡すことになるでしょう。
                        </p>
                        <p>
                          愛はそこに宿っていたのです。サマリヤ人ははらわたで愛を感じました。そして立ち止まり、男を助け、一晩中看病しました。
                          アリストテレスは、人と人を繋ぎ、心の膜を溶かすのは、美徳や達成への期待だと考えました。しかしイエスは、膜を溶かし、本当に人と人を繋ぐのは『弱さ（Vulnerability）』だと考えたのです。
                        </p>
                        <p>
                          弱さを通じて人と繋がることの興味深い点は、それが誰とでも可能だということです。私たちは皆、道端で物理的に打ちのめされて死にかけているわけではないかもしれませんが、人生によって打ちのめされた経験は誰もが持っています。私たちの中には皆、あの傷ついた男の要素があり、そこで愛のつながりが生まれるのです。
                        </p>
                        <p>
                          私の言葉を鵜呑みにする必要はありません。30年前、社会心理学で最も興味深い研究の一つが行われました。アーサー・アーロン博士による素晴らしい実験で、実験室で見知らぬ人同士を1時間足らずで恋に落ちさせることができることを証明しました。
                          実験はこうです。ペアを作り、お互いにより深い弱さをさらけ出すような質問をさせました。
                        </p>
                        <p>
                          最初は「夕食を一緒に食べたい人は誰？」といった簡単な質問から始まり、最後には「家族の中で誰が死んだら一番ショックを受けるか？」といった質問になります。
                          その結果、参加者の30%が、最も親密なパートナーや親友に対して感じるのと同程度の親近感を覚えたと報告しました。
                        </p>
                        <p>
                          弱さには、こうしたつながりを生み出す力があります。皆さんはどうかわかりませんが、私は特にこの10年、いわば『倫理的な便秘』の時代を生きているように感じます。（笑）
                          私たちは再びはらわたを動かさなければなりません。それは、より良い政治論議や、より抽象的な概念、あるいは互いを切り離すことでは達成できません。
                        </p>
                        <p>
                          私たちは繋がることを学ばなければならないし、それを弱さを通じて行う方法を学ばなければなりません。ノートルダム大学で私が教えるクリスのような学生たちは、自らの『スプランクニゾマイ（感情）』が自分を弱くすると考えています。
                          しかし私は、このはらわたの感覚、この種の愛、このつながりこそが、私たちが『善き人生』への道を歩んでいる最も確かな証なのだと思います。
                        </p>
                        <p>ありがとうございました。</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p>
                          So I'm a philosopher at the University of Notre Dame,
                          where I teach a very popular course on the good life.
                          In my career, I have corrupted thousands of youth with
                          philosophy. And tonight, I’m here to try to corrupt
                          you with what I think is one of the most important,
                          but least appreciated ideas in the philosophy of the
                          good life today.
                        </p>
                        <p>
                          Most major philosophers and nearly every major world
                          religion puts the virtue of love at the center of the
                          good life. But what exactly does it mean to practice
                          this virtue? To get my students thinking about this, I
                          give them a thought experiment. Suppose I had a pill,
                          and if you took it, it would cause you to experience
                          love for absolutely anyone you met.
                        </p>
                        <p>
                          Would you take it? I’ve asked this to thousands of
                          students, and the answer I overwhelmingly get from my
                          very earnest, very Catholic freshmen is: no. They
                          wouldn't take the "love everyone" pill. And in hearing
                          their answers, I start to get some insight into how
                          they're thinking about this virtue. One of the most
                          profound answers I ever heard was from a 19-year-old
                          guy I taught a couple of years ago.
                        </p>
                        <p>
                          Let's call him Chris, to protect his identity. When
                          Chris raised his hand to tell me why he wouldn't take
                          the "love everyone" pill, I half expected him to say
                          something like, "Professor, losers don't deserve my
                          love." But instead, he said something that was
                          actually pretty deep. He said, "Professor, I sleep
                          with my cell phone across my bedroom at night.
                        </p>
                        <p>
                          And sometimes it goes off in the middle of the night.
                          And I wake up and I think, ’Oh my God, something’s
                          happened to my mom.′ And I feel sick to my stomach
                          until I can get to the phone and answer it and know
                          that she's OK. Feeling that way about everyone, that
                          would be unbearable for me." Chris has his finger,
                          attention in how we think about love.
                        </p>
                        <p>
                          Love is essential to the good life, but it's also
                          risky, dangerous, it can even be downright unbearable.
                          One thing that's kind of funny is we have all these
                          complex thinkings about the virtue of love, but when
                          it comes to hate and resentment, those are easy. We
                          can absolutely cultivate those. In fact, our current
                          politics, the internet, it has us taking a "hate
                          everyone" pill just about voluntarily every day.
                        </p>
                        <p>
                          There are a lot of philosophers that are trying to
                          figure out a way out of this current chaos. And in my
                          field of ethics, one of the hottest topics right now
                          is the virtue of civility. What we need to teach
                          people is how to turn down their feelings, how to have
                          more sophisticated political conversations, and how to
                          coexist with other people who they disagree with.
                        </p>
                        <p>
                          Now in 2,400 years of philosophy, I can think of no
                          major thinker who thinks civility is a cardinal
                          virtue. Civility, it's a virtue, but like a third
                          tier, division-three virtue at best. (Laughter) Love,
                          on the other hand, love is the deep magic. The
                          philosophers that I study think the virtue of love is
                          crucial for our ethical and social health.
                        </p>
                        <p>
                          The tough thing is figuring out how to get yourself to
                          take that love pill. So to get us on that track, I
                          want to introduce you guys to two of the greatest
                          ancient philosophers of love who don't agree on
                          everything, but have some deep insights that we need
                          to recover to get out of our current mess. The first
                          philosopher is Aristotle of Macedonia.
                        </p>
                        <p>
                          He taught his course on the good life 2,400 years ago,
                          and his big idea was that love is not just a feeling
                          that happens inside of you. When you love another
                          person, you experience them as another self. Love has
                          the power to dissolve the membrane between yourself
                          and another person. When you love someone and they
                          achieve something great or they have extraordinary
                          virtue, Aristotle thinks those achievements and
                          virtues, they come into yourself.
                        </p>
                        <p>
                          When you love someone and they do something shameful
                          or they have vice, that comes into you. Aristotle
                          thought for those reasons you should be super careful
                          who you love. You shouldn't want any potentially bad
                          stuff to come into yourself. About 500 years later,
                          another great philosopher comes on the scene and he
                          innovates this debate.
                        </p>
                        <p>
                          This is Jesus of Nazareth. Now a lot of people don’t
                          think of Jesus as a philosopher, but if you read the
                          Gospels, he is getting into philosophical disputes all
                          the time that rival the ones the ancient Greek
                          philosophers are having. The best one, I think, comes
                          in the Gospel of Luke. Jesus gets a question from a
                          Jewish ethicist.
                        </p>
                        <p>
                          The core of the good life in Judaism is loving God and
                          loving others as another self. And the ethicist asks
                          Jesus, what does this mean? And Jesus responds with a
                          thought experiment. One day this man is walking down
                          the road from Jerusalem to Jericho when some robbers
                          come upon him, they strip him naked, take all of his
                          stuff and beat him within an inch of his life.
                        </p>
                        <p>
                          They leave him to die by the side of the road. Two men
                          walk by, they notice the man dying by the side of the
                          road, and they're unmoved, they just walk on by. A
                          third man comes around, a Samaritan, and he sees the
                          man, and his guts move inside of him. The Greek word
                          in the Gospel of Luke that we’re given is
                          “splagchnizomai,” his guts churn inside of him.
                        </p>
                        <p>
                          In the ancient world strong emotions like love, they
                          didn't live in your heart. They lived in your
                          intestines. If you wanted to make someone an ancient
                          philosophy-inspired Valentine, you wouldn't cut them
                          out a heart. You would literally cut them out a coil
                          of intestines and like, a liver and a kidney and give
                          it to them.
                        </p>
                        <p>
                          That's where love lived. The Samaritan loved in his
                          guts. And he stopped and he helped the man, he nursed
                          him back to health all night. Aristotle thought that
                          what connects us with other people, what dissolves
                          that membrane, is expectation of virtue and
                          achievement. But Jesus thought, what dissolves the
                          membrane, what really connects us with other people is
                          vulnerability.
                        </p>
                        <p>
                          And what's interesting about connecting with people on
                          vulnerability is that you can do it with absolutely
                          anyone. We might not all be physically beaten up,
                          laying, dying by the side of the road, but we've all
                          been beaten up by life. We all have some element of
                          that beaten man inside of us, and that is where the
                          love connection can happen.
                        </p>
                        <p>
                          You don't have to take my word for it. I think one of
                          the most interesting studies in social psychology, 30
                          years ago, Arthur Aron did this amazing experiment
                          where he showed that he could cause strangers to love
                          each other in a lab in under an hour. And here was the
                          experiment. He'd pair people up, and he would have
                          them ask each other questions that required them to be
                          increasingly vulnerable.
                        </p>
                        <p>
                          It would start with simple questions like, who’s
                          someone you’d like to have dinner with? And end with
                          questions like, which member of your family would you
                          be most disturbed to discover had died? People
                          reported, 30 percent of participants in the Aron's
                          study, reported feelings of closeness that rivaled how
                          they felt towards their most intimate partners and
                          towards their best friends.
                        </p>
                        <p>
                          Vulnerability has the ability to cause these
                          connections. I don't know about you guys, but I feel
                          like, especially in the last decade, we have been
                          living through a period of what I would call ethical
                          constipation. (Laughter) We have to get our guts
                          moving again, and we're not going to be able to do
                          that with better political discussions, more
                          abstractions, separating ourselves from each other.
                        </p>
                        <p>
                          We have got to learn to connect, and we've got to
                          learn how to do it through our vulnerability. Guys
                          like Chris that I teach at Notre Dame, they think that
                          their splagchnizomai makes them weak. But I think that
                          this feeling in our guts, this kind of love, this
                          connection, it's the surest sign that we are on the
                          road to the good life.
                        </p>
                        <p>Thank you. (Cheers and applause)</p>
                      </div>
                    )}
                  </article>
                </div>
              </TabsContent>
            </Tabs>
          </main>

          <footer className="text-center text-xs text-gray-400 mt-20 pb-12 border-t border-gray-200/50 dark:border-neutral-800 pt-8">
            &copy; 2024 VNS masakinihirota. All rights reserved.
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
