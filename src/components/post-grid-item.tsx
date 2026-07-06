import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";

// Square thumbnail for profile grids. Accepts the minimal post shape so it works
// for both full posts and the stripped /api/me/saved items.
export function PostGridItem({
  post,
}: {
  post: { id: number; imageUrl: string; caption?: string | null };
}) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group relative aspect-square overflow-hidden bg-muted"
    >
      {post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt={post.caption || "Post"}
          fill
          sizes="(max-width: 640px) 33vw, 200px"
          className="object-cover transition-opacity group-hover:opacity-90"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <ImageOff className="size-6" />
        </div>
      )}
    </Link>
  );
}
