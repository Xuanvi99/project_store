const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    sold: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    stocked: {
      type: Boolean,
      default: () => {
        return this.total > 0 ? true : false;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("inventories", inventorySchema);
