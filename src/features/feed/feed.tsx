"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Loader2, Sparkles, Users } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { PostCardSkeletonList } from "@/components/post-skeletons";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { Post } from "@/lib/api";
import { useFeed } from "./use-feed";

function dedupeById(items: Post[]): Post[] {
  const seen = new Set<number>();
  const result: Post[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

export function Feed() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const feed = useFeed();

  const posts = useMemo(
    () => dedupeById(feed.data?.pages.flatMap((page) => page.items) ?? []),
    [feed.data],
  );

  const sentinelRef = useInfiniteScroll({
    hasMore: Boolean(feed.hasNextPage),
    isLoading: feed.isFetchingNextPage,
    onLoadMore: feed.fetchNextPage,
  });

  if (authLoading || feed.isPending) {
    return (
      <div className="mx-auto w-full max-w-md p-4">
        <PostCardSkeletonList count={3} />
      </div>
    );
  }

  if (feed.isError && posts.length === 0) {
    return (
      <div className="mx-auto w-full max-w-md p-4">
        <ErrorState title="Couldn't load your feed" onRetry={() => feed.refetch()} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={isAuthenticated ? Users : Sparkles}
        title={isAuthenticated ? "Your feed is quiet" : "Nothing here yet"}
        description={
          isAuthenticated
            ? "Follow people or share your first post to fill up your feed."
            : "Check back soon for new posts."
        }
        action={
          isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button asChild className="rounded-full">
                <Link href="/search">Find people</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/create">Create post</Link>
              </Button>
            </div>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4 p-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div ref={sentinelRef} aria-hidden className="h-px" />

      {feed.isFetchingNextPage ? (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : feed.isFetchNextPageError ? (
        <div className="flex justify-center py-4">
          <Button variant="outline" size="sm" onClick={() => feed.fetchNextPage()}>
            Try again
          </Button>
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">
          You&apos;re all caught up
        </p>
      )}
    </div>
  );
}
