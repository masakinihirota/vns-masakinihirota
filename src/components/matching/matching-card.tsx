import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, UserPlus, X } from "lucide-react";

// Simplified Profile Type for MVP
export interface MatchingProfile {
  id: string;
  displayName: string;
  roleType: string;
  purpose?: string;
  matchScore?: number; // Optional compatibility score
}

interface MatchingCardProps {
  profile: MatchingProfile;
  onLike: () => void;
  onSkip: () => void;
  onWatch: () => void;
}

export const MatchingCard = ({ profile, onLike, onSkip, onWatch }: MatchingCardProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <Card className="overflow-hidden border-2 hover:border-indigo-500/50 transition-colors">
          <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
            <span className="text-6xl">👤</span>
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{profile.displayName}</h3>
                <Badge variant="secondary" className="mt-1">{profile.roleType}</Badge>
              </div>
              {profile.matchScore !== undefined && (
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-indigo-600">{profile.matchScore}%</span>
                  <span className="text-xs text-muted-foreground">Match</span>
                </div>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[3rem]">
              {profile.purpose || "No specific purpose listed."}
            </p>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200"
                onClick={onSkip}
              >
                <X className="h-6 w-6" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200"
                onClick={onWatch}
                title="Watch / Follow"
              >
                <UserPlus className="h-6 w-6" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="rounded-full h-12 w-12 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
                onClick={onLike}
              >
                <Heart className="h-6 w-6 fill-current" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
