import { Check, Eye, UserPlus } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Candidate, MatchingUser } from "./manual-matching.logic";

interface ManualMatchingProps {
  currentUser: MatchingUser;
  candidates: Candidate[];
  onToggleWatch: (id: string) => void;
  onToggleFollow: (id: string) => void;
}

export const ManualMatching: React.FC<ManualMatchingProps> = ({
  currentUser,
  candidates,
  onToggleWatch,
  onToggleFollow,
}) => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 md:p-12 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
          Soul Sync
        </h1>
        <p className="text-neutral-400 mt-2 text-lg">Find your echo in the noise.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {candidates.map((candidate) => (
          <Card
            key={candidate.user.id}
            className="group relative bg-white/5 backdrop-blur-lg border-white/10 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 text-neutral-100"
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Avatar / Match Score */}
                <div className="relative shrink-0">
                  <Avatar className="w-20 h-20 border-2 border-white/10 rounded-full overflow-hidden">
                    <AvatarImage
                      src={candidate.user.avatarSrc}
                      alt={candidate.user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-neutral-800 text-neutral-400 text-2xl">
                      {candidate.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-bold border border-neutral-700 ${
                        candidate.compatibility > 80
                          ? "bg-neutral-900 text-green-400 hover:bg-neutral-800"
                          : candidate.compatibility > 50
                            ? "bg-neutral-900 text-yellow-400 hover:bg-neutral-800"
                            : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                      }`}
                    >
                      {candidate.compatibility}%
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {candidate.user.name}
                      </h3>
                      <p className="text-sm text-neutral-400 line-clamp-2">{candidate.user.bio}</p>
                    </div>
                  </div>

                  {/* Tags Comparison */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {candidate.user.tags.map((tag) => {
                      const isShared = currentUser.tags.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`text-xs px-2 py-1 rounded-md border ${
                            isShared
                              ? "bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
                              : "bg-neutral-800 border-neutral-700 text-neutral-500 hover:bg-neutral-700"
                          }`}
                        >
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <Button
                    onClick={() => onToggleWatch(candidate.user.id)}
                    variant={candidate.isWatched ? "secondary" : "ghost"}
                    className={`flex-1 md:flex-none justify-start ${
                      candidate.isWatched
                        ? "bg-purple-500/20 border border-purple-500 text-purple-300 hover:bg-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300"
                    }`}
                  >
                    {candidate.isWatched ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    {candidate.isWatched ? "Watching" : "Watch"}
                  </Button>
                  <Button
                    onClick={() => onToggleFollow(candidate.user.id)}
                    variant={candidate.isFollowed ? "default" : "ghost"}
                    className={`flex-1 md:flex-none justify-start ${
                      candidate.isFollowed
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 border border-blue-500"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300"
                    }`}
                  >
                    {candidate.isFollowed ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {candidate.isFollowed ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
