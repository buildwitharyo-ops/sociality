"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthGuard } from "@/features/auth/hooks";
import { EmojiPicker } from "./emoji-picker";
import { useAddComment } from "./use-add-comment";

export function CommentComposer({ postId }: { postId: number }) {
  const [text, setText] = useState("");
  const addComment = useAddComment(postId);
  const guard = useAuthGuard();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    guard(() => {
      addComment.mutate(value);
      setText("");
    });
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-1">
      <EmojiPicker onSelect={(emoji) => setText((current) => current + emoji)} />
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a comment…"
        aria-label="Add a comment"
        className="flex-1 border-0 bg-transparent focus-visible:ring-0"
      />
      <Button
        type="submit"
        variant="ghost"
        disabled={!text.trim() || addComment.isPending}
        className="shrink-0 font-semibold text-primary"
      >
        Post
      </Button>
    </form>
  );
}
