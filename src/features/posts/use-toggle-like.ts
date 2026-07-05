"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "@/lib/api";
import { patchPostInCaches } from "./post-cache";

export type LikeablePost = { id: number; likedByMe: boolean; likeCount: number };

// Optimistic like toggle. Flips the post in every cache immediately, rolls back
// on error, and reconciles with the server's authoritative count on success.
export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: LikeablePost) =>
      post.likedByMe ? unlikePost(post.id) : likePost(post.id),
    onMutate: async (post) => {
      // Stop any in-flight refetch from overwriting the optimistic patch.
      await queryClient.cancelQueries();
      // Snapshot the caches so we can restore them exactly on error.
      const previous = queryClient.getQueriesData({});
      patchPostInCaches(queryClient, post.id, {
        likedByMe: !post.likedByMe,
        likeCount: post.likeCount + (post.likedByMe ? -1 : 1),
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
