"use client";

import { useMutation } from "@tanstack/react-query";
import { savePost, unsavePost } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setSaved } from "./saved-slice";

// Optimistic save toggle. Saved state lives in the Redux `saved` slice (the API
// has no per-post saved flag), flipped immediately and reconciled on settle.
export function useToggleSave() {
  const dispatch = useAppDispatch();

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
    },
  });
}
