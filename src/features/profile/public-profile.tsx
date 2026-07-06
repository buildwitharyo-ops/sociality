"use client";

import Link from "next/link";
import { Heart, LayoutGrid } from "lucide-react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/profile-header";
import { ShareProfileButton } from "@/components/share-profile-button";
import { PostGrid } from "@/components/post-grid";
import { FollowButton } from "@/components/follow-button";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toListProps } from "@/lib/infinite";
import { ApiError, type PublicProfile as PublicProfileData } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthGuard } from "@/features/auth/hooks";
import { useAppSelector } from "@/store/hooks";
import { selectIsFollowing } from "@/features/follows/follows-slice";
import { useToggleFollow } from "@/features/follows/use-toggle-follow";
import { useUserProfile } from "./use-user-profile";
import { useUserLikes, useUserPosts } from "./use-user-content";

export function PublicProfile({ username }: { username: string }) {
  const profile = useUserProfile(username);

  if (profile.isPending) return <PublicProfileSkeleton />;

  if (profile.isError || !profile.data) {
    const notFound = profile.error instanceof ApiError && profile.error.status === 404;
    return (
      <div className="mx-auto w-full max-w-lg p-4">
        {notFound ? (
          <EmptyState
            title="User not found"
            description="This account may not exist."
            action={
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">Back to feed</Link>
              </Button>
            }
          />
        ) : (
          <ErrorState title="Couldn't load this profile" onRetry={() => profile.refetch()} />
        )}
      </div>
    );
  }

  return <PublicProfileView profile={profile.data} />;
}

function PublicProfileView({ profile }: { profile: PublicProfileData }) {
  const queryClient = useQueryClient();
  const guard = useAuthGuard();
  const toggle = useToggleFollow(profile.username);
  const known = useAppSelector((state) => selectIsFollowing(state, profile.username));
  const isFollowing = known ?? profile.isFollowing;

  function onToggleFollow() {
    guard(() => {
      const delta = isFollowing ? -1 : 1;
      patchFollowerCount(queryClient, profile.username, delta);
      toggle.mutate(
        { username: profile.username, following: isFollowing },
        {
          onError: () => patchFollowerCount(queryClient, profile.username, -delta),
          // Replace the optimistic ±1 with the server's authoritative counts —
          // the follow response carries no count, so refetch the profile.
          onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.user(profile.username) });
            void queryClient.invalidateQueries({
              queryKey: queryKeys.userFollowers(profile.username),
            });
          },
        },
      );
    });
  }

  const action = (
    <>
      {profile.isMe ? (
        <Button asChild variant="outline" className="flex-1 rounded-full">
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>
      ) : (
        <FollowButton
          size="default"
          isFollowing={isFollowing}
          isPending={toggle.isPending}
          onClick={onToggleFollow}
          className="flex-1"
        />
      )}
      <ShareProfileButton username={profile.username} />
    </>
  );

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <ProfileHeader
        name={profile.name}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        bio={profile.bio}
        stats={profile.counts}
        statHrefs={{
          followers: `/profile/${profile.username}/followers`,
          following: `/profile/${profile.username}/following`,
        }}
        action={action}
      />

      <Tabs defaultValue="gallery" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="gallery" className="flex-1">
            <LayoutGrid className="size-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex-1">
            <Heart className="size-4" />
            Liked
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gallery" className="mt-4">
          <UserPostsTab username={profile.username} />
        </TabsContent>
        <TabsContent value="liked" className="mt-4">
          <UserLikesTab username={profile.username} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserPostsTab({ username }: { username: string }) {
  const query = useUserPosts(username);
  return (
    <PostGrid
      {...toListProps(query)}
      empty={{ icon: LayoutGrid, title: "No posts yet", description: "This user hasn't posted anything." }}
    />
  );
}

function UserLikesTab({ username }: { username: string }) {
  const query = useUserLikes(username);
  return (
    <PostGrid
      {...toListProps(query)}
      empty={{ icon: Heart, title: "No liked posts", description: "This user hasn't liked anything yet." }}
    />
  );
}

// Keep the viewed profile's follower count in step with a follow/unfollow.
function patchFollowerCount(queryClient: QueryClient, username: string, delta: number) {
  queryClient.setQueryData<PublicProfileData>(queryKeys.user(username), (old) =>
    old
      ? { ...old, counts: { ...old.counts, followers: Math.max(0, old.counts.followers + delta) } }
      : old,
  );
}

function PublicProfileSkeleton() {
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
