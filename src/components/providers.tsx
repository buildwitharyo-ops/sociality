"use client";

import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeStore } from "@/store/store";
import { makeQueryClient } from "@/lib/query-client";
import { clearSession, setSession } from "@/features/auth/auth-slice";
import { loadSession } from "@/features/auth/session";

export function Providers({ children }: { children: React.ReactNode }) {
  // Created once per client via the useState initializer — stable across renders.
  const [store] = useState(makeStore);
  const [queryClient] = useState(() => makeQueryClient(store));

  // Rehydrate the session from storage once, on the client. Until this runs the
  // status is "idle", which the guards treat as "still loading".
  useEffect(() => {
    const session = loadSession();
    store.dispatch(session ? setSession(session) : clearSession());
  }, [store]);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}
