import { getStoredToken } from "./token";

// Fall back to the hosted API so the app still works when the env var isn't set
// (e.g. a fresh deploy where it hasn't been configured yet). Point somewhere else
// by setting NEXT_PUBLIC_API_BASE_URL.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://be-social-media-api-production.up.railway.app";

/** A single field error from a 400 validation response. */
export type FieldError = { path: string; message: string };

/**
 * Thrown for any non-2xx response or `{ success: false }` payload.
 * `status` is the HTTP status; `fields` is populated when the API returns a
 * validation array (so forms can map errors back onto inputs).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fields?: FieldError[];

  constructor(status: number, message: string, fields?: FieldError[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

type QueryValue = string | number | boolean | undefined | null;
export type Query = Record<string, QueryValue>;

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
};

type Envelope<T> = { success: boolean; message: string; data: T };

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function toFieldErrors(data: unknown): FieldError[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data
    .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      path: String(entry.path ?? ""),
      message: String(entry.msg ?? entry.message ?? ""),
    }));
}

/**
 * The one function that talks to the API. It attaches the base URL and Bearer
 * token, sends JSON (or leaves FormData untouched), unwraps the
 * `{ success, message, data }` envelope, and throws an `ApiError` on failure.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, signal } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const headers = new Headers();
  if (body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: isFormData
        ? (body as FormData)
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(0, "Network error — please check your connection.");
  }

  const payload = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok || !payload || payload.success === false) {
    throw new ApiError(
      response.status,
      payload?.message ?? "Something went wrong. Please try again.",
      toFieldErrors(payload?.data),
    );
  }

  return payload.data;
}
