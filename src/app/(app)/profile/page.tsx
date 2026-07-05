import type { Metadata } from "next";
import { RequireAuth } from "@/features/auth/auth-guard";
import { MyProfile } from "@/features/profile/my-profile";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <MyProfile />
    </RequireAuth>
  );
}
