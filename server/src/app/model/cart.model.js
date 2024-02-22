const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user" },
    listProduct: [
      {
        id: { type: Schema.Types.ObjectId, ref: "product" },
        size: { type: number },
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
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
