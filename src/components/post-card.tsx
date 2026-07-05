"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/user-avatar";
import { LikeButton } from "@/components/like-button";
import { SaveButton } from "@/components/save-button";
import { fromNow } from "@/lib/date";
import type { Post } from "@/lib/api";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center gap-3 p-3">
        <Link href={`/profile/${post.author.username}`}>
          <UserAvatar name={post.author.name} avatarUrl={post.author.avatarUrl} />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/profile/${post.author.username}`}
            className="block truncate text-sm font-semibold hover:underline"
          >
            {post.author.username}
          </Link>
          <p className="text-xs text-muted-foreground">{fromNow(post.createdAt)}</p>
        </div>
      </header>

      <Link href={`/posts/${post.id}`} className="relative block aspect-square w-full bg-muted">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.caption || "Post image"}
            fill
            sizes="(max-width: 640px) 100vw, 480px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Image unavailable
          </div>
        )}
      </Link>

      <div className="flex items-center gap-4 p-3">
        <LikeButton post={post} />
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <MessageCircle className="size-5" />
          <span className="tabular-nums">{post.commentCount}</span>
        </Link>
        <ShareButton postId={post.id} />
        <SaveButton postId={post.id} className="ml-auto" />
      </div>

      <Caption username={post.author.username} caption={post.caption} />
    </article>
  );
}

function ShareButton({ postId }: { postId: number }) {
  function copyLink() {
    const url = `${window.location.origin}/posts/${postId}`;
    void navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Couldn't copy the link"));
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      aria-label="Copy link to post"
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      <Send className="size-5" />
    </button>
  );
}

function Caption({ username, caption }: { username: string; caption: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!caption) return null;

  const isLong = caption.length > 120;
  const text = !expanded && isLong ? `${caption.slice(0, 120).trimEnd()}…` : caption;

  return (
    <div className="px-3 pb-3 text-sm">
      <Link href={`/profile/${username}`} className="font-semibold hover:underline">
        {username}
      </Link>{" "}
      <span className="whitespace-pre-wrap">{text}</span>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="ml-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}
