"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserLikes, getUserPosts, type Paginated, type Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 12;

function getNextPage(lastPage: Paginated<Post>) {
  const { page, totalPages } = lastPage.pagination;
  return page < totalPages ? page + 1 : undefined;
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userPosts(username),
    queryFn: ({ pageParam }) => getUserPosts(username, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

export function useUserLikes(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userLikes(username),
    queryFn: ({ pageParam }) => getUserLikes(username, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}
