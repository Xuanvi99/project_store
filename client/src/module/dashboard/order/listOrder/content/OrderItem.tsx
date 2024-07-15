import { IResOrder } from "@/types/order.type";
import { formatPrice } from "@/utils";
import { Link } from "react-router-dom";

function OrderItem({ data, index }: { data: IResOrder; index: number }) {
  const { customer, codeOrder, createdAt, total, statusOrder } = data;

  const handleFormatDate = (value: Date) => {
    const date = new Date(value);
    return date.toLocaleDateString();
  };

  const handleFormatStatusOrder = (value: string) => {
    switch (value) {
      case "pending":
        return (
          <p className="inline p-1 text-white rounded-sm bg-amber-500">
            Chờ xác nhận
          </p>
        );

      case "cancelled":
        return (
          <p className="inline p-1 text-white bg-red-500 rounded-sm">Đã hủy</p>
        );

      case "confirmed":
        return (
          <p className="inline p-1 text-white rounded-sm bg-lime-500">
            Đã xác nhận
          </p>
        );

      case "completed":
        return (
          <p className="inline p-1 text-white rounded-sm bg-sky-500">
            Đã giao hàng
          </p>
        );

      case "shipping":
        return (
          <p className="inline p-1 text-white rounded-sm bg-emerald-500">
            Đang giao hàng
          </p>
        );

      case "refund":
        return (
          <p className="inline p-1 text-white rounded-sm bg-fuchsia-500">
            Hoàn trả
          </p>
        );

      default:
        break;
    }
  };

  return (
    <div className="grid w-full grid-cols-[70px_150px_200px_150px_200px_150px_100px] text-sm grid-rows-1 border-t-1 border-t-grayCa ">
      <span className="flex items-center justify-center font-semibold">
        {index + 1}
      </span>
      <span>{codeOrder}</span>
      <span>{customer.name}</span>
      <span>{handleFormatDate(createdAt)}</span>
      <span className="text-xs font-semibold">
        {handleFormatStatusOrder(statusOrder)}
      </span>
      <span className="text-danger">{formatPrice(total)}₫</span>
      <span>
        <Link
          to={`/dashboard/order/detail?codeOrder=${codeOrder}`}
          className="font-semibold italic hover:text-blue hover:underline "
        >
          Xem chi tiết
        </Link>
      </span>
    </div>
  );
}

export default OrderItem;
