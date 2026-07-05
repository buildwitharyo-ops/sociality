import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { FollowButton } from "@/components/follow-button";
import type { UserChip as UserChipData } from "@/lib/api";

export function UserChip({
  user,
  showFollow = true,
  isFollowing,
  onToggleFollow,
  isPending,
}: {
  user: UserChipData;
  showFollow?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  isPending?: boolean;
}) {
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
      {showFollow && !user.isMe ? (
        <FollowButton
          isFollowing={isFollowing ?? user.isFollowedByMe ?? false}
          onClick={onToggleFollow}
          isPending={isPending}
        />
      ) : null}
    </div>
  );
}
