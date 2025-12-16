import React, { useState } from 'react';
import { ProfileDashboard } from './profile-dashboard';
import {
    UserProfile,
    INITIAL_PROFILES,
    filterProfiles,
    createNewProfile,
    duplicateProfile,
    ProfileType
} from './profile-dashboard.logic';

export const ProfileDashboardContainer = () => {
    const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    // Create Form States
    const [newName, setNewName] = useState("");
    const [newHandle, setNewHandle] = useState("");
    const [newType, setNewType] = useState<ProfileType>("Sub");

    const filteredProfiles = filterProfiles(profiles, searchQuery);

    const handleCreate = () => {
        if (!newName || !newHandle) return; // Basic validation

        const newProfile = createNewProfile(newName, newHandle, newType);

        setProfiles([newProfile, ...profiles]);
        setIsCreateOpen(false);
        // Reset form
        setNewName("");
        setNewHandle("");
    };

    const handleDuplicate = (profile: UserProfile) => {
        const duplicated = duplicateProfile(profile);
        setProfiles([duplicated, ...profiles]);
    };

    const handleDelete = () => {
        if (deleteTarget) {
            setProfiles(profiles.filter((p) => p.id !== deleteTarget));
            setDeleteTarget(null);
        }
    };

    return (
        <ProfileDashboard
            filteredProfiles={filteredProfiles}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isCreateOpen={isCreateOpen}
            setIsCreateOpen={setIsCreateOpen}
            deleteTarget={deleteTarget}
            setDeleteTarget={setDeleteTarget}
            newName={newName}
            setNewName={setNewName}
            newHandle={newHandle}
            setNewHandle={setNewHandle}
            newType={newType}
            setNewType={setNewType}
            onCreate={handleCreate}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
        />
    );
};
