"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks";

// Floating pill nav — the signature Sociality element. Shown to signed-in users
// on every screen (mobile and desktop); guests navigate via the top bar.
export function BottomNav() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur">
        <NavItem href="/" icon={Home} label="Home" active={pathname === "/"} />
        <Link
          href="/create"
          aria-label="Create post"
          className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="size-5" />
        </Link>
        <NavItem
          href="/profile"
          icon={User}
          label="Profile"
          active={pathname === "/profile" || pathname.startsWith("/profile/")}
        />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Link>
  );
}
