import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorkRegistrationForm } from "@/components/works/work-registration-form";

export default function NewWorkPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="pl-0 hover:bg-transparent hover:text-primary"
        >
          <Link href="/works" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            カタログに戻る
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">作品の登録</h1>
          <p className="text-muted-foreground">
            カタログにない作品を登録して、プロフィールに追加しましょう。
          </p>
        </div>

        <WorkRegistrationForm />
      </div>
    </div>
  );
}
