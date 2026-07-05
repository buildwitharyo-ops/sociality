"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";

// Temporary home placeholder — the real feed (Step 5) replaces this. The nav
// around it is now live, so this only needs to reflect the session.
export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Sociality</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : isAuthenticated ? (
          <p className="text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{user?.name}</span> (@
            {user?.username})
          </p>
        ) : (
          <p className="text-muted-foreground">You&apos;re browsing as a guest.</p>
        )}
      </div>

      {!isLoading && !isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Button asChild className="rounded-full">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
