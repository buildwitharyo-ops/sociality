"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { FollowButton } from "@/components/follow-button";
import { useAuthGuard } from "@/features/auth/hooks";
import { useAppSelector } from "@/store/hooks";
import { selectIsFollowing } from "@/features/follows/follows-slice";
import { useToggleFollow } from "@/features/follows/use-toggle-follow";
import type { UserChip as UserChipData } from "@/lib/api";

// Self-contained: the follow button reads its state from the follows slice
// (falling back to the API's isFollowedByMe) and toggles via useToggleFollow.
export function UserChip({ user }: { user: UserChipData }) {
  const guard = useAuthGuard();
  const toggle = useToggleFollow(user.username);
  const known = useAppSelector((state) => selectIsFollowing(state, user.username));
  const isFollowing = known ?? user.isFollowedByMe ?? false;

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/profile/${user.username}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </Link>
      {!user.isMe ? (
        <FollowButton
          isFollowing={isFollowing}
          isPending={toggle.isPending}
          onClick={() =>
            guard(() => toggle.mutate({ username: user.username, following: isFollowing }))
          }
        />
      ) : null}
    </div>
  );
}
