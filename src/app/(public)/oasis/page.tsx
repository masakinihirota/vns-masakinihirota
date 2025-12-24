import { Droplets, Heart, Globe, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
  title: "Oasis Declaration | VNS masakinihirota",
  description: "Our motto and promise defining our digital oasis.",
};

export default function OasisPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-muted/20">
      <main className="max-w-4xl w-full space-y-12 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Droplets className="size-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            オアシス宣言
          </h1>
          <p className="text-xl text-muted-foreground font-serif italic">
            &quot;褒めるときは大きな声でみんなの前で、叱るときは二人きりで小さな声で。&quot;
          </p>
          <p className="text-sm text-muted-foreground/80">
            Motto: When giving praise, do it loudly in front of everyone. When scolding, do it
            quietly with just the two of you.
          </p>
        </div>

        {/* Declaration Content */}
        <div className="grid gap-8">
          <Card className="border-none shadow-lg bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5 text-primary" />
                <span>Declaration</span>
              </CardTitle>
              <CardDescription>
                インターネットという情報の洪水の中で、オアシスの場所であることを宣言します。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <ul className="grid gap-6">
                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-bold">
                    1
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">安らぎの場所 / Sanctuary</p>
                    <p className="text-muted-foreground">
                      インターネット上で翼を休める場所、砂漠の中で命の水を授かる場所を作ります。
                      <br />
                      <span className="text-xs opacity-70">
                        Create a place where you can rest your wings on the Internet, and a place
                        where you can receive water of life in the desert.
                      </span>
                    </p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-bold">
                    2
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">ユーザー主導 / User Sovereignty</p>
                    <p className="text-muted-foreground">
                      広告はユーザー側に主導権があります。
                      <br />
                      <span className="text-xs opacity-70">Advertising is led by the user.</span>
                    </p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-bold">
                    3
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">共通の価値観 / Shared Values</p>
                    <p className="text-muted-foreground">
                      共通の価値観を持った人々のオアシスという場所を作ります。
                      <br />
                      <span className="text-xs opacity-70">
                        Create an oasis of people with common values.
                      </span>
                    </p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-bold">
                    4
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">相互尊重 / Mutual Respect</p>
                    <p className="text-muted-foreground">
                      お互いの価値観を認めるのならば、誰もが参加できます。
                      <br />
                      <span className="text-xs opacity-70">
                        Everyone can participate if they recognize each other&apos;s values.
                      </span>
                    </p>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-bold">
                    5
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">優しい世界 / Gentle World</p>
                    <p className="text-muted-foreground">
                      きれいな世界、優しい世界を守り、広めます。
                      <br />
                      <span className="text-xs opacity-70">
                        Protect and promote a beautiful world, a kind world.
                      </span>
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer / Vision */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex justify-center gap-4 text-muted-foreground">
            <ShieldCheck className="size-6" />
            <Heart className="size-6" />
            <Users className="size-6" />
          </div>
          <p className="text-lg font-medium">
            誰もが争うことなく休憩する場所であることを目指します。
            <br />
            誰もが笑顔になれる場所です。
          </p>
          <p className="text-sm text-muted-foreground">
            We aim to be a place where everyone can rest without conflict. It is a place where
            everyone can smile.
          </p>
        </div>

        <div className="flex justify-center pt-8">
          <Button asChild variant="ghost">
            <Link href="/">Back to Entrance</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
