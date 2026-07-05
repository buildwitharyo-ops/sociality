import type { Metadata } from "next";
import { RequireAuth } from "@/features/auth/auth-guard";
import { CreatePost } from "@/features/posts/create-post";

export const metadata: Metadata = {
  title: "Add Post",
};

export default function CreatePage() {
  return (
    <RequireAuth>
      <CreatePost />
    </RequireAuth>
  );
}
