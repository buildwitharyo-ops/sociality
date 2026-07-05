import type { QueryClient } from "@tanstack/react-query";
import type { Post } from "@/lib/api";

export type PostPatch = Partial<Pick<Post, "likedByMe" | "likeCount" | "commentCount">>;

// The same post can sit in many caches at once — the feed, the explore list, the
// detail view, profile grids. This patches the post wherever it appears (across
// infinite queries, single lists, and single-post caches) and keeps references
// stable for anything it doesn't touch, so unrelated queries don't re-render.
export function patchPostInCaches(
  queryClient: QueryClient,
  postId: number,
  patch: PostPatch,
): void {
  queryClient.setQueriesData({}, (data: unknown) => patchData(data, postId, patch));
}

function patchData(data: unknown, postId: number, patch: PostPatch): unknown {
  if (!data || typeof data !== "object") return data;
  const record = data as Record<string, unknown>;

  // Infinite query: { pages: Page[], pageParams }
  if (Array.isArray(record.pages)) {
    let changed = false;
    const pages = record.pages.map((page) => {
      const next = patchPage(page, postId, patch);
      if (next !== page) changed = true;
      return next;
    });
    return changed ? { ...record, pages } : data;
  }

  // Single page: { items: Post[], pagination }
  if (Array.isArray(record.items)) {
    return patchPage(data, postId, patch);
  }

  // Single post
  if (record.id === postId && "likeCount" in record) {
    return { ...record, ...patch };
  }

  return data;
}

function patchPage(page: unknown, postId: number, patch: PostPatch): unknown {
  if (!page || typeof page !== "object") return page;
  const record = page as Record<string, unknown>;
  if (!Array.isArray(record.items)) return page;

  let changed = false;
  const items = record.items.map((item) => {
    if (item && typeof item === "object" && (item as Post).id === postId && "likeCount" in item) {
      changed = true;
      return { ...item, ...patch };
    }
    return item;
  });

  return changed ? { ...record, items } : page;
}
