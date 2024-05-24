const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: Schema.Types.ObjectId, ref: "images" },
    status: { type: String, enum: ["active", "deactive"], default: "deactive" },
    productIds: [{ type: Schema.Types.ObjectId, ref: "products" }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("categories", CategorySchema);
