import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ProfileMaskView } from "./profile-mask-view";
import { ModalState, ProfileMask } from "./profile-mask.types";

const mockProfile: ProfileMask = {
  id: "ghost",
  name: "幽霊のプロフィール",
  constellationName: "魚座",
  constellationHistory: [["魚座"]],
  historyPointer: 0,
  avatarType: "ghost",
  maskId: "ghost",
  isGhost: true,
  selectedTypeId: null,
  selectedObjectiveIds: [],
  selectedSlots: [],
  selectedValues: [],
};

const mockModal: ModalState = {
  isOpen: false,
  type: "",
  message: "",
};

const defaultProps = {
  profiles: [mockProfile],
  activeProfile: mockProfile,
  activeProfileId: "ghost",
  filteredProfiles: [mockProfile],
  searchQuery: "",
  setSearchQuery: vi.fn(),
  isDirty: false,
  modal: mockModal,
  mainScrollRef: { current: null } as any,
  onUpdateDraft: vi.fn(),
  onSwitchProfile: vi.fn(),
  onSave: vi.fn(),
  onNextAnonyms: vi.fn(),
  onPrevAnonyms: vi.fn(),
  onSelectAnonym: vi.fn(),
  onToggleObjective: vi.fn(),
  onToggleSlot: vi.fn(),
  onCreateNewProfile: vi.fn(),
  onCloseModal: vi.fn(),
  onConfirmModal: vi.fn(),
};

describe("ProfileMaskView", () => {
  it("正常にレンダリングされる", () => {
    // Arrange & Act
    const { container } = render(<ProfileMaskView {...defaultProps} />);

    // Assert
    expect(container).toBeTruthy();
  });

  it("アクセシビリティ違反がない", async () => {
    // Arrange
    const { container } = render(<ProfileMaskView {...defaultProps} />);

    // Act
    const results = await axe(container);

    // Assert
    expect(results).toHaveNoViolations();
  });
});
