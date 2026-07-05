"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed, getPosts, type Paginated, type Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/hooks";

const PAGE_SIZE = 12;

// The home timeline is adaptive: signed-in users get their personalized feed
// (self + following), guests get the public explore list. The query key follows
// the auth state, so logging in/out swaps the timeline cleanly.
export function useFeed() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  return useInfiniteQuery({
    queryKey: isAuthenticated ? queryKeys.feed : queryKeys.explore,
    queryFn: ({ pageParam }) =>
      isAuthenticated
        ? getFeed({ page: pageParam, limit: PAGE_SIZE })
        : getPosts({ page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Paginated<Post>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !authLoading,
  });
}
