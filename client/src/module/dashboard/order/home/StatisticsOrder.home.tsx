import LoadingSpinner from "@/components/loading";
import { useGetStatisticsOrderQuery } from "@/stores/service/order.service";

function StatisticsOrder() {
  const { data, isFetching } = useGetStatisticsOrderQuery();

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-x-5 gap-y-5">
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow1 gap-y-2">
        <span>TỔNG ĐƠN HÀNG</span>
        <span className="flex items-center gap-x-1">
          {isFetching ? (
            <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
          ) : (
            <span>{data?.all}</span>
          )}
          <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow1 gap-y-2">
        <span>ĐƠN CHỜ DUYỆT</span>
        <span className="flex items-center gap-x-1">
          {isFetching ? (
            <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
          ) : (
            <span>{data?.pending}</span>
          )}
          <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow1 gap-y-2">
        <span>ĐƠN CHỜ VẬN CHUYỂN</span>
        <span className="flex items-center gap-x-1">
          {isFetching ? (
            <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
          ) : (
            <span>{data?.confirmed}</span>
          )}
          <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow1 gap-y-2">
        <span>ĐƠN ĐANG GIAO</span>
        <span className="flex items-center gap-x-1">
          {isFetching ? (
            <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
          ) : (
            <span>{data?.shipping}</span>
          )}
          <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow1 gap-y-2">
        <span>ĐƠN HOÀN THÀNH</span>
        <span className="flex items-center gap-x-1">
          {isFetching ? (
            <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
          ) : (
            <span>{data?.completed}</span>
          )}
          <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow1 gap-y-2">
        <span>ĐƠN HỦY</span>
        <span className="flex items-center gap-x-1">
          {isFetching ? (
            <LoadingSpinner className="border-orange border-r-transparent"></LoadingSpinner>
          ) : (
            <span>{data?.cancelled}</span>
          )}
          <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
    </div>
  );
}

export default StatisticsOrder;
