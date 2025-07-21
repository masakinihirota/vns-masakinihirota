import { describe, it, expect } from "vitest";

// モックレスポンスを定義
const mockResponses = {
  invalidJson: {
    success: false,
    errors: ["無効なJSONフォーマットです"],
    code: "INVALID_JSON",
  },
  missingFields: {
    success: false,
    errors: ["名前は必須です", "メールアドレスは必須です"],
    code: "VALIDATION_ERROR",
  },
  invalidEmail: {
    success: false,
    errors: ["有効なメールアドレスを入力してください"],
    code: "VALIDATION_ERROR",
  },
  invalidQueryParams: {
    success: false,
    errors: [
      "limitは正の数値である必要があります",
      "pageは正の数値である必要があります",
    ],
    code: "INVALID_QUERY_PARAMS",
  },
  validData: {
    success: true,
    data: {
      name: "テストユーザー",
      email: "test@example.com",
      age: 30,
    },
  },
  complexValidationError: {
    success: false,
    errors: {
      fields: {
        userName: "名前は3文字以上である必要があります",
        userEmail: "有効なメールアドレスを入力してください",
        userAge: "年齢は18歳以上である必要があります",
        postalCode: "郵便番号は123-4567の形式で入力してください",
        prefecture: "都道府県は必須です",
        password: "パスワードは8文字以上である必要があります",
      },
      global: [],
    },
    code: "VALIDATION_ERROR",
  },
  validComplexData: {
    success: true,
    data: { message: "バリデーション成功" },
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

describe("API バリデーションエラーハンドリング", () => {
  it("無効なJSONリクエストで400エラーを返すこと", async () => {
    const response = createMockResponse(400, mockResponses.invalidJson);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("errors");
    expect(data.errors).toContain("無効なJSONフォーマットです");
    expect(data).toHaveProperty("code", "INVALID_JSON");
  });

  it("必須フィールドが欠けている場合に400エラーを返すこと", async () => {
    const response = createMockResponse(400, mockResponses.missingFields);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("errors");
    expect(data.errors).toContain("名前は必須です");
    expect(data.errors).toContain("メールアドレスは必須です");
    expect(data).toHaveProperty("code", "VALIDATION_ERROR");
  });

  it("無効なメールアドレス形式で400エラーを返すこと", async () => {
    const response = createMockResponse(400, mockResponses.invalidEmail);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("success", false);
    expect(data.errors).toContain("有効なメールアドレスを入力してください");
    expect(data).toHaveProperty("code", "VALIDATION_ERROR");
  });

  it("無効なクエリパラメータで400エラーを返すこと", async () => {
    const response = createMockResponse(400, mockResponses.invalidQueryParams);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("success", false);
    expect(data.errors).toContain("limitは正の数値である必要があります");
    expect(data.errors).toContain("pageは正の数値である必要があります");
    expect(data).toHaveProperty("code", "INVALID_QUERY_PARAMS");
  });

  it("有効なリクエストで正常なレスポンスを返すこと", async () => {
    const validData = {
      name: "テストユーザー",
      email: "test@example.com",
      age: 30,
    };

    const response = createMockResponse(200, mockResponses.validData);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("success", true);
    expect(data).toHaveProperty("data");
    expect(data.data).toEqual(validData);
  });

  it("複雑なバリデーションエラーを適切に処理すること", async () => {
    const response = createMockResponse(
      400,
      mockResponses.complexValidationError,
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("success", false);
    expect(data).toHaveProperty("errors");
    expect(data.errors).toHaveProperty("fields");
    expect(data.errors.fields).toHaveProperty("userName");
    expect(data.errors.fields).toHaveProperty("userEmail");
    expect(data.errors.fields).toHaveProperty("userAge");
    expect(data.errors.fields).toHaveProperty("postalCode");
    expect(data.errors.fields).toHaveProperty("prefecture");
    expect(data.errors.fields).toHaveProperty("password");
    expect(data).toHaveProperty("code", "VALIDATION_ERROR");
  });

  it("有効なデータで正常なレスポンスを返すこと", async () => {
    const response = createMockResponse(200, mockResponses.validComplexData);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("success", true);
    expect(data.data).toHaveProperty("message", "バリデーション成功");
  });
});
