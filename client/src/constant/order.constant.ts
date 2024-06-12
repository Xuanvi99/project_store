export const ORDER = {
  STATUS: {
    PENDING: "pending", // order created, waiting for confirm by admin or staff
    CONFIRMED: "confirmed", // order confirmed by admin or staff
    SHIPPING: "shipping", // order has been picked up by staff and is being shipped
    COMPLETED: "completed", // order has been delivered
    CANCELLED: "cancelled", // order has been cancelled
    REFUND: "refund",
  },
  PAYMENT_METHOD: {
    COD: "cod", // paid at delivery (cash on delivery)
    VNPAY: "vnpay", // paid by VNPAY
  },
  PAYMENT_STATUS: {
    PENDING: "pending", // payment is pending
    PAID: "paid", // payment has been made
    CANCELLED: "cancelled", // payment has been cancelled
  },
};

export const reasonCanceled = [
  {
    id: 1,
    value: "Tôi muốn cập nhật địa chỉ/sđt nhận  hàng",
  },
  {
    id: 2,
    value: "Tôi muốn thay đổi sản phẩm (kích thước, số lượng)",
  },
  {
    id: 3,
    value: "Thủ tục thanh toán rắc rối",
  },
  {
    id: 4,
    value: "Tôi tìm thấy chỗ mua khác tốt hơn",
  },
  {
    id: 5,
    value: "Tôi không có nhu cầu mua nữa",
  },
  {
    id: 6,
    value: "Tôi không tìm thấy lý do phù hợp",
  },
  // {
  //   id: 7,
  //   value: "Tôi muốn cập nhật địa chỉ/sđt nhận  hàng",
  // },
];

export const listHeaderOrder = [
  { id: 1, title: "Tất cả", status: "" },
  { id: 2, title: "Chờ xác nhận", status: "pending" },
  { id: 3, title: "Vận chuyển", status: "confirmed" },
  { id: 4, title: "Chờ giao hàng", status: "shipping" },
  { id: 5, title: "Hoàn thành", status: "completed" },
  { id: 6, title: "Đã hủy", status: "cancelled" },
  { id: 7, title: "Trả hàng/Hoàn tiền", status: "refund" },
];
