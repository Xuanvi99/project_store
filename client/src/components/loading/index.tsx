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
}: {
  className?: {
    wrap: string;
  };
}) {
  return (
    <div className={cn("flex justify-center w-full h-full", className?.wrap)}>
      <div className={`relative w-full h-full`}>
        <div
          className={`absolute inset-0 z-30 w-full h-full border-4 rounded-full border-grayCa`}
        ></div>
        <LoadingSpinner
          className={`absolute inset-0 z-40 w-full h-full border-4 border-r-orange border-l-transparent border-t-transparent border-b-transparent`}
        ></LoadingSpinner>
      </div>
    </div>
  );
}
