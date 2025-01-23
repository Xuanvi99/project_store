import Skeleton from "@/components/skeleton";

function SkeletonHeader() {
  return (
    <div className="flex gap-x-3 items-center px-3 border-b-1 border-orange py-2 max-h-[50px]">
      <div className="w-8 h-8 overflow-hidden rounded-full ">
        <Skeleton />
      </div>
      <div className="flex flex-col justify-start gap-y-1">
        <div className="w-[200px] h-3">
          <Skeleton />
        </div>
        <div className="w-16 h-3">
          <Skeleton />
        </div>
      </div>
    </div>
  );
}

export default SkeletonHeader;
