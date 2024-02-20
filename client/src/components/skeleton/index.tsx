import { cn } from "../../utils";

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton w-full", className)}></div>;
}
