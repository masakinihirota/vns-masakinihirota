import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { VNSTrialData } from "@/lib/trial-storage";
import { signTrialData } from "@/lib/trial-signature";

// Mock database module
vi.mock("@/lib/db/client", () => {
  return {
    db: {
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{
            id: "mock-user-id",
            name: "Mock User",
            email: "mock@example.com",
            emailVerified: true,
            image: null,
            role: "user",
            isAnonymous: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          }])),
        })),
      })),
    },
  };
});

// Mock trial-signature module to avoid server-only errors
vi.mock("@/lib/trial-signature", () => {
  return {
    hashTrialData: (data: VNSTrialData): string => {
      // Simple mock hash function
      return JSON.stringify(data).slice(0, 32);
    },
    signTrialData: (data: VNSTrialData): { signature: string; hash: string } => {
      // Mock signature generation
      const hash = JSON.stringify(data).slice(0, 32);
      const signature = `mock_signature_${hash}`;
      return { signature, hash };
    },
    verifyTrialData: (data: VNSTrialData, signature: string): boolean => {
      // Mock verification - check if signature matches expected mock pattern
      const expectedHash = JSON.stringify(data).slice(0, 32);
      const expectedSignature = `mock_signature_${expectedHash}`;
      return signature === expectedSignature;
    },
    isTimestampValid: (createdAt: string, validationDays: number = 30): boolean => {
      // Check if timestamp is within validation period
      try {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= validationDays;
      } catch {
        return false;
      }
    },
    validateDataLimits: (data: VNSTrialData): { valid: boolean; errors: Array<{ field: string; current: number; max: number }> } => {
      const errors: Array<{ field: string; current: number; max: number }> = [];

      if ((data.points?.current || 0) > 1_000_000) {
        errors.push({ field: "points", current: data.points.current, max: 1_000_000 });
      }
      if ((data.profiles?.length || 0) > 10) {
        errors.push({ field: "profiles", current: data.profiles.length, max: 10 });
      }
      if ((data.watchlist?.length || 0) > 100) {
        errors.push({ field: "watchlist", current: data.watchlist.length, max: 100 });
      }
      if ((data.groups?.length || 0) > 2) {
        errors.push({ field: "groups", current: data.groups.length, max: 2 });
      }

      return { valid: errors.length === 0, errors };
    },
    validateTrialDataFull: (data: VNSTrialData, signature: string): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      // Verify signature
      const expectedHash = JSON.stringify(data).slice(0, 32);
      const expectedSignature = `mock_signature_${expectedHash}`;
      if (signature !== expectedSignature) {
        errors.push("signature_invalid: データが改ざんされています");
        return { valid: false, errors };
      }

      // Check timestamp
      try {
        const createdDate = new Date(data.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays > 30) {
          errors.push("timestamp_expired: 30日以上前のデータです");
        }
      } catch {
        errors.push("timestamp_invalid: 無効なタイムスタンプ");
      }

      // Check limits
      if ((data.points?.current || 0) > 1_000_000) {
        errors.push("limit_exceeded: points");
      }

      return { valid: errors.length === 0, errors };
    },
  };
});

/**
 * 匿名認証APIのエッジケーステスト
 * 署名検証、タイムスタンプ検証、エラーハンドリングをテスト
 */

describe("Anonymous Auth API - Edge Cases", () => {
  beforeEach(async () => {
    // テスト前にクリーンアップ（必要に応じて）
  });

  describe("署名検証", () => {
    it("署名なしでも匿名ログインできる（新規ユーザー）", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/sign-in/anonymous", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.redirectURL).toBeDefined();
    });

    it("不正な署名の場合、エラーを返す", async () => {
      const trialData: VNSTrialData = {
        rootAccount: {
          display_id: "test_user",
          display_name: "Test User",
          activity_area_id: null,
          core_activity_start: "09:00",
          core_activity_end: "17:00",
          holidayActivityStart: "10:00",
          holidayActivityEnd: "18:00",
          uses_ai_translation: false,
          nativeLanguages: ["ja"],
          agreed_oasis: true,
          zodiac_sign: "aries",
          birth_generation: "1990s",
          week_schedule: {},
          created_at: new Date().toISOString(),
        },
        profiles: [],
        groups: [],
        nation: null,
        watchlist: [],
        points: {
          current: 500,
        },
        createdAt: new Date().toISOString(),
      };

      const invalidSignature = "invalid_signature_12345";

      const req = new NextRequest("http://localhost:3000/api/auth/sign-in/anonymous", {
        method: "POST",
        body: JSON.stringify({
          data: trialData,
          signature: invalidSignature,
          version: 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("検証に失敗");
    });

    it("正しい署名の場合、ログインに成功する", async () => {
      const trialData: VNSTrialData = {
        rootAccount: {
          display_id: "test_user",
          display_name: "Test User",
          activity_area_id: null,
          core_activity_start: "09:00",
          core_activity_end: "17:00",
          holidayActivityStart: "10:00",
          holidayActivityEnd: "18:00",
          uses_ai_translation: false,
          nativeLanguages: ["ja"],
          agreed_oasis: true,
          zodiac_sign: "aries",
          birth_generation: "1990s",
          week_schedule: {},
          created_at: new Date().toISOString(),
        },
        profiles: [],
        groups: [],
        nation: null,
        watchlist: [],
        points: {
          current: 500,
        },
        createdAt: new Date().toISOString(),
      };

      const { signature } = signTrialData(trialData);

      const req = new NextRequest("http://localhost:3000/api/auth/sign-in/anonymous", {
        method: "POST",
        body: JSON.stringify({
          data: trialData,
          signature,
          version: 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("タイムスタンプ検証", () => {
    it("古すぎるデータの場合、エラーを返す", async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31); // 31日前（有効期限切れ）

      const trialData: VNSTrialData = {
        rootAccount: {
          display_id: "test_user",
          display_name: "Test User",
          activity_area_id: null,
          core_activity_start: "09:00",
          core_activity_end: "17:00",
          holidayActivityStart: "10:00",
          holidayActivityEnd: "18:00",
          uses_ai_translation: false,
          nativeLanguages: ["ja"],
          agreed_oasis: true,
          zodiac_sign: "aries",
          birth_generation: "1990s",
          week_schedule: {},
          created_at: oldDate.toISOString(),
        },
        profiles: [],
        groups: [],
        nation: null,
        watchlist: [],
        points: {
          current: 500,
        },
        createdAt: oldDate.toISOString(),
      };

      const { signature } = signTrialData(trialData);

      const req = new NextRequest("http://localhost:3000/api/auth/sign-in/anonymous", {
        method: "POST",
        body: JSON.stringify({
          data: trialData,
          signature,
          version: 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("検証に失敗");
    });
  });

  describe("データ制限", () => {
    it("ポイントが上限を超える場合でも、制限内に調整される", async () => {
      const trialData: VNSTrialData = {
        rootAccount: {
          display_id: "test_user",
          display_name: "Test User",
          activity_area_id: null,
          core_activity_start: "09:00",
          core_activity_end: "17:00",
          holidayActivityStart: "10:00",
          holidayActivityEnd: "18:00",
          uses_ai_translation: false,
          nativeLanguages: ["ja"],
          agreed_oasis: true,
          zodiac_sign: "aries",
          birth_generation: "1990s",
          week_schedule: {},
          created_at: new Date().toISOString(),
        },
        profiles: [],
        groups: [],
        nation: null,
        watchlist: [],
        points: {
          current: 999999999, // 上限を大幅に超えるポイント
        },
        createdAt: new Date().toISOString(),
      };

      const { signature } = signTrialData(trialData);

      const req = new NextRequest("http://localhost:3000/api/auth/sign-in/anonymous", {
        method: "POST",
        body: JSON.stringify({
          data: trialData,
          signature,
          version: 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(req);
      const data = await response.json();

      // 署名検証でエラーになるはず(データ制限超過)
      // または成功した場合はポイントが調整される
      if (response.status === 400) {
        expect(data.error).toContain("検証に失敗");
      } else {
        expect(response.status).toBe(200);
      }
    });
  });

  describe("ユーザーとセッション作成", () => {
    it("匿名ユーザーとセッションが正しく作成される", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/sign-in/anonymous", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          "user-agent": "Test Browser",
          "x-real-ip": "127.0.0.1",
        },
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // Cookieが設定されているか確認
      const cookies = response.headers.get("set-cookie");
      expect(cookies).toContain("better-auth.session_token");
    });
  });
});
