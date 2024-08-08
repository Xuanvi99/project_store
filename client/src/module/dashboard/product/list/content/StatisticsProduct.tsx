import LoadingSpinner from "@/components/loading";
import { useGetStatisticsProductQuery } from "@/stores/service/product.service";

const listStatistics = [
  { key: "all", value: "TỔNG" },
  { key: "active", value: "ĐANG BÁN" },
  { key: "inactive", value: "NGỪNG BÁN/HẾT HÀNG" },
  { key: "deleted", value: "ĐÃ XÓA" },
];

function StatisticsProduct() {
  const { data, isFetching } = useGetStatisticsProductQuery();

  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-5">
      {listStatistics.map((statistics, index) => {
        const key = statistics.key as "all" | "active" | "inactive" | "deleted";
        return (
          <div
            key={index}
            className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow1 gap-y-2"
          >
            <span>{statistics.value}</span>
            <span className="flex items-center gap-x-1">
              {!isFetching && data ? (
                <span>{data[key]}</span>
              ) : (
                <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
              )}
              <span className="text-sm font-normal text-grayCa">Sản phẩm</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StatisticsProduct;
