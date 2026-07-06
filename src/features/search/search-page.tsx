"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Search, SearchX, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserList } from "@/components/user-list";
import { EmptyState } from "@/components/empty-state";
import { toListProps } from "@/lib/infinite";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "./use-search";

export function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-lg p-4" />}>
      <SearchView />
    </Suspense>
  );
}

function SearchView() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const debounced = useDebounce(query, 300);
  const search = useSearch(debounced);
  const isIdle = query.trim().length === 0;
  // Results are settling (waiting on the debounce, or fetching) — signal it so
  // the currently-shown rows aren't mistaken for the current query's results.
  const isSyncing = !isIdle && (query.trim() !== debounced.trim() || search.isFetching);

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for people"
          aria-label="Search for people"
          autoFocus
          className="rounded-full pl-9 pr-9"
        />
        {isSyncing ? (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {isIdle ? (
        <EmptyState
          icon={Search}
          title="Search for people"
          description="Find friends by their name or username."
        />
      ) : (
        <div className={cn("transition-opacity", isSyncing && "opacity-60")}>
          <UserList
            {...toListProps(search)}
            empty={{ icon: SearchX, title: "No results found", description: "Change your keyword." }}
          />
        </div>
      )}
    </div>
  );
}
