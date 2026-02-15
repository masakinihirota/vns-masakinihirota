import { db } from "@/lib/db/drizzle-postgres";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema.postgres";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [], // Providers will be added later (e.g. GitHub, Google, Credentials)
  session: {
    strategy: "jwt", // Using JWT for session strategy initially
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  }
});
