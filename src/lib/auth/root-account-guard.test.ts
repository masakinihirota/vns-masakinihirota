import { beforeEach, describe, expect, it, vi } from "vitest";
import { hasRootAccount } from "./root-account-guard";

// モックの定義
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

// createClient のモック
vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

describe("hasRootAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // チェーンメソッドのモック戻り値設定
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  it("ルートアカウントが存在する場合、trueを返す", async () => {
    // Arrange
    const userId = "user-123";
    mockSingle.mockResolvedValue({ data: { id: "root-1" }, error: null });

    // Act
    const result = await hasRootAccount(userId);

    // Assert
    expect(result).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("root_accounts");
    expect(mockEq).toHaveBeenCalledWith("auth_user_id", userId);
  });

  it("ルートアカウントが存在しない場合、falseを返す", async () => {
    // Arrange
    const userId = "user-no-root";
    // single() はレコードがない場合、data: null, error: { code: 'PGRST116', ... } を返す
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116", message: "Row not found" },
    });

    // Act
    const result = await hasRootAccount(userId);

    // Assert
    expect(result).toBe(false);
  });

  it("DBエラーが発生した場合、falseを返す（現状の実装ではエラーをスローせずfalseになる挙動を確認）", async () => {
    // Arrange
    const userId = "user-error";
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });

    // Act
    const result = await hasRootAccount(userId);

    // Assert
    expect(result).toBe(false);
  });
});
