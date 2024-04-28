import { cn } from "../../utils";
export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-5 h-5 rounded-full border-2 border-r-transparent border-white animate-spin",
        className
      )}
    ></div>
  );
}
