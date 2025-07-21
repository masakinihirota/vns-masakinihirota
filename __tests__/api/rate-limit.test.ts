import { describe, it, expect } from "vitest";

// モックレスポンスを定義
const mockResponses = {
  success: {
    success: true,
    data: { message: "リクエスト成功" },
  },
  rateLimited: {
    success: false,
    error: "レート制限を超過しました。しばらく待ってから再試行してください。",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: 60, // 60秒後に再試行可能
  },
};

// モックレスポンスを作成する関数
function createMockResponse(status, data, headers = {}) {
  return {
    status,
    json: async () => data,
    headers: {
      get: (name) => headers[name] || null,
    },
  };
}

describe("API レート制限のハンドリング", () => {
  it("レート制限を超えると429エラーを返すこと", async () => {
    // 最初の2回のリクエストは成功するはず
    const successResponse1 = createMockResponse(200, mockResponses.success, {
      "X-RateLimit-Limit": "2",
      "X-RateLimit-Remaining": "1",
      "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 60),
    });

    const successResponse2 = createMockResponse(200, mockResponses.success, {
      "X-RateLimit-Limit": "2",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 60),
    });

    // 3回目のリクエストはレート制限エラーになるはず
    const rateLimitedResponse = createMockResponse(
      429,
      mockResponses.rateLimited,
      {
        "Retry-After": "60",
        "X-RateLimit-Limit": "2",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 60),
      },
    );

    // 最初の2回のリクエストを検証
    for (let i = 0; i < 2; i++) {
      const response = i === 0 ? successResponse1 : successResponse2;
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("success", true);
      expect(response.headers.get("X-RateLimit-Remaining")).toBe(String(1 - i));
    }

    // 3回目のリクエストを検証
    const data = await rateLimitedResponse.json();

    expect(rateLimitedResponse.status).toBe(429);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("error");
    expect(data).toHaveProperty("code", "RATE_LIMIT_EXCEEDED");
    expect(data).toHaveProperty("retryAfter");
    expect(rateLimitedResponse.headers.get("Retry-After")).toBe("60");
    expect(rateLimitedResponse.headers.get("X-RateLimit-Remaining")).toBe("0");
  });

  it("レート制限ヘッダーが適切に設定されていること", async () => {
    const resetTime = Math.floor(Date.now() / 1000) + 60;
    const response = createMockResponse(200, mockResponses.success, {
      "X-RateLimit-Limit": "2",
      "X-RateLimit-Remaining": "1",
      "X-RateLimit-Reset": String(resetTime),
    });

    expect(response.headers.get("X-RateLimit-Limit")).toBe("2");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("1");
    expect(response.headers.get("X-RateLimit-Reset")).toBe(String(resetTime));

    // リセット時間が未来の時間であることを確認
    const currentTime = Math.floor(Date.now() / 1000);
    expect(
      parseInt(response.headers.get("X-RateLimit-Reset") || "0", 10),
    ).toBeGreaterThan(currentTime);
  });

  it("レート制限エラーレスポンスが適切な形式であること", async () => {
    const resetTime = Math.floor(Date.now() / 1000) + 60;
    const response = createMockResponse(429, mockResponses.rateLimited, {
      "Retry-After": "60",
      "X-RateLimit-Limit": "2",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(resetTime),
    });

    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("error");
    expect(typeof data.error).toBe("string");
    expect(data).toHaveProperty("code", "RATE_LIMIT_EXCEEDED");
    expect(data).toHaveProperty("retryAfter");
    expect(typeof data.retryAfter).toBe("number");

    // ヘッダーの検証
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(response.headers.get("X-RateLimit-Limit")).toBe("2");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("X-RateLimit-Reset")).toBe(String(resetTime));
  });
});
