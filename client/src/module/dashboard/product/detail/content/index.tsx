import useTestContext from "@/hook/useTestContext";
import { DetailProductContext, IDetailProductProvide } from "../context";
import InfoDetail from "./infoDetail";
import UpdateDetail from "./updateDetail";
import { LoadingCallApi } from "@/components/loading";
import { cn } from "@/utils";

function DetailContent() {
  const { isLoading, showTab, setShowTab } =
    useTestContext<IDetailProductProvide>(
      DetailProductContext as React.Context<IDetailProductProvide>
    );

  if (isLoading) {
    return <LoadingCallApi size={60}></LoadingCallApi>;
  }

  return (
    <div className="w-full px-6 pb-10 mt-[80px]">
      <div
        className={cn(
          "flex items-center",
          " [&>span]:py-3 [&>span]:px-6 [&>span]:italic [&>span]:font-semibold [&>span]:text-sm [&>span]:cursor-pointer"
        )}
      >
        <span
          onClick={() => setShowTab("info")}
          className={cn(
            `${
              showTab === "info"
                ? "bg-white text-orange shadow-shadow_4"
                : "bg-grayF30 shadow-shadow_inset_2"
            }`,
            "hover:text-orange transition-all"
          )}
        >
          1.Chi tiết
        </span>
        <span
          onClick={() => setShowTab("update")}
          className={cn(
            `${
              showTab === "update"
                ? "bg-white text-orange shadow-shadow_4"
                : "bg-grayF30 shadow-shadow_inset_2"
            }`,
            "hover:text-orange"
          )}
        >
          2.Cập nhật
        </span>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className={`${showTab === "info" ? "" : "hidden"}`}>
          <InfoDetail></InfoDetail>
        </div>
        <div className={`${showTab === "update" ? "" : "hidden"}`}>
          <UpdateDetail></UpdateDetail>
        </div>
      </div>
    </div>
  );
}

export default DetailContent;
