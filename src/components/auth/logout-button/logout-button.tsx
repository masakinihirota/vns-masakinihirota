"use client";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        router.push("/login");
        setLoading(false);
    };

    return (
        <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <>
                    ログアウト
                    <LogOut className="ml-2 size-4" />
                </>
            )}
        </Button>
    );
}
