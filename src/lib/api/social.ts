import { apiFetch } from "./client";
import { normalizeList } from "./normalize";
import type {
  Comment,
  DeleteResult,
  FollowResult,
  LikeResult,
  Paginated,
  PageParams,
  SaveResult,
  UserChip,
} from "./types";

// Likes — POST/DELETE are idempotent; the response carries the authoritative count.
export function likePost(postId: number): Promise<LikeResult> {
  return apiFetch<LikeResult>(`/api/posts/${postId}/like`, { method: "POST" });
}

export function unlikePost(postId: number): Promise<LikeResult> {
  return apiFetch<LikeResult>(`/api/posts/${postId}/like`, { method: "DELETE" });
}

export async function getPostLikes(
  postId: number,
  params: PageParams = {},
): Promise<Paginated<UserChip>> {
  return normalizeList<UserChip>(await apiFetch(`/api/posts/${postId}/likes`, { query: params }));
}

// Saves (bookmarks).
export function savePost(postId: number): Promise<SaveResult> {
  return apiFetch<SaveResult>(`/api/posts/${postId}/save`, { method: "POST" });
}

export function unsavePost(postId: number): Promise<SaveResult> {
  return apiFetch<SaveResult>(`/api/posts/${postId}/save`, { method: "DELETE" });
}

// Follow.
export function followUser(username: string): Promise<FollowResult> {
  return apiFetch<FollowResult>(`/api/follow/${encodeURIComponent(username)}`, { method: "POST" });
}

export function unfollowUser(username: string): Promise<FollowResult> {
  return apiFetch<FollowResult>(`/api/follow/${encodeURIComponent(username)}`, { method: "DELETE" });
}

// Comments.
export async function getComments(
  postId: number,
  params: PageParams = {},
): Promise<Paginated<Comment>> {
  return normalizeList<Comment>(await apiFetch(`/api/posts/${postId}/comments`, { query: params }));
}

export function createComment(postId: number, text: string): Promise<Comment> {
  return apiFetch<Comment>(`/api/posts/${postId}/comments`, { method: "POST", body: { text } });
}

export function deleteComment(commentId: number): Promise<DeleteResult> {
  return apiFetch<DeleteResult>(`/api/comments/${commentId}`, { method: "DELETE" });
}
