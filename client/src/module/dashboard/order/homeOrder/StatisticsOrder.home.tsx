function StatisticsOrder() {
  return (
    <div className="grid grid-cols-4 mt-5 gap-x-10">
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow77 gap-y-2">
        <span>TẤT CẢ</span>
        <span className="flex items-center gap-x-1">
          999 <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow77 gap-y-2">
        <span>ĐƠN ĐANG GIAO</span>
        <span className="flex items-center gap-x-1">
          999 <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow77 gap-y-2">
        <span>ĐƠN HOÀN THÀNH</span>
        <span className="flex items-center gap-x-1">
          999 <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
      <div className="grid grid-cols-1 p-3 font-semibold bg-white rounded-md shadow-shadow77 gap-y-2">
        <span>ĐƠN HỦY</span>
        <span className="flex items-center gap-x-1">
          999 <span className="text-sm font-normal text-grayCa">Đơn hàng</span>
        </span>
      </div>
    </div>
  );
}

export default StatisticsOrder;
