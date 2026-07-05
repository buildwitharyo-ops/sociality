"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMySaved, type Paginated, type SavedPost } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 12;

export function useMySaved(enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.mySaved,
    queryFn: ({ pageParam }) => getMySaved({ page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Paginated<SavedPost>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled,
  });
}
