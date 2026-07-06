// Flattens a TanStack infinite query into the prop shape our list/grid
// components take, so each list is a one-liner:
//   <PostGrid {...toListProps(query)} empty={...} />
//   <UserList {...toListProps(query)} empty={...} />
type InfiniteListQuery<T> = {
  data?: { pages: Array<{ items: T[] }> };
  isPending: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
};

export function toListProps<T>(query: InfiniteListQuery<T>) {
  return {
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchNextPageError: query.isFetchNextPageError,
    onLoadMore: query.fetchNextPage,
    onRetry: query.refetch,
  };
}
