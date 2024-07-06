import { IResOrder } from "@/types/order.type";
import { formatPrice } from "@/utils";
import ShippingFee from "./ShippingFee.purchase";
import ListProduct from "./ListProduct.purchase";
import HeaderPurchase from "./Header.purchase";
import PaymentMethod from "./PaymentMethod.purchase";
import BottomPurchase from "./Bottom.purchase";

type TProps = {
  data: IResOrder;
};

function OrderItem({ data }: TProps) {
  const { listProducts, total, codeOrder, statusOrder } = data;

  return (
    <div className="w-full p-4 bg-white rounded-sm">
      <HeaderPurchase id={codeOrder} statusOrder={statusOrder}></HeaderPurchase>
      <PaymentMethod data={data}></PaymentMethod>
      <ListProduct data={listProducts}></ListProduct>
      <ShippingFee data={data}></ShippingFee>
      <div className="flex items-center justify-end p-4 border-dashed gap-x-2 border-t-1 border-t-grayCa">
        <span>Thành tiền:</span>
        <span className="text-xl text-danger">{formatPrice(total)}₫</span>
      </div>
      <BottomPurchase data={data}></BottomPurchase>
    </div>
  );
}

export default OrderItem;
