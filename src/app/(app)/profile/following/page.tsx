import type { Metadata } from "next";
import { RequireAuth } from "@/features/auth/auth-guard";
import { MyFollowingList } from "@/features/follows/follow-lists";

export const metadata: Metadata = {
  title: "Following",
};

export default function MyFollowingPage() {
  return (
    <RequireAuth>
      <MyFollowingList />
    </RequireAuth>
  );
}
