import { apiFetch } from "./client";
import { normalizeList, normalizeStats } from "./normalize";
import type { Paginated, PageParams, Post, PublicProfile, UserChip } from "./types";

function base(username: string): string {
  return `/api/users/${encodeURIComponent(username)}`;
}

export async function searchUsers(
  q: string,
  params: PageParams = {},
): Promise<Paginated<UserChip>> {
  return normalizeList<UserChip>(
    await apiFetch("/api/users/search", { query: { q, ...params } }),
  );
}

export async function getUserProfile(username: string): Promise<PublicProfile> {
  const raw = await apiFetch<Omit<PublicProfile, "counts"> & { counts: unknown }>(base(username));
  return { ...raw, counts: normalizeStats(raw.counts) };
}

export async function getUserPosts(
  username: string,
  params: PageParams = {},
): Promise<Paginated<Post>> {
  return normalizeList<Post>(await apiFetch(`${base(username)}/posts`, { query: params }));
}

export async function getUserLikes(
  username: string,
  params: PageParams = {},
): Promise<Paginated<Post>> {
  return normalizeList<Post>(await apiFetch(`${base(username)}/likes`, { query: params }));
}

export async function getUserFollowers(
  username: string,
  params: PageParams = {},
): Promise<Paginated<UserChip>> {
  return normalizeList<UserChip>(await apiFetch(`${base(username)}/followers`, { query: params }));
}

export async function getUserFollowing(
  username: string,
  params: PageParams = {},
): Promise<Paginated<UserChip>> {
  return normalizeList<UserChip>(await apiFetch(`${base(username)}/following`, { query: params }));
}
