import { cn } from "@/lib/utils";

// The Sociality wordmark — an 8-point sparkle glyph plus the name.
export function Logo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-bold", className)}>
      <SparkGlyph className="size-5 text-primary" />
      {!iconOnly && <span className="tracking-tight">Sociality</span>}
    </span>
  );
}

function SparkGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 1c.4 4.3 1.6 6.7 3.4 8.1S19.7 11.6 23 12c-4.3.4-6.7 1.6-8.1 3.4S12.4 19.7 12 23c-.4-4.3-1.6-6.7-3.4-8.1S4.3 12.4 1 12c4.3-.4 6.7-1.6 8.1-3.4S11.6 4.3 12 1Z" />
    </svg>
  );
}
