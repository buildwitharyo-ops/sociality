"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getMyFollowers,
  getMyFollowing,
  getUserFollowers,
  getUserFollowing,
  type Paginated,
  type UserChip,
} from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

const PAGE_SIZE = 20;

function getNextPage(lastPage: Paginated<UserChip>) {
  const { page, totalPages } = lastPage.pagination;
  return page < totalPages ? page + 1 : undefined;
}

export function useMyFollowers() {
  return useInfiniteQuery({
    queryKey: queryKeys.myFollowers,
    queryFn: ({ pageParam }) => getMyFollowers({ page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

export function useMyFollowing() {
  return useInfiniteQuery({
    queryKey: queryKeys.myFollowing,
    queryFn: ({ pageParam }) => getMyFollowing({ page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

export function useUserFollowers(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userFollowers(username),
    queryFn: ({ pageParam }) => getUserFollowers(username, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

export function useUserFollowing(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.userFollowing(username),
    queryFn: ({ pageParam }) => getUserFollowing(username, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}
