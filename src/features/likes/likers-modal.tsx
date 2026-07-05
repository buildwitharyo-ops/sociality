"use client";

import { Users } from "lucide-react";
import { UserChip } from "@/components/user-chip";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLikers } from "./use-likers";

export function LikersModal({
  postId,
  open,
  onOpenChange,
}: {
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const likers = useLikers(postId, open);
  const users = likers.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {likers.isPending ? (
            Array.from({ length: 5 }).map((_, index) => <LikerSkeleton key={index} />)
          ) : likers.isError ? (
            <ErrorState onRetry={() => likers.refetch()} />
          ) : users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No likes yet"
              description="Be the first to like this post."
            />
          ) : (
            <>
              {users.map((user) => (
                <UserChip key={user.id} user={user} />
              ))}
              {likers.hasNextPage ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  disabled={likers.isFetchingNextPage}
                  onClick={() => likers.fetchNextPage()}
                >
                  {likers.isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LikerSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-2.5 w-16" />
      </div>
    </div>
  );
}
