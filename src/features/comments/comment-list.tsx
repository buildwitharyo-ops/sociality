"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentItem } from "./comment-item";
import { useComments } from "./use-comments";

export function CommentList({ postId }: { postId: number }) {
  const comments = useComments(postId);
  const items = comments.data?.pages.flatMap((page) => page.items) ?? [];

  if (comments.isPending) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="size-6 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.isError && items.length === 0) {
    return <ErrorState onRetry={() => comments.refetch()} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="No comments yet"
        description="Start the conversation."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((comment) => (
        <CommentItem key={comment.id} postId={postId} comment={comment} />
      ))}
      {comments.hasNextPage ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => comments.fetchNextPage()}
          disabled={comments.isFetchingNextPage}
          className="w-full text-muted-foreground"
        >
          {comments.isFetchingNextPage ? "Loading…" : "Load more comments"}
        </Button>
      ) : null}
    </div>
  );
}
