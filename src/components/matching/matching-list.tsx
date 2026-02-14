"use client";

import { followProfileAction } from "@/app/actions/follows";
import { createMatchingRequestAction, getMatchingCandidatesAction } from "@/app/actions/matching";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MatchingCard, MatchingProfile } from "./matching-card";

export const MatchingList = () => {
  const [candidates, setCandidates] = useState<MatchingProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      // @ts-ignore: Type mismatch between DB and UI for now, we map it
      const data = await getMatchingCandidatesAction(10);
      const mapped: MatchingProfile[] = data.map((p: any) => ({
        id: p.id,
        displayName: p.display_name || p.displayName,
        roleType: p.role_type || p.roleType,
        purpose: p.purpose,
        matchScore: Math.floor(Math.random() * 20) + 80, // Mock score for MVP
      }));
      setCandidates(mapped);
    } catch (error) {
      console.error("Failed to load candidates", error);
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCandidates();
  }, []);

  const handleRemoveCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLike = async (profile: MatchingProfile) => {
    try {
      await createMatchingRequestAction(profile.id);
      toast.success(`Request sent to ${profile.displayName}`);
      handleRemoveCandidate(profile.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request");
    }
  };

  const handleWatch = async (profile: MatchingProfile) => {
    try {
      // Status defaults to "follow", can be "watch" if we want distinct semantics
      await followProfileAction(profile.id, "watch");
      toast.success(`Following ${profile.displayName}`);
      handleRemoveCandidate(profile.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to follow");
    }
  };

  const handleSkip = (profile: MatchingProfile) => {
    // Just remove from view for now
    handleRemoveCandidate(profile.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <Button variant="ghost" size="sm" onClick={loadCandidates}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No more candidates found.</p>
          <Button variant="link" onClick={loadCandidates}>Try refreshing</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((profile) => (
            <MatchingCard
              key={profile.id}
              profile={profile}
              onLike={() => handleLike(profile)}
              onSkip={() => handleSkip(profile)}
              onWatch={() => handleWatch(profile)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
