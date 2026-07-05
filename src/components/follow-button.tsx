"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Presentational — the useToggleFollow mutation is wired in where profiles live
// (Step 11). Callers pass the current state and a handler.
export function FollowButton({
  isFollowing,
  onClick,
  isPending = false,
  size = "sm",
  className,
}: {
  isFollowing: boolean;
  onClick?: () => void;
  isPending?: boolean;
  size?: "sm" | "default";
  className?: string;
}) {
  return (
    <Button
      type="button"
      size={size}
      variant={isFollowing ? "outline" : "default"}
      onClick={onClick}
      disabled={isPending}
      className={cn("rounded-full", className)}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
