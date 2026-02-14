import { authDb } from "@/lib/drizzle/authjs-client";
import {
  authjsAccounts,
  authjsSessions,
  authjsUsers,
  authjsVerificationTokens,
} from "@/lib/drizzle/schema/auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * Auth.js v5 設定
 * Supabaseとは完全に独立した認証システム
 * GitHub OAuth + Google OAuth のみ使用
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(authDb, {
    usersTable: authjsUsers,
    accountsTable: authjsAccounts,
    sessionsTable: authjsSessions,
    verificationTokensTable: authjsVerificationTokens,
  }),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/authjs-login",
  },
  callbacks: {
    /** セッションにユーザーIDを含める */
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
