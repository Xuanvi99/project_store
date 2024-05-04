import { cn } from "../../utils";
export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-5 h-5 rounded-full border-2  border-white border-r-transparent animate-spin",
        className
      )}
    ></div>
  );
}
