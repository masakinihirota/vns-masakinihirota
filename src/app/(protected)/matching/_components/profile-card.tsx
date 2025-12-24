"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, Check } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserProfile } from "../_logic/mock-matching";

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Mask effect styles based on type
  const getMaskStyle = () => {
    switch (profile.maskType) {
      case "blur":
        return "backdrop-blur-xl bg-background/50";
      case "glitch":
        return "bg-[repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_4px)] opacity-50 mix-blend-overlay";
      case "pixel":
        return "backdrop-brightness-50";
      default:
        return "bg-background/90";
    }
  };

  return (
    <Card className="relative overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-primary/20">
      <CardHeader className="relative p-0 h-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="font-mono text-xs">
            {profile.compatibility}% MATCH
          </Badge>
        </div>
      </CardHeader>

      <div className="absolute top-16 left-6 z-20">
        <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback>
            {profile.displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="pt-12 pb-4 flex-grow space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">{profile.displayName}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {profile.bio}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 px-6 border-t bg-muted/20 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          {profile.isWatchlisted ? (
            <span className="flex items-center text-primary font-medium">
              <Check className="w-3 h-3 mr-1" /> Auto-Watchlisted
            </span>
          ) : (
            <span>Observed</span>
          )}
        </div>
        <Button size="sm" variant="ghost" className="text-xs">
          View Details
        </Button>
      </CardFooter>

      {/* The "Mask" Overlay */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer ${getMaskStyle()}`}
            onClick={() => setIsRevealed(true)}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="text-center space-y-4 p-6 bg-background/80 backdrop-blur-sm rounded-xl border shadow-2xl"
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-6xl filter blur-sm select-none">🎭</div>
              <div>
                <p className="font-bold text-lg tracking-widest">
                  UNKNOWN ENTITY
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  Compatibility: {profile.compatibility}%
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Observe
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
