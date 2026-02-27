import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { ProfileList } from "./profile-list";

describe("ProfileList", () => {
  it("アクセシビリティ上の違反がないこと", async () => {
    const { container } = render(
      <ProfileList name="山田太郎" role="エンジニア" bio="フルスタック開発者" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("名前を表示する", () => {
    render(
      <ProfileList name="山田太郎" role="エンジニア" bio="フルスタック開発者" />
    );
    expect(screen.getByText("山田太郎")).toBeInTheDocument();
  });

  it("役割を表示する", () => {
    render(
      <ProfileList name="山田太郎" role="エンジニア" bio="フルスタック開発者" />
    );
    expect(screen.getByText("エンジニア")).toBeInTheDocument();
  });

  it("自己紹介を表示する", () => {
    render(
      <ProfileList name="山田太郎" role="エンジニア" bio="フルスタック開発者" />
    );
    expect(screen.getByText("フルスタック開発者")).toBeInTheDocument();
  });

  it("アバターが表示される", () => {
    render(
      <ProfileList name="山田太郎" role="エンジニア" bio="フルスタック開発者" />
    );
    const avatar = screen.getByText("山");
    expect(avatar).toBeInTheDocument();
  });
});
