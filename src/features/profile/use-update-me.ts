"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateMe, type MyProfile, type UpdateMeInput, type UpdatedProfile } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSession } from "@/features/auth/auth-slice";

export function useUpdateMe() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  return useMutation({
    mutationFn: (input: UpdateMeInput | FormData) => updateMe(input),
    onSuccess: (updated: UpdatedProfile) => {
      toast.success("Profile updated");

      // Reflect the edit in the profile cache immediately (keep the stats), then
      // refetch to reconcile.
      queryClient.setQueryData<MyProfile>(queryKeys.me, (old) =>
        old
          ? {
              ...old,
              name: updated.name,
              username: updated.username,
              phone: updated.phone,
              bio: updated.bio,
              avatarUrl: updated.avatarUrl,
            }
          : old,
      );
      // exact: true — queryKeys.me is ["me"], which would otherwise prefix-match
      // the ["me", ...] list queries (posts/likes/saved/…) and refetch them all.
      void queryClient.invalidateQueries({ queryKey: queryKeys.me, exact: true });

      // Keep the nav (avatar/name) and persisted session in sync.
      if (token) {
        dispatch(
          setSession({
            token,
            user: {
              id: updated.id,
              name: updated.name,
              username: updated.username,
              email: updated.email,
              phone: updated.phone,
              avatarUrl: updated.avatarUrl,
            },
          }),
        );
      }

      router.push("/profile");
    },
  });
}
