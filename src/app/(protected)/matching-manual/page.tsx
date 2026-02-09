import { ManualMatching as ManualMatchingContainer } from "@/components/manual-matching";

export const metadata = {
  title: "Manual Matching | VNS masakinihirota",
  description: "Manually browse and connect with users.",
};

export default function ManualMatchingPage() {
  return (
    <main className="container py-8">
      <ManualMatchingContainer />
    </main>
  );
}
