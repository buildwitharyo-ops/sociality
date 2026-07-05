"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPost } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { findPostInCaches } from "./post-cache";

// Loads a single post. Works around the API quirk where GET /api/posts/:id
// always returns likedByMe:false — we seed/correct it from any trustworthy list
// copy in the cache (the like mutation keeps everything in sync afterwards).
export function usePost(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.post(id),
    queryFn: async () => {
      const post = await getPost(id);
      const cached = findPostInCaches(queryClient, id);
      return cached ? { ...post, likedByMe: cached.likedByMe } : post;
    },
    // Render instantly from a cached list copy when we have one, then refresh.
    initialData: () => findPostInCaches(queryClient, id),
    initialDataUpdatedAt: 0,
  });
}
