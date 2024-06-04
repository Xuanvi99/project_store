const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../../constants");

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    customer: {
      type: {
        name: { type: String, trim: true, required: true },
        phone: { type: String, trim: true, required: true },
        address: { type: String, trim: true, required: true },
      },
      required: false,
    },
    note: { type: String, required: true, default: "" },
    listProduct: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        size: { type: Number, required: true },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    // trang thai don hang
    status: {
      type: String,
      enum: Object.values(constants.ORDER.STATUS),
      default: constants.ORDER.STATUS.PENDING,
      required: true,
    },
    // phuong thuc thanh toan
    paymentMethod: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_METHOD),
      default: constants.ORDER.PAYMENT_METHOD.CASH,
      required: true,
    },
    // trang thai thanh toan
    paymentStatus: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_STATUS),
      default: constants.ORDER.PAYMENT_STATUS.PENDING,
    },

    CodePayment: { type: String, default: "" },

    shippingFee: { type: Number, required: true },
    discount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    delivery_at: { type: Date },
    canceled_at: { type: Date },
    complete_at: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("orders", OrderSchema);
