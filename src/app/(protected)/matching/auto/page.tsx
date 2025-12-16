import { MatchingView } from "../_components/matching-view";

export const metadata = {
  title: "Auto Matching | VNS masakinihirota",
  description: "Automatically find users with similar values.",
};

export default function AutoMatchingPage() {
  return (
    <main className="container py-8">
      <MatchingView />
    </main>
  );
}
