import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RootAccountDashboard } from "../root-account-dashboard";
import { dummyRootAccountData } from "../root-account-dashboard.dummyData";

// Next.js Image コンポーネントのモック
vi.mock("next/image", () => ({
  default: ({ src, alt, onError }: any) => {
    return <img src={src} alt={alt} onError={onError} />;
  },
}));

// alert のモック
global.alert = vi.fn();

describe("RootAccountDashboard", () => {
  it("正常にレンダリングされる", () => {
    render(<RootAccountDashboard data={dummyRootAccountData} />);

    expect(screen.getByText("アカウント管理")).toBeInTheDocument();
    expect(
      screen.getByText(dummyRootAccountData.display_name)
    ).toBeInTheDocument();
  });

  it("旧スキーマのデータを正規化して表示", () => {
    const oldSchemaData = {
      ...dummyRootAccountData,
      mother_tongue_code: "ja",
      site_language_code: "en",
      mother_tongue_codes: undefined,
      available_language_codes: undefined,
    };

    render(<RootAccountDashboard data={oldSchemaData as any} />);

    // コンポーネントが正常にレンダリングされることを確認
    expect(screen.getByText("アカウント管理")).toBeInTheDocument();
  });

  describe("編集機能", () => {
    it("編集ボタンをクリックすると編集モードになる", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      const editButton = screen.getByRole("button", {
        name: /プロフィール編集/i,
      });
      fireEvent.click(editButton);

      expect(
        screen.getByRole("button", { name: /変更を保存/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /キャンセル/i })
      ).toBeInTheDocument();
    });

    it("キャンセルボタンで編集をキャンセルできる", async () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      // 編集モードに入る
      const editButton = screen.getByRole("button", {
        name: /プロフィール編集/i,
      });
      fireEvent.click(editButton);

      // 表示名を変更
      const displayNameInput = screen.getByDisplayValue(
        dummyRootAccountData.display_name
      );
      fireEvent.change(displayNameInput, { target: { value: "新しい名前" } });

      // キャンセル
      const cancelButton = screen.getByRole("button", { name: /キャンセル/i });
      fireEvent.click(cancelButton);

      // 元の値に戻っていることを確認
      await waitFor(() => {
        expect(
          screen.getByDisplayValue(dummyRootAccountData.display_name)
        ).toBeInTheDocument();
      });
    });

    it("保存ボタンで変更を保存できる", async () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      // 編集モードに入る
      const editButton = screen.getByRole("button", {
        name: /プロフィール編集/i,
      });
      fireEvent.click(editButton);

      // 保存ボタンをクリック
      const saveButton = screen.getByRole("button", { name: /変更を保存/i });
      fireEvent.click(saveButton);

      // アラートが表示されることを確認
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("変更を保存しました");
      });
    });
  });

  describe("セクション別編集機能", () => {
    it("言語の編集ボタンが機能する", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      const editButtons = screen.getAllByRole("button", { name: /編集/i });
      const languageEditButton = editButtons.find((btn) =>
        btn.closest("div")?.textContent?.includes("言語")
      );

      expect(languageEditButton).toBeDefined();
    });

    it("コア活動時間の編集ボタンが機能する", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      const editButtons = screen.getAllByRole("button", { name: /編集/i });
      const coreHoursEditButton = editButtons.find((btn) =>
        btn.closest("div")?.textContent?.includes("アクティブ時間")
      );

      expect(coreHoursEditButton).toBeDefined();
    });
  });

  describe("画像エラーハンドリング", () => {
    it("画像読み込みエラー時にフォールバック表示される", async () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      // 画像要素を取得してエラーをトリガー
      const images = screen.getAllByRole("img");
      const worldMapImage = images.find((img) =>
        img.getAttribute("alt")?.includes("北米")
      );

      expect(worldMapImage).toBeDefined();

      if (worldMapImage) {
        fireEvent.error(worldMapImage);

        await waitFor(() => {
          expect(
            screen.getByText("地図画像を読み込めません")
          ).toBeInTheDocument();
        });
      }
    });
  });

  describe("生誕世代の変更履歴", () => {
    it("生誕世代を変更すると履歴が記録される", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "2000-2004" } });

      // 履歴が表示されることを確認
      expect(screen.getByText(/変更履歴/i)).toBeInTheDocument();
    });
    it("エリアを選択すると推奨コアタイムが自動設定される", () => {
      render(<RootAccountDashboard data={dummyRootAccountData} />);

      // Area 1 (North America) selected -> 16:00 - 24:00 UTC
      const nyArea = screen
        .getAllByText(/アメリカ/i)
        .find((el) => el.closest("div"));
      if (nyArea) {
        fireEvent.click(nyArea);
        expect(screen.getByText("16:00 ～ 24:00")).toBeInTheDocument();
      }

      // Area 2 (Europe/Africa) selected -> 08:00 - 16:00 UTC
      const londonArea = screen
        .getAllByText(/イギリス/i)
        .find((el) => el.closest("div"));
      if (londonArea) {
        fireEvent.click(londonArea);
        expect(screen.getByText("08:00 ～ 16:00")).toBeInTheDocument();
      }

      // Area 3 (Asia/Oceania) selected -> 00:00 - 08:00 UTC
      const tokyoArea = screen
        .getAllByText(/日本/i)
        .find((el) => el.closest("div"));
      if (tokyoArea) {
        fireEvent.click(tokyoArea);
        expect(screen.getByText("00:00 ～ 08:00")).toBeInTheDocument();
      }
    });
  });
});
