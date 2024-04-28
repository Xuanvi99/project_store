const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    productId: { type: Schema.Types.ObjectId, ref: "products" },
    imageIds: [{ type: Schema.Types.ObjectId, ref: "images" }],
    status: { type: Boolean, default: false },
    content: { type: String, default: "" },
    star: { type: Number, default: 5 },
    like: { type: Number, default: 0 },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", CommentSchema);
