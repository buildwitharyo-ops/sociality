"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyPosts, type Paginated, type Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 12;

export function useMyPosts(enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.myPosts,
    queryFn: ({ pageParam }) => getMyPosts({ page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Paginated<Post>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
  });
}
