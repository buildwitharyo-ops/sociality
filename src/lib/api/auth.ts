import { apiFetch } from "./client";
import type { AuthResult } from "./types";

export type RegisterInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export function register(input: RegisterInput): Promise<AuthResult> {
  return apiFetch<AuthResult>("/api/auth/register", { method: "POST", body: input });
}

export function login(input: LoginInput): Promise<AuthResult> {
  return apiFetch<AuthResult>("/api/auth/login", { method: "POST", body: input });
}
