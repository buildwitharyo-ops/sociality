"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { SearchBar } from "@/components/search-bar";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks";

export function TopNav() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4">
        <Link href="/" aria-label="Sociality home" className="shrink-0">
          <Logo className="text-lg" />
        </Link>

        <div className="flex flex-1 justify-center">
          <SearchBar className="hidden w-full max-w-sm sm:block" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="sm:hidden">
            <Link href="/search" aria-label="Search">
              <Search className="size-5" />
            </Link>
          </Button>

          {isLoading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : isAuthenticated && user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
