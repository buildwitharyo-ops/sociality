import { clearStoredToken, getStoredToken, setStoredToken, type AuthUser } from "@/lib/api";

// Session persistence. The token is owned by the API layer (token.ts, so the
// client can read it); the user object is stored alongside it here.

const USER_STORAGE_KEY = "sociality.user";

export type StoredSession = { token: string; user: AuthUser };

export function saveSession({ token, user }: StoredSession): void {
  setStoredToken(token);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore write failures.
  }
}

export function loadSession(): StoredSession | null {
  const token = getStoredToken();
  if (typeof window === "undefined" || !token) return null;
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return { token, user: JSON.parse(raw) as AuthUser };
  } catch {
    return null;
  }
}

export function clearStoredSession(): void {
  clearStoredToken();
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
