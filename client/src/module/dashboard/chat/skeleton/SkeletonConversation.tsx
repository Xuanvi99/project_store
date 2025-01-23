import Skeleton from "@/components/skeleton";

export default function SkeletonConversation() {
  return (
    <aside className="flex basis-[30%] h-full overflow-hidden bg-white rounded-lg ">
      <div className="flex flex-col w-full p-3 gap-y-2">
        <div className="w-1/2 h-6">
          <Skeleton />
        </div>
        <div className="w-full h-12">
          <Skeleton />
        </div>
        <div className={"w-full h-full flex flex-col mt-auto gap-y-2"}>
          <Skeleton />
        </div>
      </div>
    </aside>
  );
}
