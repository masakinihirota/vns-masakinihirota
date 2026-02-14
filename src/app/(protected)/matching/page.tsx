import { MatchingList } from "@/components/matching/matching-list";

export default function MatchingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Matching
          </h1>
          <p className="text-slate-500 mt-2">
            Find partners and creators that resonate with your values.
          </p>
        </div>

        <MatchingList />
      </div>
    </div>
  );
}
