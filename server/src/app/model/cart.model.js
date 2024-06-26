const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    listProduct: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        size: { type: String, required: true },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity can not be less then 1."],
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("carts", CartSchema);
