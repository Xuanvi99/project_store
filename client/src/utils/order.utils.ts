import { IReqOrder } from "@/types/order.type";

export const FormatPaymentStatusOrder = (value: IReqOrder["paymentStatus"]) => {
  const listPaymentStatus = [
    { title: "Chờ thanh toán", status: "pending" },
    { title: "Hoàn tiền", status: "refund" },
    { title: "Đâ thanh toán", status: "paid" },
    { title: "Đã hủy", status: "cancelled" },
  ];
  const title = listPaymentStatus.filter((payment) => payment.status === value);
  return title[0].title;
};

export const FormatStatusOrder = (value: IReqOrder["statusOrder"]) => {
  const listStatusOrder = [
    { title: "Chờ xác nhận", status: "pending" },
    { title: "Chờ vận chuyển", status: "confirmed" },
    { title: "Chờ giao hàng", status: "shipping" },
    { title: "Hoàn thành", status: "completed" },
    { title: "Đã hủy", status: "cancelled" },
    { title: "Trả hàng/Hoàn tiền", status: "refund" },
  ];
  const title = listStatusOrder.filter((order) => order.status === value);
  return title[0].title;
};

export const FormatShippingUnit = (value: string) => {
  const listShippingUnit = [
    { title: "Giao hàng nhanh", value: "giaohangnhanh" },
  ];
  const title = listShippingUnit.filter(
    (shippingUnit) => shippingUnit.value === value
  );

  return title[0].title;
};
