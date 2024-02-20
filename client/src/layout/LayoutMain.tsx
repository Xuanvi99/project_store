import { cn } from "../utils";

export default function LayoutMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("max-w-[1200px] my-10 w-full mx-auto", className)}>
      {children}
    </main>
  );
}
