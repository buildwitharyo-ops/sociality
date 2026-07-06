import type { Metadata } from "next";
import { RequireAuth } from "@/features/auth/auth-guard";
import { MyFollowersList } from "@/features/follows/follow-lists";

export const metadata: Metadata = {
  title: "Followers",
};

export default function MyFollowersPage() {
  return (
    <RequireAuth>
      <MyFollowersList />
    </RequireAuth>
  );
}
