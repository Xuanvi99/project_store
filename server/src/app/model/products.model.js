const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, slug: "name", unique: true },
    desc: { type: String, required: true },
    brand: {
      type: String,
      enum: ["Adidas", "LV", "Nike", "Vans"],
      required: true,
    },
    banner: { type: Schema.Types.ObjectId, ref: "image" },
    imageID: [{ type: Schema.Types.ObjectId, ref: "image", required: true }],
    sizes: { type: Array, required: true },
    quantity: { type: Number, require: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    flashSale: { type: Boolean, default: false },
    commentID: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    sold: { type: Number, default: 0 },
    is_Stock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  const product = this;
  if (product.quantity > 0) {
    product.is_Stock = true;
  }
  return next();
});

module.exports = mongoose.model("product", ProductSchema);
