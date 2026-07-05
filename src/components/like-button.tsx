"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/features/auth/hooks";
import { useToggleLike, type LikeablePost } from "@/features/posts/use-toggle-like";

export function LikeButton({ post, className }: { post: LikeablePost; className?: string }) {
  const toggle = useToggleLike();
  const guard = useAuthGuard();

  return (
    <button
      type="button"
      onClick={() => guard(() => toggle.mutate(post))}
      aria-pressed={post.likedByMe}
      aria-label={post.likedByMe ? "Unlike" : "Like"}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-5 transition-colors",
          post.likedByMe && "fill-red-500 text-red-500",
        )}
      />
      <span className="tabular-nums">{post.likeCount}</span>
    </button>
  );
}
