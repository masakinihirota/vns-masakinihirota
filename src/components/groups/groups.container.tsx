import { Groups } from "./groups";
import { useGroupLogic } from "./groups.logic";
import { MOCK_MEMBERS } from "./groups.mock";

export const GroupsContainer = () => {
  const logic = useGroupLogic();
  const currentUser = MOCK_MEMBERS[0];

  return (
    <Groups
      {...logic}
      members={logic.filteredMembers}
      currentUser={currentUser}
    />
  );
};
