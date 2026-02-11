"use client";

import { NationEvent } from "@/components/groups/groups.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Users } from "lucide-react";
import { useState } from "react";
import { useJoinEvent } from "./events.logic";

interface NationEventCardProps {
  event: NationEvent;
  onJoinSuccess: () => void;
}

export const NationEventCard = ({
  event,
  onJoinSuccess,
}: NationEventCardProps) => {
  const { joinEvent } = useJoinEvent();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false); // Ideally fetch this from participant status

  const handleJoin = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login");
      setLoading(false);
      return;
    }

    try {
      await joinEvent(event.id, user.id);
      setJoined(true);
      onJoinSuccess();
    } catch (error) {
      console.error("Failed to join event", error);
      alert("Failed to join event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge variant={event.type === "free" ? "secondary" : "default"}>
            {event.type === "free" ? "Free" : "Product Required"}
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(event.start_at).toLocaleDateString()}{" "}
            {new Date(event.start_at).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>Max Participants: {event.max_participants || "Unlimited"}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleJoin}
          disabled={loading || joined}
        >
          {loading ? "Joining..." : joined ? "Joined" : "Join Event"}
        </Button>
      </CardFooter>
    </Card>
  );
};
