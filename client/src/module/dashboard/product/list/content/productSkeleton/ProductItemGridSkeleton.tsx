import Skeleton from "@/components/skeleton";

function ProductItemGridSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-md group productItem_grid shadow-shadow2">
      <div className="w-[calc(960px/4)] h-[240px] p-4">
        <Skeleton></Skeleton>
      </div>
      <div className="z-40 flex flex-col p-3 text-sm bg-white border-t-1 border-t-grayCa gap-y-2">
        <div className="font-semibold line-clamp-2">
          <Skeleton></Skeleton>
        </div>
        <div className="h-6">
          <Skeleton></Skeleton>
        </div>
        <div className="flex items-center justify-between gap-x-5">
          <div className="h-5 basis-1/2">
            <Skeleton></Skeleton>
          </div>
          <div className="h-5 basis-1/2">
            <Skeleton></Skeleton>
          </div>
        </div>
        <div className="h-5">
          <Skeleton></Skeleton>
        </div>
      </div>
    </div>
  );
}

export default ProductItemGridSkeleton;
