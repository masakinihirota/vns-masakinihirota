import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-static";

export const metadata = {
  title: "Contact | VNS masakinihirota",
  description: "Contact information for VNS masakinihirota project.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-muted/20">
      <main className="max-w-3xl w-full space-y-12 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Mail className="size-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            お問い合わせ
          </h1>
          <p className="text-xl text-muted-foreground font-serif">Contact Us</p>
        </div>

        {/* Contact info card */}
        <div className="grid gap-8">
          <Card className="border-none shadow-lg bg-background/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>お問い合わせ先</span>
              </CardTitle>
              <CardDescription>
                プロジェクトに関するお問い合わせは、以下のリンクからご連絡ください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  asChild
                  variant="outline"
                  className="h-20 flex flex-col gap-2 items-center justify-center text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Link
                    href="https://x.com/masakinihirota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Twitter className="size-5 text-[#1DA1F2]" />
                      <span className="font-bold text-lg">X (Twitter)</span>
                    </div>
                    <span className="text-lg text-muted-foreground">
                      @masakinihirota
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-20 flex flex-col gap-2 items-center justify-center text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Link
                    href="https://github.com/masakinihirota"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Github className="size-5 text-slate-900 dark:text-white" />
                      <span className="font-bold text-lg">GitHub</span>
                    </div>
                    <span className="text-lg text-muted-foreground">
                      @masakinihirota
                    </span>
                  </Link>
                </Button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-lg text-muted-foreground">
                  ※ VNS masakinihirota プロジェクトは現在開発中です。
                  <br />
                  バグ報告や機能要望は GitHub Issues でも受け付けています。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-4 py-8">
          <Button asChild variant="ghost">
            <Link href="/">Back to Entrance</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
