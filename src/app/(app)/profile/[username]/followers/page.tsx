import { UserFollowersList } from "@/features/follows/follow-lists";

export default async function UserFollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <UserFollowersList username={decodeURIComponent(username)} />;
}
