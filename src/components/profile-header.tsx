import type { ReactNode } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { StatRow, type Stat } from "@/components/stat-row";
import type { ProfileStats } from "@/lib/api";

// Shared by the signed-in profile (Edit action) and public profiles (Follow
// action, Step 11). The action slot holds whatever buttons the caller wants.
export function ProfileHeader({
  name,
  username,
  avatarUrl,
  bio,
  stats,
  statHrefs,
  action,
}: {
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  stats: ProfileStats;
  statHrefs?: { followers?: string; following?: string };
  action?: ReactNode;
}) {
  const statItems: Stat[] = [
    { label: "Posts", value: stats.posts },
    { label: "Followers", value: stats.followers, href: statHrefs?.followers },
    { label: "Following", value: stats.following, href: statHrefs?.following },
    { label: "Likes", value: stats.likes },
  ];

  return (
    <header className="space-y-4">
      <div className="flex items-center gap-4">
        <UserAvatar name={name} avatarUrl={avatarUrl} size="lg" className="size-16 sm:size-20" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{name}</h1>
          <p className="truncate text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>

      {action ? <div className="flex items-center gap-2">{action}</div> : null}

      {bio ? <p className="whitespace-pre-wrap text-sm">{bio}</p> : null}

      <StatRow stats={statItems} />
    </header>
  );
}
