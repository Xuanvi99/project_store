const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
const mongoose_delete = require("mongoose-delete");

mongoose.plugin(slug);

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, "name must be at least 3 character"],
    },
    slug: { type: String, slug: "name", unique: true },
    summary: { type: String, required: true, default: "" },
    desc: { type: String, required: true, default: "" },
    brand: { type: String, required: true },
    thumbnail: { type: Schema.Types.ObjectId, ref: "images" },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    sale: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "deactive"], default: "deactive" },
    imageIds: [{ type: Schema.Types.ObjectId, ref: "images", require: true }],
    commentIds: [{ type: Schema.Types.ObjectId, ref: "comments" }],
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      require: true,
    },
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: "inventories",
      require: true,
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
});

const productItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    size: { type: String, default: "" },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", ProductSchema);
const productItemModel = mongoose.model("productItems", productItemSchema);

module.exports = {
  productModel,
  productItemModel,
};
