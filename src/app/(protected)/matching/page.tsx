import { Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Matching Selection | VNS masakinihirota",
  description: "Choose your matching style.",
};

export default function MatchingSelectionPage() {
  return (
    <main className="container flex flex-col items-center justify-center min-h-[80vh] py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Find Your Resonance
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose how you want to connect with the multiverse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/20 bg-muted/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto size-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="size-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Auto Resonance</CardTitle>
            <CardDescription className="text-base">
              System-guided matching based on your core values.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4 pb-8">
            <p className="mb-6 text-sm text-muted-foreground/80">
              Let the algorithm find your soul echoes. Best for effortless
              discovery.
            </p>
            <Button asChild size="lg" className="w-full text-lg">
              <Link href="/matching/auto">Start Auto Match</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-2xl hover:shadow-secondary/20 bg-muted/5">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto size-24 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="size-12 text-secondary" />
            </div>
            <CardTitle className="text-2xl">Manual Discovery</CardTitle>
            <CardDescription className="text-base">
              Explore and connect at your own pace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4 pb-8">
            <p className="mb-6 text-sm text-muted-foreground/80">
              Browse profiles and select who you want to observe. Best for
              curated connections.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full text-lg"
            >
              <Link href="/matching/manual">Browse Profiles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
