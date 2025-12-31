"use client";

import React, { useState } from "react";
import { ProfileListView } from "./profile-list";
import {
  INITIAL_PROFILES,
  UserProfile,
  UserProfileAttributes,
} from "./profile-list.logic";

export const ProfileListContainer = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Create Form States
  const [newName, setNewName] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [newType, setNewType] = useState("Sub");

  // --- Handlers ---

  const handleCreate = () => {
    if (!newName || !newHandle) return; // Simple validation

    const newProfile: UserProfile = {
      id: `p-${Date.now()}`,
      name: newName,
      handle: newHandle.startsWith("@") ? newHandle : `@${newHandle}`,
      bio: "No description provided yet.",
      avatarColor: "bg-slate-500",
      lastUpdated: "Just now",
      attributes: {
        purpose: "General",
        role: "User",
        type: newType as UserProfileAttributes["type"],
      },
    };

    setProfiles([newProfile, ...profiles]);
    setIsCreateOpen(false);
    // Reset form
    setNewName("");
    setNewHandle("");
  };

  const handleDuplicate = (profile: UserProfile) => {
    const duplicated: UserProfile = {
      ...profile,
      id: `p-${Date.now()}`,
      name: `${profile.name} (Copy)`,
      lastUpdated: "Just now",
    };
    setProfiles([duplicated, ...profiles]);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setProfiles(profiles.filter((p) => p.id !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  return (
    <ProfileListView
      profiles={profiles}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isCreateOpen={isCreateOpen}
      setIsCreateOpen={setIsCreateOpen}
      newName={newName}
      setNewName={setNewName}
      newHandle={newHandle}
      setNewHandle={setNewHandle}
      newType={newType}
      setNewType={setNewType}
      handleCreate={handleCreate}
      handleDuplicate={handleDuplicate}
      setDeleteTarget={setDeleteTarget}
      deleteTarget={deleteTarget}
      handleDelete={handleDelete}
    />
  );
};
