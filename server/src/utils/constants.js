const ORDER = {
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
    CANCELLED: "cancelled",
    REFUND: "refund", // payment has been cancelled
  },
  SHIPPING_UNIT: {
    GHN: "giaohangnhanh",
  },
};

const WHITELIST_DOMAIN = ["http://localhost:5173"];

module.exports = { WHITELIST_DOMAIN, ORDER };
