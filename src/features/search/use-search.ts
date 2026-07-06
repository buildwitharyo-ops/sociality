"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { searchUsers, type Paginated, type UserChip } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 20;

// Searches users by name/username. Disabled for an empty query — the API
// requires at least 1 char and 400s on an empty `q` (quirk #7).
export function useSearch(query: string) {
  const q = query.trim();

  return useInfiniteQuery({
    queryKey: queryKeys.search(q),
    queryFn: ({ pageParam }) => searchUsers(q, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Paginated<UserChip>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: q.length >= 1,
  });
}
