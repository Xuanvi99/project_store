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

    status: {
      type: String,
      enum: Object.values(constants.ORDER.STATUS),
      default: constants.ORDER.STATUS.PENDING,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_METHOD),
      default: constants.ORDER.PAYMENT_METHOD.CASH,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_STATUS),
      default: constants.ORDER.PAYMENT_STATUS.PENDING,
      required: true,
    },

    subTotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    discount: { type: Number, required: true },
    total: { type: Number, required: true },

    canceled_at: { type: Date },
    complete_at: { type: Date },
    delivery_at: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("orders", OrderSchema);
