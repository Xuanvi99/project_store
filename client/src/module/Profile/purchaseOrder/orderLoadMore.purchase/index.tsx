import { IResOrder } from "../../../../types/order.type";
import OrderItem from "../content.purchase/OrderItem";

type TProps = {
  data?: IResOrder[];
};

function OrderLoadMore({ data }: TProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-sm min-h-[600px] mt-3 bg-white flex flex-col justify-center items-center gap-y-3">
        <img alt="" srcSet="/orderNull.png" className="w-40" />
        <p>Chưa có đơn hàng</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-5">
      {data.map((order, index) => {
        return <OrderItem key={index} data={order}></OrderItem>;
      })}
    </div>
  );
}

export default OrderLoadMore;
