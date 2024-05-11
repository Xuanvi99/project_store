const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flashSaleSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "products" },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    discount: { type: Number, require: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("flashSale", flashSaleSchema);
