"use client";

import { Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// "Share" is copy-link — the API exposes no share metric, so there's no count.
export function ShareButton({ postId, className }: { postId: number; className?: string }) {
  function copyLink() {
    const url = `${window.location.origin}/posts/${postId}`;
    void navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Couldn't copy the link"));
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      aria-label="Copy link to post"
      className={cn("text-muted-foreground transition-colors hover:text-foreground", className)}
    >
      <Send className="size-5" />
    </button>
  );
}
