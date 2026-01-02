import fs from "fs";
import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { Step1Identity } from "./step1-identity";

describe("Step1Identity Debug", () => {
  it("dumps DOM to file", () => {
    render(<Step1Identity data={{}} onUpdate={() => {}} userId="user_123" />);
    const html = document.body.innerHTML;
    fs.writeFileSync(
      "u:/2026src/vns-masakinihirota.worktrees/anti/debug-dom.html",
      html
    );
  });
});
