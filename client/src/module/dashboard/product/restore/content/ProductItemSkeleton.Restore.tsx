import { cn } from "@/utils";
import Skeleton from "../../../../../components/skeleton/index";

function ProductItemSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "productItem grid w-full grid-cols-[50px_350px_100px_150px_150px_100px_auto] text-sm grid-rows-1 min-h-[75px]",
        index % 2 !== 0 ? "bg-grayFa" : ""
      )}
    >
      <span className="flex items-center justify-center">
        <Skeleton className="w-5 h-5"></Skeleton>
      </span>
      <span className="text-xs font-semibold text-grayDark gap-x-7">
        <Skeleton></Skeleton>
      </span>
      <span className="font-semibold">
        <Skeleton></Skeleton>
      </span>
      <span className="text-danger">
        <Skeleton></Skeleton>
      </span>
      <span>
        <Skeleton></Skeleton>
      </span>
      <span>
        <Skeleton></Skeleton>
      </span>
      <span>
        <Skeleton></Skeleton>
      </span>
    </div>
  );
}

export default ProductItemSkeleton;
