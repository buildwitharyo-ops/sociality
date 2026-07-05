"use client";

import { useMutation } from "@tanstack/react-query";
import { followUser, unfollowUser } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setFollowing } from "./follows-slice";

// Optimistic follow toggle. Follow state lives in the Redux `follows` slice
// (keyed by username), flipped immediately and reconciled with the server on
// settle. Reused by profiles and follower/following lists in Step 11.
//
// Pass the username to `scope` so rapid toggles for the SAME person (even from
// different UserChip instances) run sequentially instead of racing and settling
// out of order.
export function useToggleFollow(scopeUsername?: string) {
  const dispatch = useAppDispatch();

  return useMutation({
    scope: scopeUsername ? { id: `follow:${scopeUsername}` } : undefined,
    mutationFn: ({ username, following }: { username: string; following: boolean }) =>
      following ? unfollowUser(username) : followUser(username),
    onMutate: ({ username, following }) => {
      dispatch(setFollowing({ username, following: !following }));
    },
    onError: (_error, { username, following }) => {
      dispatch(setFollowing({ username, following }));
    },
    onSuccess: (result, { username }) => {
      dispatch(setFollowing({ username, following: result.following }));
    },
  });
}
