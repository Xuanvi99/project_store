import { cn } from "../../utils";
import { IconBadgeSales } from "../icon";

export default function CardSales({
  discount,
  type,
  className,
}: {
  discount: string;
  type: "flashSale" | "sale" | "normal";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 text-white font-bold w-full h-[30px] text-sm rounded-r-2xl z-10",
        className
      )}
    >
      <div className="absolute top-0 left-0 z-20 w-[80px]">
        <IconBadgeSales></IconBadgeSales>
        <span className="absolute z-20 -translate-x-1/2 top-1/2 left-1/2 -translate-y-2/3">
          - {discount}%
        </span>
      </div>
      {type === "flashSale" && (
        <div className="absolute top-0 right-0 z-20 inline-block px-2 py-1 text-xs font-normal bg-orangeLinear rounded-xl">
          Deal giá sốc
        </div>
      )}
    </div>
  );
}
