import type { Pagination, Paginated, ProfileStats } from "./types";

// The API returns paginated lists under different keys depending on the
// endpoint — `items` (feed, my posts), `posts` (most lists), `users` (people
// lists), `comments`. These helpers collapse that into one predictable shape.

type RawList = {
  items?: unknown[];
  posts?: unknown[];
  users?: unknown[];
  comments?: unknown[];
  pagination?: Pagination;
};

export function normalizeList<T>(data: unknown): Paginated<T> {
  const raw = (data ?? {}) as RawList;
  const items = (raw.items ?? raw.posts ?? raw.users ?? raw.comments ?? []) as T[];
  return {
    items,
    pagination: raw.pagination ?? {
      page: 1,
      limit: items.length,
      total: items.length,
      totalPages: items.length ? 1 : 0,
    },
  };
}

// Own profile reports `stats { posts, ... }`; public profile reports
// `counts { post, ... }` (singular). Unify both to ProfileStats.
type RawStats = {
  post?: number;
  posts?: number;
  followers?: number;
  following?: number;
  likes?: number;
};

export function normalizeStats(data: unknown): ProfileStats {
  const raw = (data ?? {}) as RawStats;
  return {
    posts: raw.posts ?? raw.post ?? 0,
    followers: raw.followers ?? 0,
    following: raw.following ?? 0,
    likes: raw.likes ?? 0,
  };
}
