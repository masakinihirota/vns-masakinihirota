/* eslint-disable no-console */

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { renderWithWait } from "@/lib/test-utils";

import { UserEditedUserProfilesContainer } from "./user-edited-userprofiles.container";

// Mock matchMedia for components that use it (lucide-react or others)
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("UserEditedUserProfiles", () => {
  it("正しくレンダリングされる", async () => {
    await renderWithWait(<UserEditedUserProfilesContainer />);
    // InventorySidebar 内のラベルや、各セクションが表示されているか確認
    expect(screen.getByTestId("global-nav")).toBeInTheDocument();
    expect(screen.getByTestId("inventory-sidebar")).toBeInTheDocument();
  });

  it("アクセシビリティ違反がない", async () => {
    const { container } = await renderWithWait(<UserEditedUserProfilesContainer />);
    const results = await axe(container);
    if (results.violations.length > 0) {
      console.log("Accessibility Violations:", JSON.stringify(results.violations, null, 2));
    }
    expect(results).toHaveNoViolations();
  });
});
