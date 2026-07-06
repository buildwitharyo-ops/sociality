import { PublicProfile } from "@/features/profile/public-profile";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <PublicProfile username={decodeURIComponent(username)} />;
}
