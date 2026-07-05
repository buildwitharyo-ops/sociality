"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePost } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { removePostFromCaches } from "./post-cache";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_result, id) => {
      removePostFromCaches(queryClient, id);
      queryClient.removeQueries({ queryKey: queryKeys.post(id) });
      toast.success("Post deleted");
      router.push("/");
    },
    onError: () => {
      toast.error("Couldn't delete the post. Please try again.");
    },
  });
}
