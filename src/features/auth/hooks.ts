"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { login, register, type LoginInput, type RegisterInput } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSession, selectAuth, setSession } from "./auth-slice";

export function useAuth() {
  const auth = useAppSelector(selectAuth);
  return {
    user: auth.user,
    status: auth.status,
    isAuthenticated: auth.status === "authenticated",
    isLoading: auth.status === "idle",
  };
}

export function useLogin() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => dispatch(setSession(data)),
  });
}

export function useRegister() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: (data) => dispatch(setSession(data)),
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    dispatch(clearSession());
    queryClient.clear();
    router.replace("/login");
  };
}

// Runs a private action only when signed in; otherwise sends the guest to log in
// with a returnTo. Used by like/save/follow buttons and the comment composer.
export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (action: () => void) => {
    // Still rehydrating the session — don't bounce a possibly-signed-in user.
    if (isLoading) return;
    if (isAuthenticated) {
      action();
      return;
    }
    router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
  };
}
