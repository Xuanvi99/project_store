import Skeleton from "../../skeleton/index";
function CartSkeleton() {
  return (
    <div className="relative rounded-sm card-item shadow-shadow1 shadow-grayCa bg-grayF5">
      <div className="flex flex-col">
        <div className="w-full overflow-hidden h-[200px]">
          <Skeleton></Skeleton>
        </div>
        <div className="flex flex-col flex-1 text-sm gap-y-4 p-[10px]">
          <div className="font-bold text-black h-[40px] line-clamp-2 hover:text-blue">
            <Skeleton></Skeleton>
          </div>
          <div className="flex items-center justify-start h-3 font-semibold gap-x-2 text-gray">
            <Skeleton></Skeleton>
          </div>
          <div className="flex items-center justify-start h-3 font-semibold gap-x-2 text-gray">
            <Skeleton></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSkeleton;
