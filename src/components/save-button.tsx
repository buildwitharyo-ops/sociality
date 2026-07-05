"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/features/auth/hooks";
import { useAppSelector } from "@/store/hooks";
import { selectIsSaved } from "@/features/posts/saved-slice";
import { useToggleSave } from "@/features/posts/use-toggle-save";

export function SaveButton({ postId, className }: { postId: number; className?: string }) {
  const saved = useAppSelector((state) => selectIsSaved(state, postId));
  const toggle = useToggleSave();
  const guard = useAuthGuard();

  return (
    <button
      type="button"
      onClick={() => guard(() => toggle.mutate({ postId, saved }))}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Save"}
      className={cn("text-muted-foreground transition-colors hover:text-foreground", className)}
    >
      <Bookmark className={cn("size-5", saved && "fill-foreground text-foreground")} />
    </button>
  );
}
