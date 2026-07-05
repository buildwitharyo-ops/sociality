import type { Metadata } from "next";
import { RequireGuest } from "@/features/auth/auth-guard";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <RequireGuest>
      <RegisterForm />
    </RequireGuest>
  );
}
