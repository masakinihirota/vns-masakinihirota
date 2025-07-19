import { describe, it, expect } from "vitest";

describe("Vitest Setup", () => {
  it("should have DOM environment available", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  it("should have mocked localStorage", () => {
    expect(typeof localStorage).toBe("object");
    expect(typeof localStorage.getItem).toBe("function");
  });

  it("should have mocked matchMedia", () => {
    expect(typeof window.matchMedia).toBe("function");
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    expect(mediaQuery).toHaveProperty("matches");
  });

  it("should have ResizeObserver mock", () => {
    expect(typeof ResizeObserver).toBe("function");
    const observer = new ResizeObserver(() => {});
    expect(observer).toHaveProperty("observe");
    expect(observer).toHaveProperty("disconnect");
  });

  it("should have environment variables set", () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });
});
