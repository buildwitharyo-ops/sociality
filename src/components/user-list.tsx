"use client";

import type { ComponentType, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { UserChip } from "@/components/user-chip";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { UserChip as UserChipData } from "@/lib/api";

export type UserListProps = {
  items: UserChipData[];
  isPending: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError?: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  empty: {
    icon?: ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    action?: ReactNode;
  };
};

// Reusable paginated list of UserChips with its own loading / empty / error
// states. Powers the "Liked by" surfaces and the followers/following pages.
export function UserList({
  items,
  isPending,
  isError,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError = false,
  onLoadMore,
  onRetry,
  empty,
}: UserListProps) {
  const sentinelRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore,
    disabled: isFetchNextPageError,
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError && items.length === 0) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={empty.icon}
        title={empty.title}
        description={empty.description}
        action={empty.action}
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((user) => (
        <UserChip key={user.id} user={user} />
      ))}
      <div ref={sentinelRef} aria-hidden className="h-px" />
      {isFetchingNextPage ? (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : isFetchNextPageError ? (
        <div className="flex justify-center py-4">
          <Button variant="outline" size="sm" onClick={onLoadMore}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
