import { Logo } from "@/components/logo";

export function AuthCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Logo className="text-xl" />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {children}
      {footer ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      ) : null}
    </div>
  );
}
