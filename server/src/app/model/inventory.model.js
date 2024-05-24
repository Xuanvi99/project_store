const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    total: { type: Number, default: 0 },
    stocked: {
      type: Boolean,
      default: () => {
        return this.total > 0 ? true : false;
      },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("inventories", inventorySchema);
