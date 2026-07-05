import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/lib/api";

export type AuthStatus = "idle" | "authenticated" | "unauthenticated";

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: AuthStatus;
}

// Starts as "idle" — we don't know the session until the client rehydrates
// from storage on mount. Guards treat "idle" as "still loading".
const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = "authenticated";
    },
    clearSession(state) {
      state.token = null;
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
