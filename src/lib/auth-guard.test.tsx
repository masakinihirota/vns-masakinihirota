import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth/helper", () => ({
    getSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

import { getSession } from "@/lib/auth/helper";
import { redirect } from "next/navigation";
import { RequireRole } from "@/lib/auth-guard";

describe("auth-guard RequireRole", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("platform_admin は許可される", async () => {
        vi.mocked(getSession).mockResolvedValue({
            user: {
                id: "u1",
                email: "admin@example.com",
                name: "admin",
                role: "platform_admin",
            },
            session: {
                id: "s1",
                expiresAt: new Date().toISOString(),
            },
        } as any);

        const result = await RequireRole({
            role: "platform_admin",
            children: <div>ok</div>,
        });

        expect(redirect).not.toHaveBeenCalled();
        expect(result).toBeTruthy();
    });

    it("非 platform_admin は拒否される", async () => {
        vi.mocked(getSession).mockResolvedValue({
            user: {
                id: "u2",
                email: "user@example.com",
                name: "user",
                role: "member",
            },
            session: {
                id: "s2",
                expiresAt: new Date().toISOString(),
            },
        } as any);

        await RequireRole({
            role: "platform_admin",
            children: <div>ng</div>,
        });

        expect(redirect).toHaveBeenCalled();
    });
});
