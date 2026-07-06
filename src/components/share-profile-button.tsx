"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareProfileButton({ username }: { username: string }) {
  function copyLink() {
    const url = `${window.location.origin}/profile/${username}`;
    void navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("Profile link copied"))
      .catch(() => toast.error("Couldn't copy the link"));
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={copyLink}
      aria-label="Share profile"
      className="shrink-0 rounded-full"
    >
      <Share2 className="size-4" />
    </Button>
  );
}
