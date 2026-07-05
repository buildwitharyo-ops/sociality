"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bookmark, Heart, ImageOff, LayoutGrid, Share2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile-header";
import { PostGrid, toGridProps } from "@/components/post-grid";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/store/hooks";
import { seedSaved } from "@/features/posts/saved-slice";
import { useMyLikes } from "@/features/likes/use-my-likes";
import { useMe } from "./use-me";
import { useMyPosts } from "./use-my-posts";
import { useMySaved } from "./use-my-saved";

export function MyProfile() {
  const me = useMe();

  if (me.isPending) {
    return <ProfileSkeleton />;
  }

  if (me.isError || !me.data) {
    return (
      <div className="mx-auto w-full max-w-lg p-4">
        <ErrorState title="Couldn't load your profile" onRetry={() => me.refetch()} />
      </div>
    );
  }

  const profile = me.data;

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <ProfileHeader
        name={profile.name}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        bio={profile.bio}
        stats={profile.stats}
        statHrefs={{ followers: "/profile/followers", following: "/profile/following" }}
        action={
          <>
            <Button asChild className="flex-1 rounded-full">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
            <ShareProfileButton username={profile.username} />
          </>
        }
      />

      <Tabs defaultValue="gallery" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="gallery" className="flex-1">
            <LayoutGrid className="size-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            <Bookmark className="size-4" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex-1">
            <Heart className="size-4" />
            Liked
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gallery" className="mt-4">
          <GalleryTab />
        </TabsContent>
        <TabsContent value="saved" className="mt-4">
          <SavedTab />
        </TabsContent>
        <TabsContent value="liked" className="mt-4">
          <LikedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GalleryTab() {
  const query = useMyPosts();
  return (
    <PostGrid
      {...toGridProps(query)}
      empty={{
        icon: ImageOff,
        title: "Your story starts here",
        description: "Share your first post and let the world see your moments.",
        action: (
          <Button asChild className="rounded-full">
            <Link href="/create">Upload My First Post</Link>
          </Button>
        ),
      }}
    />
  );
}

function SavedTab() {
  const dispatch = useAppDispatch();
  const query = useMySaved();

  // Seed the saved slice so bookmark buttons elsewhere reflect these saves.
  useEffect(() => {
    const ids = query.data?.pages.flatMap((page) => page.items.map((post) => post.id)) ?? [];
    if (ids.length) dispatch(seedSaved(ids));
  }, [query.data, dispatch]);

  return (
    <PostGrid
      {...toGridProps(query)}
      empty={{
        icon: Bookmark,
        title: "No saved posts yet",
        description: "Posts you save will show up here.",
      }}
    />
  );
}

function LikedTab() {
  const query = useMyLikes();
  return (
    <PostGrid
      {...toGridProps(query)}
      empty={{
        icon: Heart,
        title: "No liked posts yet",
        description: "Posts you like will show up here.",
      }}
    />
  );
}

function ShareProfileButton({ username }: { username: string }) {
  function copyLink() {
    const url = `${window.location.origin}/profile/${username}`;
    void navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("Profile link copied"))
      .catch(() => toast.error("Couldn't copy the link"));
  }

  return (
    <Button variant="outline" size="icon" onClick={copyLink} aria-label="Share profile" className="rounded-full">
      <Share2 className="size-4" />
    </Button>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full sm:size-20" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
