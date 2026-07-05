"use client";

import { useEffect, useRef } from "react";

// Attach the returned ref to a sentinel element at the end of a list. When it
// scrolls into view (a bit before, via rootMargin) and there's more to load,
// onLoadMore fires. Pass `disabled` (e.g. after a next-page error) to stop
// auto-loading — otherwise a failed page would be retried in a tight loop as
// the observer keeps re-firing on the still-visible sentinel.
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  disabled = false,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasMore || disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading && !disabled) {
          onLoadMore();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, disabled]);

  return ref;
}
