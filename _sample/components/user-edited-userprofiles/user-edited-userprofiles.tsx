import { GlobalNav } from "./components/global-nav";
import { InventorySidebar } from "./components/inventory-sidebar";
import { MainEditor } from "./components/main-editor";
import { ProfileListSidebar } from "./components/profile-list-sidebar";
import { Package, SectionId, Slot, UserProfile } from "./user-profile-app.types";

interface UserEditedUserProfilesProperties {
  readonly isDarkMode: boolean;
  readonly setIsDarkMode: (isDark: boolean) => void;
  readonly profiles: readonly UserProfile[];
  readonly activeProfileId: string;
  readonly activeProfile: UserProfile;
  readonly activeSectionId: SectionId;
  readonly setActiveSectionId: (id: SectionId) => void;
  readonly handleProfileSelect: (id: string) => void;
  readonly handleUpdateProfile: (profile: UserProfile) => void;
  readonly handleUpdateTier: (itemId: string, newTier?: 1 | 2 | 3) => void;
  readonly handleSave: () => Promise<void>;
  readonly isSaving: boolean;
  readonly isDirty: boolean;
  readonly localTiers: Record<string, 1 | 2 | 3 | undefined>;
  readonly setLocalTiers: React.Dispatch<React.SetStateAction<Record<string, 1 | 2 | 3 | undefined>>>;
  readonly handleEquipPackage: (package_: Package) => void;
  readonly handleEquipItem: (item: Slot) => void;
  readonly handleRemoveItemById: (id: string) => void;
}

/**
 * プレゼンテーションコンポーネント: UIのレイアウトと統合を担当
 * 状態やロジックは Container から Props 経由で受け取ります。
 * @param root0
 * @param root0.isDarkMode
 * @param root0.setIsDarkMode
 * @param root0.profiles
 * @param root0.activeProfileId
 * @param root0.activeProfile
 * @param root0.activeSectionId
 * @param root0.setActiveSectionId
 * @param root0.handleProfileSelect
 * @param root0.handleUpdateProfile
 * @param root0.handleUpdateTier
 * @param root0.handleSave
 * @param root0.isSaving
 * @param root0.isDirty
 * @param root0.localTiers
 * @param root0.setLocalTiers
 * @param root0.handleEquipPackage
 * @param root0.handleEquipItem
 * @param root0.handleRemoveItemById
 */
export const UserEditedUserProfiles = ({
  isDarkMode,
  setIsDarkMode,
  profiles,
  activeProfileId,
  activeProfile,
  activeSectionId,
  setActiveSectionId,
  handleProfileSelect,
  handleUpdateProfile,
  handleUpdateTier,
  handleSave,
  isSaving,
  isDirty,
  localTiers,
  setLocalTiers,
  handleEquipPackage,
  handleEquipItem,
  handleRemoveItemById,
}: UserEditedUserProfilesProperties) => {
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
        <GlobalNav
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <ProfileListSidebar
          profiles={profiles}
          activeId={activeProfileId}
          onSelect={handleProfileSelect}
        />

        <MainEditor
          profile={activeProfile}
          activeSection={activeSectionId}
          onSectionSelect={setActiveSectionId}
          onUpdate={handleUpdateProfile}
          onUpdateTier={handleUpdateTier}
          onSave={handleSave}
          isSaving={isSaving}
          isDirty={isDirty}
        />

        <InventorySidebar
          activeSectionId={activeSectionId}
          onEquipPackage={handleEquipPackage}
          onEquipItem={handleEquipItem}
          onRemoveItem={handleRemoveItemById}
          onUpdateTier={handleUpdateTier}
          localTiers={localTiers}
          setLocalTiers={setLocalTiers}
          profile={activeProfile}
        />
      </div>
    </div>
  );
};
