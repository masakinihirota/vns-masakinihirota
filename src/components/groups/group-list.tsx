"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
// import { GroupCard } from "@/components/groups/group-card"; // To implement
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGroups } from "./groups.list.logic"; // Corrected import

export const GroupList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { groups, isLoading, isError } = useGroups();

  const filteredGroups = groups?.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div>Loading groups...</div>
      ) : isError ? (
        <div>Error loading groups</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups?.map((group) => (
            <div key={group.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <p className="text-sm text-gray-500">{group.description}</p>
              {/* Temporary simple card */}
            </div>
            // <GroupCard key={group.id} group={group} />
          ))}
          {filteredGroups?.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No groups found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
