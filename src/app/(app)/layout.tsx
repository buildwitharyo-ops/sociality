import { TopNav } from "@/components/top-nav";
import { BottomNav } from "@/components/bottom-nav";

// Chrome for the main app pages (feed, profile, search, create). The auth pages
// live in their own route group and don't get this nav.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex flex-1 flex-col pb-28">{children}</main>
      <BottomNav />
    </>
  );
}
