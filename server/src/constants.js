const ORDER = {
  STATUS: {
    PENDING: "pending", // order created, waiting for confirm by admin or staff
    CONFIRMED: "confirmed", // order confirmed by admin or staff
    SHIPPING: "shipping", // order has been picked up by staff and is being shipped
    COMPLETED: "completed", // order has been delivered
    CANCELLED: "cancelled", // order has been cancelled
  },
  PAYMENT_METHOD: {
    // CASH: "cash", // paid at store
    COD: "cod", // paid at delivery (cash on delivery)
    VNPAY: "vnpay", // paid by VNPAY
    // MOMO: "momo", // paid by Momo
    // PAYPAL: "paypal", // paid by Paypal
    // ZALO_PAY: "zalopay", // paid by Zalo PAY
  },
  PAYMENT_STATUS: {
    PENDING: "pending", // payment is pending
    PAID: "paid", // payment has been made
    CANCELLED: "cancelled", // payment has been cancelled
  },
};

const WHITELIST_DOMAIN = ["http://localhost:5173"];

module.exports = { WHITELIST_DOMAIN, ORDER };
