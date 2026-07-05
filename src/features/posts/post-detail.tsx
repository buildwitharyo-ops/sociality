"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { LikeButton } from "@/components/like-button";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fromNow } from "@/lib/date";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/features/auth/hooks";
import { CommentComposer } from "@/features/comments/comment-composer";
import { CommentList } from "@/features/comments/comment-list";
import { LikersModal } from "@/features/likes/likers-modal";
import { usePost } from "./use-post";
import { useDeletePost } from "./use-delete-post";

export function PostDetail({ id }: { id: number }) {
  const { user } = useAuth();
  const post = usePost(id);
  const deletePost = useDeletePost();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [likersOpen, setLikersOpen] = useState(false);

  if (post.isPending) {
    return <PostDetailSkeleton />;
  }

  // Only show the error/not-found state when we have nothing to render — a
  // failed background refresh shouldn't discard a usable cached copy.
  if (!post.data) {
    const notFound = post.error instanceof ApiError && post.error.status === 404;
    return (
      <div className="mx-auto w-full max-w-md p-4">
        <EmptyState
          title={notFound ? "Post not found" : "Couldn't load this post"}
          description={
            notFound
              ? "This post may have been deleted."
              : "Something went wrong. Please try again."
          }
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Back to feed</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const data = post.data;
  const isOwner = data.author.id === user?.id;

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card lg:grid lg:grid-cols-2">
        <div className="relative aspect-square bg-muted">
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.caption || "Post image"}
              fill
              sizes="(max-width: 1024px) 100vw, 512px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Image unavailable
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <header className="flex items-center gap-3 border-b border-border p-3">
            <Link href={`/profile/${data.author.username}`}>
              <UserAvatar name={data.author.name} avatarUrl={data.author.avatarUrl} />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/profile/${data.author.username}`}
                className="block truncate text-sm font-semibold hover:underline"
              >
                {data.author.username}
              </Link>
              <p className="text-xs text-muted-foreground">{fromNow(data.createdAt)}</p>
            </div>
            {isOwner ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Post options">
                    <MoreHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
                    <Trash2 className="size-4" />
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 lg:max-h-[420px]">
            {data.caption ? (
              <p className="text-sm">
                <Link
                  href={`/profile/${data.author.username}`}
                  className="font-semibold hover:underline"
                >
                  {data.author.username}
                </Link>{" "}
                <span className="whitespace-pre-wrap break-words">{data.caption}</span>
              </p>
            ) : null}
            <CommentList postId={id} />
          </div>

          <div className="space-y-3 border-t border-border p-3">
            <div className="flex items-center gap-4">
              <LikeButton post={data} showCount={false} />
              <ShareButton postId={id} />
              <SaveButton postId={id} className="ml-auto" />
            </div>
            {data.likeCount > 0 ? (
              <button
                type="button"
                onClick={() => setLikersOpen(true)}
                className="text-sm font-semibold hover:underline"
              >
                {data.likeCount} {data.likeCount === 1 ? "like" : "likes"}
              </button>
            ) : null}
            <CommentComposer postId={id} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete post?"
        description="This can't be undone."
        confirmLabel="Delete"
        destructive
        loading={deletePost.isPending}
        onConfirm={() => deletePost.mutate(id)}
      />

      <LikersModal postId={id} open={likersOpen} onOpenChange={setLikersOpen} />
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card lg:grid lg:grid-cols-2">
        <Skeleton className="aspect-square rounded-none" />
        <div className="space-y-4 p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
