"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { bumpCommentCount } from "@/features/posts/post-cache";
import { removeComment, type CommentPages } from "./comment-cache";

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.comments(postId) });
      const previous = queryClient.getQueryData<CommentPages>(queryKeys.comments(postId));
      queryClient.setQueryData<CommentPages>(queryKeys.comments(postId), (old) =>
        removeComment(old, commentId),
      );
      bumpCommentCount(queryClient, postId, -1);
      return { previous };
    },
    onError: (_error, _commentId, context) => {
      if (!context) return;
      queryClient.setQueryData(queryKeys.comments(postId), context.previous);
      bumpCommentCount(queryClient, postId, 1);
    },
  });
}
