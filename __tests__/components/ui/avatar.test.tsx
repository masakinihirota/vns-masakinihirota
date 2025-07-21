import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test-utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar コンポーネント", () => {
  it("Avatar が正しくレンダリングされる", () => {
    render(<Avatar data-testid="avatar" />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("size-8");
    expect(avatar).toHaveClass("rounded-full");
    expect(avatar).toHaveAttribute("data-slot", "avatar");
  });

  it("AvatarFallback が正しくレンダリングされる", () => {
    render(
      <Avatar>
        <AvatarFallback data-testid="avatar-fallback">ユーザー</AvatarFallback>
      </Avatar>
    );

    const avatarFallback = screen.getByTestId("avatar-fallback");
    expect(avatarFallback).toBeInTheDocument();
    expect(avatarFallback).toHaveTextContent("ユーザー");
    expect(avatarFallback).toHaveClass("bg-muted");
    expect(avatarFallback).toHaveAttribute("data-slot", "avatar-fallback");
  });

  it("完全なアバターコンポーネントが正しく構成される", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">ユーザー</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByTestId("avatar");
    const avatarFallback = screen.getByTestId("avatar-fallback");

    expect(avatar).toBeInTheDocument();
    expect(avatarFallback).toBeInTheDocument();
    expect(avatarFallback).toHaveTextContent("ユーザー");
  });

  it("カスタムクラス名が正しく適用される", () => {
    render(
      <div>
        <Avatar className="custom-avatar" data-testid="custom-avatar" />
        <Avatar>
          <AvatarFallback className="custom-fallback" data-testid="custom-fallback">
            ユーザー
          </AvatarFallback>
        </Avatar>
      </div>
    );

    expect(screen.getByTestId("custom-avatar")).toHaveClass("custom-avatar");
    expect(screen.getByTestId("custom-fallback")).toHaveClass("custom-fallback");
  });

  it("アクセシビリティ属性が正しく設定される", () => {
    render(
      <Avatar aria-label="ユーザープロフィール画像" data-testid="a11y-avatar">
        <AvatarFallback>ユーザー</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId("a11y-avatar")).toHaveAttribute(
      "aria-label",
      "ユーザープロフィール画像"
    );
  });

  // AvatarImageの属性テスト
  it("AvatarImageコンポーネントが存在する", () => {
    // AvatarImageコンポーネントが存在することを確認
    expect(typeof AvatarImage).toBe("function");
  });
});
