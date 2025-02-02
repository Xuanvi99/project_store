import Skeleton from "@/components/skeleton";
import { cn } from "@/utils";

function SkeletonConversationItem() {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 max-h-[68] transition-all p-[10px] cursor-pointer hover:bg-grayE5 rounded-lg"
      )}
    >
      <div className="w-12 h-12 overflow-hidden rounded-full max-w-12">
        <Skeleton />
      </div>
      <div className="w-[calc(100%-50px)] h-12">
        <Skeleton />
      </div>
    </div>
  );
}

export default SkeletonConversationItem;
