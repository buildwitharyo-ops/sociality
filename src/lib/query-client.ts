import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { clearSession } from "@/features/auth/auth-slice";
import type { AppStore } from "@/store/store";

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

function isClientError(error: unknown): boolean {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}

export function makeQueryClient(store: AppStore): QueryClient {
  // A 401 on any request means the token is gone or expired — drop the session
  // so the guards send the user to log in. A failed login (no token yet) is
  // ignored, so it surfaces as a form error instead of a "logout".
  const handleUnauthorized = () => {
    if (store.getState().auth.token) {
      store.dispatch(clearSession());
    }
  };

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (isClientError(error)) return false;
          return failureCount < 2;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorized(error)) handleUnauthorized();
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isUnauthorized(error)) handleUnauthorized();
      },
    }),
  });
}
