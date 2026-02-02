import { TutorialStory } from "@/components/tutorial";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function TutorialStoryPage() {
  return (
    <div className="w-full h-screen overflow-hidden bg-neutral-900">
      <Suspense
        fallback={
          <div className="text-white text-center mt-20">Loading...</div>
        }
      >
        <TutorialStory />
      </Suspense>
    </div>
  );
}
