import Skeleton from "@/components/skeleton";
import { cn } from "@/utils";

function ProductItemListSkeleton() {
  return (
    <div
      className={cn(
        "productItem_list grid w-full grid-cols-[50px_350px_100px_100px_100px_100px_100px_auto] text-sm grid-rows-1",
        "[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:p-3",
        "h-[70px]"
      )}
    >
      <span>
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
      <span>
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

export default ProductItemListSkeleton;
