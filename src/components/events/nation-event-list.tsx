"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvents } from "./events.logic";
import { NationEventCard } from "./nation-event-card";

interface NationEventListProps {
  nationId?: string;
}

export const NationEventList = ({ nationId = "all" }: NationEventListProps) => {
  const { events, isLoading, isError, mutate } = useEvents(nationId);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading events...</div>;
  if (isError) return <div>Error loading events</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents?.map((event) => (
          <NationEventCard
            key={event.id}
            event={event}
            onJoinSuccess={() => mutate()}
          />
        ))}
        {filteredEvents?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            No upcoming events found.
          </div>
        )}
      </div>
    </div>
  );
};
