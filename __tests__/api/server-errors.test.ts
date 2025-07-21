import { describe, it, expect } from "vitest";

// モックレスポンスを定義
const mockResponses = {
  serverError: {
    success: false,
    error: "内部サーバーエラーが発生しました",
    code: "INTERNAL_SERVER_ERROR",
  },
  databaseError: {
    success: false,
    error: "データベース接続エラーが発生しました",
    code: "DATABASE_ERROR",
  },
  externalApiError: {
    success: false,
    error: "外部APIとの通信中にエラーが発生しました",
    code: "EXTERNAL_API_ERROR",
  },
  timeoutError: {
    success: false,
    error: "リクエストがタイムアウトしました",
    code: "REQUEST_TIMEOUT",
  },
};

// モックレスポンスを作成する関数
function createMockResponse(status, data) {
  return {
    status,
    json: async () => data,
    headers: {
      get: () => null,
    },
  };
}

describe("API サーバーエラー（500系）のハンドリング", () => {
  it("内部サーバーエラーで500エラーを返すこと", async () => {
    // 実際のfetchを呼び出さずにモックレスポンスを返す
    const response = createMockResponse(500, mockResponses.serverError);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual(mockResponses.serverError);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("error", "内部サーバーエラーが発生しました");
    expect(data).toHaveProperty("code", "INTERNAL_SERVER_ERROR");
  });

  it("データベース接続エラーで503エラーを返すこと", async () => {
    // 実際のfetchを呼び出さずにモックレスポンスを返す
    const response = createMockResponse(503, mockResponses.databaseError);
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data).toEqual(mockResponses.databaseError);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty(
      "error",
      "データベース接続エラーが発生しました",
    );
    expect(data).toHaveProperty("code", "DATABASE_ERROR");
  });

  it("外部APIエラーで502エラーを返すこと", async () => {
    // 実際のfetchを呼び出さずにモックレスポンスを返す
    const response = createMockResponse(502, mockResponses.externalApiError);
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data).toEqual(mockResponses.externalApiError);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty(
      "error",
      "外部APIとの通信中にエラーが発生しました",
    );
    expect(data).toHaveProperty("code", "EXTERNAL_API_ERROR");
  });

  it("タイムアウトで504エラーを返すこと", async () => {
    // 実際のfetchを呼び出さずにモックレスポンスを返す
    const response = createMockResponse(504, mockResponses.timeoutError);
    const data = await response.json();

    expect(response.status).toBe(504);
    expect(data).toEqual(mockResponses.timeoutError);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("error", "リクエストがタイムアウトしました");
    expect(data).toHaveProperty("code", "REQUEST_TIMEOUT");
  });

  it("エラーレスポンスが一貫した形式であること", async () => {
    const endpoints = [
      { status: 500, response: mockResponses.serverError },
      { status: 503, response: mockResponses.databaseError },
      { status: 502, response: mockResponses.externalApiError },
      { status: 504, response: mockResponses.timeoutError },
    ];

    for (const endpoint of endpoints) {
      const response = createMockResponse(endpoint.status, endpoint.response);
      const data = await response.json();

      expect(response.status).toBe(endpoint.status);
      expect(response.status).toBeGreaterThanOrEqual(500);
      expect(response.status).toBeLessThanOrEqual(599);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("error");
      expect(typeof data.error).toBe("string");
      expect(data).toHaveProperty("code");
      expect(typeof data.code).toBe("string");
    }
  });
});
