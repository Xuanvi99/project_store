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
    REFUND: "refund",
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

export const NotificationVnpay = [
  {
    code: "00",
    message: "Giao dịch thành công",
  },
  {
    code: "02",
    message: "Đơn hàng này đã được cập nhật trạng thái thanh toán",
  },
  {
    code: "01",
    message: "404! Không tìm thấy đơn hàng",
  },
  {
    code: "04",
    message: "số tiền thanh toán không hợp lệ",
  },
  {
    code: "07",
    message:
      "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
  },
  {
    code: "09",
    message:
      "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
  },
  {
    code: "10",
    message:
      "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
  },
  {
    code: "11",
    message:
      "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
  },
  {
    code: "12",
    message:
      "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
  },
  {
    code: "13",
    message:
      "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
  },
  {
    code: "24",
    message: "Giao dịch không thành công do: Khách hàng hủy giao dịch",
  },
  {
    code: "51",
    message:
      "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch",
  },
  {
    code: "65",
    message:
      "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
  },
  {
    code: "75",
    message: "Ngân hàng thanh toán đang bảo trì.",
  },
  {
    code: "79",
    message:
      "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịchh",
  },
  {
    code: "97",
    message: "Thông tin đơn hàng không đúng",
  },
  {
    code: "99",
    message:
      "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
  },
];

export const limitOrder = 4;
