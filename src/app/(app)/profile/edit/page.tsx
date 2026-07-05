import type { Metadata } from "next";
import { RequireAuth } from "@/features/auth/auth-guard";
import { EditProfile } from "@/features/profile/edit-profile";

export const metadata: Metadata = {
  title: "Edit Profile",
};

export default function EditProfilePage() {
  return (
    <RequireAuth>
      <EditProfile />
    </RequireAuth>
  );
}
