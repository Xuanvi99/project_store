import { cn } from "../../utils";
export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-5 h-5 rounded-full border-2 border-white border-r-transparent animate-spin",
        className
      )}
    ></div>
  );
}

export function LoadingCallApi({
  className,
  size = 16,
}: {
  className?: {
    wrap: string;
  };
  size: number;
}) {
  return (
    <div className={cn("flex justify-center w-full", className?.wrap)}>
      <div className={`relative w-${size} h-${size}`}>
        <div
          className={`absolute inset-0 z-30 w-${size} h-${size} border-4 rounded-full border-grayCa`}
        ></div>
        <LoadingSpinner
          className={`absolute inset-0 z-40 w-${size} h-${size} border-4 border-r-orange border-l-transparent border-t-transparent border-b-transparent`}
        ></LoadingSpinner>
      </div>
    </div>
  );
}
