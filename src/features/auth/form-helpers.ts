import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api";

const GENERIC_ERROR = "Something went wrong. Please try again.";

// Map an ApiError from a form submit back onto the UI:
// - 400 field-validation array → onto the matching inputs
// - 401 / message-only 400 (e.g. "Invalid credentials", "Email already in use")
//   → a single form-level message
export function applyApiError<T extends FieldValues>(
  error: unknown,
  knownFields: readonly Path<T>[],
  setFieldError: UseFormSetError<T>,
  setFormError: (message: string) => void,
): void {
  if (!(error instanceof ApiError)) {
    setFormError(GENERIC_ERROR);
    return;
  }

  const fields = error.fields ?? [];
  let mapped = 0;
  for (const field of fields) {
    if ((knownFields as readonly string[]).includes(field.path)) {
      setFieldError(field.path as Path<T>, { message: field.message });
      mapped += 1;
    }
  }

  if (mapped === 0) {
    setFormError(error.message || GENERIC_ERROR);
  }
}

// Read a validated internal `returnTo` path from the current URL (client only).
export function getReturnTo(fallback = "/"): string {
  if (typeof window === "undefined") return fallback;
  const value = new URLSearchParams(window.location.search).get("returnTo");
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return fallback;
}
