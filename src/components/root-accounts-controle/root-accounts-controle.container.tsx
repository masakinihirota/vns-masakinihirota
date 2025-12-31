"use client";

import { useState } from "react";
import { RootAccountsControlView } from "./root-accounts-controle";
import { staticData } from "./root-accounts-controle.logic";

export const RootAccountsControlContainer = () => {
  const { rootAccount, userProfiles, profileManagement } = staticData;
  const [profiles, setProfiles] = useState(userProfiles);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState("");

  // hasMatrimonyProfile logic
  const hasMatrimonyProfile = profiles.some((p) => p.purpose === "婚活");

  const handleEditClick = (profileId: string, currentName: string) => {
    setEditingProfileId(profileId);
    setNewProfileName(currentName);
  };

  const handleSaveClick = (profileId: string) => {
    if (newProfileName.trim() === "") {
      alert("プロフィール名を入力してください。");
      return;
    }
    const updatedProfiles = profiles.map((p) =>
      p.id === profileId ? { ...p, name: newProfileName } : p
    );
    setProfiles(updatedProfiles);
    setEditingProfileId(null);
  };

  const handleCancelClick = () => {
    setEditingProfileId(null);
  };

  const handleNewProfileNameChange = (name: string) => {
    setNewProfileName(name);
  };

  return (
    <RootAccountsControlView
      rootAccount={rootAccount}
      profiles={profiles}
      profileManagement={profileManagement}
      editingProfileId={editingProfileId}
      newProfileName={newProfileName}
      hasMatrimonyProfile={hasMatrimonyProfile}
      onEditClick={handleEditClick}
      onSaveClick={handleSaveClick}
      onCancelClick={handleCancelClick}
      onNewProfileNameChange={handleNewProfileNameChange}
    />
  );
};
