const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    brand: { type: String, required: true },
    banner: { type: Schema.Types.ObjectId, ref: "image" },
    images: [{ type: Schema.Types.ObjectId, ref: "image", required: true }],
    sizes: { type: Array, required: true },
    status: {
      type: String,
      enum: ["outOfStock", "inStock"],
      default: "inStock",
    },
    flashSale: { type: Boolean, default: false },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "comment", default: "" }],
    slug: { type: String, slug: "name", unique: true },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", ProductSchema);
