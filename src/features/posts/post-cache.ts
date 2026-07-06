import type { QueryClient } from "@tanstack/react-query";
import type { Post } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export type PostPatch = Partial<Pick<Post, "likedByMe" | "likeCount" | "commentCount">>;
type PostUpdater = (post: Post) => Post;

// The same post can sit in many caches at once — the feed, the explore list, the
// detail view, profile grids. `updatePostInCaches` applies an updater to the post
// wherever it appears (across infinite queries, single lists, and single-post
// caches), keeping references stable for anything it doesn't touch.
function updatePostInCaches(queryClient: QueryClient, postId: number, update: PostUpdater): void {
  queryClient.setQueriesData({}, (data: unknown) => updateData(data, postId, update));
}

// Merge a fixed patch into the post (absolute values — used for like state).
export function patchPostInCaches(
  queryClient: QueryClient,
  postId: number,
  patch: PostPatch,
): void {
  updatePostInCaches(queryClient, postId, (post) => ({ ...post, ...patch }));
}

// Adjust commentCount relative to EACH cache's own value, so caches that have
// drifted apart don't get clobbered by a single broadcast value.
export function bumpCommentCount(queryClient: QueryClient, postId: number, delta: number): void {
  updatePostInCaches(queryClient, postId, (post) => ({
    ...post,
    commentCount: Math.max(0, post.commentCount + delta),
  }));
}

// Remove a post from every list cache (used after a delete).
export function removePostFromCaches(queryClient: QueryClient, postId: number): void {
  queryClient.setQueriesData({}, (data: unknown) => removeData(data, postId));
}

// Find a post in any *list* cache (feed/explore/profile grids). Used to correct
// the detail endpoint's always-false `likedByMe` from a trustworthy list copy.
// Deliberately ignores single-post caches to avoid reading a stale detail value.
export function findPostInCaches(queryClient: QueryClient, postId: number): Post | undefined {
  for (const [, data] of queryClient.getQueriesData({})) {
    const found = findInLists(data, postId);
    if (found) return found;
  }
  return undefined;
}

// The post's current cached state, wherever it lives — the single-post detail
// cache first, then any list cache. Lets the like toggle read the up-to-date
// state instead of a possibly-stale click-time prop.
export function readCachedPost(queryClient: QueryClient, postId: number): Post | undefined {
  const detail = queryClient.getQueryData<Post>(queryKeys.post(postId));
  if (detail && typeof detail === "object" && "likeCount" in detail) return detail;
  return findPostInCaches(queryClient, postId);
}

function updateData(data: unknown, postId: number, update: PostUpdater): unknown {
  if (!data || typeof data !== "object") return data;
  const record = data as Record<string, unknown>;

  if (Array.isArray(record.pages)) {
    let changed = false;
    const pages = record.pages.map((page) => {
      const next = updatePage(page, postId, update);
      if (next !== page) changed = true;
      return next;
    });
    return changed ? { ...record, pages } : data;
  }

  if (Array.isArray(record.items)) {
    return updatePage(data, postId, update);
  }

  if (record.id === postId && "likeCount" in record) {
    return update(record as unknown as Post);
  }

  return data;
}

function updatePage(page: unknown, postId: number, update: PostUpdater): unknown {
  if (!page || typeof page !== "object") return page;
  const record = page as Record<string, unknown>;
  if (!Array.isArray(record.items)) return page;

  let changed = false;
  const items = record.items.map((item) => {
    if (item && typeof item === "object" && (item as Post).id === postId && "likeCount" in item) {
      changed = true;
      return update(item as Post);
    }
    return item;
  });

  return changed ? { ...record, items } : page;
}

function removeData(data: unknown, postId: number): unknown {
  if (!data || typeof data !== "object") return data;
  const record = data as Record<string, unknown>;

  if (Array.isArray(record.pages)) {
    let changed = false;
    const pages = record.pages.map((page) => {
      const next = removeFromPage(page, postId);
      if (next !== page) changed = true;
      return next;
    });
    return changed ? { ...record, pages } : data;
  }

  if (Array.isArray(record.items)) {
    return removeFromPage(data, postId);
  }

  return data;
}

function removeFromPage(page: unknown, postId: number): unknown {
  if (!page || typeof page !== "object") return page;
  const record = page as Record<string, unknown>;
  if (!Array.isArray(record.items)) return page;

  const items = record.items.filter(
    (item) => !(item && typeof item === "object" && (item as Post).id === postId),
  );
  return items.length !== record.items.length ? { ...record, items } : page;
}

function findInLists(data: unknown, postId: number): Post | undefined {
  if (!data || typeof data !== "object") return undefined;
  const record = data as Record<string, unknown>;

  if (Array.isArray(record.pages)) {
    for (const page of record.pages) {
      const found = findInPage(page, postId);
      if (found) return found;
    }
    return undefined;
  }

  if (Array.isArray(record.items)) {
    return findInPage(data, postId);
  }

  return undefined;
}

function findInPage(page: unknown, postId: number): Post | undefined {
  if (!page || typeof page !== "object") return undefined;
  const items = (page as Record<string, unknown>).items;
  if (!Array.isArray(items)) return undefined;
  return items.find(
    (item): item is Post =>
      Boolean(item) && typeof item === "object" && (item as Post).id === postId && "likedByMe" in item,
  );
}
