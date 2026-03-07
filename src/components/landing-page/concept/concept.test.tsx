import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { Concept } from "./concept";
import {
  CONCEPT_GHOST_TEXT,
  CONCEPT_NOTE,
  CONCEPT_PHASES,
  WORK_CHAINS
} from "./concept.logic";

expect.extend(matchers);

describe("Concept Component Accessibility", () => {
  it("アクセシビリティ違反がないこと", async () => {
    const { container } = render(
      <Concept
        phases={CONCEPT_PHASES}
        workChains={WORK_CHAINS}
        ghostText={CONCEPT_GHOST_TEXT}
        note={CONCEPT_NOTE}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Concept Component Content", () => {
  it("主要な文言が正しく表示されていること", () => {
    render(
      <Concept
        phases={CONCEPT_PHASES}
        workChains={WORK_CHAINS}
        ghostText={CONCEPT_GHOST_TEXT}
        note={CONCEPT_NOTE}
      />
    );

    // ヘッダーテキストの確認
    expect(screen.getByText(CONCEPT_GHOST_TEXT)).toBeInTheDocument();

    // 各フェーズのタイトルの確認
    CONCEPT_PHASES.forEach((phase) => {
      expect(screen.getByText(new RegExp(`${phase.title}：`))).toBeInTheDocument();
    });

    // 作品タイトルの確認
    WORK_CHAINS.forEach((chain) => {
      expect(screen.getByText(chain.workTitle)).toBeInTheDocument();
    });

    // 補足説明の確認
    expect(screen.getByText(CONCEPT_NOTE)).toBeInTheDocument();
  });
});
