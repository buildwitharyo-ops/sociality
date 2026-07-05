import Link from "next/link";
import { cn } from "@/lib/utils";

export type Stat = { label: string; value: number; href?: string };

export function StatRow({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <div className={cn("flex items-center justify-around", className)}>
      {stats.map((stat) => {
        const content = (
          <>
            <span className="block text-lg font-bold tabular-nums">{stat.value}</span>
            <span className="block text-xs text-muted-foreground">{stat.label}</span>
          </>
        );

        return stat.href ? (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-md px-3 py-1 text-center transition-colors hover:bg-accent"
          >
            {content}
          </Link>
        ) : (
          <div key={stat.label} className="px-3 py-1 text-center">
            {content}
          </div>
        );
      })}
    </div>
  );
}
