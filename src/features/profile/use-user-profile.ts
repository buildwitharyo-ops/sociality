"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.user(username),
    queryFn: () => getUserProfile(username),
  });
}
