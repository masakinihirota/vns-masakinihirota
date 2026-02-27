import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LogoutButton } from "./logout-button";

// next/navigationのモック
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh,
    }),
}));

describe("LogoutButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it("ボタンをクリックすると確認ダイアログが表示される", async () => {
        render(<LogoutButton />);

        const button = screen.getByRole("button", { name: /ログアウト/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("ログアウトの確認")).toBeInTheDocument();
            expect(screen.getByText("本当にログアウトしますか?")).toBeInTheDocument();
        });
    });

    it("複数認証の警告が表示される", async () => {
        render(<LogoutButton hasMultipleAuthMethods={true} />);

        const button = screen.getByRole("button", { name: /ログアウト/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByText(/複数の認証方法が登録されています/i)
            ).toBeInTheDocument();
        });
    });

    it("匿名ユーザーの警告が表示される", async () => {
        render(<LogoutButton isAnonymous={true} />);

        const button = screen.getByRole("button", { name: /ログアウト/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByText(/匿名アカウントでは、ログアウト後にデータが復元できない/i)
            ).toBeInTheDocument();
        });
    });

    it("ログアウトに成功するとログインページにリダイレクトされる", async () => {
        const mockFetch = vi.mocked(global.fetch);
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        } as Response);

        render(<LogoutButton />);

        const button = screen.getByRole("button", { name: /ログアウト/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("ログアウトの確認")).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole("button", { name: /ログアウト$/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith("/api/auth/sign-out", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(mockPush).toHaveBeenCalledWith("/login");
            expect(mockRefresh).toHaveBeenCalled();
        });
    });

    it("ログアウトに失敗するとエラーメッセージが表示される", async () => {
        const mockFetch = vi.mocked(global.fetch);
        mockFetch.mockResolvedValue({
            ok: false,
            text: async () => "Server error",
        } as Response);

        // alertをモック
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => { });

        render(<LogoutButton />);

        const button = screen.getByRole("button", { name: /ログアウト/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("ログアウトの確認")).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole("button", { name: /ログアウト$/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                "ログアウトに失敗しました。再度お試しください。"
            );
        });

        alertSpy.mockRestore();
    });

    it("キャンセルボタンでダイアログが閉じる", async () => {
        render(<LogoutButton />);

        const button = screen.getByRole("button", { name: /ログアウト/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("ログアウトの確認")).toBeInTheDocument();
        });

        const cancelButton = screen.getByRole("button", { name: /キャンセル/i });
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText("ログアウトの確認")).not.toBeInTheDocument();
        });
    });

    it("カスタムchildren要素が表示される", () => {
        render(
            <LogoutButton>
                <span>Custom Logout</span>
            </LogoutButton>
        );

        expect(screen.getByText("Custom Logout")).toBeInTheDocument();
    });
});
