import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import authReducer, { clearSession, setSession } from "@/features/auth/auth-slice";
import savedReducer from "@/features/posts/saved-slice";
import followsReducer from "@/features/follows/follows-slice";
import { clearStoredSession, saveSession } from "@/features/auth/session";

// Persist the session to storage whenever it changes, so the token survives a
// refresh and the API client can read it.
const sessionListener = createListenerMiddleware();
sessionListener.startListening({
  actionCreator: setSession,
  effect: (action) => saveSession(action.payload),
});
sessionListener.startListening({
  actionCreator: clearSession,
  effect: () => clearStoredSession(),
});

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      saved: savedReducer,
      follows: followsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(sessionListener.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
