// Where the auth token lives on the client. The API client reads it here to
// attach the Bearer header; the auth flow (login/logout) writes it here.
// All access is guarded for SSR — there's no localStorage on the server.

export const TOKEN_STORAGE_KEY = "sociality.token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore write failures (private mode, storage full, etc.).
  }
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
