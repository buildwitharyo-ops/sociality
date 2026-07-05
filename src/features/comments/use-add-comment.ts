"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, type Comment } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/hooks";
import { bumpCommentCount } from "@/features/posts/post-cache";
import { prependComment, replaceComment, type CommentPages } from "./comment-cache";

// Unique, collision-free temp ids for optimistic comments (negative, decrementing).
let lastTempId = 0;
function nextTempId(): number {
  lastTempId -= 1;
  return lastTempId;
}

// Optimistically prepend the comment (temp id) and bump the post's comment count;
// on success swap the temp for the real one, on error roll back. When the comments
// query isn't loaded yet, skip the optimistic write and reconcile via a refetch.
export function useAddComment(postId: number) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (text: string) => createComment(postId, text),
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.comments(postId) });
      const previous = queryClient.getQueryData<CommentPages>(queryKeys.comments(postId));
      const hadData = previous !== undefined;
      const tempId = nextTempId();

      if (hadData) {
        const optimistic: Comment = {
          id: tempId,
          text,
          createdAt: new Date().toISOString(),
          author: {
            id: user?.id ?? 0,
            username: user?.username ?? "",
            name: user?.name ?? "",
            avatarUrl: user?.avatarUrl ?? null,
          },
          isMine: true,
        };
        queryClient.setQueryData<CommentPages>(queryKeys.comments(postId), (old) =>
          prependComment(old, optimistic),
        );
        bumpCommentCount(queryClient, postId, 1);
      }

      return { previous, tempId, hadData };
    },
    onError: (_error, _text, context) => {
      if (!context?.hadData) return;
      queryClient.setQueryData(queryKeys.comments(postId), context.previous);
      bumpCommentCount(queryClient, postId, -1);
    },
    onSuccess: (real, _text, context) => {
      if (context?.hadData) {
        queryClient.setQueryData<CommentPages>(queryKeys.comments(postId), (old) =>
          replaceComment(old, context.tempId, real),
        );
      } else {
        // Nothing was shown optimistically — pull the truth from the server.
        void queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
        void queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
      }
    },
  });
}
