import { Button } from "@/components/button";
import ShowListOrder from "./ShowListOrder";
import useTestContext from "@/hook/useTestContext";
import { IListOrderFilterProvider, ListOrderFilterContext } from "../context";
import LoadingSpinner from "@/components/loading";

function Content() {
  const { status } = useTestContext<IListOrderFilterProvider>(
    ListOrderFilterContext as React.Context<IListOrderFilterProvider>
  );

  return (
    <div className="bg-white rounded-md min-h-[200px] p-5 mt-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Danh sách đơn hàng</h1>
        <Button
          variant="default"
          type="button"
          className="text-sm whitespace-nowrap"
        >
          Xuất danh sách đơn hàng
        </Button>
      </div>
      {status === "pending" ? (
        <div className="flex justify-center w-full mt-10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 z-30 w-16 h-16 border-4 rounded-full border-grayCa"></div>
            <LoadingSpinner className="absolute inset-0 z-40 w-16 h-16 border-4 border-r-orange border-l-transparent border-t-transparent border-b-transparent"></LoadingSpinner>
          </div>
        </div>
      ) : (
        <ShowListOrder></ShowListOrder>
      )}
    </div>
  );
}

export default Content;
