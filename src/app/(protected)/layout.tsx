import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Layout({ children }: { children: ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() });
    const isAdmin = session?.user.role === "admin";

    return (
        <>
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <p className="text-sm text-gray-600">Logged in as: {session?.user.name}</p>
                </div>
            </div>
            {children}
        </>
    );
}
