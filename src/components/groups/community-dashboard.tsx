"use client";

import { Bell } from "lucide-react";
import { NationEventList } from "@/components/events/nation-event-list";
import { MarketList } from "@/components/market/market-list";
import { NationList } from "@/components/nations/nation-list";
import { NotificationList } from "@/components/notifications/notification-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupList } from "./group-list";

export const CommunityDashboard = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Hub</h1>
          <p className="text-muted-foreground">
            Explore nations, join groups, trade in the market, and participate
            in events.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {/* Optional: Add badge for unread count */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
              <NotificationList />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="nations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nations">Nations</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="nations" className="space-y-4">
          <NationList />
        </TabsContent>
        <TabsContent value="groups" className="space-y-4">
          <GroupList />
        </TabsContent>
        <TabsContent value="market" className="space-y-4">
          <MarketList />
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <NationEventList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
