import { useEffect, useState } from "react";
import { Groups } from "./groups";
import { getMyProfiles, useGroupLogic } from "./groups.logic";
import { MOCK_MEMBERS } from "./groups.mock";
import { Member } from "./groups.types";

interface GroupsContainerProps {
  groupId?: string;
}

export const GroupsContainer = ({ groupId }: GroupsContainerProps) => {
  const logic = useGroupLogic(groupId);
  const [currentUser, setCurrentUser] = useState<Member>(MOCK_MEMBERS[0]); // Fallback to mock for now, but should ideally be null until loaded

  useEffect(() => {
    void getMyProfiles().then((profiles) => {
      if (profiles && profiles.length > 0) {
        const p = profiles[0];
        setCurrentUser({
          id: p.id,
          name: p.display_name,
          role: p.role_type === "leader" ? "リーダー" : "一般",
          avatar: p.avatar_url || "👤",
          traits: [],
          ratings: {},
          values: {},
        });
      }
    });
  }, []);

  return (
    <Groups
      {...logic}
      members={logic.filteredMembers}
      currentUser={currentUser}
    />
  );
};
