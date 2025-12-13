import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ManualMatching } from "./manual-matching";
import { Candidate, CURRENT_USER } from "./manual-matching.logic";

// Mock data
const mockCandidates: Candidate[] = [
  {
    user: { id: "c1", name: "Alice", avatarSrc: "", bio: "Bio A", tags: ["Tag1"] },
    compatibility: 80,
    isWatched: false,
    isFollowed: false,
  },
  {
    user: { id: "c2", name: "Bob", avatarSrc: "", bio: "Bio B", tags: ["Tag2"] },
    compatibility: 40,
    isWatched: true, // Already watched
    isFollowed: false,
  },
];

describe("ManualMatching UI", () => {
  const mockToggleWatch = vi.fn();
  const mockToggleFollow = vi.fn();

  it("renders the list of candidates", () => {
    render(
      <ManualMatching
        currentUser={CURRENT_USER}
        candidates={mockCandidates}
        onToggleWatch={mockToggleWatch}
        onToggleFollow={mockToggleFollow}
      />,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("80% Match")).toBeInTheDocument();
  });

  it("calls onToggleWatch when Watch button is clicked", () => {
    render(
      <ManualMatching
        currentUser={CURRENT_USER}
        candidates={mockCandidates}
        onToggleWatch={mockToggleWatch}
        onToggleFollow={mockToggleFollow}
      />,
    );

    // Alice is not watched, button should say "Watch" (or icon)
    const watchButtons = screen.getAllByRole("button", { name: /Watch/i });
    fireEvent.click(watchButtons[0]); // Click Alice's watch button

    expect(mockToggleWatch).toHaveBeenCalledWith("c1");
  });

  it("displays active state for watched candidates", () => {
    render(
      <ManualMatching
        currentUser={CURRENT_USER}
        candidates={mockCandidates}
        onToggleWatch={mockToggleWatch}
        onToggleFollow={mockToggleFollow}
      />,
    );

    // Bob is watched, button text might change or look different. checking for text "Unwatch" or "Watching" logic would differ based on implementation.
    // For now assuming the button text changes to "Watching"
    expect(screen.getByText("Watching")).toBeInTheDocument();
  });
});
