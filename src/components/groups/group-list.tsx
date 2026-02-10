"use client";

import Link from "next/link";
import { useState } from "react";
import { mutate } from "swr";
import { Input } from "@/components/ui/input";
import { CreateGroupModal } from "./create-group-modal";
import { useGroups } from "./groups.list.logic"; // Corrected import

export const GroupList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { groups, isLoading, isError } = useGroups();

  const handleGroupCreated = () => {
    void mutate("groups"); // Refresh the list
  };

  const filteredGroups = groups?.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <CreateGroupModal onGroupCreated={handleGroupCreated} />
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
            <Link key={group.id} href={`/groups/${group.id}`} className="block">
              <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.description}</p>
              </div>
            </Link>
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
