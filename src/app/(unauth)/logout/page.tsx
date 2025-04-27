import { LogoutButton } from "@/components/oauth/logout-button-unauth";
import Link from "next/link";

export default async function ProtectedPage() {
  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <Link
        href="/"
        className="text-sm text-blue-500"
      >
        TOPページ
      </Link>
      <LogoutButton />
    </div>
  );
}
