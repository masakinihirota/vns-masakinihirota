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
import { Event } from "@/lib/db/types";

import { useJoinEvent } from "./events.logic";

interface NationEventCardProperties {
  event: Event;
  onJoinSuccess: () => void;
}

export const NationEventCard = ({
  event,
  onJoinSuccess,
}: NationEventCardProperties) => {
  const { joinEvent } = useJoinEvent();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false); // Ideally fetch this from participant status

  const handleJoin = async () => {
    setLoading(true);

    // eslint-disable-next-line no-restricted-syntax
    try {
      await joinEvent(event.id);
      setJoined(true);
      onJoinSuccess();
      toast.success("イベントに参加しました");
    } catch (error: unknown) {
      console.error("Failed to join event", error);
      if (error instanceof Error && error.message === "Unauthorized") {
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
          <CardTitle as="h2" className="text-xl">{event.title}</CardTitle>
          <Badge variant={event.type === "free" ? "outline" : "default"} className={event.type === "free" ? "border-teal-500 text-teal-500" : ""}>
            {event.type === "free" ? "Free" : "Product Required"}
          </Badge>
        </div>
        <CardDescription className="text-gray-200">{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-200 mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(event.startAt).toLocaleDateString()}{" "}
            {new Date(event.startAt).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-200">
          <Users className="h-4 w-4" />
          <span>Max Participants: {event.maxParticipants || "Unlimtied"}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleJoin}
          disabled={loading || joined}
        >
          {loading ? "Joining..." : (joined ? "Joined" : "Join Event")}
        </Button>
      </CardFooter>
    </Card>
  );
};
