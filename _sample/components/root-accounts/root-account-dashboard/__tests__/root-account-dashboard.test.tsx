import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RootAccountDashboard } from "../root-account-dashboard";
import { dummyRootAccountData } from "../root-account-dashboard.dummyData";

// Next.js Image コンポーネントのモック
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onError,
  }: {
    readonly src: string;
    readonly alt: string;
    readonly onError?: () => void;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} onError={onError} />;
  },
}));

vi.mock("../root-account-dashboard.logic", () => ({
  saveRootAccount: vi.fn(() => Promise.resolve()),
  saveAreaSetting: vi.fn(() => Promise.resolve()),
  calculateGenerationHistory: vi.fn((previous) => [...previous]),
  calculateAreaHistory: vi.fn((previous) => [...previous]),
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("RootAccountDashboard", () => {
  it("正常にレンダリングされる", () => {
    render(<RootAccountDashboard data={dummyRootAccountData} />);
    // デバッグ出力によると h1 タグ内に「アカウント管理」がある
    expect(screen.getByRole("heading", { level: 1, name: /アカウント管理/i })).toBeInTheDocument();
    // 表示名は input の value としてレンダリングされるため getByDisplayValue を使用
    expect(screen.getByDisplayValue(dummyRootAccountData.display_name)).toBeInTheDocument();
  });

  describe("編集モードの遷移", () => {
    it("編集ボタンをクリックすると保存・キャンセルボタンが表示される", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      // 「ユーザー属性」セクション内の「編集」ボタンを特定する
      const basicInfoSection = screen.getByRole("heading", { name: /ユーザー属性/i }).closest("section") || document.body;
      const editButton = [...basicInfoSection.querySelectorAll("button")].find(button => button.textContent?.includes("編集"));

      if (editButton) {
        fireEvent.click(editButton);
        expect(screen.getByRole("button", { name: /保存/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /キャンセル/i })).toBeInTheDocument();
      } else {
        throw new Error("ユーザー属性の編集ボタンが見つかりません");
      }
    });

    it("保存ボタンクリックで非編集モードに戻る", async () => {
      // 本テストではタイマーをリアルタイムに戻す（保存処理の待ち時間と waitFor の競合を避けるため）
      vi.useRealTimers();
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      const basicInfoSection = screen.getByRole("heading", { name: /ユーザー属性/i }).closest("section") || document.body;
      const editButton = [...basicInfoSection.querySelectorAll("button")].find(button => button.textContent?.includes("編集"));

      if (editButton) {
        fireEvent.click(editButton);
        const saveButton = screen.getByRole("button", { name: /保存/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(screen.queryByRole("button", { name: /保存/i })).not.toBeInTheDocument();
        }, { timeout: 2000 });
      } else {
        throw new Error("ユーザー属性の編集ボタンが見つかりません");
      }
    });
  });

  describe("表示内容の確認", () => {
    it("アクティブ時間のセクションが表示される", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);
      expect(screen.getByText(/アクティブ時間/i)).toBeInTheDocument();
    });

    it("マイ・プロフィールセクションが表示される", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);
      // h4 レベルで「マイ・プロフィール」を検索
      expect(screen.getByRole("heading", { level: 4, name: /マイ・プロフィール/i })).toBeInTheDocument();
    });
  });

  describe("画像エラーのハンドリング", () => {
    it("画像読み込みエラー時に適切に処理される", async () => {
      // 本テストではタイマーをリアルタイムに戻す
      vi.useRealTimers();
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      const areaImage = screen.getAllByRole("img").find(img => img.getAttribute("alt")?.includes("エリア") || img.getAttribute("src")?.includes("world/area"));
      const testImage = areaImage;

      if (testImage) {
        fireEvent.error(testImage);
        // エラー発生時にフォールバック表示（MapPinアイコン等）に切り替わるはず
        // 今回のコンポーネント実装では、onError で state が更新され、img タグが消えて MapPin が出る。
        // なので、img タグが消えたことを確認する
        await waitFor(() => {
          expect(testImage).not.toBeInTheDocument();
        }, { timeout: 2000 });

        expect(screen.getByText(/地図画像を読み込めません/i)).toBeInTheDocument();
      } else {
        throw new Error("評価対象のエリア画像が見つかりません");
      }
    });
  });
});
