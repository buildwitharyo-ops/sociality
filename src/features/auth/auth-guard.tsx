"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "./hooks";

function AuthLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

// Wrap private pages. Sends signed-out visitors to /login with a returnTo so
// they land back here afterwards. Shows a loader while the session rehydrates.
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status !== "authenticated") return <AuthLoading />;
  return <>{children}</>;
}

// Wrap the login/register pages. Signed-in users get bounced to the home feed.
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status !== "unauthenticated") return <AuthLoading />;
  return <>{children}</>;
}
