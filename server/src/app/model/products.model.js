const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    banner: { type: String, required: true },
    listImage: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["outOfStock", "inStock"],
      default: "inStock",
    },
    flashSale: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    slug: { type: String, slug: "name", unique: true },
    sold: { type: number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
