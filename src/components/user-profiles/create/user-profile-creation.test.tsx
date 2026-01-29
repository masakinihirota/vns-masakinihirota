import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { UserProfileCreation } from "./user-profile-creation";

// Mock the hook to provide controlled state
vi.mock("./user-profile-creation.logic");

// Helper to get default mock return value
const mockLogicReturn = {
  currentStep: 1,
  setCurrentStep: vi.fn(),
  masterWorks: [],
  isRegistering: false,
  setIsRegistering: vi.fn(),
  ratingType: "LIKE" as const,
  setRatingType: vi.fn(),
  activePeriod: "NOW" as const,
  setActivePeriod: vi.fn(),
  showRatingHelp: false,
  setShowRatingHelp: vi.fn(),
  openQuestionId: null,
  setOpenQuestionId: vi.fn(),
  currentPage: 1,
  setCurrentPage: vi.fn(),
  valueSelections: {},
  valueTiers: {},
  addedQuestionIds: [],
  setAddedQuestionIds: vi.fn(),
  removedQuestionIds: [],
  setRemovedQuestionIds: vi.fn(),
  formData: {
    role: "Leader",
    type: "SELF",
    purposes: ["create_work"],
    zodiac: "Leo",
    displayName: "",
    nameCandidates: ["Candidate 1", "Candidate 2"],
    ownWorks: [],
    favWorks: [],
    valuesAnswer: "",
  },
  candidateHistory: [],
  historyIndex: 0,
  newWorkTagsInput: "",
  setNewWorkTagsInput: vi.fn(),
  masterSearch: "",
  setMasterSearch: vi.fn(),
  filterCategories: [],
  setFilterCategories: vi.fn(),
  filterEras: [],
  setFilterEras: vi.fn(),
  searchedMasterWorks: [],
  handleValueSelection: vi.fn(),
  toggleValueTier: vi.fn(),
  updateForm: vi.fn(),
  handleGenerateCandidates: vi.fn(),
  handleUndoCandidates: vi.fn(),
  togglePurpose: vi.fn(),
  addOwnWork: vi.fn(),
  updateOwnWork: vi.fn(),
  removeOwnWork: vi.fn(),
  addFavWorkFromMaster: vi.fn(),
  removeFavWork: vi.fn(),
  toggleBestWork: vi.fn(),
  setWorkTier: vi.fn(),
  handleRegisterNewWork: vi.fn(),
};

describe("UserProfileCreation Accessibility", () => {
  it("Step 1 should have no accessibility violations", async () => {
    const { container } = render(
      <UserProfileCreation {...mockLogicReturn} currentStep={1} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Step 2 should have no accessibility violations", async () => {
    const { container } = render(
      <UserProfileCreation {...mockLogicReturn} currentStep={2} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Step 3 should have no accessibility violations", async () => {
    const { container } = render(
      <UserProfileCreation {...mockLogicReturn} currentStep={3} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Step 4 should have no accessibility violations", async () => {
    const { container } = render(
      <UserProfileCreation {...mockLogicReturn} currentStep={4} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Step 5 should have no accessibility violations", async () => {
    const { container } = render(
      <UserProfileCreation {...mockLogicReturn} currentStep={5} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Step 6 should have no accessibility violations", async () => {
    const { container } = render(
      <UserProfileCreation {...mockLogicReturn} currentStep={6} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
