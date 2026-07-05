"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPost } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAppSelector } from "@/store/hooks";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const username = useAppSelector((state) => state.auth.user?.username);

  return useMutation({
    mutationFn: (input: { image: File; caption: string }) => createPost(input),
    onSuccess: () => {
      toast.success("Post shared");
      // Refresh everywhere the new post should appear.
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed });
      void queryClient.invalidateQueries({ queryKey: queryKeys.explore });
      void queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
      if (username) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.userPosts(username) });
      }
      router.push("/");
    },
    onError: () => {
      toast.error("Couldn't share your post. Please try again.");
    },
  });
}
