import { type ReactNode } from "react";
import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";
import { getSession } from "@/lib/auth/helper";
import {
    checkGroupRole,
    type AuthSession,
    type GroupRole,
} from "@/lib/auth/rbac-helper";

type GroupScopedRole =
    | "group_leader"
    | "group_sub_leader"
    | "group_member"
    | "group_mediator";

function toAuthSession(session: Awaited<ReturnType<typeof getSession>>): AuthSession | null {
    if (!session?.user || !session?.session) return null;

    return {
        user: {
            id: session.user.id,
            email: session.user.email ?? null,
            name: session.user.name ?? null,
            role: session.user.role ?? null,
        },
        session: {
            id: session.session.id,
            expiresAt: new Date(session.session.expiresAt),
        },
    };
}

function mapGroupRole(role: GroupScopedRole): GroupRole {
    switch (role) {
        case "group_leader":
            return "leader";
        case "group_sub_leader":
            return "sub_leader";
        case "group_member":
            return "member";
        case "group_mediator":
            return "mediator";
    }
}

export async function RequireAuth({ children }: { children: ReactNode }) {
    const session = await getSession();

    if (!session?.user) {
        redirect(ROUTES.LANDING);
    }

    return <>{children}</>;
}

export async function RequireRole({
    role,
    children,
}: {
    role: "platform_admin";
    children: ReactNode;
}) {
    const session = await getSession();

    if (!session?.user) {
        redirect(ROUTES.LANDING);
    }

    if (session.user.role !== role) {
        redirect(ROUTES.LANDING);
    }

    return <>{children}</>;
}

export async function RequireGroupRole({
    groupId,
    role,
    children,
}: {
    groupId: string;
    role: GroupScopedRole;
    children: ReactNode;
}) {
    const session = await getSession();
    const authSession = toAuthSession(session);

    if (!authSession?.user) {
        redirect(ROUTES.LANDING);
    }

    const allowed = await checkGroupRole(authSession, groupId, mapGroupRole(role));

    if (!allowed) {
        redirect(ROUTES.LANDING);
    }

    return <>{children}</>;
}
