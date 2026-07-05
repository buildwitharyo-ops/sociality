"use client";

import type { ComponentType, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { PostGridItem } from "@/components/post-grid-item";
import { PostGridSkeleton } from "@/components/post-skeletons";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

type GridPost = { id: number; imageUrl: string; caption?: string | null };

// Maps a TanStack infinite query onto PostGrid's props, so each profile tab is a
// one-liner: <PostGrid {...toGridProps(query)} empty={...} />.
type InfiniteGridQuery<T extends GridPost> = {
  data?: { pages: Array<{ items: T[] }> };
  isPending: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
};

export function toGridProps<T extends GridPost>(query: InfiniteGridQuery<T>) {
  return {
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchNextPageError: query.isFetchNextPageError,
    onLoadMore: query.fetchNextPage,
    onRetry: query.refetch,
  };
}

// Reusable 3-column post grid with infinite scroll and its own loading / empty /
// error states. Powers the profile tabs (Gallery / Saved / Liked) in Step 9.
export function PostGrid({
  items,
  isPending,
  isError,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError = false,
  onLoadMore,
  onRetry,
  empty,
}: {
  items: GridPost[];
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
}) {
  const sentinelRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: isFetchingNextPage,
    onLoadMore,
    disabled: isFetchNextPageError,
  });

  if (isPending) {
    return <PostGridSkeleton count={9} />;
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
    <div>
      <div className="grid grid-cols-3 gap-1">
        {items.map((post) => (
          <PostGridItem key={post.id} post={post} />
        ))}
      </div>
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
