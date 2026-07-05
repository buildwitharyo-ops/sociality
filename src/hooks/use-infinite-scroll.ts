"use client";

import { useEffect, useRef } from "react";

// Attach the returned ref to a sentinel element at the end of a list. When it
// scrolls into view (a bit before, via rootMargin) and there's more to load,
// onLoadMore fires. Safe against double-fetching — the caller's query ignores
// concurrent calls, and we also gate on isLoading.
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return ref;
}
