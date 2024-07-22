import { Input } from "@/components/input";
import { cn } from "@/utils";
import Skeleton from "../../../../components/skeleton/index";

function ProductItemSkeleton({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "productItem grid w-full grid-cols-[50px_350px_100px_100px_100px_100px_100px_auto] text-sm grid-rows-1 ",
        index % 2 !== 0 ? "bg-grayFa" : ""
      )}
    >
      <span className="flex items-center justify-center">
        <Input
          type="checkbox"
          name="checkbox"
          data-id={""}
          className={{
            input: "w-5 h-5 cursor-pointer",
            wrap: "w-5 static",
          }}
        />
      </span>
      <span className="text-xs font-semibold text-grayDark gap-x-7 h-[50px]">
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
      <span>
        <Skeleton></Skeleton>
      </span>
    </div>
  );
}

export default ProductItemSkeleton;
