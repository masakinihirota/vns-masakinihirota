import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BeginningCountry } from "./beginning-country";

describe("BeginningCountry Accessibility", () => {
  it("should have no accessibility violations in initial state", async () => {
    const { container } = render(
      <BeginningCountry
        currentStep={0}
        onStepChange={() => {}}
        formData={{
          displayName: "",
          avatar: "♏",
          format: "profile",
          role: "member",
          purpose: ["play_purpose"],
        }}
        onUpdateForm={() => {}}
        nameCandidates={["赤い光の蠍座", "青い星の蠍座", "銀の幻想の蠍座"]}
        onGenerateNames={() => {}}
        onRestoreNames={() => {}}
        isRotating={false}
        canRestore={false}
        zodiac={{ name: "蠍座", emoji: "♏" }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
