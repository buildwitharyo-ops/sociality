import { UserFollowingList } from "@/features/follows/follow-lists";

export default async function UserFollowingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <UserFollowingList username={decodeURIComponent(username)} />;
}
