import { cn } from "../../utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        " w-full h-full rounded-md bg-stone-200 animate-pulse",
        className
      )}
    ></div>
  );
}
