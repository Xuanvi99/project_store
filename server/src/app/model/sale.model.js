const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SaleSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "product" },
    time: { type: Date, require: true },
    quantity: { type: Number, require: true },
    sold: { type: Number, require: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sale", SaleSchema);
