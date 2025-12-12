import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight">VNS Masakinihirota</h1>

        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p>Welcome to the application.</p>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/home">Home (Dev)</Link>
          </Button>

          <Button asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
