export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
      {/* Deep-purple glow rising from the bottom-center, behind the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-15%] -z-10 h-[65%] blur-2xl"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, color-mix(in oklch, var(--primary) 55%, transparent), transparent 72%)",
        }}
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
