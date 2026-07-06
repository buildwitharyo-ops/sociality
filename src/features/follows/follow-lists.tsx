"use client";

import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserList, type UserListProps } from "@/components/user-list";
import { Button } from "@/components/ui/button";
import { toListProps } from "@/lib/infinite";
import {
  useMyFollowers,
  useMyFollowing,
  useUserFollowers,
  useUserFollowing,
} from "./use-follow-lists";

function FollowListView({
  title,
  emptyTitle,
  ...listProps
}: { title: string; emptyTitle: string } & Omit<UserListProps, "empty">) {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-lg p-4">
      <header className="mb-5 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      <UserList {...listProps} empty={{ icon: Users, title: emptyTitle }} />
    </div>
  );
}

export function MyFollowersList() {
  return <FollowListView title="Followers" emptyTitle="No followers yet" {...toListProps(useMyFollowers())} />;
}

export function MyFollowingList() {
  return (
    <FollowListView
      title="Following"
      emptyTitle="Not following anyone yet"
      {...toListProps(useMyFollowing())}
    />
  );
}

export function UserFollowersList({ username }: { username: string }) {
  return (
    <FollowListView
      title="Followers"
      emptyTitle="No followers yet"
      {...toListProps(useUserFollowers(username))}
    />
  );
}

export function UserFollowingList({ username }: { username: string }) {
  return (
    <FollowListView
      title="Following"
      emptyTitle="Not following anyone yet"
      {...toListProps(useUserFollowing(username))}
    />
  );
}
