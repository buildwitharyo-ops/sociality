import type { Metadata } from "next";
import { RequireGuest } from "@/features/auth/auth-guard";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <RequireGuest>
      <LoginForm />
    </RequireGuest>
  );
}
