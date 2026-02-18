"use client";

import { Calendar, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Tables } from "@/types/types_db";
import { useJoinEvent } from "./events.logic";
type NationEvent = Tables<"nation_events">;

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

    try {
      await joinEvent(event.id);
      setJoined(true);
      onJoinSuccess();
      toast.success("イベントに参加しました");
    } catch (error: any) {
      console.error("Failed to join event", error);
      if (error.message === "Unauthorized") {
        toast.error("ログインが必要です");
      } else {
        toast.error("イベントへの参加に失敗しました");
      }
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
          <span>Max Participants: {event.max_participants || "Unlimtied"}</span>
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
