import {
  AdminTab as AdminTabType,
  EvalTab as EvalTabType,
  Member,
  PlazaTab as PlazaTabType,
  SkillTab as SkillTabType,
  SortConfig,
  ValueSelection,
  Work,
} from "./groups.types";
import { GroupHeader } from "./header/group-header";
import { GroupSidebar } from "./sidebar/group-sidebar";
import { AdminTab } from "./tabs/admin";
import { EvaluationTab } from "./tabs/evaluation";
import { PlazaTab } from "./tabs/plaza";
import { SkillsTab } from "./tabs/skills";
import { ValuesTab } from "./tabs/values";

interface GroupsProps {
  // State
  mainTab: string;
  plazaSubTab: PlazaTabType;
  evalSubTab: EvalTabType;
  skillSubTab: SkillTabType;
  adminSubTab: AdminTabType;

  selectedMember: Member;
  searchQuery: string;
  sortConfig: SortConfig;
  openTopicId: string | null;
  userValueSelections: Record<string, ValueSelection>;
  isComparingSelf: boolean;
  sortedWorks: Work[];
  members: Member[];
  currentUser: Member;

  // Handlers
  setMainTab: (tab: string) => void;
  setPlazaSubTab: (tab: PlazaTabType) => void;
  setEvalSubTab: (tab: EvalTabType) => void;
  setSkillSubTab: (tab: SkillTabType) => void;
  setAdminSubTab: (tab: AdminTabType) => void;
  setSelectedMember: (member: Member) => void;
  setSearchQuery: (query: string) => void;
  requestSort: (key: SortConfig["key"]) => void;
  setOpenTopicId: (id: string | null) => void;
  handleValueChange: (topicId: string, choice: string) => void;
  handleTierChange: (topicId: string, tier: string) => void;
}

export const Groups = ({
  mainTab,
  plazaSubTab,
  evalSubTab,
  skillSubTab,
  adminSubTab,
  selectedMember,
  searchQuery,
  sortConfig,
  openTopicId,
  userValueSelections,
  isComparingSelf,
  sortedWorks,
  members,
  currentUser,
  setMainTab,
  setPlazaSubTab,
  setEvalSubTab,
  setSkillSubTab,
  setAdminSubTab,
  setSelectedMember,
  setSearchQuery,
  requestSort,
  setOpenTopicId,
  handleValueChange,
  handleTierChange,
}: GroupsProps) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <GroupHeader activeTab={mainTab} onTabChange={setMainTab} />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-gray-50 dark:bg-black overflow-hidden relative">
          {mainTab === "plaza" && (
            <PlazaTab
              activeSubTab={plazaSubTab}
              onSubTabChange={setPlazaSubTab}
            />
          )}
          {mainTab === "evaluation" && (
            <EvaluationTab
              activeSubTab={evalSubTab}
              onSubTabChange={setEvalSubTab}
              isComparingSelf={isComparingSelf}
              currentUser={currentUser}
              selectedMember={selectedMember}
              sortedWorks={sortedWorks}
              sortConfig={sortConfig}
              onRequestSort={requestSort}
            />
          )}
          {mainTab === "values" && (
            <ValuesTab
              openTopicId={openTopicId}
              onToggleTopic={setOpenTopicId}
              userValueSelections={userValueSelections}
              selectedMember={selectedMember}
              onValueChange={handleValueChange}
              onTierChange={handleTierChange}
            />
          )}
          {mainTab === "skills" && (
            <SkillsTab
              activeSubTab={skillSubTab}
              onSubTabChange={setSkillSubTab}
            />
          )}
          {mainTab === "admin" && (
            <AdminTab
              activeSubTab={adminSubTab}
              onSubTabChange={setAdminSubTab}
            />
          )}
        </main>

        {/* Sidebar (Right) */}
        <GroupSidebar
          members={members}
          selectedMember={selectedMember}
          onSelectMember={setSelectedMember}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
};
