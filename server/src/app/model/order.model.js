const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
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
    totalPrice: {
      type: Number,
      required: true,
    },
    is_payment: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderSchema);
