"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
