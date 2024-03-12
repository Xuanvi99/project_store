const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    listProduct: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        size: { type: Number, required: true },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", CartSchema);
