"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "@/lib/api";
import { patchPostInCaches, readCachedPost } from "./post-cache";

export type LikeablePost = { id: number; likedByMe: boolean; likeCount: number };

// Optimistic like toggle. Pass the post id to `scope` so rapid toggles for the
// SAME post serialize instead of racing. The current state is read from the
// cache (not the click-time prop, which can be stale after a double-click):
// onMutate flips the cached value, and the request is chosen to match the
// resulting target state.
export function useToggleLike(scopePostId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    scope: scopePostId != null ? { id: `like:${scopePostId}` } : undefined,
    mutationFn: (post: LikeablePost) => {
      // onMutate has already flipped the cache to the target — match it.
      const target = readCachedPost(queryClient, post.id) ?? post;
      return target.likedByMe ? likePost(post.id) : unlikePost(post.id);
    },
    onMutate: async (post) => {
      await queryClient.cancelQueries();
      const previous = queryClient.getQueriesData({});
      const current = readCachedPost(queryClient, post.id) ?? post;
      patchPostInCaches(queryClient, post.id, {
        likedByMe: !current.likedByMe,
        likeCount: current.likeCount + (current.likedByMe ? -1 : 1),
      });
      return { previous };
    },
    onError: (_error, _post, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: (result, post) => {
      patchPostInCaches(queryClient, post.id, {
        likedByMe: result.liked,
        likeCount: result.likeCount,
      });
    },
  });
}
