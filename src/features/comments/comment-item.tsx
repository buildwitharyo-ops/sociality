"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { fromNow } from "@/lib/date";
import { useAuth } from "@/features/auth/hooks";
import type { Comment } from "@/lib/api";
import { useDeleteComment } from "./use-delete-comment";

export function CommentItem({ postId, comment }: { postId: number; comment: Comment }) {
  const { user } = useAuth();
  const del = useDeleteComment(postId);
  const [confirm, setConfirm] = useState(false);

  // The comments list omits `isMine`, so ownership is decided by id (quirk #4).
  const isMine = comment.author.id === user?.id;
  // Temporary optimistic comments have a negative id — no delete until confirmed.
  const isOptimistic = comment.id < 0;

  return (
    <div className="flex gap-3">
      <Link href={`/profile/${comment.author.username}`} className="shrink-0">
        <UserAvatar name={comment.author.name} avatarUrl={comment.author.avatarUrl} size="sm" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <Link
            href={`/profile/${comment.author.username}`}
            className="font-semibold hover:underline"
          >
            {comment.author.username}
          </Link>{" "}
          <span className="whitespace-pre-wrap break-words">{comment.text}</span>
        </p>
        <p className="text-xs text-muted-foreground">{fromNow(comment.createdAt)}</p>
      </div>
      {isMine && !isOptimistic ? (
        <button
          type="button"
          onClick={() => setConfirm(true)}
          aria-label="Delete comment"
          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      ) : null}

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete comment?"
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={() =>
          del.mutate(comment.id, {
            onSettled: () => setConfirm(false),
          })
        }
      />
    </div>
  );
}
