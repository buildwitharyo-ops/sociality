"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePost, unsavePost } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAppDispatch } from "@/store/hooks";
import { setSaved } from "./saved-slice";

// Optimistic save toggle. Saved state lives in the Redux `saved` slice (the API
// has no per-post saved flag), flipped immediately and reconciled on settle. On
// success we also refresh the Saved tab so its grid stays in sync.
export function useToggleSave() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, saved }: { postId: number; saved: boolean }) =>
      saved ? unsavePost(postId) : savePost(postId),
    onMutate: ({ postId, saved }) => {
      dispatch(setSaved({ postId, saved: !saved }));
    },
    onError: (_error, { postId, saved }) => {
      dispatch(setSaved({ postId, saved }));
    },
    onSuccess: (result, { postId }) => {
      dispatch(setSaved({ postId, saved: result.saved }));
      void queryClient.invalidateQueries({ queryKey: queryKeys.mySaved });
    },
  });
}
