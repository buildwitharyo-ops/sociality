import type { InfiniteData } from "@tanstack/react-query";
import type { Comment, Paginated } from "@/lib/api";

export type CommentPages = InfiniteData<Paginated<Comment>>;

export function prependComment(
  data: CommentPages | undefined,
  comment: Comment,
): CommentPages | undefined {
  if (!data || data.pages.length === 0) return data;
  const [first, ...rest] = data.pages;
  return { ...data, pages: [{ ...first, items: [comment, ...first.items] }, ...rest] };
}

export function replaceComment(
  data: CommentPages | undefined,
  tempId: number,
  real: Comment,
): CommentPages | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((comment) => (comment.id === tempId ? real : comment)),
    })),
  };
}

export function removeComment(
  data: CommentPages | undefined,
  commentId: number,
): CommentPages | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter((comment) => comment.id !== commentId),
    })),
  };
}
