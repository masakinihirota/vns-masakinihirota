import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BusinessCardConfig } from "@/lib/db/business-cards";
import { UserProfile } from "@/lib/db/user-profiles";
import { BusinessCardView } from "./business-card-view";

describe("BusinessCardView", () => {
  const mockProfile: UserProfile = {
    id: "1",
    root_account_id: "root1",
    display_name: "Test User",
    role_type: "Developer",
    is_active: true,
    created_at: "",
    updated_at: "",
    last_interacted_record_id: null,
    profile_format: "profile",
    role: "member",
    purposes: ["Work"],
    profile_type: "self",
    avatar_url: null,
    external_links: null,
    purpose: null,
  };

  const mockConfig: BusinessCardConfig = {
    show_display_name: true,
    show_role_type: true,
  };

  it("renders profile information", () => {
    render(<BusinessCardView profile={mockProfile} config={mockConfig} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(
      <BusinessCardView profile={mockProfile} config={mockConfig} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders trust signals correctly", () => {
    const { getByText } = render(
      <BusinessCardView
        profile={mockProfile}
        config={mockConfig}
        content={{
          trust: {
            response_time: "2 hours",
            completion_rate: "99%",
            revision_policy: "Unlimited",
          },
        }}
      />
    );
    expect(getByText("2 hours")).toBeInTheDocument();
    expect(getByText("99%")).toBeInTheDocument();
    expect(getByText("Unlimited")).toBeInTheDocument();
  });

  it("renders value badges correctly", () => {
    const { getByText } = render(
      <BusinessCardView
        profile={mockProfile}
        config={mockConfig}
        content={{
          value: {
            feedback_stance: "commercial",
            ai_stance: "no_ai",
          },
        }}
      />
    );
    expect(getByText(/Commercial First/i)).toBeInTheDocument();
    expect(getByText(/No Generative AI/i)).toBeInTheDocument();
  });

  it("renders pr information correctly", () => {
    const { getByText } = render(
      <BusinessCardView
        profile={mockProfile}
        config={mockConfig}
        content={{
          pr: {
            promotion_level: "Will share everywhere",
            comm_style: "Discord",
          },
        }}
      />
    );
    expect(getByText("Will share everywhere")).toBeInTheDocument();
    expect(getByText("Discord")).toBeInTheDocument();
  });
});
