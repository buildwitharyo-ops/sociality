"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostLikes, type Paginated, type UserChip } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 20;

// Who liked a post. Only fetches while the modal is open, and treats the data as
// always stale so reopening the modal reflects the current likers rather than a
// cached snapshot from a previous open.
export function useLikers(postId: number, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: queryKeys.likers(postId),
    queryFn: ({ pageParam }) => getPostLikes(postId, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Paginated<UserChip>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
    staleTime: 0,
  });
}
