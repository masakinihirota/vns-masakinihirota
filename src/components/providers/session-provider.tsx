"use client";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Better Auth doesn't require a session provider for client-side hooks
  // The useSession hook in @/lib/auth-client handles everything
  return <>{children}</>;
}
