"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  findMatches,
  activeWatchlist,
  UserProfile,
} from "../_logic/mock-matching";
import { ProfileCard } from "./profile-card";
import { SearchingEffect } from "./searching-effect";

type MatchingState = "idle" | "searching" | "results";

export function MatchingView() {
  const [state, setState] = useState<MatchingState>("idle");
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  const startMatching = async () => {
    setState("searching");
    setProfiles([]); // Clear previous results

    // 1. Simulate finding matches
    const foundProfiles = await findMatches();

    // 2. Simulate auto-watchlist logic
    const watchlistedProfiles = await activeWatchlist(foundProfiles);

    setProfiles(watchlistedProfiles);
    setState("results");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 min-h-[80vh]">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Value Resonance System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with 10 other masks that share your core values.
          <br />
          <span className="text-sm opacity-70">
            Top matches are automatically added to your watchlist.
          </span>
        </p>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-[400px]">
        {state === "idle" && (
          <div className="flex flex-col items-center justify-center p-12 space-y-8 border-2 border-dashed rounded-3xl bg-muted/10">
            <div className="size-48 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="size-24 text-primary opacity-50" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Synchronize?</h2>
              <p className="text-muted-foreground mb-8">
                The system will analyze your values against the multiverse
                database.
              </p>
              <Button
                size="lg"
                onClick={startMatching}
                className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-primary/50 transition-all"
              >
                <Sparkles className="mr-2 size-5" />
                Start Resonance Search
              </Button>
            </div>
          </div>
        )}

        {state === "searching" && <SearchingEffect />}

        {state === "results" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
              <div>
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">🎉</span>
                  Resonance Complete
                </h2>
                <p className="text-muted-foreground text-sm">
                  Found {profiles.length} entities with compatible wavelengths.
                </p>
              </div>
              <Button variant="outline" onClick={startMatching}>
                <RefreshCw className="mr-2 size-4" />
                Rescan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
