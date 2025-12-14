import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Baby, Footprints, RefreshCcw, HandHeart, History } from "lucide-react";

export const metadata = {
  title: "Human Declaration | VNS masakinihirota",
  description: "Affirming the imperfect, growing nature of humanity.",
};

export default function HumanPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-muted/20">
      <main className="max-w-4xl w-full space-y-12 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/10 mb-4">
            <Baby className="size-10 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-secondary to-orange-600">
            人間宣言
          </h1>
          <p className="text-xl text-muted-foreground font-serif italic">
            &quot;人は間違いを犯したり、再挑戦することが出来る。&quot;
          </p>
          <p className="text-sm text-muted-foreground/80">
            Humans make mistakes and have the right to try again.
          </p>
        </div>

        {/* Declaration Content */}
        <div className="grid gap-8">
          <Card className="border-none shadow-lg bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Footprints className="size-5 text-secondary" />
                <span>Declaration</span>
              </CardTitle>
              <CardDescription>不完全であることを認め、変化と成長を肯定する宣言。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <ul className="grid gap-6">
                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-secondary font-bold">
                    I
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">失敗と再挑戦 / Trial & Error</p>
                    <p className="text-muted-foreground">
                      人は間違いを犯したり、再挑戦することが出来る。それを認めて欲しい。
                      <br />
                      <span className="text-xs opacity-70">
                        Humans make mistakes and have the right to try again. We seek recognition of
                        this truth.
                      </span>
                    </p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-secondary font-bold">
                    II
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">成長と学習 / Growth & Learning</p>
                    <p className="text-muted-foreground">
                      人は成長する生き物であり、失敗を通じて学び、次に活かすことができる。そのための環境を整えて欲しい。
                      <br />
                      <span className="text-xs opacity-70">
                        Humans are beings that grow, learning from failure to shape the future. We
                        desire an environment that nurtures this growth.
                      </span>
                    </p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-secondary font-bold">
                    III
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">変化の肯定 / Embracing Change</p>
                    <p className="text-muted-foreground">
                      一度言ったことを撤回したり、考えを変えることは悪いことではない。
                      <br />
                      <span className="text-xs opacity-70">
                        It is not wrong to retract words or change one&apos;s mind.
                      </span>
                    </p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-secondary font-bold">
                    IV
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">過去と現在 / Past & Present</p>
                    <p className="text-muted-foreground">
                      過去に発言したことは過去の自分、現在発言したことは現在の自分。
                      <br />
                      <span className="text-xs opacity-70">
                        Past words belong to the past self; current words belong to the current
                        self.
                      </span>
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer / Summary */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex justify-center gap-4 text-muted-foreground">
            <RefreshCcw className="size-6" />
            <History className="size-6" />
            <HandHeart className="size-6" />
          </div>
          <p className="text-lg font-medium">それが人間であり、人間宣言の内容です。</p>
          <p className="text-sm text-muted-foreground">
            This is the essence of being human. This is our Human Declaration.
          </p>
        </div>

        <div className="flex justify-center pt-8 gap-4">
          <Button asChild variant="ghost">
            <Link href="/">Back to Entrance</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/oasis">View Oasis Declaration</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
