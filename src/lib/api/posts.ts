import { apiFetch } from "./client";
import { normalizeList } from "./normalize";
import type { DeleteResult, Paginated, PageParams, Post } from "./types";

/** Public global timeline — works signed out. */
export async function getPosts(params: PageParams = {}): Promise<Paginated<Post>> {
  return normalizeList<Post>(await apiFetch("/api/posts", { query: params }));
}

/** Private personalized feed — self + people you follow. */
export async function getFeed(params: PageParams = {}): Promise<Paginated<Post>> {
  return normalizeList<Post>(await apiFetch("/api/feed", { query: params }));
}

export function getPost(id: number): Promise<Post> {
  return apiFetch<Post>(`/api/posts/${id}`);
}

export function createPost(input: { image: File; caption: string }): Promise<Post> {
  const form = new FormData();
  form.append("image", input.image);
  form.append("caption", input.caption);
  return apiFetch<Post>("/api/posts", { method: "POST", body: form });
}

export function deletePost(id: number): Promise<DeleteResult> {
  return apiFetch<DeleteResult>(`/api/posts/${id}`, { method: "DELETE" });
}
