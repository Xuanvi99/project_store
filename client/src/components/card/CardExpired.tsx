import { cn } from "@/utils";

function CardExpired() {
  return (
    <div
      className={cn(
        "absolute top-20 left-1/2 -translate-x-1/2 block px-7 py-2 border-1 border-danger",
        "text-sm whitespace-nowrap font-bold rounded-md bg-white opacity-70 text-danger",
        "rotate-[-45deg]"
      )}
    >
      Ngừng bán
    </div>
  );
}

export default CardExpired;
