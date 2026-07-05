import { notFound } from "next/navigation";
import { PostDetail } from "@/features/posts/post-detail";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  return <PostDetail id={postId} />;
}
