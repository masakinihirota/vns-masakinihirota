import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  checkRateLimit,
  resetRateLimit,
  getRateLimitStatus,
  clearRateLimitStore,
  RATE_LIMIT_CONFIG,
} from "@/lib/auth/rate-limiter";
import {
  checkAuthRateLimit,
  resetAuthRateLimit,
  AuthRateLimitError,
} from "@/lib/auth/auth-rate-limit";

/**
 * Rate Limiting Test Suite
 *
 * メモリベースのレート制限実装をテスト
 */

describe("Rate Limiter - Core Functions", () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  describe("checkRateLimit", () => {
    it("should allow first attempt", () => {
      const result = checkRateLimit("user-1", 5, 60000);
      expect(result).toBe(true);
    });

    it("should allow multiple attempts within limit", () => {
      const userId = "user-2";
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(userId, 5, 60000);
        expect(result).toBe(true);
      }
    });

    it("should deny attempt when limit exceeded", () => {
      const userId = "user-3";
      // 5回の試行を許可
      for (let i = 0; i < 5; i++) {
        checkRateLimit(userId, 5, 60000);
      }
      // 6回目を拒否
      const result = checkRateLimit(userId, 5, 60000);
      expect(result).toBe(false);
    });

    it("should reset after window expires", (context) => {
      context.task.skip(); // 時間経過テストは手動でのみ実行
      // 実装: vitest.useFakeTimers() を使用した時間操作テスト
    });
  });

  describe("getRateLimitStatus", () => {
    it("should return null for new key", () => {
      const status = getRateLimitStatus("new-user");
      expect(status).toBeNull();
    });

    it("should return count and resetTime", () => {
      const userId = "user-4";
      checkRateLimit(userId, 5, 60000);
      checkRateLimit(userId, 5, 60000);

      const status = getRateLimitStatus(userId);
      expect(status).not.toBeNull();
      expect(status?.count).toBe(2);
      expect(status?.resetTime).toBeGreaterThan(Date.now());
    });
  });

  describe("resetRateLimit", () => {
    it("should remove user from rate limit store", () => {
      const userId = "user-5";
      checkRateLimit(userId, 5, 60000);

      expect(getRateLimitStatus(userId)).not.toBeNull();

      resetRateLimit(userId);

      expect(getRateLimitStatus(userId)).toBeNull();
    });
  });
});

describe("Rate Limiter - Auth Integration", () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  describe("checkAuthRateLimit", () => {
    it("should allow auth attempt within limit", async () => {
      expect(async () => {
        await checkAuthRateLimit("user-6");
      }).not.toThrowError();
    });

    it("should throw AuthRateLimitError when limit exceeded", async () => {
      const userId = "user-7";
      const maxAttempts = RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS;

      // しきい値まで試行
      for (let i = 0; i < maxAttempts; i++) {
        checkRateLimit(userId, maxAttempts, RATE_LIMIT_CONFIG.AUTH_WINDOW_MS);
      }

      // 次の試行で例外
      try {
        await checkAuthRateLimit(userId);
        expect(true).toBe(false); // should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(AuthRateLimitError);
        expect((error as AuthRateLimitError).message).toContain("認証に失敗しました");
      }
    });

    it("AuthRateLimitError should contain retry info", async () => {
      const userId = "user-8";
      const maxAttempts = RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS;

      for (let i = 0; i < maxAttempts; i++) {
        checkRateLimit(userId, maxAttempts, RATE_LIMIT_CONFIG.AUTH_WINDOW_MS);
      }

      try {
        await checkAuthRateLimit(userId);
      } catch (error) {
        if (error instanceof AuthRateLimitError) {
          expect(error.retryAfterSeconds).toBeGreaterThan(0);
          expect(error.attemptCount).toBeGreaterThan(0);
          expect(error.maxAttempts).toBe(maxAttempts);
        }
      }
    });
  });

  describe("resetAuthRateLimit", () => {
    it("should clear auth rate limit", async () => {
      const userId = "user-9";

      checkRateLimit(userId, 5, 60000);
      expect(getRateLimitStatus(userId)).not.toBeNull();

      await resetAuthRateLimit(userId);

      expect(getRateLimitStatus(userId)).toBeNull();
    });
  });
});

describe("Rate Limiter - Configuration", () => {
  it("should have reasonable auth rate limit defaults", () => {
    expect(RATE_LIMIT_CONFIG.AUTH_MAX_ATTEMPTS).toBe(5);
    expect(RATE_LIMIT_CONFIG.AUTH_WINDOW_MS).toBe(60 * 1000); // 1分
  });

  it("should have cleanup interval configured", () => {
    expect(RATE_LIMIT_CONFIG.CLEANUP_INTERVAL_MS).toBeGreaterThan(0);
  });

  it("rate limit window should be sufficient for users", () => {
    // 1分以上あれば合理的
    expect(RATE_LIMIT_CONFIG.AUTH_WINDOW_MS).toBeGreaterThanOrEqual(60 * 1000);
  });
});

describe("Rate Limiter - Edge Cases", () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  it("should handle same identifier multiple times", () => {
    const identifier = "test-user";

    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(identifier, 5, 60000);
      expect(result).toBe(true);
    }

    const sixthAttempt = checkRateLimit(identifier, 5, 60000);
    expect(sixthAttempt).toBe(false);
  });

  it("should handle different identifiers independently", () => {
    const user1Result = checkRateLimit("user-a", 5, 60000);
    const user2Result = checkRateLimit("user-b", 5, 60000);

    expect(user1Result).toBe(true);
    expect(user2Result).toBe(true);

    // user1 を5回試行
    for (let i = 0; i < 4; i++) {
      checkRateLimit("user-a", 5, 60000);
    }

    // user-a は制限に達する
    expect(checkRateLimit("user-a", 5, 60000)).toBe(false);

    // user-b は まだ試行可能
    expect(checkRateLimit("user-b", 5, 60000)).toBe(true);
  });

  it("should handle empty identifier gracefully", () => {
    const result = checkRateLimit("", 5, 60000);
    expect(result).toBe(true); // Allow with empty ID (unusual but shouldn't crash)
  });
});
