"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyLikes, type Paginated, type Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 12;

// Posts the signed-in user has liked (the profile's "Liked" tab, Step 9).
export function useMyLikes(enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.myLikes,
    queryFn: ({ pageParam }) => getMyLikes({ page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Paginated<Post>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
  });
}
