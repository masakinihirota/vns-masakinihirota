import { auth } from "@/auth";
import type { Session } from "next-auth";

export const getSession = async (): Promise<Session | null> => {
  return await auth();
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user ?? null;
};
